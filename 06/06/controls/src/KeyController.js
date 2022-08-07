export class KeyController {
    constructor() {
        this.keys = [];
        window.addEventListener('keydown', e => {
            console.log(e.code + ' 누름');
            this.keys[e.code] = true;   // 어떤 키가 눌렸을때 특정 키가 눌린것을 알고 있어서 그 키를 true로 만들어줌
        });

        window.addEventListener('keyup', e => {
            console.log(e.code + ' 뗌');
            delete this.keys[e.code];  // 이제 특정 키를 떼면 그 키를 배열에서 삭제시킴
        })
    }
}