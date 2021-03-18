import {track,trigger,effect,recordInstanceBoundEffect,setType} from "./new_reactivity.js"
export class computedNode{
    constructor(name,fn,sact){
        this.name = name;
        this._is_computed = true;
        this._init = false;
        this._value;
        this.sact = sact;
        fn = fn.bind(sact);

        this.effect = effect(fn,{
            lazy:true,
            isComputed:true,
            scheduler:()=>{
                this._value = fn();
                trigger(sact.$data,setType.SET,this.name);
            }
        })
        recordInstanceBoundEffect(this.effect,sact);
    }

    get value(){
        if(!this._init){
            this._init = true;
            this._value = this.effect();
        }
        track(this.sact.$data,this.name);
        return this._value;
    }

    set value(newValue){
        this._value = newValue;
        trigger(this.sact.$data,setType.SET,this.name);
    }
}