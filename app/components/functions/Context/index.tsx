'use client'
import { FunctionItem, FunctionItemHeader, FunctionItemContent} from "../../function-item";
import {createStore} from "zustand";

export function Context(){
    // const countContext = createStore({})
    return (
        <FunctionItem>
            <FunctionItemHeader>useContext</FunctionItemHeader>
            <FunctionItemContent>
                <p>useContext: {''}</p>
            </FunctionItemContent>
        </FunctionItem>
    )
}

Context.displayName = "Context"