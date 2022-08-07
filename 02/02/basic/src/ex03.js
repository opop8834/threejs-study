import * as THREE from 'three';

// 주제 : 배경색, 투명도
export default function example()
{

const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGL1Renderer({
    canvas,
    antialias:true,
    alpha: true  // 투명하게 해줘
});

renderer.setClearColor('#00ff00');   // 배경색 설정 가능
renderer.setClearAlpha(0.5);   // 0이면 불투명도 0이 된다.

const scene = new THREE.Scene();

// scene의 우선순위가 높아서 renderer에서 투명도와 색을 설정해놔도 scene에서 정하면 scene꺼만 보이게됨
scene.background = new THREE.Color('blue');   // 즉 위에서 설정한 초록색위에 블루가 덧칠하게 되서 블루만 보임

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 5 : 1);
console.log(window.devicePixelRatio>1);

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
