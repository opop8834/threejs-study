import { Mesh } from 'three';
import {cm1, geo, mat, sounds} from './common';
import {Stuff} from './Stuff';

export class Glass extends Stuff{
    constructor(info){
        super(info);  // 내 부모 클래스의 생성자 호출해서 세팅

        this.type = info.type;
        this.step = info.step;

        this.geometry = geo.glass;

        switch (this.type)
        {
            case 'normal':
                this.material = mat.glass1;
                this.mass = 1; // 무게를 줘서 플레이어가 밟으면 부서지게
                break;
            case 'strong':
                this.material = mat.glass2;
                this.mass = 0; 
                break;            
        }

        
        this.width = this.geometry.parameters.width;
        this.height = this.geometry.parameters.height;
        this.depth = this.geometry.parameters.depth;

        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.position.set(this.x, this.y, this.z);
        // this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.name = this.name;
        this.mesh.step = this.step;
        this.mesh.type = this.type;
        cm1.scene.add(this.mesh);

        this.setCannonBody();
        this.cannonBody.addEventListener('collide', playSound);
        const sound = sounds[this.type];
        function playSound(e){
            // console.log('충돌'); 
            const strength = e.contact.getImpactVelocityAlongNormal(); // 바위에 얹어진 유리가 이미 닿아있어서 소리가 나는 상황이 발생
            // console.log(strength);
            if (strength > 5)  // 즉 강도가 셀때만 사운드 출력
            {
                sound.volume = 0.3;
                sound.currentTime = 0;
                sound.play();
            }
        }
    }
}