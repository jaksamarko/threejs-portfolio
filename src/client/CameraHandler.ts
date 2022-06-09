import * as THREE from "three";

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
        document.addEventListener('contextmenu',(ev:MouseEvent)=>{this.onPointerRClick(ev)})
        document.addEventListener('mousedown',(ev:MouseEvent)=>{
            if(!this.isClick) {
                this.mPosPrev.copy(CameraHandler.calculateMs(ev))
                this.isClick=true
            }
        })
        document.addEventListener('mouseup',()=>{this.isClick=false})
    }

    set holding(obj: THREE.Object3D | null) {
        this.holdingObj=obj;
        if(obj!=null)
            this.putDown=false;
    }

    static calculateMs(ev:MouseEvent):THREE.Vector2 {
        return new THREE.Vector2(( ev.screenX / window.innerWidth )*2-1, ( ev.screenY / window.innerHeight )*2+1);
    }

    private clamp(v: number, min: number, max:number) {
        return Math.min(max,Math.max(min,v));
    }

    private pointerMove(ev:MouseEvent) {
        const ms = CameraHandler.calculateMs(ev)
        const diff = new THREE.Vector2(ms.x-this.mPosPrev.x,ms.y-this.mPosPrev.y).multiplyScalar(80 * Math.PI/180);
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
                this.holdingObj=null
                this.putDown=false
            }   
        }
    }
}