import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

// ----- 주제: glb 파일 불러오기

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
	const controls = new OrbitControls(camera, renderer.domElement);

	// gltf loader
	const gltfLoader = new GLTFLoader();
    let mixer;
	gltfLoader.load('/models/squid.glb', gltf => {
		// console.log(gltf.scene.children[0]);  // 이게 mesh 위치
		const squidMesh = gltf.scene.children[0];
		scene.add(squidMesh);

        mixer = new THREE.AnimationMixer(squidMesh);
        // console.log(gltf.animations[1]);  // 이게 애니메이션 위치
        const actions = [];
        actions[0] = mixer.clipAction(gltf.animations[0]);
        actions[1] = mixer.clipAction(gltf.animations[1]);
        actions[0].repetitions = 1;   // 애니메이션 반복 횟수도 지정 가능 1번만 반복한다.
        actions[0].clampWhenFinished = true;   // 이 속성은 애니메이션이 딱 멈출때의 자세로 있게된다. 즉 idle포즈로 가지 않는다.
        actions[0].play();
	});


	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();

        if (mixer)    // mixer가 있을때만 실행 이 조건문도 필수
            mixer.update(delta);   // 애니메이션도 update 필수

		renderer.render(scene, camera);
		renderer.setAnimationLoop(draw);
	}

	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}

	// 이벤트
	window.addEventListener('resize', setSize);

	draw();
}
