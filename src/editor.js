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

function blockByCode(code){
    try {
        var ast = esprima.parse(code);
    } catch (e) {
        console.error("構文エラー");
        return "error";
    }

    for (statement of ast.body) {
        var block = blockByStatement(statement);
        if(block === null) continue;
        return block;
    }
    return null;
}
function codeToBlock() {
    var editor = getAceEditor();
    var program = editor.getValue();
    try {
        var ast = esprima.parse(program);
        workspace.clear();
    } catch (e) {
        console.error("構文エラー");
        return;
    }

    for (statement of ast.body) {
        var block = blockByStatement(statement);
        if(block === null) continue;
        block.moveBy(blockX, blockY);
        blockY += block.height + blockMargin;
    }

    blockY = 0;
}
function isExist(a) {
    return a !== undefined && a !== null;
}

var callFunctionNameList = ["fill","background","rect", "noStroke"];
var functionNameList = ["setup", "draw"];

var blockY = 0;
var blockX = 100;
var blockMargin = 30;


function blockByStatement(statement) {
    switch(statement.type){
        case 'BlockStatement':
            return blockStatementBlock(statement);
        case 'ExpressionStatement':
            return expressionStatementBlock(statement);
        case 'ForStatement':
            return forStatementBlock(statement);
        case 'FunctionDeclaration':
            return functionDeclarationBlock(statement);
        case 'IfStatement':
            return ifStatementBlock(statement);
        case 'WhileStatement':
            return whileStatementBlock(statement);
        case 'VariableDeclaration':
            return variableDeclarationBlock(statement);
        case 'VariableDeclarator':
            return variableDeclaratorBlock(statement);
        default:
            errorMessage("blockByStatementでエラー。存在しないstatement=>" + statement.type);
    }
}
/**
 * statement列からブロック列を生成しその先頭のブロックだけを返す。生成されたブロックは順番通りに連結されている。nullを返すおそれがある。
 * @param  {json} statement 命令列
 * @return {Blockly.BlockSvg} 生成されたブロック列の先頭ブロック
 */
function blockStatementBlock(statement) {
    var firstBlock = null;
    var block = null;
    for(stm of statement.body){
        if(block === null){
            firstBlock = blockByStatement(stm);
            block = firstBlock;
        }else{
            var nextBlock = blockByStatement(stm);
            if(nextBlock !== null){
                combineNextBlock(block, nextBlock);
                block = nextBlock;
            }
        }
    }
    return firstBlock;
}

function expressionStatementBlock(statement) {
    if(statement.expression.type === 'CallExpression') return blockByExpression(statement.expression, true);
    var exprBlock = blockByExpression(statement.expression, true);
    if(exprBlock.type === 'setup' || exprBlock.type === 'draw') return exprBlock;
    var block = createBlock('expression_statement');
    combineIntoBlock(block,exprBlock);
    return block;
}

/**
 * 初期化式がExpressionかVariableDeclarationかによって
 * for文の形を変えて返す
 * @param  {JSON} statement 文
 * @return {Block} block 生成したブロック
 */
function forStatementBlock(statement) {
    if(statement.init.type == 'VariableDeclaration'){
        var block = createBlock('for_decl');
        var initBlock = blockByStatement(statement.init);
        var testBlock = blockByExpression(statement.test);
        var updateBlock = blockByExpression(statement.update);
        var stmBlock = blockByStatement(statement.body);
        combineStatementBlock(block, initBlock, 0);
        combineIntoBlock(block, testBlock);
        combineIntoBlock(block, updateBlock);
        combineStatementBlock(block, stmBlock, 3);

        return block;
    }
    var block = createBlock('my_for');
    var initBlock   = blockByExpression(statement.init);
    var testBlock   = blockByExpression(statement.test);
    var updateBlock = blockByExpression(statement.update);
    var stmBlock    = blockByStatement(statement.body);
    combineIntoBlock(block, initBlock);
    combineIntoBlock(block, testBlock);
    combineIntoBlock(block, updateBlock);
    combineStatementBlock(block, stmBlock, 3);

    return block;
}

