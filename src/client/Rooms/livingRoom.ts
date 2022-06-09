import { Vector3 } from "three";
import { loadObject } from "../ModelHandler";
import { SceneHandler } from "../SceneHandler";

export default function createLivingRoom(ROOM_SIZE: number) {
    const objs: loadObject[] = [];
    objs.push(
        {type:'rugRectangle',params:{position: new Vector3(0.75,0.05,4.5)},ev:SceneHandler.teleportFunc},
        {type:'tableGlass',params:{position: new Vector3(5,0.05,5)}},
        {type:'loungeSofa',params:{position: new Vector3(5,0.05,4.25)}},
        {type:'loungeChair',params:{position: new Vector3(4.55,0.05,4.5), rotation: new Vector3(0,Math.PI/4,0)},ev:SceneHandler.teleportFunc},
        {type:'loungeChair',params:{position: new Vector3(6.05,0.05,4.25), rotation: new Vector3(0,-Math.PI/4,0)},ev:SceneHandler.teleportFunc},
        {type:'cabinetTelevision',params:{position: new Vector3(6.15,0.05,6.7), scale: new Vector3(1.25,1.25,1.25),rotation: new Vector3(0,Math.PI,0)}},
        {type:'televisionModern',params:{position: new Vector3(5.6,0.475,6.75), scale: new Vector3(1.25,1.25,1.25), rotation: new Vector3(0,Math.PI,0)}},
        {type:'rugRectangle',params:{position: new Vector3(5,0.05,6), scale: new Vector3(0.6,0.6,0.6)},ev:SceneHandler.teleportFunc},
        {type:'rugRound',params:{position: new Vector3(3,0.05,6), scale: new Vector3(0.6,0.6,0.6)},ev:SceneHandler.teleportFunc},
        {type:'text', params:{position: new Vector3(3.35,1,6.9),name:"Hi I'm Jaksa Márkó\nWelcome to my place!\nTake a look around", rotation: new Vector3(0,Math.PI,0)}}
    )
    return objs;
}