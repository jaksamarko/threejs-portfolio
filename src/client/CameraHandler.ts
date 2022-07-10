import * as THREE from "three";
import { SceneHandler } from "./SceneHandler";

const CAM_SPEED = 2;

export class CameraHandler extends THREE.PerspectiveCamera {
    mPosPrev: THREE.Vector2;
    isClick: boolean;
    putDown: boolean;
    target: THREE.Object3D | null;
    holdingObj: THREE.Object3D | null;
    private rot: THREE.Vector2;
    private holdRot: THREE.Vector2;
    constructor(...args:number[]) {
        super(...args)

        this.mPosPrev = new THREE.Vector2(0.5,0.5);
        this.isClick = this.putDown = false;

        this.rot = new THREE.Vector2(0,0)
        this.holdRot = this.rot.clone()
        this.target = this.holdingObj = null;

        document.addEventListener('mousemove',(ev:MouseEvent)=>{this.pointerMove(ev)});
        document.addEventListener('touchmove',(ev:TouchEvent)=>{this.pointerMove(ev)});
        document.addEventListener('contextmenu',(ev:MouseEvent)=>{this.onPointerRClick(ev)})
        document.addEventListener('mousedown',(ev:MouseEvent)=>{this.pointerPress(ev)});
        document.addEventListener('touchstart',(ev:TouchEvent)=>{this.pointerPress(ev)});
        document.addEventListener('mouseup',()=>{this.pointerRelease()})
        document.addEventListener('touchend',()=>{this.pointerRelease()})
    }

    set holding(obj: THREE.Object3D | null) {
        const inst = SceneHandler.instance;
        this.holdingObj=obj;
        inst.btCancel.style.visibility=(obj!=null)?"visible":"hidden"
        if(obj!=null)
            this.putDown=false;
    }

    get holding() {
        return this.holdingObj
    }

    static calculateMs(ev:MouseEvent|TouchEvent):THREE.Vector2 {
        const v = new THREE.Vector2()
        if(ev instanceof MouseEvent)
            v.set(ev.screenX,ev.screenY)
        else 
            v.set(ev.touches[0].clientX,ev.touches[0].clientY)
        return new THREE.Vector2(( v.x / window.innerWidth )*2-1, ( v.y / window.innerHeight )*2+1);
    }

    private clamp(v: number, min: number, max:number) {
        return Math.min(max,Math.max(min,v));
    }

    private pointerRelease() {
        this.isClick=false;
    }

    private pointerPress(ev:MouseEvent | TouchEvent) {
        if(!this.isClick) {
            this.mPosPrev.copy(CameraHandler.calculateMs(ev))
            this.isClick=true
        }
    }

    private pointerMove(ev:MouseEvent | TouchEvent) {
        const ms = CameraHandler.calculateMs(ev)
        const diff = new THREE.Vector2(ms.x-this.mPosPrev.x,ms.y-this.mPosPrev.y).multiplyScalar(CAM_SPEED * Math.PI/2);
        if(this.isClick) {
            if(this.holdingObj==null) {
                this.rot.x += diff.x;
                this.rot.y = this.clamp(this.rot.y+diff.y,-Math.PI/2,Math.PI/2);
                this.setRotationFromEuler(new THREE.Euler(this.rot.y,this.rot.x,0,'ZYX'))
            } else {
                if(!this.putDown) {
                    this.holdRot.add(diff.multiplyScalar(2))
                    this.holdingObj.setRotationFromEuler(new THREE.Euler(this.holdRot.y,this.holdRot.x,0,'ZYX'))
                }
            }
        }
        this.mPosPrev.copy(ms)
    }

    onPointerRClick(event: MouseEvent) {
        event.preventDefault()
        if(this.holdingObj)
            this.putDown=true
    }

    private holdTransfer(obj:THREE.Object3D,to:THREE.Vector3) {
        let dir = (this.putDown?obj.userData.position:to).clone().sub(obj.position)
        obj.position.add(dir.multiplyScalar(0.05))
        if(this.putDown) {
            obj.rotation.setFromQuaternion(obj.quaternion.slerp(obj.userData.quaternion,0.1))
            if(obj.position.distanceTo(obj.userData.position)<0.01) {
                obj.position.copy(obj.userData.position)
                obj.quaternion.copy(obj.userData.quaternion)
                obj.userData.position = obj.userData.quaternion = undefined;
                return true;
            }
        }
        return false;
    }

    transferTo(to: THREE.Object3D) {
        let v = new THREE.Vector3()
        new THREE.Box3().setFromObject(to).getCenter(v)
        if(v.distanceTo(this.position)<0.1) {
            return true;
        }
        v.y=0.7
        const dir = v.clone().sub(this.position)
        this.position.add(dir.multiplyScalar(0.05))

        return false;
    }

    step() {
        if(this.target) {
            if(this.transferTo(this.target)) {
                this.target=null;
            }
        }
        if(this.holdingObj) {
            const dirVec = new THREE.Vector3()
            this.getWorldDirection(dirVec)
            if(this.holdTransfer(this.holdingObj,this.position.clone().add(dirVec.multiplyScalar(0.2)))) {
                this.holding=null
                this.putDown=false
            }   
        }
    }
}