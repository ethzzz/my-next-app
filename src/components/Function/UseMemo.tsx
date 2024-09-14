import { memo, useMemo, useEffect, useState } from "react";
import { FunctionItem, FunctionItemHeader, FunctionItemContent} from "@/components/FunctionItem";

export function UseMemo(){
    const [count, setCount] = useState(0);
    const [text, setText] = useState("");

    const memoizedValue = useMemo(() => {
        let sum = 0;
        for (let i = 0; i < count; i++) {
            sum += i;
        }
        return sum;
    }, [count]);

    const AComp = (props:any) =>{
        return (
            <div>
                {props.count}
            </div>
        )
    }

    const BComp = memo((props:any) =>{
        return (
            <div>{props.count}</div>
        )
    })

    useEffect(() => {
        console.log("useEffect");
    }, [count]);

    return (
        <FunctionItem>
            <FunctionItemHeader>memo + useMemo + useCallback </FunctionItemHeader>
            <FunctionItemContent>
                <AComp count={count}/>
                <BComp count={count}/>
            </FunctionItemContent>
        </FunctionItem>
    )
}