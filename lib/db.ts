//Simple db client that uses saved JSON file

import { existsSync, readFileSync, writeFileSync } from "fs";

export function makeDatabase(location: string| undefined): {
    get: (key:string) => string|number|undefined,
    set: (key:string, value:string|number) => void,
    getAll: () => {[key:string] : string|number|undefined};
    delete: (key:string) => void
}{
    const dbLocation :string = 'string' === typeof location ? location : "db.json";
    let items = new Map();
    if( ! existsSync(dbLocation) ){
        writeFileSync(dbLocation,JSON.stringify({}));
    }else{
        items = new Map(Object.entries(JSON.parse(
            readFileSync(dbLocation).toString()
        )));
    }
    return {
        get: (key:string) => items.get(key),
        set: (key:string, value:string|number) => {
            items.set(key, value);
            writeFileSync(dbLocation, JSON.stringify(Object.fromEntries(items)));
        },
        getAll: () => Object.fromEntries(items),
        delete: (key:string) => {
            items.delete(key);
            writeFileSync(dbLocation, JSON.stringify(Object.fromEntries(items)));
        }
    }
}
