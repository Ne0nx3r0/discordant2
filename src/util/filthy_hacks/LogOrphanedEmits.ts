export default function LogOrphanedEmits(socket){
    var onevent = socket['onevent'];//using this syntax to avoid pissing off typescript
    var eventNames = Object.keys(socket['_events']);
    socket['onevent'] = function (packet) {
        onevent.call(this, packet);// original call
        
        var handlerName = packet.data[0];

        if(eventNames.indexOf(handlerName) == -1){
            console.error('No handler for emitted event: '+handlerName);
        }
    };
}