import PlayerCharacter from '../creature/player/PlayerCharacter';
import PartyExploringMap, { PartyMoveDirection } from "./PartyExploringMap";
import Game from "../../gameserver/game/Game";
import { IGetRandomClientFunc } from '../../gameserver/socket/SocketServer';
import ExplorableMap from "../map/ExplorableMap";
import DeleteChannelClientRequest from '../../client/requests/DeleteChannelClientRequest';
import SendMessageClientRequest from '../../client/requests/SendMessageClientRequest';
import SendPMClientRequest from '../../client/requests/SendPMClientRequest';
import SendImageClientRequest from '../../client/requests/SendImageClientRequest';
import SendLocalImageClientRequest from "../../client/requests/SendLocalImageClientRequest";
import { IBattleEndedPlayer } from '../../client/requests/CoopBattleEndedClientRequest';
import { SocketPlayerCharacter } from '../creature/player/PlayerCharacter';
import SendAddPartyMemberClientRequest from "../../client/requests/SendAddPartyMemberClientRequest";
import CreatureBattleTurnBased from '../battle/CreatureBattleTurnBased';
import { BattleResult } from '../battle/CreatureBattleTurnBased';
import LootGenerator from "../loot/LootGenerator";
import CreatureAIControlled from "../creature/CreatureAIControlled";
import RevokeChannelPermissionsClientRequest from '../../client/requests/RevokeChannelPermissionsRequest';

const INVITE_EXPIRES_MS = 60000;

enum PartyStatus{
    InTown,
    Exploring,
    Battling
}

interface PlayerCharacterInvited{
    pc:PlayerCharacter;
    expires:number;
}

interface IPlayerPartyBag{
    map:ExplorableMap;
    lootGenerator: LootGenerator;
}

export {PartyStatus};

interface PlayerPartyBag{
    title:string;
    leader:PlayerCharacter;
    channelId:string;
    game:Game;
    getClient:IGetRandomClientFunc;
}

interface IPartyReturnFuncBag{
    party: PlayerParty;
}

interface PartyReturnFunc{
    (bag:IPartyReturnFuncBag):void;
}

export default class PlayerParty{
    leader:PlayerCharacter;
    title: string;
    members:Map<string,PlayerCharacter>;
    invited:Map<string,PlayerCharacterInvited>;
    channelId:string;
    partyStatus:PartyStatus;
    exploration:PartyExploringMap;
    currentBattle:CreatureBattleTurnBased;
    getClient:IGetRandomClientFunc;
    game:Game;
    timesRun: number;

    constructor(bag:PlayerPartyBag){
        this.leader = bag.leader;
        this.title = bag.title;
        this.channelId = bag.channelId;
        this.getClient = bag.getClient;
        this.timesRun = 0;

        this.members = new Map();
        this.members.set(bag.leader.uid,bag.leader);

        this.invited = new Map();
        this.partyStatus = PartyStatus.InTown;
        this.game = bag.game;
        this.currentBattle = null;

        this.leader.party = this;
        this.leader.status = 'inParty';
    }

    partyPlural(singular:string,plural:string){
        return this.members.size > 1 ? plural : singular;
    }

    sendChannelMessage(msg:string){
        new SendMessageClientRequest({
            channelId: this.channelId,
            message: msg
        })
        .send(this.getClient());
    }

    get id():string{
        return this.channelId;
    }

    get status():PartyStatus{
        return this.partyStatus;
    }

    get currentTileStopsPlayer():boolean{
        return this.exploration.currentTileStopsPlayer;
    }

    returnToTown(){
        this.exploration = null;
        
        this.partyStatus = PartyStatus.InTown;

        this.sendChannelMessage(`The party returns to town`);
    }

    explore(map:ExplorableMap,x?:number,y?:number){
        if(this.partyStatus == PartyStatus.Battling){
            throw 'The party is in a battle right now!';
        }

        this.exploration = new PartyExploringMap({
            map: map,
            party: this,
            sendPartyMessage: this.sendChannelMessage.bind(this)
        });

        this.partyStatus = PartyStatus.Exploring;

        if(x && y){
            this.exploration.moveTo(x,y);
        }

        if(!this.exploration.onEnterCurrentTile()){
            this.sendCurrentMapImageFile(this.partyPlural('You arrive','Your party arrives') + ` at ${map.title}...`);
        }
    }

    move(direction:PartyMoveDirection,steps:number){
        if(steps < 1){
            throw 'Cannot move less than one step';
        }
        
        if(this.partyStatus != PartyStatus.Exploring){
            throw this.partyPlural('You','Your party')+' must be exploring a map';
        }

        for(var i=0;i<steps;i++){
            if(!this.exploration.canMove(direction)){
                if(i==0){  
                    this.sendChannelMessage('The way is blocked');
                }
                else{
                    if(!this.exploration.onEnterCurrentTile()){
                        this.sendCurrentMapImageFile(`Walked ${i} steps but could not go further`);
                    }
                }

                return;
            }

            this.exploration.move(direction);

            //If an eventtile was encountered that stops the party
            if(this.currentTileStopsPlayer && this.exploration.onEnterCurrentTile()){
                return;
            }
            else if(this.exploration.getEncounterChance() > Math.random()){
                this.randomMonsterEncounter();

                return;
            }
        }

        if(!this.exploration.onEnterCurrentTile()){
            this.sendCurrentMapImageFile(this.partyPlural('You','Your party')+' moved');
        }
    }

