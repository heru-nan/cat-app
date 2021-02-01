import React from "react"

export default function Bar({...props}){
    const {values} = props;
    return (
        <div style={{
            position: "fixed",
            right: "5%",
            bottom: "5%",
            display:"flex",
            flexDirection: "column-reverse",
            justifyContent: "center"
        }}>
            {
                values.map((v, i) => {
                    return <img key={i} className="Button" src={v.src} onClick={v.fn} />
                })
            }
            </div>
    )
}

