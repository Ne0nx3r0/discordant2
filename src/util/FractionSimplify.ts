//Euclid's Algorithm
function getGCD(n, d){
    var numerator = (n<d)?n:d;
    var denominator = (n<d)?d:n;        
    var remainder = numerator;
    var lastRemainder = numerator;

    while (true){
        lastRemainder = remainder;
        remainder = denominator % numerator;
        if (remainder === 0){
            break;
        }
        denominator = numerator;
        numerator = remainder;
    }
    if(lastRemainder){
        return lastRemainder;
    }
};

export default function FractionSimplify(n, d){
    var gcd = getGCD(n, d);

    return [n/gcd, d/gcd];
};