import { createPersistStore } from "@/utils/store";

type System = {
    showHeader?: boolean
}

type SystemMethods = {
    getSystem(): System
    setSystem(system: System): void
}

const SYSTEM_STATE: System = {
    showHeader: true
}

export const useSystemStore = createPersistStore<
    System,
    SystemMethods
>(
    SYSTEM_STATE,
    (set,_get)=>{
        return {
            getSystem(){
                return _get()
            },
            setSystem(system){
                set(system)
            }
        }
    },
    { name: "system" }
)