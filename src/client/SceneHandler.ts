import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import {OutlineEffect} from "three/examples/jsm/effects/OutlineEffect";
import { CameraHandler } from "./CameraHandler";
import changeMaterial from "./HelperFunctions";
import { loadEvent, ModelHandler } from "./ModelHandler";
import { createText } from "./TextHandler";

export interface ObjectParams {
    position?: THREE.Vector3;
    scale?: THREE.Vector3;
    rotation?: THREE.Vector3;
    origin?: THREE.Vector3;
    name?: string;
    material?: THREE.MeshStandardMaterialParameters;
}

export class SceneHandler extends THREE.Scene {
    private static instance: SceneHandler;
    modelHandler: ModelHandler;
    camera: CameraHandler;
    stats: Stats;
    renderer: OutlineEffect | THREE.WebGLRenderer;
    teleports: THREE.Object3D[];
    examine: THREE.Object3D[];
    interact: THREE.Object3D[];
    pointer: THREE.Vector2;
    raycaster: THREE.Raycaster;
    highlight: THREE.Object3D | null;

    step: ()=>void;
    draw: ()=>void;

    constructor(cam: CameraHandler) {
        super();
        SceneHandler.instance=this;

        this.modelHandler = ModelHandler.instance
        this.camera = cam

        this.stats = Stats();
        const renderer = new THREE.WebGLRenderer({antialias:true, powerPreference:'low-power'})
        renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer = /*new OutlineEffect(renderer)*/renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight)

        const dom = this.renderer.domElement
        document.body.appendChild(dom)
        document.body.appendChild(this.stats.dom)
        this.step = this.draw = ()=>{};

        window.addEventListener('resize', ()=>{this.onWindowResize()}, false)
        document.addEventListener( 'mousemove', (ev:MouseEvent)=>{this.onPointerMove(ev)})
        document.addEventListener('mousedown', (ev:MouseEvent)=>{this.onPointerClick(ev)})


        this.teleports=[]
        this.examine=[]
        this.interact=[]
        this.pointer = new THREE.Vector2(0,0)
        this.raycaster = new THREE.Raycaster()
        this.highlight = null
    }

    static teleportFunc:loadEvent = (obj)=>{
        this.instance.teleports.push(obj)
        obj.name="tp"
    }

    static examineFunc:loadEvent = (obj)=>{
        this.instance.examine.push(obj)
    }

    static interactFunc:loadEvent = (obj)=>{
        this.instance.interact.push(obj)
    }

    containsByName(list: THREE.Object3D[], obj: THREE.Object3D) {
        for(const _obj of list)
            if(_obj.name==obj.name)
                return true;
        return false;
    }

    spawnObject(name:string,params: ObjectParams, ev:loadEvent | undefined) {
        let ind:keyof typeof params
        if(name=="text") {
            if(params.name) {
                createText(this,params,"font")
            }
            return;
        }
        ModelHandler.instance.getModel(name,(v)=>{
            
            for(ind in params) {
                if(ind == "origin") {
                    const origin = new THREE.Vector3()
                    new THREE.Box3().setFromObject(v,false).getCenter(origin)
                    if(params.origin) {
                        origin.multiply(params.origin.multiplyScalar(-1))
                        v.children[0].position.copy(origin)
                    }
                } else {
                    if(ind == "name") {
                        v.name=params[ind] as string;
                    } else {
                        if(ind == "material") {
                            changeMaterial(v,params[ind] as THREE.MeshStandardMaterialParameters)
                        } else 
                            Object.assign(v[ind], params[ind])
                    }
                }
            }

            //v.matrixAutoUpdate = false;
            v.updateMatrix()
            this.add(v)
            if(ev)
                ev(v)
        })
    }

    onPointerMove( event: MouseEvent ) {
        this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        const intersects = this.raycaster.intersectObjects( [...this.teleports,...this.examine,...this.interact] , true );
        if(this.highlight) {
            changeMaterial(this.highlight ,{emissive:new THREE.Color(0,0,0)})
            this.highlight = null
        }
        if(this.camera.holdingObj)
            return;
        if(intersects.length) {
            this.highlight = intersects[0].object.parent || intersects[0].object;
            changeMaterial(this.highlight ,{emissive:new THREE.Color(0.25,0.25,0.25)})
        }
    }

    private onPointerClick(event: MouseEvent) {
        
    }

    private onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setPixelRatio(Math.min(3,window.devicePixelRatio))
        this.render()
    }

    private animate=()=> {
        requestAnimationFrame(this.animate)
        this.camera.step()
        this.step()
        this.render()
        this.stats.update();
    }
    
    private render() {
        this.draw()
        this.raycaster.setFromCamera( this.pointer, this.camera );
        this.renderer.render(this, this.camera)
    }
    

    build(step: ()=>void, draw: ()=>void) {
        this.step = step;
        this.draw = draw;
        this.animate()
    }
}