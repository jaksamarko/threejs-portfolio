import * as THREE from "three"

export default function changeMaterial(parent: THREE.Object3D, params: THREE.MeshStandardMaterialParameters) {
    parent.traverse((obj:THREE.Object3D)=>{
        if(obj instanceof THREE.Mesh) {
            obj.material.setValues(params)
        }
    })
}