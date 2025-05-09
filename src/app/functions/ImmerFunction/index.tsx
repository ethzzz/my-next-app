'use client'
import { useState } from 'react';
import { produce } from 'immer';
import { Button } from "antd";
import { FunctionItem,FunctionItemHeader,FunctionItemContent } from '@/components/FunctionItem';
import styles from '../content.module.scss'

export function ImmerFunction(){
    const [state, setState] = useState({name: 'John', age: 30});

    const updateState = () => {
        // setState(prevState => {
        //     return {...prevState, age: prevState.age + 1}
        // })
        setState(produce(state, state => {
            state.age += 1;
        }))
    }

    return (
        <FunctionItem>
            <FunctionItemHeader>Immer Function</FunctionItemHeader>
            <FunctionItemContent>
                <p>Name: {state.name}</p>
                <p>Age: {state.age}</p>
                <Button onClick={updateState}>Update Age</Button>
            </FunctionItemContent>
        </FunctionItem>
    )
}

ImmerFunction.displayName = "ImmerFunction"