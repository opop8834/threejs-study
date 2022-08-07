export class PreventDragClick{
    constructor(elem)  // 여기 들어온 elem의 이벤트를 지정해 줘서 canvas라는 외부 객체를 이용할 수 있게 되었다.
    {

    this.mouseMoved;   // 외부에서 이 변수를 사용할 수 있게 된다.
    let clickStartX;
    let clickStartY;
    let clickStartTime;
    elem.addEventListener('mousedown', e=>{
        clickStartX = e.clientX;
        clickStartY = e.clientY;
        clickStartTime = Date.now();  
    });
    elem.addEventListener('mouseup', e=>{
        const xGap = Math.abs(e.clientX - clickStartX);
        const yGap = Math.abs(e.clientY - clickStartY);
        // console.log(xGap,yGap);    
        const timeGap = Date.now() - clickStartTime;

        if( xGap > 5 || yGap > 5 || timeGap > 500)  
        {
            this.mouseMoved = true;
        }
        else
        {
            this.mouseMoved = false;
        }
    });
    }
}