import * as THREE from 'three';

// 주제 : 애니메이션 time과 delta말고 자바스크립트 내장함수 사용 Data.now()활용
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



let oldTime = Date.now();
// 화면에 그릴때 애니메이션 추가해보기
function draw()
{
    const newTime = Date.now();
    const deltaTime = newTime - oldTime;
    oldTime = newTime;

    mesh.rotation.y += 0.001* deltaTime;  // 즉 += 사용
    mesh.position.y += 0.001*deltaTime;
    if (mesh.position.y > 3)  
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
