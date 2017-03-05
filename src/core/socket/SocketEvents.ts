const events = {
    GET_PLAYER_BY_UID: 'getPlayerByUID'
};

export default events;

export interface SocketGetPlayerByUID{
    uid: string;
}

export interface SocketGetPlayerByUIDResponse{
    title: string;
    uid: string;
}