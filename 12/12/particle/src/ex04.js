import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ----- 주제: 파티클을 랜덤으로 여러가지 색으로

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
	

	// Points
	const geometry = new THREE.BufferGeometry();   // 형태 정해지지 않았기 때문에 buffer로 생성
    const count = 1000;
    const positions = new Float32Array(count * 3);  // 3차원 이라서 *3
    const colors = new Float32Array(count * 3);
    for (let i = 0; i<positions.length; i++)
    {
        positions[i] = (Math.random() - 0.5) * 10;   // -5 ~ +5
        colors[i] = Math.random();   // 0하고 1사이의 색
    }
    geometry.setAttribute(   // 이렇게 속성을 임의로 추가
        'position',
        new THREE.BufferAttribute(positions, 3)  // 점하나당 xyz인 값 3개를 쓰기 때문에
        );
    geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors,3)
    );

    // 이미지 로드
    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load('/images/star.png');
    
    const material = new THREE.PointsMaterial({
        size: 0.1,
        map: particleTexture,
        transparent: true,
        alphaMap : particleTexture,
        depthWrite: false,
        
        //색깔 추가
        vertexColors: true

    });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

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
