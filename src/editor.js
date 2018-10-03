
// const jshint = require('jshint');
let keyStack = [];  //入力数を保存する変数
let dragStack = [];
const KEY_TIME = 1000;   //1000msだけキー入力を待つ
const DRAG_TIME =  500;
let varDict = {};

function func1(e) {
    if(e.lines[0].length === 1){    // NOTE: これはかなりテキトーなやり方。再考が必要。
        keyStack.push(1);  //1はテキトーな数。本当はkeyなどを入れた方が良さげ
        setTimeout(function(){
            keyStack.pop();
            if(keyStack.length === 0){
                const editor = getAceEditor();
                const program = editor.getValue();
                codeToBlock(program);
                keyStack = [];  //一応初期化
            }
        },KEY_TIME);
    }
}

function func2(e){
    console.log("change");
    dragStack.push(1);
    setTimeout(function(){
        dragStack.pop();
        if(dragStack.length === 0){
            const range = editor.getSelectionRange();
            const program = editor.getSession().getTextRange(range);
            codeToBlock(program);
            dragStack = [];
        }
    }, DRAG_TIME);
}

//Aceエディタの設定
function onLoad() {
    editor = ace.edit("input_txt");
    editor.$blockScrolling = Infinity;
    editor.getSession().setMode("ace/mode/javascript");
    editor.setTheme("ace/theme/chrome");
    editor.setFontSize(20);
    editor.session.setOptions({
        tabSize: 2,
        useSoftTabs: true
    });
    editor.setHighlightActiveLine(false);
    editor.on('change', func1);
    // editor.getSelection().on('changeSelection', func2);
}



//ダイアログ
const dlg = document.querySelector('#sample-dialog');
//Escによるキャンセルをさせない
dlg.addEventListener('cancel', (event) => {
    'use strict';
    event.preventDefault();
});
function showModalDialogElement() {
    'use strict';

    return new Promise((resolve, reject) => {
        dlg.showModal();

        function onClose(event) {
            // 2017/2/5現在Chromium:v54のためaddEventListenerの{once: true}は利用できないため自力で解放。v55になれば{once: true}を利用するのが良いと思います。
            dlg.removeEventListener('close', onClose);
            if (dlg.returnValue === 'ok') { //returnValueにvalue属性の値が入る
                const inputValue = document.querySelector('#input').value;//入力値を取得
                // alert(inputValue);//テストのためalert
                resolve(inputValue);//入力値をresolve
            } else {
                reject();
            }
        }
        dlg.addEventListener('close', onClose, {once: true});
    });
}