/**
 * 関数定義のブロックを返す
 * @param  {JSON} statement
 * @return {Block}
 */
function functionDeclarationBlock(statement){
    const name = statement.id.name;
    const params = statement.params;
    if (name == 'setup') {
        block = createBlock('setup');
        // let stmBlock = blockByStatement(statement.body);
        // combineStatementBlock(block, stmBlock, 0);
        return block;
    } else if (name == 'draw') {
        block = createBlock('draw');
        let stmBlock = blockByStatement(statement.body);
        combineStatementBlock(block, stmBlock, 0);
        return block;
    } else {
        var block = createBlock('decl_function');
        block.getField('NAME').setValue(name);
        block.createValueInput(params.length);
        let stmBlock = blockByStatement(statement.body);
        let i = 0;
        for(param of params){
            block.getField("PARAM" + i).setValue(param.name);
            i++;
        }
        combineStatementBlock(block, stmBlock, 1);
        return block;
    }
}
/**
 * if文のブロックを作成する
 * @param  {JSON} statement [description]
 * @return {[type]} if文ブロック
 */
function ifStatementBlock(statement){
    var block;
    if(statement.alternate === null){
        block = createBlock("controls_if");
    }else{
        block = createBlock("controls_ifelse");
    }
    var condBlock = blockByExpression(statement.test, false);
    combineIntoBlock(block, condBlock, 0);
    var stmBlock = blockByStatement(statement.consequent);
    combineStatementBlock(block, stmBlock, 1);
    if(statement.alternate !== null){
        stmBlock = blockByStatement(statement.alternate);
        combineStatementBlock(block, stmBlock, 2);
    }
    return block;
}

function whileStatementBlock(statement) {
    var block = createBlock('controls_whileUntil');
    var condBlock = blockByExpression(statement.test, false);
    combineIntoBlock(block,condBlock);
    var stmBlock = blockByStatement(statement.body);
    combineStatementBlock(block, stmBlock,1);
    return block;
}

//NOTE : 現在kind('var', 'const', 'let')は無視している
function variableDeclarationBlock(statement) {
    var firstBlock = null;
    var block = null;
    const kind = statement.kind;
    for (declaration of statement.declarations) {
        var nextBlock = variableDeclaratorBlock(declaration, kind);
        if(block === null && nextBlock !== null){
            firstBlock = nextBlock;
        }else if(block !== null && nextBlock !== null){
            combineNextBlock(block, nextBlock);
        }
        block = nextBlock;
    }

    return firstBlock;
}

//NOTE idのBindingPatternに対応していない
function variableDeclaratorBlock(statement, kind) {
    if(statement.id.type === 'Identifier'){
        var name = statement.id.name;
        createVariable(name);
        var block = createBlock("var_decl");
        var variable = workspace.getVariable(name);
        block.getField("NAME").setValue(variable.getId());
        switch(kind){
            case 'var':
                block.getField('KIND').setValue('VAR');
                break;
            case 'let':
                block.getField('KIND').setValue('LET');
                break;
            case 'const':
                block.getField('KIND').setValue('CONST');
                break;
            default:
                errorMessage('variableDeclaratorBlockにおいて以下の変数の種類が定義できません: ' + kind);
        }
        if(statement.init !== null){
            var rightHandBlock = blockByExpression(statement.init, false);
            combineIntoBlock(block, rightHandBlock);
        }
        return block;
    }else{
        errorMessage("VariableDeclaratorにおいて以下のタイプに対応していない : " + statement.id.type);
    }
}
/**
 * 式からブロックを生成する。呼び出された情報がExpressionStatementであるかどうかによって変更を行う。
 * @param  {json}  expression  [description]
 * @param  {Boolean} isStatement [description]
 * @return {Blockly.BlockSvg}              [description]
 */
