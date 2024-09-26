import {FunctionItem, FunctionItemContent, FunctionItemHeader} from "@/components/FunctionItem";
import {useState, Suspense, useEffect} from "react";

export function SuspenseFunction(){
    const fetchData = ():Promise<string> =>{
        return new Promise((resolve, reject) =>
            setTimeout(() =>
                resolve('fetch data success')
            , 2000)
        );
    }

    const LoadData = () => {
        const [loading,setLoading] = useState<boolean>(false)
        const [data, setData] = useState<string>('');
        useEffect(() => {
            setLoading(true);
            fetchData().then((res) => {
                setLoading(false)
                setData(res)
            });
        }, []);
        return loading ? <div>loading...</div> :<div>{data}</div>
    }

    return (
        <FunctionItem>
            <FunctionItemHeader>
                Suspense
            </FunctionItemHeader>
            <FunctionItemContent>
                <LoadData />
            </FunctionItemContent>
        </FunctionItem>
    )
}