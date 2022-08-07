import * as THREE from 'three';
import { DoubleSide } from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

// ----- 주제: skybox 주변 배경 자체를 environmap로 보여준다. 즉 배경을 만들어 준다.

export default function example() {

// 텍스쳐 이미지 로드
    const cubeTextureLoader = new THREE.CubeTextureLoader();


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
    scene.background = cubeTextureLoader   // 이렇게 배경에다 넣어주는게 특징이다.
    .setPath('./textures/cubemap/')
    .load([
        // 순서는 +(p)  , -(n) 순서
        'px.png', 'nx.png',
        'py.png', 'ny.png',
        'pz.png', 'nz.png'
    ]);


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
        directionalLight.position.set(1, 1, 2);
	scene.add(directionalLight);

	// Controls
	const controls = new OrbitControls(camera, renderer.domElement);

	// Mesh
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE. MeshStandardMaterial({

        color: 'gold'
        // 이렇게 적용을 해주면 된다 따로 standardmaterial을 쓸려면 roughness 같은 것을 적용해줘야 된다.
	});
	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();

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