function blockByExpression(expression, isStatement) {
    switch (expression.type) {
        case 'ArrayExpression':
            return arrayExpressionBlock(expression);
        case 'AssignmentExpression':
            return assignmentExpressionBlock(expression);
        case 'BinaryExpression':
            return binaryExpressionBlock(expression);
        case 'CallExpression':
            return callExpressionBlock(expression, isStatement);
        case 'Identifier':
            return identiferBlock(expression);
        case 'Literal':
            return literalBlock(expression);
        case 'LogicalExpression':
            return logicalExpressionBlock(expression);
        case 'MemberExpression':
            return memberExpressionBlock(expression);
        case 'UnaryExpression':
            return unaryExpressionBlock(expression);
        case 'UpdateExpression':
            return updateExpressionBlock(expression);
        default:
            errorMessage("blockByExpressionでエラー。該当しないExpression=>" + expression.type);
            return null;
    }
}

/**
 * 配列を作成しブロックとして返す。
 * 配列の要素数に応じて配列ブロックのインプットを増やす。
 * @param  {JSON} node [expression]
 * @return {Block}      生成したブロック
 */
function arrayExpressionBlock(node){
    var block = createBlock("array_block");
    const elements = node.elements;
    block.createValueInput(elements.length);
    for (element of elements) {
        var argBlock = blockByExpression(element, false);
        var index = getAkiIndex(block.inputList);
        argBlock.outputConnection.connect(block.inputList[index].connection);
    }
    return block;
}

function assignmentExpressionBlock(node) {
    var block;
    var name = node.left.name;
    if (name == 'setup') {
        block = createBlock('setup');
        // let stmBlock = blockByStatement(statement.body);
        // combineStatementBlock(block, stmBlock, 0);
        return block;
    } else if (name == 'draw') {
        block = createBlock('draw');
        let stmBlock = blockByStatement(node.right.body);
        combineStatementBlock(block, stmBlock, 0);
        return block;
    } else {
        var block = createBlock("assingment_expression");
        var name = node.left.name;
        createVariable(name);
        var variable = workspace.getVariable(name);
        block.getField("NAME").setValue(variable.getId());
        switch(node.operator){
            case '=':
                block.getField('OP').setValue('EQ');
                break;
            case '+=':
                block.getField('OP').setValue('ADD');
                break;
            case '-=':
                block.getField('OP').setValue('SUB');
                break;
            case '*=':
                block.getField('OP').setValue('MULT');
                break;
            case '/=':
                block.getField('OP').setValue('DIVISION');
                break;
            case '%=':
                block.getField('OP').setValue('AMARI');
                break;
            case '**=':
                block.getField('OP').setValue('BEKI');
                break;
            default:
                errorMessage("AssignmentExpressionのブロック変換において、以下のoperatorは定義されていません: " +
                  node.operator + "\n\n面倒くさくて実装していません。本当にごめんなさい。")
        }
        var rightHandBlock = blockByExpression(node.right, false);
        combineIntoBlock(block, rightHandBlock);
        return block;
    }
}

function callExpressionBlock(node, isStatement){
    var name = node.callee.name;
    var block;
    if(name === "fill"){
        name = "void_fill";
        block = createBlock(name);
    }else{
        block = searchBlock(name, callFunctionNameList);
    }
    if(!block){
        if(isStatement){
            block = createBlock('no_return_function');
            block.getField('FUNCTION_NAME').setValue(name);
            block.createValueInput(node.arguments.length);
        }else{
            block = createBlock('return_function');
            block.getField('FUNCTION_NAME').setValue(name);
            block.createValueInput(node.arguments.length);
        }
    }
    for (argument of node.arguments) {
        var argBlock = blockByExpression(argument, false);
        var index = getAkiIndex(block.inputList);
        argBlock.outputConnection.connect(block.inputList[index].connection);
    }
    return block;
}

function identiferBlock(node) {
    switch(node.name){
        case 'mouseX':
        case 'mouseY':
            return createBlock(node.name);
        case 'width':
            var block = createBlock("variable_event");
            block.getField("NAME").setValue("WIDTH");
            return block;
        case 'height':
            var block = createBlock("variable_event");
            block.getField("NAME").setValue("HEIGHT");
            return block;
        case 'frameCount':
            var block = createBlock("variable_event");
            block.getField("NAME").setValue("FRAMECOUNT");
            return block;
        default:
            createVariable(node.name);
            var variable = workspace.getVariable(node.name);
            var block = new Blockly.BlockSvg(workspace, "variables_get");
            block.getField("VAR").setValue(variable.getId());
            block.initSvg();
            block.render();
            return block;
    }
}

