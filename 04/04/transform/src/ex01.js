import * as THREE from 'three';
import dat from 'dat.gui';

// ----- 주제: set 이용 position. 크기, 회전

export default function example() {
	// Renderer
	const canvas = document.querySelector('#three-canvas');
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 5 : 1);

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

	// Mesh
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshStandardMaterial({
		color: 'seagreen'
	});
	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	// AxesHelper
	const axesHelper = new THREE.AxesHelper(3);
	scene.add(axesHelper);

	// Dat GUI
	const gui = new dat.GUI();
	gui.add(camera.position, 'x', -5, 5, 0.1).name('카메라 X');
	gui.add(camera.position, 'y', -5, 5, 0.1).name('카메라 Y');
	gui.add(camera.position, 'z', 2, 10, 0.1).name('카메라 Z');

	// 그리기
	const clock = new THREE.Clock();

	mesh.rotation.reorder('YXZ');   //월드 좌표가 아닌 mesh 중심으로 회전하게
	mesh.rotation.y = THREE.MathUtils.degToRad(45);
	mesh.rotation.x = THREE.MathUtils.degToRad(20);

	function draw() {
		const delta = clock.getDelta();

		//mesh.rotation.x = THREE.MathUtils.degToRad(45); // 45도로 회전
		// mesh.rotation.x = Math.PI/ 4;
		// mesh.rotation.y += delta;  //계속 회전

		// mesh.scale.x = 2;
        // mesh.scale.y = 0.5;
        mesh.scale.set(0.5, 1, 2);

		// mesh.position.y = 2; 이렇게 말고 다른방법이 있다.
		mesh.position.set(-2,0,0);  // 바로 set 방법 이용
		// console.log(mesh.position.length());
		// console.log(mesh.position.distanceTo(new THREE.Vector3(1,0,0)));

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
