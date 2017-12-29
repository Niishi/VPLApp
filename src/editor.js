const esprima = require('esprima');
const estraverse = require('estraverse');


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
    workspace.clear();
    // console.log("start");
    var editor = getAceEditor();
    var program = editor.getValue();
    var ast = esprima.parse(program);
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
                    if(node.left.name == "setup"){
                        isSetupFunction = false;
                    }else if(node.left.name == "draw"){
                        isDrawFunction = false;
                    }
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
                console.log("parent!!!!!!!!!!!!!!!!!!!!");
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

var usedNode = null;
var isSetupFunction = false;
var isDrawFunction = false;

var nodeStack = [];

var blockY = 0;
var blockX = 100;
function blockByCode(node) {
    if(isSetupFunction){
        return;
    }
    switch (node.type) {
        case 'Identifier':
            switch(node.name){
                case 'mouseX':
                case 'mouseY':
                    var block = createBlock(node.name, node.type);
                    if(parentBlock!== null){
                        var index = getAkiIndex(parentBlock.inputList);
                        block.outputConnection.connect(parentBlock.inputList[index].connection);
                    }
                    parentBlock = block;
                    break;
            }
            break;
        case 'AssignmentExpression':

            if(node.left.name == "setup"){
                isSetupFunction = true;
                var block = new Blockly.BlockSvg(workspace, "setup");
                block.moveBy(blockX, blockY);
                block.initSvg();
                block.render();
                parentBlock = block;
                blockY += parentBlock.height;
                nodeStack.push("AssignmentExpression");
                break;
            }else if(node.left.name == "draw"){
                isDrawFunction = true;
                var block = new Blockly.BlockSvg(workspace, "draw");
                block.moveBy(blockX, blockY);
                block.initSvg();
                block.render();
                parentBlock = block;
                nodeStack.push("AssignmentExpression");
                break;
            }
            break;
        case 'ExpressionStatement':
            var expression = node.expression;

            if(expression.type === 'CallExpression'){
                searchBlock(expression.callee.name, callFunctionNameList, node.type);
                usedNode = node;
                break;
            }
            break;
        case 'FunctionExpression':
            if(isDrawFunction){
                isDrawFunction = false;
            }
            break;
        case 'FunctionDeclaration':
            if(isDrawFunction){
                isDrawFunction = false;
                break
            }else{
                searchBlock(node.id.name, functionNameList, node.type);
                usedNode = node;
                break;
            }
        case 'Literal':
            if(isColor(node.value)){
                var block = new Blockly.BlockSvg(workspace, "colour_picker");
                block.initSvg();
                block.render();

                console.log(parentBlock);
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
                // usedNode = node;
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
        }
    }
}

function isColor (color) {
    if(!isNaN(color)) return false;
    return color.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/) !== null;
}

function createBlock(name, type){
    var block = new Blockly.BlockSvg(workspace, name);
    block.initSvg();
    block.render();
    nodeStack.push(type);
    return block;
}
function createBlockByName(name, type){
    console.log(parentBlock);
    var block = new Blockly.BlockSvg(workspace, name);
    block.initSvg();
    block.render();
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
