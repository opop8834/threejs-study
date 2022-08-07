import { Color, PerspectiveCamera, Scene } from "three";

export class CreateScene{
    constructor(info){
        this.renderer = info.renderer;
        this.elem = document.querySelector(info.placeholder);  // 이렇게 placeholder를 일단 가져온다.
        // console.log(this.elem);
        const rect = this.elem.getBoundingClientRect();
        // console.log(rect);   // placeholder의 크기를 파악할 수 있다. 즉 고정값으로 주지않고 유동적인 크기를 가져올 수 있게 됨

        const bgColor = info.bgColor || 'white';
        const fov = info.fov || 75;
        const aspect = rect.width / rect.height;
        const near = info.near || 0.1;
        const far = info.far || 100;
        const cameraPosition = info.cameraPosition || {x:0, y:0, z:3};


        // scene 만들기
        this.scene = new Scene();
        this.scene.background = new Color(bgColor);

        //카메라 만들기
        this.camera = new PerspectiveCamera(fov,aspect,near,far);
        this.camera.position.x = cameraPosition.x;
        this.camera.position.y = cameraPosition.y;
        this.camera.position.z = cameraPosition.z;

        this.scene.add(this.camera);

        this.meshes = [];

    }
    set(func)
    {
        func();
    }

    render(){  // 지정한 영역에 mesh 그리기
        const renderer = this.renderer;
        const rect = this.elem.getBoundingClientRect(); //실시간으로 위치 가져오기
        if (rect.bottom < 0 || rect.top > renderer.domElement.clientHeight || rect.left > renderer.domElement.clientWidth || rect.right < 0)   // 씬이 화면에 안보일때 굳이 랜더링 해줄필요 없음
        {
            return;
        }

        // 이제 화면 비율이 작아져도 mesh 크기는 줄어들지 않고 유지됨
        this.camera.aspect = rect.width / rect.height;
        this.camera.updateProjectionMatrix();
        
        const canvasBottom = renderer.domElement.clientHeight - rect.bottom;
        renderer.setScissor(rect.left, canvasBottom, rect.width, rect.height);
        renderer.setViewport(rect.left, canvasBottom, rect.width, rect.height);
        renderer.setScissorTest(true);

        renderer.render(this.scene, this.camera);
    }
}