function literalBlock(node) {
    if(node.raw === "true" || node.raw === "false"){
        var block = new Blockly.BlockSvg(workspace, "logic_boolean");
        block.initSvg();
        block.render();
        if(node.raw === "true"){
            block.inputList[0].fieldRow[0].setValue("TRUE");
        }else{
            block.inputList[0].fieldRow[0].setValue("FALSE");
        }
        return block;
    }else if(isColor(node.value)){
        var block = new Blockly.BlockSvg(workspace, "colour_picker");
        block.initSvg();
        block.render();
        block.inputList[0].fieldRow[0].setValue(node.value);
        return block;
    }else if(!isNaN(node.value)){
        var block = new Blockly.BlockSvg(workspace, "math_number");
        block.initSvg();
        block.render();

        block.inputList[0].fieldRow[0].setValue(node.value);
        return block;
    }else{
        errorMessage("literalBlockでエラー。該当しないLiteral=>" + node.value);
        return null;
    }
}

function logicalExpressionBlock(node){
    var block = createBlock("logic_operation");
    var leftBlock = blockByExpression(node.left, false);
    var rightBlock = blockByExpression(node.right, false);
    if(node.operator === '||'){
        block.getField('OP').setValue('OR');
    }else if(node.operator === '&&'){
        block.getField('OP').setValue('AND');
    }else{
        errorMessage("logicalExpressionBlock()において次のnode.operatorが存在しない: " + node.operator);
    }
    combineIntoBlock(block, leftBlock);
    combineIntoBlock(block, rightBlock);

    return block;
}

/**
 * 現在は配列の要素指定のみ実現している。
 * x.func()やthis.xなどはまだ実装されていないので要実装
 * @param  {JSON} expression
 * @return {Block}
 */
function memberExpressionBlock(node){
    var block;
    if(node.computed){
        block = createBlock("array_member");
        nameBlock = blockByExpression(node.object, false);
        indexBlock = blockByExpression(node.property, false);
        combineIntoBlock(block, nameBlock);
        combineIntoBlock(block, indexBlock);
    } else {
        block = blockByExpression(node.object, false);
        let rightBlock;
        if(node.property.type === "Identifier"){
            rightBlock = createBlock("member_block");
            rightBlock.getField("NAME").setValue(node.property.name);
        }else{
            rightBlock = blockByExpression(node.property, false);
        }
        combineIntoBlock(block, rightBlock);
    }
    return block;
}

function binaryExpressionBlock(node) {
    var block = null;
    switch(node.operator) {
        case "+":
            block = createBlock("math_arithmetic", node.type);
            block.getField("OP").setValue("ADD");
            break;
        case "-":
            block = createBlock("math_arithmetic", node.type);
            block.getField("OP").setValue("MINUS");
            break;
        case "*":
            block = createBlock("math_arithmetic", node.type);
            block.getField("OP").setValue("MULTIPLY");
            break;
        case "/":
            block = createBlock("math_arithmetic", node.type);
            block.getField("OP").setValue("DIVIDE");
            break;
        case '==':
            block = createBlock("logic_compare", node.type);
            block.getField("OP").setValue("EQ");
            break;
        case '!=':
            block = createBlock("logic_compare", node.type);
            block.getField("OP").setValue("NEQ");
            break;
        case '<=':
            block = createBlock("logic_compare", node.type);
            block.getField("OP").setValue("LTE");
            break;
        case '<':
            block = createBlock("logic_compare", node.type);
            block.getField("OP").setValue("LT");
            break;
        case '>=':
            block = createBlock("logic_compare", node.type);
            block.getField("OP").setValue("GTE");
            break;
        case '>':
            block = createBlock("logic_compare", node.type);
            block.getField("OP").setValue("GT");
            break;
    }
    var leftBlock = blockByExpression(node.left,false);
    var rightBlock = blockByExpression(node.right,false);
    combineIntoBlock(block, leftBlock);
    combineIntoBlock(block, rightBlock);
    return block;
}

