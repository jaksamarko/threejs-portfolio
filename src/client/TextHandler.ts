import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import { Euler, Group, Mesh, Scene } from 'three';
import * as THREE from 'three';
import { ObjectParams, SceneHandler } from './SceneHandler';

const loader = new FontLoader();
const material = new THREE.MeshPhongMaterial({
    color: new THREE.Color(0,0,0)
})
export const fonts: {[key: string]: Font}={}

export function loadFont(scene:Scene, fnt:string, str:ObjectParams) {
    loader.load( 'fonts/' + fnt + '.typeface.json', function ( response ) {
        fonts[fnt] = response;
        createText(scene,str,fnt)
    },()=>{},(ev)=>{
        console.log(ev)
    });
}

export function createText(scene:Scene, params:ObjectParams, fnt: string) {
    if(!fonts[fnt]) {
        loadFont(scene,fnt,params)
        return;
    }
    const group = new Group()
    const textGeo = new TextGeometry( params.name!, {
        font: fonts[fnt],
        height: 5
    });
    textGeo.computeBoundingBox();
    const textMesh1 = new Mesh( textGeo, material );
    textMesh1.position.x=- 0.5 * ( textGeo.boundingBox!.max.x - textGeo.boundingBox!.min.x )
    group.add(textMesh1)
    group.scale.multiply(new THREE.Vector3(0.001,0.001,0.001))
    if(params.position)
        group.position.copy(params.position)
    if(params.scale)
        group.scale.multiply(params.scale)
    if(params.rotation)
        group.rotation.copy(group.rotation.setFromVector3(params.rotation))
    console.log(group)
    scene.add(group)
}