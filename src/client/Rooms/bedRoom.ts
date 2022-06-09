import * as THREE from "three";
import { Color, Vector3 } from "three"
import { loadObject } from "../ModelHandler";
import { ObjectParams, SceneHandler } from "../SceneHandler";

export default function createBedroom(ROOM_SIZE: number) {
    const objs: loadObject[] = [];
    for(let i=0;i<ROOM_SIZE;i++) {
        objs.push(
            {type:'wall',params:{position:new Vector3(i,0,0)}},
            {type:'wall',params:{position:new Vector3(i,0,ROOM_SIZE)}},
            {type:'wall',params:{position:new Vector3(0,0,i+1), rotation: new Vector3(0,Math.PI/2,0)}},
            {type:'wall',params:{position:new Vector3(ROOM_SIZE,0,i+1), rotation: new Vector3(0,Math.PI/2,0)}})
        for(let j=0;j<ROOM_SIZE;j++) {
            const params: ObjectParams = {position:new Vector3(i,0,j+1)}
            if(i>2) {
                if(j<3) {
                    params.material={color:new Color((i+j)%2,(i+j)%2,(i+j)%2)}
                }
            }
            if(j>2) {
                params.material={color: new Color(237/255,119/255,28/255)}
                if(j>4 && i<2) {
                    params.material={color: new Color(77/255,194/255,209/255)}
                }
            }
            objs.push({type:'floorFull',params:params})
        }
    }
    //Bedroom
    for(let i=0;i<3;i++) {
        objs.push({type:i==1?'wallDoorway':'wall',params:{position:new Vector3(i,0,3)}},
            {type:'wall',params:{position:new Vector3(3,0,i+1),rotation: new Vector3(0,Math.PI/2,0)}})
    }

    //Bathroom
    for(let i=0;i<2;i++) {
        objs.push(
            {type:i==1?'wallDoorway':'wall',params:{position:new Vector3(i,0,5)}},
            {type:'wall',params:{position:new Vector3(2,0,6+i), rotation: new Vector3(0,Math.PI/2,0)}}
        )
    }

    objs.push({type:'bedDouble',params:{position:new Vector3(2,0,1.1)}},
        {type:'bookcaseClosedWide',params:{position:new Vector3(0,0,0.25)}},
        {type:'books',params:{position:new Vector3(0.1,.55,0.225), name: "bookSkills", scale: new Vector3(1.25,1.25,1.25)}},
        {type:'radio',params:{position:new Vector3(0.5,.55,0.225), scale: new Vector3(0.8,0.8,0.8)}})
    
    objs.push({type:'deskCorner',params:{position:new Vector3(1,0,2), rotation: new Vector3(0,-Math.PI,0)}})
    objs.push({type:'chairDesk',params:{
        position:new Vector3(0.5,0.05,2.15),
        rotation: new Vector3(0,-Math.PI/2,0),
        name:"bedroomChair"
    },ev:SceneHandler.interactFunc})
    objs.push({type:'computerScreen',params:{position:new Vector3(0.2,0.375,2.5), rotation: new Vector3(0,Math.PI/2,0)}},
        {type:'computerKeyboard',params:{position:new Vector3(0.35,0.375,2.55), rotation: new Vector3(0,Math.PI/2,0)}},
        {type:'computerMouse',params:{position:new Vector3(0.35,0.375,2.2), rotation: new Vector3(0,Math.PI/2,0)}},
        {type:'rugRectangle',params:{position:new Vector3(1.8,0.05,1), rotation: new Vector3(0,Math.PI/2,0), scale: new Vector3(0.6,0.6,0.6)},ev:SceneHandler.teleportFunc},
        {type:'cardboardBoxOpen',params:{position:new Vector3(0.325,0.075,1.5), rotation: new Vector3(0,Math.PI/2,0), scale: new Vector3(1.5,1.5,1.5)}},
        {type:'trashcan',params:{
            position:new Vector3(0.1,0.075,1.8),
            rotation: new Vector3(0,Math.PI/2,0),
            name: "trash",
            scale: new Vector3(0.7,0.7,0.7),
            material:{side:THREE.DoubleSide}},ev:SceneHandler.interactFunc},
        {type:'cabinetTelevision',params:{position:new Vector3(2.7,0.075,2.7), rotation: new Vector3(0,-Math.PI,0)}},
        {type:'televisionModern',params:{position:new Vector3(2.3,0.4,2.8), rotation: new Vector3(0,-Math.PI,0)}},
        {type:'speaker',params:{position:new Vector3(2.9,0.05,2.8), rotation: new Vector3(0,-Math.PI,0)}},
        {type:'speaker',params:{position:new Vector3(1.2,0.05,2.8), rotation: new Vector3(0,-Math.PI,0)}},
    
        {type:'rugRound',params:{position:new Vector3(0.3,0.05,0.8), scale: new Vector3(0.4,0.4,0.4)},ev:SceneHandler.teleportFunc},
        //{type:'rugRound',params:{position:new Vector3(1.325,0.05,3.2), scale: new Vector3(0.4,0.4,0.4)},ev:SceneHandler.teleportFunc}
        )
    
    objs.push({type:'geralt',params:{
        position:new Vector3(0.1,.42,0.2),
        rotation: new Vector3(0,Math.PI/4,0),
        scale: new Vector3(0.2,0.2,0.2),
        origin: new Vector3(0,1,0),
        material: {
            metalness: 0.5,
            roughness: 0.5,
            toneMapped: true
        }
    },
    ev:SceneHandler.examineFunc})

    return objs;
}