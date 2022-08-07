import * as THREE from 'three';
import gsap from 'gsap';   //gsap

// 주제 : 애니메이션 라이브러리 사용
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
scene.fog = new THREE.Fog('black',3,7);  // 안개 추가 그냥 그라데이션이 연하게 적용 되는것 즉 원근감을 높여줌



// perspective 카메라
const camera = new THREE.PerspectiveCamera( 
    75,  // 시야각
    window.innerWidth/ window.innerHeight,   // 종횡비
    0.1, // near
    1000 );  //far
    

camera.position.y = 1;
camera.position.z =5;



scene.add( camera ); 

const light = new THREE.DirectionalLight(0xffffff, 1);   
light.position.x = 1;
light.position.y = 3;
light.position.z = 5;
scene.add(light);

//Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ 
    color:'red'
});

const mesh = new THREE.Mesh(geometry,material);
scene.add(mesh);

let oldTime = Date.now();
// 화면에 그릴때 애니메이션 추가해보기
function draw()
{
    const newTime = Date.now();
    const deltaTime = newTime - oldTime;
    oldTime = newTime;


    renderer.render(scene,camera); // 그냥 화면에 그리기
    
    window.requestAnimationFrame(draw);  // 애니메이션 적용
    //renderer.setAnimationLoop(draw);  // 위에 코드랑 같은 기능을 하지만 꼭 VR/AR을 사용할때는 이걸 적용한다.    
}

//gsap
gsap.to(
    mesh.position,
    {
        duration: 1,
        y: 2,
        z:3
    }
);


// 이제 화면에 그리기
draw();

function setSize()
{
    camera.aspect = window.innerWidth/ window.innerHeight;
    camera.updateProjectionMatrix();  
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
}

// 이벤트 resize일때 함수가 호출된다.
window.addEventListener('resize', setSize);

}
