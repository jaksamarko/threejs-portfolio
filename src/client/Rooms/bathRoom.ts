import { Vector3 } from "three";
import { loadObject } from "../ModelHandler";
import { SceneHandler } from "../SceneHandler";

export default function createBathRoom(ROOM_SIZE:number) {
    const objs: loadObject[] = [];
    objs.push(
        {type:'shower',params:{position: new Vector3(0.6,0.05,5.6)}},
        {type:'toilet',params:{position: new Vector3(0,0.05,6.8), rotation: new Vector3(0,Math.PI/2,0)}},
        {type:'bathroomSink',params:{position: new Vector3(1.5,0.45,6.625), rotation: new Vector3(0,Math.PI,0)}},
        {type:'bathroomMirror',params:{position: new Vector3(1.475,0.75,6.9), rotation: new Vector3(0,Math.PI,0)}},
        {type:'bathroomCabinet',params:{position: new Vector3(2.05,0.05,6.7), scale: new Vector3(1.2,1.2,1.2),rotation: new Vector3(0,Math.PI,0)}},
        {type:'dryer',params:{position: new Vector3(0.3,0.05,6.15), rotation: new Vector3(0,Math.PI/2,0)}},
        {type:'rugDoormat',params:{position: new Vector3(1.25,0.05,5.85)},ev:SceneHandler.teleportFunc}
    )
    return objs;
}