    randomMonsterEncounter(){
        const monsterId = this.exploration.getRandomEncounterMonsterId();
        
        this.monsterEncounter(monsterId);
    }

    monsterEncounter(monsterId:number){
        const partyMembers = [];

        this.members.forEach(function(pc){
            partyMembers.push(pc);
        });

        this.currentBattle = this.game.createMonsterBattle({
            party: this,
            partyMembers: partyMembers,
            opponentId: monsterId,
            startDelay: 1000,
            runChance: 1 / (this.timesRun+1)
        });

        this.partyStatus = PartyStatus.Battling;

        const opponentName = this.currentBattle.participants.filter(function(p){
            return p.teamNumber == 2;
        })
        .map(function(p){
            return p.creature.title;
        })
        .join(', ');

        new SendMessageClientRequest({
            channelId: this.channelId,
            message: `${opponentName} attacks!`
        })
        .send(this.getClient());
    }

    returnFromBattle(result:BattleResult,partyReturnFunc?:PartyReturnFunc){
        this.members.forEach(function(pc){
            if(pc.hpCurrent < 1){
                pc.hpCurrent = pc.stats.hpTotal * 0.05;
            }
        });

        if(partyReturnFunc){
            this.partyStatus = PartyStatus.Exploring;
            
            this.members.forEach((member)=>{
                member.status = 'inParty';
            });

            partyReturnFunc({
                party: this,
            });
        }

        if(result == BattleResult.Team1Won || result == BattleResult.Ran){
            if(result == BattleResult.Ran){
                this.timesRun++;
            }

            this.partyStatus = PartyStatus.Exploring;

            this.members.forEach((member)=>{
                member.status = 'inParty';
            });

            this.currentBattle = null;

            this.members.forEach(function(member){
                member.status = 'inParty';
            });

            this.exploration.onEnterCurrentTile();
            
            this.sendCurrentMapImageFile(this.partyPlural('You survived!','Your party survived!'));
        }
        else{
            let wishesLostStr = '';

            this.members.forEach((member)=>{
                const wishesLost = Math.round( Math.random() * (member.wishes*0.25) + (member.wishes*0.25) );

                const adjustedWishesLost = Math.max( 
                    Math.round( wishesLost * (1 - member.stats.wishProtect) ),
                    0
                ); 

                this.game.grantPlayerWishes(member.uid,0-adjustedWishesLost);

                wishesLostStr += '\n'+member.title+' lost '+adjustedWishesLost+' wishes';

                member.equipment.forEach((item,slot)=>{
                    if(item.lostOnDeath){
                        wishesLostStr += '\n'+member.title+'\'s '+item.title+' broke!';

                        this.game.unequipPlayerItem(member.uid,slot)
                        .then(()=>{
                            this.game.takePlayerItem(member.uid,item.id,1);
                        });
                    }
                });
            });

            this.sendChannelMessage('Your party was defeated!\n\nYou wake up back in town...\n'+wishesLostStr);

            this.partyStatus = PartyStatus.InTown;

            this.currentBattle = null;

            this.members.forEach((member)=>{
                member.status = 'inParty';
            });
        }
    }

    playerActionInteract(uid:string):void{
        const partyMember = this.members.get(uid);

        if(partyMember == null){
            throw 'You are not in this party';
        }

        if(this.status != PartyStatus.Exploring){
            throw this.partyPlural('You are','Your party is')+' not currently exploring';
        }

        this.exploration.onInteractCurrentTile(partyMember);
    }

    sendCurrentMapImageFile(msg:string){
        if(!this.exploration){
            throw `The party is not exploring a map`;
        }

        const localUrl = this.exploration.getCurrentLocationImage();
        
        const localPath = localUrl.substr(2);

        const cachedCDNUrl = `https://github.com/Ne0nx3r0/discordant2/blob/master/${localPath}?raw=true`;

        new SendImageClientRequest({
            channelId: this.channelId,
            imageUrl: cachedCDNUrl,
            message: msg,
        }).send(this.getClient());
    }

    playerActionInvite(pc:PlayerCharacter){
        if(this.members.size + this.invited.size >= 4){
            throw 'Party is full (max 4)';
        }

        this.invited.set(pc.uid,{
            pc:pc,
            expires: new Date().getTime()+INVITE_EXPIRES_MS,
        });

        pc.party = this;
        pc.status = 'invitedToParty';

        this.sendChannelMessage(`${pc.title} was invited to the party`);

        setTimeout(()=>{
            //invite is still pending
            if(this.invited.has(pc.uid)){
                this.sendChannelMessage(`${pc.title}'s invitation expired`);

                this.invited.delete(pc.uid);

                //They didn't accept the invite
                if(pc.status == 'invitedToParty' && pc.party.id == this.id){
                    pc.party = null;
                    pc.status = 'inCity';
                }
            }
        },INVITE_EXPIRES_MS);
    }

