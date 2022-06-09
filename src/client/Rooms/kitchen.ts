import { Vector3 } from "three";
import { loadObject } from "../ModelHandler";
import { SceneHandler } from "../SceneHandler";

export default function createKitchen(ROOM_SIZE:number) {
    const obj:  loadObject[] = [];
    for(let i=0;i<3.5;i+=0.5) {
        obj.push({type:i==2?'kitchenSink':(i==3)?'kitchenStove':'kitchenCabinet',params:{position: new Vector3(i+3,0,0.5), scale: new Vector3(1.16,1.16,1.16)}})
    }
    obj.push(
        {type:'kitchenBlender',params:{position: new Vector3(3.2,0.5,0.3)}},
        {type:'kitchenMicrowave',params:{position: new Vector3(3.5,0.5,0.3)}},
        {type:'toaster',params:{position: new Vector3(4,0.5,0.15)}},
        {type:'kitchenFridge',params:{position: new Vector3(6.5,0,0.4)}},
        {type:'tableCloth',params:{position: new Vector3(4.5,0,2.25),scale:new Vector3(1.35,1.35,1.35)}},
        {type:'cuttingBoard',params:{position: new Vector3(5.75,0.5,0.35), rotation:new Vector3(0,Math.PI/2,0),scale:new Vector3(0.35,0.35,0.35)}},
        {type:'tomatoSlice',params:{position: new Vector3(5.8,0.525,0.35), rotation:new Vector3(0,Math.PI/2,0),scale:new Vector3(0.35,0.35,0.35)}},
        {type:'tomato',params:{position: new Vector3(5.75,0.525,0.35), rotation:new Vector3(0,Math.PI/2,0),scale:new Vector3(0.35,0.35,0.35)}},
        {type:'cookingKnife',params:{position: new Vector3(5.65,0.6,0.35), rotation:new Vector3(0,Math.PI/4,-Math.PI/3),scale:new Vector3(0.35,0.35,0.35)}},
        {type:'cup',params:{position: new Vector3(4.7,0.45,1.8),scale:new Vector3(0.5,0.5,0.5)}},
        {type:'rugDoormat',params:{position: new Vector3(5.525,0.05,0.85)},ev:SceneHandler.teleportFunc},
        {type:'rugDoormat',params:{position: new Vector3(3.525,0.05,0.85)},ev:SceneHandler.teleportFunc},
        {type:'rugDoormat',params:{position: new Vector3(4.4,0.05,2.15), rotation:new Vector3(0,Math.PI/2,0)},ev:SceneHandler.teleportFunc},
        {type:'rugDoormat',params:{position: new Vector3(6,0.05,2.15), rotation:new Vector3(0,Math.PI/2,0)},ev:SceneHandler.teleportFunc},
        )
    for(let i=0;i<2;i++) {
        obj.push(
            {type:'chair',params:{position: new Vector3(4.7+i*0.5,0,1.8), scale:new Vector3(1.35,1.35,1.35)}},
            {type:'chair',params:{position: new Vector3(4.9+i*0.5,0,2.15), rotation: new Vector3(0,Math.PI*(1+i*0.2),0), scale:new Vector3(1.35,1.35,1.35)}},
            )
    }
    return obj;
}