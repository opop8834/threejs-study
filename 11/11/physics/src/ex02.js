import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';
import { MathUtils } from 'three';
import { Material } from 'cannon-es';

// ----- 주제: Contact Material  // 재질에 따른 마찰력 반발력을 지정해주기 위해

// cannon.js 문서
// http://schteppe.github.io/cannon.js/docs/
// 주의! https 아니고 http

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
	const cannonWorld = new CANNON.World();  // three 에서 scene같은 느낌이다.
	cannonWorld.gravity.set(0,-9.8,0);  // 중력 정하기


    // Contact Material
    const defaultMaterial = new CANNON.Material('default');
    const rubberMaterial = new CANNON.Material('rubber');
    const ironMaterial = new CANNON.Material('iron');
    const defaultContactMaterial = new CANNON.ContactMaterial(
        defaultMaterial,    // defualt material 끼리 만났을때
        defaultMaterial,    // 이렇게 서로 닿았을때
        {
            friction: 0.5,    // 마찰력
            restitution: 0.5    // 얼마나 튕기는지 반발
        }
    )
    cannonWorld.defaultContactMaterial = defaultContactMaterial;  // 이제 cannonworld에 세팅해주면 마찰력과 반발이 적용된다.

    const rubberDefaultContactMaterial = new CANNON.ContactMaterial(
        rubberMaterial,    // rubber와 default가 닿았을때
        defaultMaterial,    // 이렇게 서로 닿았을때
        {
            friction: 0.5,
            restitution: 0.7 
        }
    )
    cannonWorld.addContactMaterial(rubberDefaultContactMaterial);   // 이렇게 add를 해준다.
    //이제 add되고 써먹을려면 공에 rubber를 적용시켜야 된다. 즉 cannonBody에 적용해준다.

    const ironDefaultContactMaterial = new CANNON.ContactMaterial(
        ironMaterial,    // rubber와 default가 닿았을때
        defaultMaterial,    // 이렇게 서로 닿았을때
        {
            friction: 0.5,
            restitution: 0 
        }
    )
    cannonWorld.addContactMaterial(ironDefaultContactMaterial);   // 이렇게 add를 해준다.
    //이제 add되고 써먹을려면 공에 rubber를 적용시켜야 된다. 즉 cannonBody에 적용해준다.



	const floorShape = new CANNON.Plane();
	const floorBody = new CANNON.Body({
		mass: 0,  // 바닥은 mass 0으로
		position: new CANNON.Vec3(0,0,0),
		shape: floorShape,
        material : defaultMaterial   // material 지정해서 마찰력 반발 넣어줄 수 있다.
	})
	floorBody.quaternion.setFromAxisAngle(
		new CANNON.Vec3(-1,0,0),
		MathUtils.degToRad(90)
	)  // plane은 위아래로 세워진 상태여서 돌려준다.
	cannonWorld.addBody(floorBody);  // 이렇게 cannon 세상에서의 floor를 만들 수 잇다. 눈에 보이지는 않는다.

	const sphereShape = new CANNON.Sphere(0.5);   // three랑은 기준점이 가운데로 달라서 1의 크기라면 cannon에서는 0.5이다.
	const sphereBody = new CANNON.Body({
		mass:1,
		position: new CANNON.Vec3(0,5,0),
		shape: sphereShape,
        // material : rubberMaterial   // 마찬가지로 고무공이라는 material 지정
        material: ironMaterial   // 쇠공일때는 또 마찰력 반발 세팅해준거
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
		if (delta < 0.01)  // 즉 프레임이 60프레임보다 높은 모니터면
			cannonstepTime = 1/120;  // 120프레임 사용
	
		cannonWorld.step(cannonstepTime, delta, 3);

	    // floorMesh.position.copy(floorBody.position);  // cannnon이랑 three랑 floor 위치 연결 바닥이라 굳이 해줄필요는 없다.
		sphereMesh.position.copy(sphereBody.position); // box도 연결
		sphereMesh.quaternion.copy(sphereBody.quaternion);  // 회전값도 연결

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
