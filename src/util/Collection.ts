export default class Collection extends Map{
    constructor(){
        super();
    }

    find(propOrFunc,value?){
        if (typeof propOrFunc === 'string') {
            if (typeof value === 'undefined') throw new Error('No value specified.');

            for (const item of this.values()) {
                if (item[propOrFunc] === value) return item;
            }

            return;
        }
        else if (typeof propOrFunc === 'function') {
            for (const [key, val] of this) {
                if (propOrFunc(val, key, this)) return val;
            }

            return;
        } 

        throw new Error('1st arg must be property or string');
    }
}