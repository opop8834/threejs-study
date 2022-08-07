import * as THREE from 'three';
import { Material } from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

// ----- 주제: OrbitControls

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
	controls.enableDamping = true; 
	// controls.enableZoom = flase;
	controls.maxDistance = 10;  // 최소화 시키는 범위를 한정 지을 수 있다.
	controls.minDistance = 2; // 확대 시키는 범위도 한정 지을 수 있다.
	controls.minPolarAngle = THREE.MathUtils.degToRad(45)   // 화면 돌리는 각도도 제한둘 수 있다.
	controls.maxPolarAngle = THREE.MathUtils.degToRad(135)   // 화면 돌리는 각도도 제한둘 수 있다.
	controls.target.set(2,2,2);   // 화면 회전의 중심점을 임의로 정해준다.
	controls.autoRotate = true;   // 자동으로 회전
	controls.autoRotateSpeed= 10;

	// Mesh
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	let mesh;
	let material;
	for(let i =0; i< 20; i++)
	{
		material = new THREE.MeshStandardMaterial({
			color: `rgb(
					${50+ Math.floor(Math.random() * 205)},  
					${50+ Math.floor(Math.random() * 205)}, 
					${50+ Math.floor(Math.random() * 205)}
					)`
					 // 0이랑 가까운 검은색이 안나오게
		});
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.x = (Math.random() - 0.5) * 5;  
		mesh.position.y = (Math.random() - 0.5) * 5;  

		mesh.position.z = (Math.random() - 0.5) * 5;  
		scene.add(mesh);

	}

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();
		controls.update();

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
