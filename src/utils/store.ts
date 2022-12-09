interface Store {
    [prop: string]: any
}

export const store: Store = new Proxy({
    // defaults
    MUSIC_VOLUME: 20,
    SFX_VOLUME: 20
}, {
    get(o, prop){
        if(typeof prop === "string" && localStorage.getItem(prop) != null){
            return JSON.parse(localStorage.getItem(prop)!)
        }
        return Reflect.get(o, prop)        
    },
    set(o, prop, value){
        if(typeof prop === "string") localStorage.setItem(prop, JSON.stringify(value))
        return Reflect.set(o, prop, value)
    }
})