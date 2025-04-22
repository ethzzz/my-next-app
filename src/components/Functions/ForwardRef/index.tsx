import { FunctionItem, FunctionItemHeader, FunctionItemContent } from "@/components/FunctionItem";
import React, {useRef, forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {Input,Button, InputRef} from "antd";

export function ForwardRef(){
    const Father = () =>{
        const inputRef = useRef<RefProps>(null);
        useEffect(()=>{
            console.log(inputRef.current?.focus())
            console.log(inputRef.current?.getValue())
        },[])
        const setValue = () => {
            if (inputRef.current){
                inputRef.current.setValue('123')
            }
        }
        return (
            <div>
                <Son ref={inputRef}/>
                <Button style={{marginTop:'10px'}} onClick={setValue}>点击</Button>
            </div>
        )
    }

    interface RefProps {
        focus: () => void;
        getValue: () => any;
        setValue: (val:any) => void
    }

    const Guang: React.ForwardRefRenderFunction<RefProps> = (props, ref) => {
        const inputRef = useRef<InputRef>(null);
        const [inputValue,setInputValue] = useState('')
        useImperativeHandle(ref, () => {
            return {
                focus:()=>{
                    inputRef.current?.focus()
                },
                getValue: ()=>{
                    return inputRef.current?.input?.value
                },
                setValue: (val:any)=> {
                    setInputValue(val)
                }
            }
        },[])
        return <div>
            <Input ref={inputRef} value={inputValue} style={{width:'100%'}} onChange={e=>setInputValue(e.target.value)}></Input>
        </div>
    }

    const Son = forwardRef(Guang);

    /*const Son = forwardRef((props, ref) => {
        // 使用 ref 回调将 ref 转发到子组件的 input 元素
        return <input type="text" ref={ref} />;
    });*/

    return (
        <FunctionItem>
            <FunctionItemHeader>forwardRef + useImperativeHandle</FunctionItemHeader>
            <FunctionItemContent>
                <p>ForwardRef 是 React 提供的一个函数，用于将 ref 转发到子组件。</p>
                <p>在 React 中，ref 是一种特殊的属性，用于访问 DOM 元素或组件实例。默认情况下，ref 只能在类组件中使用，但在函数组件中，ref 是不可用的。</p>
                <p>ForwardRef 函数可以让你在函数组件中使用 ref，它接受两个参数：一个函数组件和一个 ref 回调</p>
                <p>结合useImperativeHandle使用</p>
            </FunctionItemContent>
            <FunctionItemContent>
                <p>使用示例：</p>
                <Father />
            </FunctionItemContent>
        </FunctionItem>
    )
}

ForwardRef.displayName = "ForwardRef"