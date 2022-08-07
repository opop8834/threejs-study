import { Material, World } from "cannon-es";
import { Scene,BoxGeometry, MeshPhongMaterial, SphereGeometry } from "three";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
export const cm1 = {
    scene : new Scene(),
    gltfLoader : new GLTFLoader(),
    mixer : undefined,   // 자바 스크립트는 속성을 임의로 추가할 수 있기 때문에 여기에 undefined라고 속성을 굳이 지정해줄 필요가 없다. 그냥 보기 편하게
    
    //cannon
    world : new World(),
    defaultMaterial : new Material('default'),
    glassMaterial : new Material('glass'),
    playerMaterial : new Material('player')
};

export const cm2 = {
    step:0,
    backgroundColor : '#3e1322',
    lightColor: '#ffe9ac',
    lightOffColor: '#222',
    pillarColor : '#071d28',
    floorColor: '#111',
    barColor: '#441c1d',
    glassColor: '#9fdfff'
};

export const geo ={
    floor: new BoxGeometry(200,1,200),
    pillar: new BoxGeometry(5, 10, 5),
    bar: new BoxGeometry(0.1, 0.3, 1.2 *21),
    sideLight: new SphereGeometry(0.1, 6, 6),
    glass: new BoxGeometry(1.2, 0.05, 1.2)
};
export const mat = {
    floor: new MeshPhongMaterial({color: cm2.floorColor}),
    pillar : new MeshPhongMaterial({color: cm2.pillarColor}),
    bar : new MeshPhongMaterial({color: cm2.barColor}),
    sideLight : new MeshPhongMaterial({color: cm2.lightColor}),
    glass1 : new MeshPhongMaterial({
        color: cm2.glassColor,
        transparent : true,   // 투명하게 만들기 위해 true
        opacity: 0.1              // 여기서 투명도 조절 가능
    
    }),
    glass2 : new MeshPhongMaterial({
        color: cm2.glassColor,
        transparent : true,   // 투명하게 만들기 위해 true
        opacity: 0.1              // 여기서 투명도 조절 가능
    
    })

};

const normalSound = new Audio();
normalSound.src = 'sounds/glass_crash.mp3';
const strongSound = new Audio();
strongSound.src = 'sounds/jump.mp3';
export const sounds = {
    normal : normalSound,
    strong : strongSound
};