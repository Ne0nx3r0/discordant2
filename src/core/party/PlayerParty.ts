import PlayerCharacter from "../creature/player/PlayerCharacter";
import PartyExploringMap from "./PartyExploringMap";
import Game from "../../gameserver/game/Game";

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

export default class PlayerParty{
    leader:PlayerCharacter;
    title: string;
    members:Map<string,PlayerCharacter>;
    invited:Map<string,PlayerCharacterInvited>;
    channelId:string;
    partyStatus:PartyStatus;
    exploration:PartyExploringMap;
    currentBattle:CoopBattle;
    game:Game;

    constructor(title:string,leader:PlayerCharacter,channelId:string,game:Game){
        this.leader = leader;
        this.title = title;
        this.channelId = channelId;

        this.members = new Map();
        this.members.set(leader.uid,leader);

        this.invited = new Map();
        this.partyStatus = PartyStatus.InTown;
        this.game = game;
        this.currentBattle = null;

        this.leader.party = this;
        this.leader.status = 'inParty';
        
        this._events = new EventDispatcher();
    }

    get id():string{
        return this.leader.uid;
    }

    get status():PartyStatus{
        return this.partyStatus;
    }

    explore(map:ExplorableMap){
        this.exploration = new PartyExploringMap(map);
        this.partyStatus = PartyStatus.Exploring;

        this.sendCurrentMapImageFile('Your party arrives outside the city...');
    }

    move(direction:PartyMoveDirection){
        if(!this.exploration.canMove(direction)){
            this.channel.sendMessage('The party cannot move '+direction+', the way is impassably blocked by a small bush or something.');

            return;
        }

        this.exploration.move(direction);

        if(this.exploration.getEncounterChance() > Math.random()){
            this.monsterEncounter();

            return;
        }

        const startingLocationImageSrc = this.exploration.getCurrentLocationImage();

        this.sendCurrentMapImageFile('Your party moved');
    }

    monsterEncounter(){
        const partyMembers = [];

        this.members.forEach(function(pc){
            partyMembers.push(pc);
        });

        const opponentId = this.exploration.getRandomEncounterMonsterId();

        const opponent = this.game.createMonsterFromId(opponentId);

        this.channel.sendMessage(`The party is attacked by ${opponent.title}!`);

        this.game.createMonsterBattle(partyMembers,this.channel,opponent)
        .then((battle:CoopBattle)=>{
            this.currentBattle = battle; 
            this.partyStatus = PartyStatus.Battling;

            battle.on(BattleEvent.CoopBattleEnd,(e:ICoopBattleEndEvent)=>{
                if(e.victory){
                    this.partyStatus = PartyStatus.Exploring;
                
                    this.sendCurrentMapImageFile('Your party survived!');
                }
                else{
                    this.channel.sendMessage('Your party was defeated!');

                    setTimeout(()=>{
                        this.members.forEach((pc)=>{
                            this.channel.client.users.get(pc.uid).sendMessage('Your party was defeated!');
                        });
                        
                        this.playerActionDisband();
                    },10000);
                }

                this.currentBattle = null;
                this.members.forEach(function(member){
                    member.status = 'inParty';
                });
            });
        })
        .catch((err)=>{
            this.channel.sendMessage('Error occured while finding encounter: '+err);
        });
    }

    sendCurrentMapImageFile(msg:string){
        const localUrl = this.exploration.getCurrentLocationImage();
        const cachedCDNUrl = MapUrlCache.getSliceRemoteUrl(localUrl);

        if(cachedCDNUrl){
            this.channel.sendMessage('',{
                embed: {
                    color: 0x36393E,
                    image: { 
                        url: cachedCDNUrl, 
                        height: 288, 
                        width: 288,
                    },   
                    description: msg,      
                }
            });
        }
        else{
            (async()=>{        
                try{
                    const resultMessage = await this.channel.sendFile(localUrl,'slice.png',msg);

                    const cacheUrl = resultMessage.attachments.first().url;      

                    MapUrlCache.setSliceRemoteUrl(localUrl,cacheUrl);              
                }
                catch(ex){
                    const did = Logger.error(ex);

                    this.channel.sendMessage("error loading map image "+did);
                }
            })();
        }
    }

    playerActionInvite(pc:PlayerCharacter){
        this.invited.set(pc.uid,{
            pc:pc,
            expires: new Date().getTime()+INVITE_EXPIRES_MS,
        });

        pc.party = this;
        pc.status = 'invitedToParty';

        const eventData:PlayerInvitedEvent = {
            party: this,
            pc:pc,
        };

        this.dispatch(PlayerPartyEvent.PlayerInvited,eventData);

        setTimeout(()=>{
            //invite is still pending
            if(this.invited.has(pc.uid)){
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

        const eventData:PlayerDeclinedToJoinEvent = {
            party:this,
            pc:pc,
        };

        this.dispatch(PlayerPartyEvent.PlayerDeclined,eventData);
    }

    playerActionJoin(pc:PlayerCharacter){
        this.members.set(pc.uid,pc);

        this.invited.delete(pc.uid);

        pc.party = this;
        pc.status = 'inParty';

        const eventData:PlayerJoinedEvent = {
            party:this,
            pc:pc,
        };

        this.dispatch(PlayerPartyEvent.PlayerJoined,eventData);
    }

    playerActionLeave(pc:PlayerCharacter){
        this.members.delete(pc.uid);

        pc.party = null;
        pc.status = 'inCity';

        const eventData:PlayerLeftEvent = {
            party:this,
            pc:pc,
        };

        this.dispatch(PlayerPartyEvent.PlayerLeft,eventData);
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

        const eventData:PartyDisbandedEvent = {
            party:this
        };

        this.dispatch(PlayerPartyEvent.PartyDisbanded,eventData);

        this.channel.delete();
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

    //Event methods
    on(event:PlayerPartyEvent,handler:Function){ this._events.on(event,handler); }
    off(event:PlayerPartyEvent,handler:Function){ this._events.off(event,handler); }
    dispatch<T>(event:PlayerPartyEvent,eventData:T){ this._events.dispatch(event,eventData); }
}

export enum PlayerPartyEvent{
    PlayerJoined,
    PlayerInvited,
    PlayerDeclined,
    PlayerLeft,
    PartyDisbanded,
    PartyAtNewLocation,
}

export interface PlayerJoinedEvent{
    party:PlayerParty,
    pc:PlayerCharacter,
}

export interface PlayerInvitedEvent{
    party:PlayerParty,
    pc:PlayerCharacter,
}

export interface PlayerDeclinedToJoinEvent{
    party:PlayerParty,
    pc:PlayerCharacter,
}

export interface PlayerLeftEvent{
    party:PlayerParty,
    pc:PlayerCharacter,
}

export interface PartyDisbandedEvent{
    party:PlayerParty
}

export interface PartyAtNewLocationEvent{
    imageSrc:string;
}