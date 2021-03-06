export function VariableNotFoundError(fn){
    try{
        return fn();
    }
    catch(e){
        if(e instanceof ReferenceError){
            throw new Error(e.message.replace("is not defined","未被定义！请检查您是否已经声明此变量"));
        }
        else{
            throw e;
        }
    }
}