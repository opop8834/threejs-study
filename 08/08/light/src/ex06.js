import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import dat from 'dat.gui';
import { MathUtils, TextureLoader } from 'three';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';

// ----- 주제: RectAreaLight  사각형 영역에서 뿜어져 나오는 light

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
	const ambientlight = new THREE.AmbientLight('white',0.5); // 따로 위치 지정이 없다 그냥 은은하게 조명만으로 입체적이게 느껴지지는 않는다.
	scene.add( ambientlight );


	const light = new THREE.RectAreaLight('orange', 10, 2, 2)  // 2, 2 사각형 판에서 light가 뿜어져 나옴
	light.position.y=2;
    light.position.z=3;
	scene.add(light);
	
	const lightHelper = new RectAreaLightHelper(light);  // Rectarea의 helper는 따로 import를 해줘야 된다.
	scene.add(lightHelper);


	// Controls
	const controls = new OrbitControls(camera, renderer.domElement);

	// Geometry
	const planeGeometry = new THREE.PlaneGeometry(10,10);
	const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
	const sphereGeometry = new THREE.SphereGeometry(0.7, 16, 16);

	// Material
	const material1 = new THREE.MeshStandardMaterial({color: 'grey'});
	const material2 = new THREE.MeshStandardMaterial({color: 'royalblue'});
	const material3 = new THREE.MeshStandardMaterial({color: 'gold'});

	// Mesh
	const plane = new THREE.Mesh(planeGeometry, material1);
	const box = new THREE.Mesh(boxGeometry, material2);
	const sphere = new THREE.Mesh(sphereGeometry, material3);

	plane.rotation.x = -MathUtils.degToRad(90);
	box.position.set(1,1,0);
	sphere.position.set(-1,1,0);

    //그림자 설정
    plane.receiveShadow = true;
    box.castShadow = true;
    box.receiveShadow = true;
    sphere.castShadow = true;
    sphere.receiveShadow = true;

	scene.add(plane,box,sphere);

	// AxesHelper
	const axesHelper = new THREE.AxesHelper(3);
	scene.add(axesHelper);

	// Dat GUI
	const gui = new dat.GUI();
	gui.add(light.position, 'x', -5, 5).name('light X');
	gui.add(light.position, 'y', -5, 5).name('light y');
	gui.add(light.position, 'z', -5, 5).name('light z');

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();
		const time = clock.getElapsedTime();

		// light.position.x = Math.cos(time)*5;   // c/a  a가 1이라고 할때 c는 x를 나타냄
		// light.position.z = Math.sin(time)*5;   // b/a  b는 z를 나타냄
		// // 즉 각도 알파에 time값을 넣어서 계속 늘어나게 됨, 점차 원이 그려지게 됨

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
