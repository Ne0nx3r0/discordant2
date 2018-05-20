const STABLE_COST_TO_UPGRADE:number[] = [1000,// Cost to buy first stall
    2500,// cost to buy 2nd stall
    5000,
    7500,
    10000,
    20000,
    30000,
    40000,
    50000,
    100000,
];

export function getStableUpgradeCost(currentStalls:number):number{
    return STABLE_COST_TO_UPGRADE[currentStalls];
}