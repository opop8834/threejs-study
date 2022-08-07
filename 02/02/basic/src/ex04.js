import * as THREE from 'three';

// 주제 : light, 조명
export default function example()
{

const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGL1Renderer({
    canvas,
    antialias:true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 5 : 1);
console.log(window.devicePixelRatio>1);

const scene = new THREE.Scene();



// perspective 카메라
const camera = new THREE.PerspectiveCamera( 
    75,  // 시야각
    window.innerWidth/ window.innerHeight,   // 종횡비
    0.1, // near
    1000 );  //far
    
camera.position.x =1;
camera.position.y =2;
camera.position.z =5;   // 1.2.5



scene.add( camera ); 

const light = new THREE.DirectionalLight(0xffffff, 1);   // 밝기도 조절 가능 지금은 1로 설정됨
light.position.x = 1;
light.position.z = 2;
scene.add(light);

//Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
//const material = new THREE.MeshBasicMaterial({   // 빛에 반응하지 않는 material
const material = new THREE.MeshStandardMaterial({  //  빛에 반응하는 material만 보이게 됨
    color:'red'
});
const mesh = new THREE.Mesh(geometry,material);
scene.add(mesh);


// 이제 화면에 그리기
renderer.render(scene, camera);

function setSize()
{
    camera.aspect = window.innerWidth/ window.innerHeight;
    camera.updateProjectionMatrix();   // 카메라 투영에 관한 값변경이 있을때 update꼭 해주기
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
}

// 이벤트 resize일때 함수가 호출된다.
window.addEventListener('resize', setSize);

}
