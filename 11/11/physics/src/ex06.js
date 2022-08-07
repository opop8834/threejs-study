import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';
import { MathUtils } from 'three';
import { Material } from 'cannon-es';
import {PreventDragClick} from './PreventDragClick';
import { MySphere } from './MySphere';

// ----- 주제: 충돌 이벤트, 사운드 넣기


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


    // 성능을 위한 세팅
    cannonWorld.allowSleep = true;  // 공이 생성하고 나중에 멈췄을때 더이상 test를 안하게 그만큼 성능에 도움이 됨
    // 하지만 게임에서 쓸때는 주의할 것
    
    cannonWorld.broadphase = new CANNON.SAPBroadphase(cannonWorld);  // performane 높이기 좋음 
    // SAPBroadphase 가 현재 가장 많이 쓰이고 가장 좋음 그냥 얘 쓰셈
    // NaiveBroadphase  기본값
    // GridBroadphase 구역을 나누어 테스트



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

    const spheres = [];
    const sphereGenmetry = new THREE.SphereGeometry(0.5);
	const sphereMaterial = new THREE.MeshStandardMaterial({
		color: 'seagreen'
	});

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();
		let cannonstepTime = 1/60;
		if (delta < 0.01)  
			cannonstepTime = 1/120; 
	
		cannonWorld.step(cannonstepTime, delta, 3); 

        spheres.forEach(item => {   // 배열에 넣고 position 회전값 copy 해준다.
            item.mesh.position.copy(item.cannonBody.position);
            item.mesh.quaternion.copy(item.cannonBody.quaternion);
        })

		renderer.render(scene, camera);
		renderer.setAnimationLoop(draw);
	}

	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}

    const sound = new Audio('/sounds/boing.mp3');

    function collide(e)
    {
        const velocity = e.contact.getImpactVelocityAlongNormal();
        // console.log(velocity);   // 속도가 클때만 사운드 재생되게 하겠다.
        if (velocity > 3)
        {
            sound.currentTime = 0; // 사운드가 재생되면 무조건 끝까지 재생되기 떄문에 여러개의 공이 떨어지면 어색해져서 currenttime =0으로 조정
            sound.play(); 
        }
        // console.log(e);  충돌 할때마다 console 출력됨
    }

	// 이벤트
	window.addEventListener('resize', setSize);
    canvas.addEventListener('click', () => { 
        const mySphere = new MySphere({   // 배열에 넣어서 position copy
            // scene : scene  //scene 속성에 scene을 넣는다.
            scene,  // 이렇게 써도 됨
            cannonWorld,
            geometry :sphereGenmetry,
            material : sphereMaterial,
            x: (Math.random() - 0.5) * 2,   // -1 ~ 1 사이의 랜덤값 
            y : Math.random() * 5  + 2,
            z: (Math.random() - 0.5) * 2,
            scale: Math.random() + 0.2 // 같은 geometry를 공유해서 쓸거라 생성할때 선언해야 되는 radius가 아닌 scale로 쓸것이다.
        });

        spheres.push(mySphere);

        // 충동될때 이벤트
        mySphere.cannonBody.addEventListener('collide', collide);
    });

    const preventDragClick = new PreventDragClick(canvas);

	draw();
}
