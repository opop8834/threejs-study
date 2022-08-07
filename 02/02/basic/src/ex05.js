import * as THREE from 'three';

// 주제 : 애니메이션
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
    

camera.position.z =5;



scene.add( camera ); 

const light = new THREE.DirectionalLight(0xffffff, 1);   
light.position.x = 1;
light.position.z = 2;
scene.add(light);

//Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ 
    color:'red'
});
const mesh = new THREE.Mesh(geometry,material);
scene.add(mesh);


const clock = new THREE.Clock(); // 사양에 따른 동일한 애니메이션 나오게

// 화면에 그릴때 애니메이션 추가해보기
function draw()
{
    const time = clock.getElapsedTime();  // 초단위를 적용 이제 함수가 호출될때마다 업데이트된다.
   // mesh.rotation.y += 0.1;   // 360도는 2파이 3.14*2 6.28정도가 360도이다.
    //mesh.rotation.y += THREE.MathUtils.degToRad(1);   // 여기서는 360도에서 1도를 의미하며 1도를 라디안 값으로 바꿔준다.
    mesh.rotation.y = time; // 이렇게 시간 적용
    mesh.position.y = time;   // position의 time은 항상 증가되서
    if (mesh.position.y > 3)   // 이러한 조건문이 필요가 없어지게 된다.
    {
        mesh.position.y=0;
    }
    renderer.render(scene,camera); // 그냥 화면에 그리기
    
    
    window.requestAnimationFrame(draw);  // 애니메이션 적용
    //renderer.setAnimationLoop(draw);  // 위에 코드랑 같은 기능을 하지만 꼭 VR/AR을 사용할때는 이걸 적용한다.    
}


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
