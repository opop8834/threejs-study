import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';
import { MathUtils } from 'three';
import { Material } from 'cannon-es';
import {PreventDragClick} from './PreventDragClick';

// ----- 주제: Force


export default function example() {
	// Renderer
	const canvas = document.querySelector('#three-canvas');
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;  // 그림자 부드럽게

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
    directionalLight.castShadow = true;  // 그림자를 주는 애
	scene.add(directionalLight);

	// Controls
	const controls = new OrbitControls(camera, renderer.domElement);

	// Cannon (물리 엔진)
	const cannonWorld = new CANNON.World();  
	cannonWorld.gravity.set(0,-9.8,0); 


    // Contact Material
    const defaultMaterial = new CANNON.Material('default');
    const rubberMaterial = new CANNON.Material('rubber');
    const ironMaterial = new CANNON.Material('iron');
    const defaultContactMaterial = new CANNON.ContactMaterial(
        defaultMaterial,   
        defaultMaterial,    
        {
            friction: 0.5,    
            restitution: 0.5  
        }
    )
    cannonWorld.defaultContactMaterial = defaultContactMaterial;  

	const floorShape = new CANNON.Plane();
	const floorBody = new CANNON.Body({
		mass: 0,  // 바닥은 mass 0으로
		position: new CANNON.Vec3(0,0,0),
		shape: floorShape,
        material : defaultMaterial   
	})
	floorBody.quaternion.setFromAxisAngle(
		new CANNON.Vec3(-1,0,0),
		MathUtils.degToRad(90)
	) 
	cannonWorld.addBody(floorBody); 

	const sphereShape = new CANNON.Sphere(0.5);   
	const sphereBody = new CANNON.Body({
		mass:1,
		position: new CANNON.Vec3(0,5,0),
		shape: sphereShape,
        material: defaultMaterial
	})
	cannonWorld.addBody(sphereBody);
	// Mesh
	const floorMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(10,10),
		new THREE.MeshStandardMaterial({
			color:'slategray'
		})
	);
	floorMesh.rotation.x = MathUtils.degToRad(-90);
    floorMesh.receiveShadow = true;   // 그림자를 받고 그리는 애
	scene.add(floorMesh);

	const sphereGenmetry = new THREE.SphereGeometry(0.5);
	const sphereMaterial = new THREE.MeshStandardMaterial({
		color: 'seagreen'
	});
	const sphereMesh = new THREE.Mesh(sphereGenmetry, sphereMaterial);
	sphereMesh.position.y =0.5;
    sphereMesh.castShadow = true;   // 그림자 주는 애
	scene.add(sphereMesh);

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();
		let cannonstepTime = 1/60;
		if (delta < 0.01)  
			cannonstepTime = 1/120; 
	
		cannonWorld.step(cannonstepTime, delta, 3);

		sphereMesh.position.copy(sphereBody.position); 
		sphereMesh.quaternion.copy(sphereBody.quaternion);  


        // 공 속도 서서히 감소
        sphereBody.velocity.x *= 0.98;
        // sphereBody.velocity.y *= 0.98;
        sphereBody.velocity.z *= 0.98;
        sphereBody.angularVelocity.x  *= 0.98;
        // sphereBody.angularVelocity.y  *= 0.98;
        sphereBody.angularVelocity.z  *= 0.98;

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
    canvas.addEventListener('click', () => {  // 클릭하면 지정해준 값만큼 방향과 힘 전달됨
        if(preventDragClick.mouseMoved)
        {
            return;
        }
        
        sphereBody.velocity.x = 0;
        sphereBody.velocity.y = 0;
        sphereBody.velocity.z = 0;
        sphereBody.angularVelocity.x = 0;
        sphereBody.angularVelocity.y = 0;
        sphereBody.angularVelocity.z = 0;
        // 힘이 중첩해서 계속 들어가지지 않게 0으로 세팅해준다.

        sphereBody.applyForce(new CANNON.Vec3(-500,0,0), sphereBody.position)   // vector3로 방향과 힘을 동시에 적용 
    })

    const preventDragClick = new PreventDragClick(canvas);

	draw();
}
