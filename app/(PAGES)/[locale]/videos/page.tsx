// import react from "react"

import GeneralHero from "@/components/GeneralHero";
import { VideoLinedBottom } from "@/components/shapes";



export default function Videos(){
    return(
        <>
        <GeneralHero icon={<VideoLinedBottom/>} text="Videos" />
        <div>Hello Video</div>
        </>
    )
}