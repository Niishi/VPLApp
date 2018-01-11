const esprima = require('esprima');
const estraverse = require('estraverse');
const prompt = require('electron-prompt');

var keyStack = [];  //入力数を保存する変数
const KEY_TIME = 1000;   //1000msだけキー入力を待つ
function func1(e) {
    if(e.lines[0].length === 1){    // NOTE: これはかなりテキトーなやり方。再考が必要。
        keyStack.push(1);  //1はテキトーな数。本当はkeyなどを入れた方が良さげ
        setTimeout(function(){
            keyStack.pop();
            if(keyStack.length === 0){
                codeToBlock();
                keyStack = [];  //一応初期化
            }
        },KEY_TIME);
    }
}
function codeToBlock() {
    parentBlock = null;

    // console.log("start");
    var editor = getAceEditor();
    var program = editor.getValue();
    try {
        var ast = esprima.parse(program);
        workspace.clear();
    } catch (e) {
        console.error("構文エラー");
        return;
    }
    var get_node_info = function(node){

        switch (node.type) {
            case 'Identifier':
            return node.name;
            case 'ExpressionStatement':
            return node.body;
            case 'FunctionDeclaration':
            return node.id;
            case 'Literal':
            return node.value;
            default:
            return node.type;
        }
    };
    estraverse.traverse(ast, {
        enter: function (node, parent) {
            console.log('[enter] ', node.type, ':', get_node_info(node));
            blockByCode(node);
        },
        leave: function (node, parent) {

            switch (node.type) {
                case 'AssignmentExpression':
                    isAssignment = false;
                    if(node.left.name == "setup"){
                        isSetupFunction = false;
                    }else if(node.left.name == "draw"){
                        isDrawFunction = false;
                        isAssignment = false;
                    }
                    break;
                case 'VariableDeclaration':
                    isVarDecl = false;
                    break;
                case 'CallExpression':
                    isCallExp = false;
                    break;
            }

            if(nodeStack[nodeStack.length-1] === node.type && !isDrawFunction && isExist(parentBlock)){
                if (isExist(parentBlock.outputConnection)){
                    parentBlock = parentBlock.outputConnection.targetBlock();
                } else if (isExist(parentBlock.previousConnection)){
                    parentBlock = parentBlock.previousConnection.targetBlock();
                } else {
                    parentBlock = null;
                }
                nodeStack.pop();
            }
            console.log('[leave] ', node.type, ':', get_node_info(node));
        }
    });
    blockY = 0;
}
function isExist(a) {
    return a !== undefined && a !== null;
}

var callFunctionNameList = ["fill","background","rect", "noStroke"];
var functionNameList = ["setup", "draw"];
var parentBlock = null;

var isSetupFunction = false;
var isDrawFunction = false;

var nodeStack = [];
var blockY = 0;
var blockX = 100;
var blockMargin = 30;

