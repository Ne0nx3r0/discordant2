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

export {PartyStatus};

interface PlayerPartyBag{
    title:string;
    leader:PlayerCharacter;
    channelId:string;
    game:Game;
    getClient:IGetRandomClientFunc;
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
        return this.leader.uid;
    }

    get status():PartyStatus{
        return this.partyStatus;
    }

    explore(map:ExplorableMap,startX:number,startY:number){
        this.exploration = new PartyExploringMap(map,this.game,this.sendChannelMessage.bind(this),startX,startY);
        this.partyStatus = PartyStatus.Exploring;

        this.sendCurrentMapImageFile(this.partyPlural('You arrive','Your party arrives') + `at ${map.name}...`);
    }

    move(direction:PartyMoveDirection){
        if(this.partyStatus != PartyStatus.Exploring){
            throw this.partyPlural('You','Your party')+' must be exploring a map.';
        }

        if(!this.exploration.canMove(direction)){
            this.sendChannelMessage('The way is impassably blocked by a small bush or something.');

            return;
        }

        this.exploration.move(direction);

        if(this.exploration.getEncounterChance() > Math.random()){
            this.monsterEncounter();
        }
        else{
            this.sendCurrentMapImageFile(this.partyPlural('You','Your party moved')+' moved');

            this.exploration.onEnterCurrentTile();
        }
    }

    monsterEncounter(){
        const partyMembers = [];

        this.members.forEach(function(pc){
            partyMembers.push(pc);
        });

        const opponentId = this.exploration.getRandomEncounterMonsterId();

        this.currentBattle = this.game.createMonsterBattle({
            party: this,
            partyMembers: partyMembers,
            opponentId: opponentId,
            startDelay: 2000,
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

    returnFromBattle(result:BattleResult){
        this.members.forEach(function(pc){
            if(pc.hpCurrent < 0){
                pc.hpCurrent = pc.stats.hpTotal * 0.05;
            }
        });

        if(result == BattleResult.Team1Won || result == BattleResult.Ran){
            if(result == BattleResult.Ran){
                this.timesRun++;
            }

            this.partyStatus = PartyStatus.Exploring;
        
            this.members.forEach((member)=>{
                member.status = 'inParty';
            });

            this.sendCurrentMapImageFile(this.partyPlural('You survived!','Your party survived!'));
        }
        else{
            this.sendChannelMessage('Your party was defeated!');

            setTimeout(()=>{
                this.playerActionDisband();
            },10000);
        }

        this.currentBattle = null;
        this.members.forEach(function(member){
            member.status = 'inParty';
        });

        this.exploration.onEnterCurrentTile();
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
        const localUrl = this.exploration.getCurrentLocationImage();
        const cachedCDNUrl = this.game.getSliceRemoteUrl(localUrl);

        if(cachedCDNUrl){
            new SendImageClientRequest({
                channelId: this.channelId,
                imageUrl: cachedCDNUrl,
                message: msg,
            }).send(this.getClient());
        }
        else{
            new SendLocalImageClientRequest({
                channelId: this.channelId,
                locationName: this.exploration.map.name,
                imageSrc: localUrl,
                message: msg,
            }).send(this.getClient());
        }
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

    playerActionLeave(pc:PlayerCharacter){
        if(this.leader.uid == pc.uid){
            throw 'Party leaders cannot leave, they must disband the party';
        }

        this.members.delete(pc.uid);

        pc.party = null;
        pc.status = 'inCity';

        new SendMessageClientRequest({
            channelId: this.channelId,
            message: `${pc.title} left the party`,
        }).send(this.getClient());
    }

    playerActionDisband(){
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
            message: `The party has been disbanded!\n\n(Channel will be deleted in one minute)`,
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

        return {
            title: this.title,
            channel: this.channelId,
            members: members,
            leader: this.leader.toSocket()
        };
    }
}

export interface SocketPlayerParty{
    title: string;
    channel: string;
    leader: SocketPlayerCharacter;
    members: Array<SocketPlayerCharacter>;
}