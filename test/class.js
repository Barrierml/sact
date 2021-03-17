class pp {
    constructor(){
        this._value= "123";
    }
    get value(){
        return this._value;
    }
    set value(v){
        this._value = v;
    }
}
pp = new pp();
console.log(pp.value);