import * as THREE from 'three'
import { CameraHandler } from './CameraHandler';
import { loadEvent } from './ModelHandler';
import { ObjectParams, SceneHandler } from './SceneHandler';
import createBedroom from './Rooms/bedRoom';
import createKitchen from './Rooms/kitchen';
import createLivingRoom from './Rooms/livingRoom';
import createBathRoom from './Rooms/bathRoom';
const ROOM_SIZE = 7;

//THREE.Cache.enabled = true;

const scene = new SceneHandler(
    new CameraHandler(75, window.innerWidth / window.innerHeight, 0.01, 1000)
)

//const controls = new OrbitControls(scene.camera,scene.renderer.domElement)
//controls.target.set(3,0,2)

const hemiLight = new THREE.HemisphereLight( 0xaaaaaa, 0x999, 1 );
hemiLight.position.set( ROOM_SIZE/2, 5, ROOM_SIZE/2 );
scene.add( hemiLight );

const objs:{type:string,params:ObjectParams,ev?:loadEvent}[] = [];
objs.push(...createBedroom(ROOM_SIZE),...createKitchen(ROOM_SIZE),...createLivingRoom(ROOM_SIZE),...createBathRoom(ROOM_SIZE))

for(let obj of objs) {
    scene.spawnObject(obj.type,obj.params,obj.ev);
}

scene.camera.position.copy(new THREE.Vector3(/*1,.6,1*/3,3,3))

function pointerClick(ev: MouseEvent | TouchEvent) {
    
}

document.addEventListener('mousedown',(ev:MouseEvent)=>{
    scene.onPointerMove(ev);
    let hObj = scene.highlight
    
    if(!hObj)
        return;

    while(hObj.parent!=scene)
        hObj=hObj.parent!

    hObj.userData.position=hObj.position.clone()
    hObj.userData.quaternion=hObj.quaternion.clone()
    switch(hObj.name) {
        case "bedroomChair":
            hObj.userData.rotSpeed=Math.random()*0.2+0.1
        break;
        case "trash":
            hObj.userData.open=!hObj.userData.open;
            break;
        case "tp":
            scene.camera.target = hObj
        break;
        default:
            if(!scene.containsByName(scene.interact,hObj))
                scene.camera.holding = hObj
    }
})

scene.build(()=>{
    //controls.update()
    for(const obj of scene.interact) {
        const dat = obj.userData;
        switch(obj.name) {
            case "bedroomChair":
                if(dat.rotSpeed) {
                    dat.rotSpeed=Math.max(0,dat.rotSpeed-0.001);
                    obj.children[0].children[0].rotateY(dat.rotSpeed)
                }
            break;
            case "trash":
                const pos = obj.children[0].children[1].position
                if(typeof dat.open === 'boolean')
                    pos.y = dat.position.y+Math.max(0,Math.min(0.1,pos.y-dat.position.y+0.01*(dat.open?1:-1)))
            break;
        }
    }
},()=>{
    
})

