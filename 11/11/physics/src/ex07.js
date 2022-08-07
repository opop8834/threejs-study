import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';
import { MathUtils } from 'three';
import { Material } from 'cannon-es';
import {PreventDragClick} from './PreventDragClick';
import { MySphere } from './MySphere';

// ----- 주제: 생성된 공들 없애기


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
    cannonWorld.allowSleep = true; 
    
    cannonWorld.broadphase = new CANNON.SAPBroadphase(cannonWorld); 



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

        spheres.forEach(item => { 
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
        if (velocity > 3)
        {
            sound.currentTime = 0; 
            sound.play(); 
        }
    }

	// 이벤트
	window.addEventListener('resize', setSize);
    canvas.addEventListener('click', () => { 
        const mySphere = new MySphere({  
            scene,
            cannonWorld,
            geometry :sphereGenmetry,
            material : sphereMaterial,
            x: (Math.random() - 0.5) * 2,  
            y : Math.random() * 5  + 2,
            z: (Math.random() - 0.5) * 2,
            scale: Math.random() + 0.2
        });

        spheres.push(mySphere);

        // 충동될때 이벤트
        mySphere.cannonBody.addEventListener('collide', collide);
    });

    const preventDragClick = new PreventDragClick(canvas);

    //삭제하기
    const btn = document.createElement('button');
    btn.style.cssText = 'position: absolute; left: 20px top: 20px; font-size: 20px';
    btn.innerHTML = '삭제';
    document.body.append(btn);

    btn.addEventListener('click', () =>{
        spheres.forEach(item => {
            item.cannonBody.removeEventListener('collide', collide); // 이벤트도 메모리에 있어서 이것도 지워져야 된다.
            cannonWorld.removeBody(item.cannonBody);  // cannon world안에있는 것도 삭제
            scene.remove(item.mesh);
        });
    });

	draw();
}
