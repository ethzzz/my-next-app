'use client'
import {FunctionItem, FunctionItemContent, FunctionItemHeader} from "@/components/FunctionItem";
import { useState, useEffect} from "react";

export function Closures(){
    const [state,setState] = useState(0);

    useEffect(()=>{
        const interval = setInterval(()=>{
            setState((state) => state + 1);
        },1000)
        return ()=>{
            clearInterval(interval)
        }
    },[state])

    return (
        <FunctionItem>
            <FunctionItemHeader>Closures</FunctionItemHeader>
            <FunctionItemContent>
                <p>Closures are functions that have access to the parent scope, even after the parent function has closed.</p>
                <div>{state}</div>
            </FunctionItemContent>
        </FunctionItem>
    )
}

Closures.displayName = "Closures"