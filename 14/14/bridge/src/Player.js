import { AnimationMixer, BoxGeometry, Mesh, MeshBasicMaterial } from 'three';
import {cm1} from './common';
import {Stuff} from './Stuff';

export class Player extends Stuff{
    constructor(info){
        super(info);  // 내 부모 클래스의 생성자 호출해서 세팅

        
        this.width = 0.5;
        this.height = 0.5;
        this.depth = 0.5;



        cm1.gltfLoader.load(
            'models/ilbuni.glb',
            glb => {
                // 그림자 glb에 추가하기
                glb.scene.traverse(child =>{
                    // console.log(child);  // glb가 scene안에 있는 것들이 모두 출력됨
                    if (child.isMesh)
                    {
                        child.castShadow = true;
                    }
                });


                // console.log(glb);
                this.modelMesh = glb.scene.children[0];
                this.modelMesh.position.set(this.x, this.y, this.z);
                this.modelMesh.rotation.set(this.rotationX,this.rotationY,this.rotationZ);
                this.modelMesh.castShadow = true;  // 기본적으로 glb을 import하고 애니메이션까지 적용을 하면 그림자가 안보이게 된다.

                cm1.scene.add(this.modelMesh);

                // console.log(glb.animations);
                this.modelMesh.animations = glb.animations;   // 임의로 modelmesh 안에 animations라고 정해논거지 이미 있는 속성이 아니다
                cm1.mixer = new AnimationMixer(this.modelMesh);
                this.actions =[];
                this.actions[0] = cm1.mixer.clipAction(this.modelMesh.animations[0]);  // default
                this.actions[1] = cm1.mixer.clipAction(this.modelMesh.animations[1]);  // fall
                this.actions[2] = cm1.mixer.clipAction(this.modelMesh.animations[2]);  // jump
                
                this.actions[2].repetitions = 1;  // 점프는 한번만 반복
                this.actions[0].play();

                this.setCannonBody();
            }
        )


        // this.mesh = new Mesh(this.geometry, this.material);
        // this.mesh.position.set(this.x, this.y, this.z);
        // // this.mesh.castShadow = true;
        // this.mesh.receiveShadow = true;
        // cm1.scene.add(this.mesh);
    }
}