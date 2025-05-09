'use client'
import { memo, useMemo, useEffect, useState, useCallback, CSSProperties } from "react";
import { FunctionItem, FunctionItemHeader, FunctionItemContent} from "@/components/FunctionItem";
import { Button } from "antd"

const Comp:CSSProperties = {
    border: "1px solid #ccc",
    padding: "10px",
    display: 'flex',
    flexDirection: 'column',
    margin: "10px 0",
    borderRadius: '5px',
}

const Btn:CSSProperties = {
    marginRight: '10px',
    marginBottom: '10px',
}

const AComp = (props:any) =>{
    console.log("AComp is rendered")
    return (
        <div style={Comp}>
            <span>AComp</span>
            <span>count : {props.count}</span>
            <span>text : {props.text}</span>
        </div>
    )
}

const BComp = memo((props:any) =>{
    console.log("BComp is rendered")
    return (
        <div style={Comp}>
            <span>BComp</span>
            <span>count : {props.count}</span>
            <span>text : {props.text}</span>
        </div>
    )
})
BComp.displayName = "BComp"

export function UseMemo(){
    const [,setNum] = useState(0)
    const [count, setCount] = useState(0);
    const [text, setText] = useState("");

    const memoizedValue = useMemo(() => {
        let sum = 0;
        for (let i = 0; i < count; i++) {
            sum += i;
        }
        return sum;
    }, [count]);

    // 未用useCallback，每次点击按钮，handleCallback都会重新创建，导致子组件重新渲染
    const handleCallback = () => {
        console.log("handleCallback");
    }

    // 用useCallback，handleCallback不会重新创建，子组件不会重新渲染
    const useHandleCallback = useCallback(() => handleCallback, []);

    useEffect(() => {
        console.log("useEffect");
    }, [count]);

    return (
        <FunctionItem>
            <FunctionItemHeader>memo + useMemo + useCallback </FunctionItemHeader>
            <FunctionItemContent>
                <span>memo: 子组件只有props变化时才会重新渲染</span>
                <span>useMemo: 只有依赖项变化时才会重新计算</span>
                <span>useCallback: 只有依赖项变化时才会重新创建函数</span>
                <AComp count={count} text={text} callback={handleCallback}/>
                <BComp count={count} text={text} memoizedValue={memoizedValue} callback={useHandleCallback}/>
                <Button style={Btn} onClick={() => setCount(count + 1)}>count+1</Button>
                <Button style={Btn} onClick={() => setText("text")}>setText</Button>
                <Button style={Btn} onClick={() => setNum(Math.random())}>setNum(不关联子组件的更新)</Button>
            </FunctionItemContent>
        </FunctionItem>
    )
}

UseMemo.displayName = "UseMemo"