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
var argCount = -1;
function codeToBlock() {
    parentBlock = null;
    workspace.clear();
    // console.log("start");
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
            blockByCode(node);
            console.log('[enter] ', node.type, ':', get_node_info(node))
        },
        leave: function (node, parent) {

            if(parentBlock !== null && usedNode == node){

                if(parentBlock.outputConnection !== null){
                    parentBlock = parentBlock.outputConnection.targetBlock();
                }else if(parentBlock.previousConnection !== null){
                    parentBlock = parentBlock.previousConnection.targetBlock();
                }else{
                    parentBlock = null;
                }
            }
            console.log('[leave] ', node.type, ':', get_node_info(node))
        }
    });
}
var callFunctionNameList = ["fill","background","rect"];
var functionNameList = ["setup", "draw"];
var parentBlock = null;

var usedNode = null;
function blockByCode(node) {

    switch (node.type) {
        case 'Identifier':
        return node.name;
        case 'ExpressionStatement':
            var expression = node.expression;
            argCount = -1;
            if(expression.type === 'CallExpression'){
                searchBlock(expression.callee.name, callFunctionNameList);
                usedNode = node;
                break;
            }
            break;
        case 'FunctionDeclaration':
            searchBlock(node.id.name, functionNameList);
            usedNode = node;
            break;
        case 'Literal':
            if(!isNaN(node.value)){
                var block = new Blockly.BlockSvg(workspace, "math_number");
                block.initSvg();
                block.render();

                block.inputList[0].fieldRow[0].setValue(node.value);
                // usedNode = node;
                if(parentBlock!== null){
                    var index = getAkiIndex(parentBlock.inputList);
                    console.log(index);
                    block.outputConnection.connect(parentBlock.inputList[index].connection);
                }
            }
            break;
        default:
        return node.type;
    }

}
function getAkiIndex(inputList) {
    var i = 0;
    for(input of inputList){
        if(!input.connection.isConnected()){
            return i;
        }
        i++;
    }
    return -1;
}
function searchBlock(name, list) {
    for(name1 of list){
        if(name1 === name){
            console.log(name);
            createBlockByName(name);
        }
    }
}

function createBlockByName(name){
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
