const STABLE_COST_TO_UPGRADE:number[] = [2000,// Cost to buy first stall
    3000,// cost to buy 2nd stall
    4000,
    6000,
    10000,
    20000,
    30000,
    40000,
    50000,
    100000,
];

export const MAX_STALLS:number = STABLE_COST_TO_UPGRADE.length;

export function getStableUpgradeCost(currentStalls:number):number{
    return STABLE_COST_TO_UPGRADE[currentStalls];
}