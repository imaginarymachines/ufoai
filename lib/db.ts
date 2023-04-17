export default function Db(){
    let items = new Map();
    return {
        get: (key:string) => items.get(key),
        set: (key:string, value:string|number) => items.set(key, value),
    }
}
