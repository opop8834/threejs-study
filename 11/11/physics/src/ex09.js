import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';
import { MathUtils } from 'three';
import { Material } from 'cannon-es';
import {PreventDragClick} from './PreventDragClick';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {Domino} from './Domino';

// ----- 주제: 도미노 raycaster와 이름 지정해주고 쓰러뜨리기


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

    //Loader
    const gltfLoader = new GLTFLoader();

	// Cannon (물리 엔진)
	const cannonWorld = new CANNON.World();  
	cannonWorld.gravity.set(0,-9.8,0); 


    // 성능을 위한 세팅
    // cannonWorld.allowSleep = true; 
    
    cannonWorld.broadphase = new CANNON.SAPBroadphase(cannonWorld); 



    // Contact Material
    const defaultMaterial = new CANNON.Material('default');
    const rubberMaterial = new CANNON.Material('rubber');
    const ironMaterial = new CANNON.Material('iron');
    const defaultContactMaterial = new CANNON.ContactMaterial(
        defaultMaterial,   
        defaultMaterial,    
        {
            friction: 0.01,    
            restitution: 0.9  
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
		new THREE.PlaneGeometry(100,100),
		new THREE.MeshStandardMaterial({
			color:'slategray'
		})
	);
	floorMesh.rotation.x = MathUtils.degToRad(-90);
    floorMesh.receiveShadow = true;   // 그림자를 받고 그리는 애
	scene.add(floorMesh);

    // 도미노 생성
    const dominos = [];
    let domino;
    for (let i=-3 ; i<17; i++)
    {
        domino = new Domino({
            index: i,
            scene,
            cannonWorld,
            gltfLoader,
            y : 0.5,
            z: -i * 0.8   // 도미노 위치들 지정
        });
        dominos.push(domino);

    }


	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();
		let cannonstepTime = 1/60;
		if (delta < 0.01)  
			cannonstepTime = 1/120; 
	
		cannonWorld.step(cannonstepTime, delta, 3); 

        dominos.forEach(item => {
            if (item.cannonBody)   // gltfloader될때까지 기다리기
            {
                item.modelMesh.position.copy(item.cannonBody.position);
                item.modelMesh.quaternion.copy(item.cannonBody.quaternion);
            }
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

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function checkIntersects()
    {
        raycaster.setFromCamera(mouse, camera);
        
        const intersects = raycaster.intersectObjects(scene.children);

        // for (const item of intersects)  첫번째 매쉬 선택 for문과 배열 [0] 두가지 방법이 있다.
        // {
        //     if (item.object.cannonBody)
        //     {
        //         item.object.cannonBody.applyForce(
        //             new CANNON.Vec3(0,0,-100),
        //             new CANNON.Vec3(0,0,0)
        //         )
        //     }
        // }
        if (intersects[0].object.cannonBody)  // cannonbody 있을때만 즉 mesh를 클릭했을 때만
        {
            intersects[0].object.cannonBody.applyForce(
                new CANNON.Vec3(0,0,-100),
                new CANNON.Vec3(0,0,0)
            )
        }
    }

	// 이벤트
	window.addEventListener('resize', setSize);
    canvas.addEventListener('click', e => { 
        if (preventDragClick.mouseMoved) return;
        mouse.x = e.clientX / canvas.clientWidth *2 -1; 
        mouse.y = -(e.clientY / canvas.clientHeight * 2 -1);

        checkIntersects();
    });

    const preventDragClick = new PreventDragClick(canvas);

	draw();
}
