//Weapon helper functions
function scalingGen(arr){
    let i = 0;

    const scaling = arr.map(function(v){
        i+= v;

        return i;
    });

    return function(baseDamage,statValue){
        return Math.floor(baseDamage * (1 + scaling[statValue] / 100));
    };
}

export default {
    ByAttribute: scalingGen([
        0,//0
        0,0,0,0,0,0,0,0,0,0,//1-10
        1,1,1,1,2,1,1,1,1,2,//11-20
        2,2,2,1,2,2,2,2,1,2,//21-30
        3,3,2,3,3,2,3,3,2,3,//31-40
        3,2,3,2,3,2,3,2,3,2,//41-50
        3,3,4,3,4,3,4,3,3,4,//51-60
        2,2,2,3,2,2,2,3,2,3,//61-70
        2,1,1,2,2,2,2,1,2,1,//71-80
        1,1,0,1,1,1,0,1,1,0, //81-90
        0,1,0,1,0,1,0,1,1,6 //91-100
    ])  
};