function unaryExpressionBlock(node) {
    var block = createBlock('unary');
    var argBlock = blockByExpression(node.argument, false);
    combineIntoBlock(block, argBlock);
    switch (node.operator) {
        case '-':
            block.getField('OP').setValue('MINUS');
            break;
        case '+':
            block.getField('OP').setValue('PLUS');
            break;
        case '~':
            block.getField('OP').setValue('CHILDA');
            break;
        case '!':
            block.getField('OP').setValue('NOT');
            break;
        case 'typeof':
            block.getField('OP').setValue('TYPEOF');
            break;
        case 'void':
            block.getField('OP').setValue('VOID');
            break;
        case 'delete':
            block.getField('OP').setValue('DELETE');
            break;
        default:
            errorMessage("UnaryExpressionで定義されていないoperator : " + node.operator);
    }
    return block;
}

function updateExpressionBlock(node) {
    var block = createBlock("updateexpression");
    var arg = node.argument;
    createVariable(arg.name);
    var variable = workspace.getVariable(arg.name);
    block.getField("VAR").setValue(variable.getId());
    if(node.operator === '++'){
        block.getField('OPE').setValue('INC');
    }else{
        block.getField('OPE').setValue('DEC');
    }
    return block;
}
/**
 * msgの内容をエラーとして出力する
 * @param  {String} msg エラーメッセージ
 */
function errorMessage(msg) {
    alert(msg);
    console.error(msg);
}
/**
 * parentブロックの中にchildブロックを入れこませる
 * @param {Block} parent [入れられる側のブロック]
 * @param {Block} child [入れる側のブロック]
*/
function combineIntoBlock(parent, child) {
    if(parent === null || child === null) return;
    var index = getAkiIndex(parent.inputList);
    child.outputConnection.connect(parent.inputList[index].connection);
}

/**
 * inputListに接続する時，indexを指定できるようにしたもの
 * @param  {Blockly.BlockSvg} parent [description]
 * @param  {Blockly.BlockSvg} child  [description]
 * @param  {integer} index  inputListに指定するindex
 */
function combineStatementBlock(parent, child, index) {
    if(parent === null || child === null) return;
    child.previousConnection.connect(parent.inputList[index].connection);
}

/**
 * preが上に来るようにpostをつなげる
 * @param  {Blockly.BlockSvg} pre  上のブロック
 * @param  {Blockly.BlockSvg} post 下のブロック
 */
function combineNextBlock(pre, post) {
    if(pre === null || post === null) return;
    if(pre.nextConnection !== null){
        post.previousConnection.connect(pre.nextConnection);
    }else{
        errorMessage("combineNextBlockにて接続できない" + pre + "\n"+ post);
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

function searchBlock(name, list) {
    for(name1 of list){
        if(name1 === name){
            console.log(name);
            return createBlock(name);
        }
    }
    return null;
}

/**
 * nameがすでに宣言されているかチェックし、なければ新しく追加する
 * @param {String} name 変数名
*/
function createVariable(name) {
    if(workspace.variableIndexOf(name) == -1){
        workspace.createVariable(name);
    }
}

function isColor (color) {
    if(!isNaN(color)) return false;
    return color.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/) !== null;
}
/**
 * 指定されたnameから対応するブロックを生成する
 * @param  {String} name ブロック名
 * @return {Block}      ブロックを返す
 */
function createBlock(name){
    var block = new Blockly.BlockSvg(workspace, name);
    block.initSvg();
    block.render();
    return block;
}

function getRandomString(){
    // 生成する文字列の長さ
    var l = 8;

    // 生成する文字列に含める文字セット
    var c = "abcdefghijklmnopqrstuvwxyz0123456789";

    var cl = c.length;
    var r = "";
    for(var i=0; i<l; i++){
      r += c[Math.floor(Math.random()*cl)];
    }
    return r;
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
