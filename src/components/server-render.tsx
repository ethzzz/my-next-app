export async function getServerSideProps(){
    return {
        props: {
            text: "This is server rendered"
        }
    }
}

export function ServerRender(props:any){
    return (
        <div>
            <h1>Server Rendered</h1>
            <p>{props.text}</p>
        </div>
    )
}