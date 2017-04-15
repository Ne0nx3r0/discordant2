import GetEarnedWishes from './util/GetEarnedWishes';

function t(a,b,c,d){
    console.log(' ');
    const earnedWishes = GetEarnedWishes({
        baseWishes: a,
        playerLevel: b,
        highestLevel: c,
        partySize: d
    });

    console.log(`BW${a} PL${b} HL${c} PS${d} EW${earnedWishes}`);
}

t(20,10,10,1);
t(20,10,10,2);
t(20,10,10,3);
t(20,10,10,4);
t(20,1,10,2);
t(20,1,10,4);