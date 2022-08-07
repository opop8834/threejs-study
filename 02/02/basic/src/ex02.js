import * as THREE from 'three';

// 주제: 고해상도

export default function example()
{

const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGL1Renderer({
    canvas,
    antialias:true  // 이미지 계단현상 수정
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 5 : 1);
console.log(window.devicePixelRatio>1);
// pixelratio가 1이상이면 2배로 해주고 아니면 그대로 해준다. 2배로 뻥튀기 하면 웬만해서는 고해상도임

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

//Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ 
    //color: 0xff0000
    //color: '#ff0000'
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
