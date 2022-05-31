import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { loadEvent, ModelHandler } from "./ModelHandler";

export interface ObjectParams {
    position?: THREE.Vector3;
    scale?: THREE.Vector3;
    rotation?: THREE.Vector3;
}

export class SceneHandler extends THREE.Scene {
    private static instance: SceneHandler;
    modelHandler: ModelHandler;
    camera: THREE.PerspectiveCamera;
    stats: Stats;
    renderer: THREE.WebGLRenderer;

    step: ()=>void;
    draw: ()=>void;

    constructor(cam: THREE.PerspectiveCamera) {
        super();
        

        SceneHandler.instance=this;

        this.modelHandler = ModelHandler.instance
        this.camera = cam

        this.stats = Stats();
        this.renderer = new THREE.WebGLRenderer({antialias:true})
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.setSize(window.innerWidth, window.innerHeight)

        const dom = this.renderer.domElement
        document.body.appendChild(dom)
        this.step = this.draw = ()=>{};

        window.addEventListener('resize', this.onWindowResize, false)
    }

    spawnObject(name:string,params: ObjectParams, ev:loadEvent | undefined) {
        ModelHandler.instance.getModel(name,(v)=>{
            let ind:keyof typeof params
            for(ind in params) {
                Object.assign(v[ind], params[ind])
            }
            v.updateMatrixWorld()
            
            this.add(v)
            if(ev)
                ev(v)
        })
    }

    private onWindowResize() {
        const scH = SceneHandler.instance;
        scH.camera.aspect = window.innerWidth / window.innerHeight
        scH.camera.updateProjectionMatrix()
        scH.renderer.setSize(window.innerWidth, window.innerHeight)
        scH.renderer.setPixelRatio(window.devicePixelRatio)
        scH.render()
    }

    private animate=()=> {
        requestAnimationFrame(this.animate)
        this.step()
        this.render()
        this.stats.update();
    }
    
    private render() {
        this.draw()
        this.renderer.render(this, this.camera)
    }
    

    build(step: ()=>void, draw: ()=>void) {
        this.step = step;
        this.draw = draw;
        this.animate()
    }
}