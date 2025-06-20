'use client'
import { useLocation } from "react-router-dom"
import { useEffect, useState } from "react"

export function Category(){
    const location = useLocation()
    const [count,setCount] = useState(0)
    useEffect(()=>{
        setCount((num)=>num+1)
        console.log(location)
    },[location])
    return (
        <>
            {location.pathname}
            {count}
        </>
    )
}