    playerActionReturn(){
        if(this.partyStatus == PartyStatus.Battling){
            throw 'You can\'t return to town during a battle!';
        }

        this.returnToTown();
    }

    playerActionDecline(pc:PlayerCharacter){
        this.invited.delete(pc.uid);

        new SendMessageClientRequest({
            channelId: this.channelId,
            message: `${pc.title} declined the party invite`,
        }).send(this.getClient());
    }

    playerActionJoin(pc:PlayerCharacter){
        this.members.set(pc.uid,pc);

        this.invited.delete(pc.uid);

        pc.party = this;
        pc.status = 'inParty';

        new SendAddPartyMemberClientRequest({
            channelId: this.channelId,
            playerUid: pc.uid
        }).send(this.getClient());
    }

    playerActionKick(kicker:PlayerCharacter,toKick:PlayerCharacter){
        if(this.leader.uid == toKick.uid){
            throw 'Party leaders cannot be kicked, they must disband the party or transfer leadership';
        }

        if(this.partyStatus == PartyStatus.Battling){
            throw 'You can\'t kick players during a battle!';
        }

        this.members.delete(toKick.uid);

        toKick.party = null;
        toKick.status = 'inCity';

        new RevokeChannelPermissionsClientRequest({
            channelId: this.channelId,
            kickUid: toKick.uid,
            message: toKick.title+' was kicked from the party',
        }).send(this.getClient());

        new SendPMClientRequest({
            channelId: this.channelId,
            playerUid: toKick.uid,
            message: 'You were kicked from party '+this.title,
        }).send(this.getClient());
    }

    playerTransferLeadership(oldLeader:PlayerCharacter,newLeader:PlayerCharacter){
        if(this.leader.uid != oldLeader.uid){
            throw 'Only the party leader can transfer leadership of the party';
        }

        if(oldLeader.uid == newLeader.uid){
            throw `${oldLeader.title} gives control of the party to one of the voices in their head`;
        }

        if(this.partyStatus == PartyStatus.Battling){
            throw 'You can\'t give up leading in the middle of a battle!';
        }

        this.leader = newLeader;

        new SendMessageClientRequest({
            channelId: this.channelId,
            message: `${oldLeader.title} transferred party leadership to ${newLeader.title}`,
        }).send(this.getClient());
    }

    playerActionLeave(pc:PlayerCharacter){
        if(this.leader.uid == pc.uid){
            throw 'Party leaders cannot leave, they must disband the party';
        }

        if(this.partyStatus == PartyStatus.Battling){
            throw 'You can\'t leave during a battle!';
        }

        this.members.delete(pc.uid);

        pc.party = null;
        pc.status = 'inCity';

        new RevokeChannelPermissionsClientRequest({
            channelId: this.channelId,
            kickUid: pc.uid,
            message: pc.title+' left the party',
        }).send(this.getClient());
    }

    playerActionDisband(){
        if(this.partyStatus == PartyStatus.Battling){
            throw 'You can\'t disband during a battle!';
        }

        const members:Array<PlayerCharacter> = [];

        this.members.forEach(function(pc){
            pc.party = null;
            pc.status = 'inCity';
        });

        this.invited.forEach(function(pci:PlayerCharacterInvited){
            pci.pc.party = null;
            pci.pc.status = 'inCity';
        });

        this.leader.party = null;
        this.leader.status = 'inCity';

        new SendMessageClientRequest({
            channelId: this.channelId,
            message: `<@${this.leader.uid}> The party has been disbanded!\n\n(Channel will be deleted in one minute)`,
        }).send(this.getClient());

        setTimeout(()=>{
            new DeleteChannelClientRequest({
                channelId: this.channelId
            }).send(this.getClient());
        },30000);

        this.game._deleteParty(this.id);
    }

    get isInBattle():boolean{
        return this.partyStatus == PartyStatus.Battling;
    }

    get isInTown():boolean{
        return this.partyStatus == PartyStatus.InTown;
    }

    get isExploring():boolean{
        return this.partyStatus == PartyStatus.Exploring;
    }

    toSocket():SocketPlayerParty{
        const members = [];
        const leaderUid = this.leader.uid;
        this.members.forEach(function(member){
            if(member.uid != leaderUid){
                members.push(member.toSocket());
            }
        });

        let statusStr = '';

        switch(this.partyStatus){
            case PartyStatus.InTown:
                statusStr = 'In town';
            break;
            case PartyStatus.Battling:
                statusStr = 'Battling!';
            break;
            case PartyStatus.Exploring:
                statusStr = 'Exploring '+this.exploration.map.title;
            break;
        }

        return {
            title: this.title,
            channel: this.channelId,
            members: members,
            leader: this.leader.toSocket(),
            statusStr: statusStr
        };
    }
}

export interface SocketPlayerParty{
    title: string;
    channel: string;
    leader: SocketPlayerCharacter;
    members: Array<SocketPlayerCharacter>;
    statusStr: string;
}