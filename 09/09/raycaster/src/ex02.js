import * as THREE from 'three';
import { Vector2 } from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

// ----- 주제: 마우스로 클릭했을때 그 mesh 판별하기

export default function example() {
	// Renderer
	const canvas = document.querySelector('#three-canvas');
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

	// Scene
	const scene = new THREE.Scene();

	// Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.x = 5;
	camera.position.y = 1.5;
	camera.position.z = 4;
	scene.add(camera);

	// Light
	const ambientLight = new THREE.AmbientLight('white', 0.5);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight('white', 1);
	directionalLight.position.x = 1;
	directionalLight.position.z = 2;
	scene.add(directionalLight);

	// Controls
	const controls = new OrbitControls(camera,renderer.domElement);

	// Mesh

	const boxGeometry = new THREE.BoxGeometry(1,1,1);
	const boxMaterial = new THREE.MeshStandardMaterial({color: 'plum'});
	const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
	boxMesh.name = 'box';

	const torusGeometry = new THREE.TorusGeometry(2,0.5,16, 100);
	const torusMaterial = new THREE.MeshStandardMaterial({color: 'lim'});
	const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
	torusMesh.name = 'torus';

	scene.add(boxMesh, torusMesh);

	const meshes = [boxMesh, torusMesh];
	
	const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();   // 마우스는 평면이기 때문에 vector2
    console.log(mouse);   // 기본 위치는 0,0


	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		// const delta = clock.getDelta();
		const time = clock.getElapsedTime();

		boxMesh.position.y = Math.sin(time)*2;
		torusMesh.position.y = Math.cos(time)*2;
		// boxMesh.material.color.set('plum');
		// torusMesh.material.color.set('lime');

	

		renderer.render(scene, camera);
		renderer.setAnimationLoop(draw);
	}

    function checkIntersects(){
        if (mouseMoved) return;
        raycaster.setFromCamera(mouse,camera);   // 카메라 시점에서 광선을 쏜다.
        const intersects = raycaster.intersectObjects(meshes);

        // for (const item of intersects){
        //     console.log(item.object.name);
        //     break;   // 첫번째 mesh를 만나면 출력하고 바로 break로 나가서 한개의 mesh만 나오게 된다.
        // }
        if (intersects[0])
        {
            console.log(intersects[0].object.name);   // 이렇게 첫번째 메쉬를 지정해도 된다.
            intersects[0].object.material.color.set('red');
        }            
    }

	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}

	// 이벤트
	window.addEventListener('resize', setSize);

    // 클릭 이벤트
    canvas.addEventListener('click', e=>{
        // console.log(e.clientX, e.clientY);   // 내가 클릭한 좌표값이 출력 하지만 가운데가 0,0이 나오지는 않는다.
        mouse.x = e.clientX / canvas.clientWidth *2 -1;  // 가운데를 원점으로 만들어 주기 위한 정규화 식
        mouse.y = -(e.clientY / canvas.clientWidth *2 -1);
        // console.log(mouse);   // 이제 가운데가 0,0이랑 비슷하게 나온다.  근데 y가 위쪽이 -1이 나오고 아래가 +1이 나온다. 그래서 y만 -를 취한다.
        checkIntersects();
    });

    // 마우스를 클릭한 상태로 드래그 할때 mesh가 클릭되는걸 방지하는 이벤트

    let mouseMoved;
    let clickStartX;
    let clickStartY;
    let clickStartTime;
    canvas.addEventListener('mousedown', e=>{
        clickStartX = e.clientX;
        clickStartY = e.clientY;
        clickStartTime = Date.now();   // 시간도 지정해서 마우스를 클릭한채로 다시 그 자리로 돌아오는 것도 방지해준다.
    });
    canvas.addEventListener('mouseup', e=>{
        const xGap = Math.abs(e.clientX - clickStartX);
        const yGap = Math.abs(e.clientY - clickStartY);
        // console.log(xGap,yGap);    // 이제 드래그 할때는 값이 출력되고 바로 누르면 0,0이 출력된다.
        const timeGap = Date.now() - clickStartTime;

        if( xGap > 5 || yGap > 5 || timeGap > 500)   // 0.5초 보다 크고 gap차이가 5차이가 나면
        {
            mouseMoved = true;
        }
        else
        {
            mouseMoved = false;
        }
    });

	draw();
}
