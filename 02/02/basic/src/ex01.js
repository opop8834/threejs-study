import * as THREE from 'three';

export default function example()
{
// const renderer = new THREE.WebGL1Renderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

const canvas = document.querySelector('#three-canvas');
// const renderer = new THREE.WebGL1Renderer({canvas: canvas});
const renderer = new THREE.WebGL1Renderer({
    canvas,
    antialias:true  // 이미지 계단현상 수정
});
renderer.setSize(window.innerWidth, window.innerHeight);

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

// 위에 카메라가 아닌 다른 직교 카메라
// const camera = new THREE.OrthographicCamera(
//     -(window.innerWidth/ window.innerHeight),  // left
//     window.innerWidth/ window.innerHeight,    //right
//     1,  //top
//     -1,  //bottom
//     0.1,  //near
//     1000   //far
// )
// camera.position.x =1;
// camera.position.y =2;
// camera.position.z =5;   // 1.2.5
// camera.zoom = 0.5; // 직교카메라 에서는 z값으로 확대가 안되니 zoom 사용
// camera.updateProjectionMatrix();   // zoom같은 것을 사용했으면 필수로 업데이트 해주기
// camera.lookAt(0,0,0);    // 이 포지션으로 무조건 바라봄

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
}
