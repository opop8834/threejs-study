// import {hello1} from './hello.js'
// import hello2 from './hello.js'    // default일때는 {} 안써줌

import * as hello from './hello.js';  // 전체 함수를 다 가져오고 싶을때
hello.hello1();
hello.hello2();