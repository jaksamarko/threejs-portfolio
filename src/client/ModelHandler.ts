import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import changeMaterial from './HelperFunctions';
import { ObjectParams } from './SceneHandler';

export type loadEvent = (v:Group)=>void
export type loadObject = {type: string, params:ObjectParams, ev?:loadEvent}

export class ModelHandler {
    private static inst: ModelHandler;
    private loader: GLTFLoader;
    private models: {[key: string]: Group};
    

    constructor() {
        this.loader = new GLTFLoader().setPath('./');
        this.models = {};
    }

    static get instance() {
        if(!this.inst||this.inst == undefined) {
            this.inst = new ModelHandler();
        }
        return this.inst;
    }

    load(name: string, ev: loadEvent) {
        let fileName = 'models/'+name+'.glb'
        if(name=='geralt') {
            fileName='geralt/scene.glb'
        }
        this.loader.load(`${fileName}`,(v)=>{
            this.models[name]=v.scene;
            changeMaterial(this.models[name],{metalness:0})
            ev(this.models[name]);
        })
    }

    loadList(list:string[]) {
        for(const l of list) {
            this.load(l,()=>{})
        }
    }

    async getModel(name: string, ev: loadEvent) {
        if(this.models[name]) {
            ev(this.models[name].clone())
        } else {
            this.load(name,ev)
        }
        return this;
    }
}