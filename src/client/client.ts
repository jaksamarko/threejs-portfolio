import * as THREE from 'three'
import { Camera, Vector2, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { loadEvent } from './ModelHandler';
import { ObjectParams, SceneHandler } from './SceneHandler';

const scene = new SceneHandler(
    new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
)

let highlight: THREE.Object3D | null = null;
const teleports: THREE.Object3D[] = [];
let onClick = false;
let moveToObject: THREE.Object3D | null = null;
const raycaster = new THREE.Raycaster();
/*if(raycaster.params.Line != undefined)
    raycaster.params.Line.threshold=0*/
const pointer = new Vector2(0,0);

/*const controls = new OrbitControls(scene.camera, scene.renderer.domElement)
controls.maxPolarAngle = Math.PI / 2;*/
//controls.enablePan = false;

const hemiLight = new THREE.HemisphereLight( 0xaaaaaa, 0x999 );
hemiLight.position.set( 0, 200, 0 );
scene.add( hemiLight );

const ROOM_SIZE = 7;

const objs:{type:string,params:ObjectParams,ev?:loadEvent}[] = [];


for(let i=0;i<ROOM_SIZE;i++) {
    objs.push(
        {type:'wall',params:{position:new Vector3(i,0,0)}},
        {type:'wall',params:{position:new Vector3(i,0,ROOM_SIZE)}},
        {type:'wall',params:{position:new Vector3(0,0,i+1), rotation: new Vector3(0,Math.PI/2,0)}},
        {type:'wall',params:{position:new Vector3(ROOM_SIZE,0,i+1), rotation: new Vector3(0,Math.PI/2,0)}})
    for(let j=0;j<ROOM_SIZE;j++)
        objs.push({type:'floorFull',params:{position:new Vector3(i,0,j+1)}})
}
//Bedroom
for(let i=0;i<3;i++) {
    objs.push({type:i==1?'wallDoorway':'wall',params:{position:new Vector3(i,0,3)}})
    objs.push({type:'wall',params:{position:new Vector3(3,0,i+1),rotation: new Vector3(0,Math.PI/2,0)}})
}
objs.push({type:'bedDouble',params:{position:new Vector3(2,0,1.1)}})
objs.push({type:'bookcaseClosedWide',params:{position:new Vector3(0,0,0.25)}})
objs.push({type:'books',params:{position:new Vector3(0.1,.55,0.225), scale: new Vector3(1.25,1.25,1.25)}})
objs.push({type:'radio',params:{position:new Vector3(0.5,.55,0.225), scale: new Vector3(0.8,0.8,0.8)}})

objs.push({type:'deskCorner',params:{position:new Vector3(1,0,2), rotation: new Vector3(0,-Math.PI,0)}})
objs.push({type:'chairDesk',params:{position:new Vector3(0.5,0.05,2.15), rotation: new Vector3(0,-Math.PI/2,0)}})
objs.push({type:'computerScreen',params:{position:new Vector3(0.2,0.375,2.5), rotation: new Vector3(0,Math.PI/2,0)}})
objs.push({type:'computerKeyboard',params:{position:new Vector3(0.35,0.375,2.55), rotation: new Vector3(0,Math.PI/2,0)}})
objs.push({type:'computerMouse',params:{position:new Vector3(0.35,0.375,2.2), rotation: new Vector3(0,Math.PI/2,0)}})
objs.push({type:'rugRectangle',params:{position:new Vector3(1.8,0.05,1), rotation: new Vector3(0,Math.PI/2,0), scale: new Vector3(0.6,0.6,0.6)}})

objs.push({type:'cardboardBoxOpen',params:{position:new Vector3(0.325,0.075,1.5), rotation: new Vector3(0,Math.PI/2,0), scale: new Vector3(1.5,1.5,1.5)}})
objs.push({type:'trashcan',params:{position:new Vector3(0.1,0.075,1.8), rotation: new Vector3(0,Math.PI/2,0), scale: new Vector3(0.7,0.7,0.7)}})
objs.push({type:'cabinetTelevision',params:{position:new Vector3(2.7,0.075,2.7), rotation: new Vector3(0,-Math.PI,0)}})
objs.push({type:'televisionModern',params:{position:new Vector3(2.3,0.4,2.8), rotation: new Vector3(0,-Math.PI,0)}})
objs.push({type:'speaker',params:{position:new Vector3(2.9,0.05,2.8), rotation: new Vector3(0,-Math.PI,0)}})
objs.push({type:'speaker',params:{position:new Vector3(1.2,0.05,2.8), rotation: new Vector3(0,-Math.PI,0)}})

const teleportFunc:loadEvent = (obj)=>{
    teleports.push(obj)
}
objs.push({type:'rugRound',params:{position:new Vector3(0.3,0.05,0.8), scale: new Vector3(0.4,0.4,0.4)},ev:teleportFunc})

objs.push({type:'geralt',params:{position:new Vector3(0.1,.32,0.2), rotation: new Vector3(0,Math.PI/4,0), scale: new Vector3(0.2,0.2,0.2)}})




for(let obj of objs) {
    scene.spawnObject(obj.type,obj.params,obj.ev);
}

//const lookAt = new Vector3(ROOM_SIZE/2,.5,ROOM_SIZE/2)
const lookAt = new Vector3(1,.5,1)
//controls.target.set(lookAt.x,lookAt.y,lookAt.z)

scene.camera.position.set(lookAt.x,lookAt.y,lookAt.z)

function changeMaterial(parent: THREE.Object3D, params: THREE.MeshStandardMaterialParameters) {
    parent.traverse((obj:THREE.Object3D)=>{
        if(obj instanceof THREE.Mesh) {
            obj.material.setValues(params)
        }
    })
}

document.addEventListener( 'mousemove', onPointerMove );
function onPointerMove( event: MouseEvent ) {
    if(onClick) {
        scene.camera.rotation.y -= event.movementX / 500;
        scene.camera.rotation.x -= event.movementY / 500;
    } else {
        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    const intersects = raycaster.intersectObjects( teleports , true );
    if(highlight) {
        changeMaterial(highlight ,{emissive:new THREE.Color(0,0,0)})
        highlight = null
    }
    if(intersects.length) {
        highlight = intersects[0].object.parent || intersects[0].object;
        changeMaterial(highlight ,{emissive:new THREE.Color(0.25,0.25,0.25)})
    }
}


document.addEventListener('mousedown', onPointerClick)
function onPointerClick(event: MouseEvent) {
    onClick = true
    onPointerMove(event);
    if(highlight) {
        moveToObject = highlight
    }
}

document.addEventListener('mouseup', onPointerRelease)
function onPointerRelease(event: MouseEvent) {
    onClick = false
}

scene.build(()=>{
    //controls.update()
    if(moveToObject) {
        const to=moveToObject.position.clone(), from = scene.camera.position;
        to.y = 0.6;
        const dir = to.sub(from);
        if(dir.length()>1) {
            //controls.target.addVectors(to,new Vector3(0,0,-1))
            from.add(dir.multiplyScalar(0.01))
        } else {
            moveToObject=null;
        }
    }
},()=>{
    raycaster.setFromCamera( pointer, scene.camera );
})