var isAssignment = false;
var isVarDecl = false;
var isCallExp = false;
function blockByCode(node) {
    if(isSetupFunction){
        return;
    }
    switch (node.type) {
        case 'Identifier':
            if(isAssignment && !(isSetupFunction || isDrawFunction)){
                var variable = workspace.getVariable(node.name);
                parentBlock.getField("VAR").setValue(variable.getId());
                isAssignment = false;
            }else if(isVarDecl && !(isSetupFunction || isDrawFunction)){
                workspace.createVariable(node.name);
            }else if(isCallExp && !(isSetupFunction || isDrawFunction)){
                if(!searchBlock(node.name, callFunctionNameList, 'CallExpression')){

                }
                isCallExp = false;
            }
            else{
                switch(node.name){
                    case 'mouseX':
                    case 'mouseY':
                        var block = createBlock(node.name, node.type);
                        if(parentBlock!== null){
                            var index = getAkiIndex(parentBlock.inputList);
                            block.outputConnection.connect(parentBlock.inputList[index].connection);
                        }
                        break;
                    default:
                        if(!(isSetupFunction || isDrawFunction)){
                            var block = new Blockly.BlockSvg(workspace, "variables_get");
                            block.initSvg();
                            block.render();

                            block.getField("VAR").setValue(node.name);
                            if(parentBlock!== null){
                                var index = getAkiIndex(parentBlock.inputList);
                                block.outputConnection.connect(parentBlock.inputList[index].connection);
                            }
                            nodeStack.push("Identifier");
                            parentBlock = block;
                        }
                }
            }
            break;
        case 'AssignmentExpression':
            isAssignment = true;
            if(node.left.name == "setup"){
                isSetupFunction = true;
                var block = new Blockly.BlockSvg(workspace, "setup");
                block.moveBy(blockX, blockY);
                block.initSvg();
                block.render();
                parentBlock = block;
                blockY += parentBlock.height + blockMargin;
                nodeStack.push("AssignmentExpression");
            }else if(node.left.name == "draw"){
                isDrawFunction = true;
                var block = new Blockly.BlockSvg(workspace, "draw");
                block.moveBy(blockX, blockY);
                block.initSvg();
                block.render();
                parentBlock = block;
                blockY += parentBlock.height + blockMargin;
                nodeStack.push("AssignmentExpression");
            }else{
                createBlockByName("variables_set", node.type);
            }
            break;
        case 'ExpressionStatement':
            var expression = node.expression;
            break;
        case 'CallExpression':
            isCallExp = true;
            break;
        case 'VariableDeclaration':
            isVarDecl = true;
            break;
        case 'VariableDeclarator':
            name = "";
            break;
        case 'FunctionExpression':
            if(isDrawFunction){
                isDrawFunction = false;
                isAssignment = false;
            }
            break;
        case 'FunctionDeclaration':
            if(isDrawFunction){
                isDrawFunction = false;
                isAssignment = false;
                break;
            }else{
                searchBlock(node.id.name, functionNameList, node.type);
                break;
            }
        case 'Literal':
            if(isColor(node.value)){
                var block = new Blockly.BlockSvg(workspace, "colour_picker");
                block.initSvg();
                block.render();

                block.inputList[0].fieldRow[0].setValue(node.value);

                if(parentBlock!== null){
                    var index = getAkiIndex(parentBlock.inputList);
                    block.outputConnection.connect(parentBlock.inputList[index].connection);
                }
                nodeStack.push("Literal");
                parentBlock = block;
            }
            else if(!isNaN(node.value)){
                var block = new Blockly.BlockSvg(workspace, "math_number");
                block.initSvg();
                block.render();

                block.inputList[0].fieldRow[0].setValue(node.value);
                if(parentBlock!== null){
                    var index = getAkiIndex(parentBlock.inputList);
                    block.outputConnection.connect(parentBlock.inputList[index].connection);
                }
                nodeStack.push("Literal");
                parentBlock = block;
            }
            break;
        case 'BinaryExpression':
            var block = new Blockly.BlockSvg(workspace, "math_arithmetic");
            switch(node.operator) {
                case "+":
                    block.getField("OP").setValue("ADD");
                    break;
                case "-":
                    block.getField("OP").setValue("MINUS");
                    break;
                case "*":
                    block.getField("OP").setValue("MULTIPLY");
                    break;
                case "/":
                    block.getField("OP").setValue("DIVIDE");
                    break;
            }
            block.initSvg();
            block.render();
            if(parentBlock!== null){
                var index = getAkiIndex(parentBlock.inputList);
                block.outputConnection.connect(parentBlock.inputList[index].connection);
            }
            parentBlock = block;
            nodeStack.push("BinaryExpression");


            break;
        default:
        return node.type;
    }

}
function getAkiIndex(inputList) {
    var i = 0;
    for(input of inputList){

        if(input.connection !== null && !input.connection.isConnected()){
            return i;
        }
        i++;
    }
    console.error("インデックスの空きが見つかりませんでした");
    return -1;
}
function searchBlock(name, list, type) {
    for(name1 of list){
        if(name1 === name){
            console.log(name);
            createBlockByName(name, type);
            return true;
        }
    }
    return false;
}

function isColor (color) {
    if(!isNaN(color)) return false;
    return color.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/) !== null;
}

function createBlock(name, type){
    var block = new Blockly.BlockSvg(workspace, name);
    block.initSvg();
    block.render();
    if(parentBlock === null){
        block.moveBy(blockX, blockY);
        blockY += block.height + blockMargin;
    }
    nodeStack.push(type);
    parentBlock = block;
    return block;
}
function createBlockByName(name, type){
    var block = new Blockly.BlockSvg(workspace, name);
    block.initSvg();
    block.render();
    if(parentBlock === null){
        block.moveBy(blockX, blockY);
        blockY += block.height + blockMargin;
    }
    if(parentBlock !== null && block.previousConnection !== null){
        var childBlocks = parentBlock.getChildren();
        if(childBlocks.length == 0){
            if(parentBlock.inputList[0].connection != null){
                block.previousConnection.connect(parentBlock.inputList[0].connection);
            }else if(parentBlock.nextConnection !== null){
                block.previousConnection.connect(parentBlock.nextConnection);
            }
        }else{
            block.previousConnection.connect(childBlocks[childBlocks.length-1].nextConnection);
        }
    }
    nodeStack.push(type);
    parentBlock = block;
}

//Aceエディタの設定
function onLoad() {
    editor = ace.edit("input_txt");
    editor.getSession().setMode("ace/mode/javascript");
    editor.setTheme("ace/theme/chrome");
    editor.setFontSize(20);
    editor.setHighlightActiveLine(false);
    editor.$blockScrolling = Infinity;
    editor.on('change', func1);
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
Blockly.prompt = function (a,b,c){
    return showModalDialogElement().then((text) =>{return c(text);});
};
