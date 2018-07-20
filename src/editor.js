const esprima = require('esprima');
const estraverse = require('estraverse');
const prompt = require('electron-prompt');

var keyStack = [];  //入力数を保存する変数
const KEY_TIME = 1000;   //1000msだけキー入力を待つ

let varDict = {};

var currentWorkspace;

function setCurrentWorkspace(workspace){
    currentWorkspace = workspace;
}
Blockly.Names.equals = function(name1, name2) {
  return name1 == name2;
};

Blockly.Names.prototype.getName = function(name, type) {
  var normalized = name + '_' + type;
  var prefix = (type == Blockly.Variables.NAME_TYPE) ?
      this.variablePrefix_ : '';
  if (normalized in this.db_) {
    return prefix + this.db_[normalized];
  }
  var safeName = this.getDistinctName(name, type);
  this.db_[normalized] = safeName.substr(prefix.length);
  return safeName;
};


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

function blockByCode(code, workspace){
    setCurrentWorkspace(workspace);
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

var blockY = 0;
var blockX = 100;
var blockMargin = 30;

function codeToBlock() {
    setCurrentWorkspace(workspace);
    var editor = getAceEditor();
    var program = editor.getValue();
    try {
        var ast = esprima.parse(program, {loc: true});
        currentWorkspace.clear();
    } catch (e) {
        console.error("構文エラー");
        return;
    }

    let block = null;
    for (statement of ast.body) {
        var newBlock = blockByStatement(statement);
        if(newBlock === null) continue;
        if(block === null){
            block = newBlock;
            block.moveBy(blockX, blockY);
            blockY += block.height;
        }else{
            if(combineNextBlock(block, newBlock)){
                blockY += block.height;
            }else{
                newBlock.moveBy(blockX, blockY);
                blockY += block.height + blockMargin;
            }
            block = newBlock;
        }
    }

    blockY = 0;
}
function isExist(a) {
    return a !== undefined && a !== null;
}

var callFunctionNameList = ["fill","background","rect", "noStroke"];
var functionNameList = ["setup", "draw", 'mousePressed', 'mouseDragged',
                        'mouseClicked', 'mouseReleased'];

function blockByStatement(statement) {
    switch(statement.type){
        case 'BlockStatement':
            return blockStatementBlock(statement);
        case 'BreakStatement':
            return breakStatementBlock(statement);
        case 'ContinueStatement':
            return continueStatementBlock(statement);
        case 'ClassDeclaration':
            return classDeclarationBlock(statement);
        case 'ClassBody':
            return classBodyBlock(statement);
        case 'DoWhileStatement':
            return doWhileStatementBlock(statement);
        case 'EmptyStatement':
            console.log('EmptyStatementがありました');
            return null;
        case 'ExpressionStatement':
            return expressionStatementBlock(statement);
        case 'ForStatement':
            return forStatementBlock(statement);
        case 'ForInStatement':
            return forInStatementBlock(statement);
        case 'ForOfStatement':
            return forOfStatementBlock(statement);
        case 'FunctionDeclaration':
            return functionDeclarationBlock(statement);
        case 'IfStatement':
            return ifStatementBlock(statement);
        case 'MethodDefinition':
            return methodDefinitionBlock(statement);
        case 'ReturnStatement':
            return returnStatementBlock(statement);
        case 'SwitchCase':
            return switchCaseBlock(statement);
        case 'SwitchStatement':
            return switchStatementBlock(statement);
        case 'ThrowStatement':
            return throwStatementBlock(statement);
        case 'TryStatement':
            return tryStatementBlock(statement);
        case 'VariableDeclaration':
            return variableDeclarationBlock(statement);
        case 'VariableDeclarator':
            return variableDeclaratorBlock(statement);
        case 'WhileStatement':
            return whileStatementBlock(statement);
        default:
            errorMessage("blockByStatementでエラー。存在しないstatement=>" + statement.type, statement);
    }
}
/**
 * statement列からブロック列を生成しその先頭のブロックだけを返す。生成されたブロックは順番通りに連結されている。nullを返すおそれがある。
 * @param  {json} statement 命令列
 * @return {Blockly.BlockSvg} 生成されたブロック列の先頭ブロック
 */
function blockStatementBlock(statement) {
    return createSequenceBlock(statement.body);
}
/**
 * 連続するstatementを接続していき、先頭のブロックだけを返す
 * @param  {[statement]} statements 文の配列
 * @return {[type]}            [description]
 */
function createSequenceBlock(statements) {
    var firstBlock = null;
    var block = null;
    for(stm of statements){
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

/**
 * labelにも対応したブロックを生成し返す
 * @param  {[type]} statement [description]
 * @return {[type]}           [description]
 */
function breakStatementBlock(statement){
    let block = createBlock('break_statement');
    if(statement.label){
        let identifierBlock = blockByExpression(statement.label, false);
        combineIntoBlock(block, identifierBlock);
    }
    return block;
}

/**
 * labelにも対応したブロックを生成し返す
 * @param  {[type]} statement [description]
 * @return {[type]}           [description]
 */
function continueStatementBlock(statement){
    let block = createBlock('continue_statement');
    if(statement.label){
        let identifierBlock = blockByExpression(statement.label, false);
        combineIntoBlock(block, identifierBlock);
    }
    return block;
}

function classDeclarationBlock(statement){
    let block = createBlock('class_decl');
    if(statement.id){
        let nameBlock = blockByExpression(statement.id, false);
        combineIntoBlock(block, nameBlock, 0);
    }
    if(statement.superClass){
        let superBlock = blockByExpression(statement.superClass, false);
        combineIntoBlock(block, superBlock, 1);
    }
    let stmBlock = blockByStatement(statement.body);
    combineStatementBlock(block, stmBlock, 2);
    return block;
}

function classBodyBlock(statement){
    return createSequenceBlock(statement.body)
}
/**
 * computedがtrueの場合は考慮していません。
 * @param  {[type]} statement [description]
 * @return {[type]}           [description]
 */
function methodDefinitionBlock(statement){
    if(statement.computed){
        errorMessage('methodDefinitionBlockにおいて' +
                     'computedがtrueの場合が実装されていません', statement);
    }
    switch(statement.kind){
        case 'method':
            var block = createBlock('method');
            if(statement.key){
                let nameBlock = blockByExpression(statement.key, false);
                combineIntoBlock(block, nameBlock);
            }
            var functionExpression = statement.value;
            block.createValueInput(functionExpression.params.length);
            var i = 0;
            for(param of functionExpression.params){
                block.getField("PARAM" + i).setValue(param.name);
                i++;
            }
            var stmBlock = blockByStatement(functionExpression.body);
            combineStatementBlock(block, stmBlock, 2);
            if(statement.static) block.getField('NAME').setValue(true);
            return block;
        case 'constructor':
            var block = createBlock('constructor');
            var functionExpression = statement.value;
            block.createValueInput(functionExpression.params.length);
            var i = 0;
            for(param of functionExpression.params){
                block.getField("PARAM" + i).setValue(param.name);
                i++;
            }
            var stmBlock = blockByStatement(functionExpression.body);
            combineStatementBlock(block, stmBlock, 1);
            return block;
        case 'set':
        case 'get':
            var block = createBlock('getset_method');
            block.getField("KIND").setValue(statement.kind);
            if(statement.key){
                let nameBlock = blockByExpression(statement.key, false);
                combineIntoBlock(block, nameBlock);
            }
            var functionExpression = statement.value;
            block.createValueInput(functionExpression.params.length);
            var i = 0;
            for(param of functionExpression.params){
                block.getField("PARAM" + i).setValue(param.name);
                i++;
            }
            var stmBlock = blockByStatement(functionExpression.body);
            combineStatementBlock(block, stmBlock, 2);
            if(statement.static) block.getField('NAME').setValue(true);
            return block;
        default:
            errorMessage('methodDefinitionBlockにおいて,以下のkindは設定されていません: ' + statement.kind);
    }
}

/**
 * do-whileブロックを生成し返す
 * @param  {[type]} statement [description]
 * @return {[type]}           [description]
 */
function doWhileStatementBlock(statement){
    let block       = createBlock('do_while');
    let stmBlock    = blockByStatement(statement.body);
    let testBlock   = blockByExpression(statement.test, false);
    combineStatementBlock(block, stmBlock, 0);
    combineIntoBlock(block, testBlock);

    return block;
}

/**
 * なるべく自然に見せるためにかなり色々な手を入れています。
 * 具体的には、
 * 関数呼び出しの場合は無駄なexpressionを省いています。
 * また、関数定義でsetup()やdraw()を定義する時も省いています。
 * @param  {[type]} statement [description]
 * @return {[type]}           [description]
 */
function expressionStatementBlock(statement) {
    // if(statement.expression.type === 'CallExpression') return blockByExpression(statement.expression, true);
    var exprBlock = blockByExpression(statement.expression, true);
    if(functionNameList.indexOf(exprBlock.type) !== -1) return exprBlock;
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
        var block       = createBlock('for_decl');
        var initBlock   = blockByStatement(statement.init);
        var testBlock   = blockByExpression(statement.test);
        var updateBlock = blockByExpression(statement.update);
        var stmBlock    = blockByStatement(statement.body);
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

function forInStatementBlock(statement){
    let block       = createBlock('for_in');
    let leftBlock   = blockByExpression(statement.left, false);
    let rightBlock  = blockByExpression(statement.right, false);
    let stmBlock    = blockByStatement(statement. body);
    combineIntoBlock(block, leftBlock);
    combineIntoBlock(block, rightBlock);
    combineStatementBlock(block, stmBlock, 2);

    return block;
}

function forOfStatementBlock(statement){
    let block       = createBlock('for_of');
    let leftBlock   = blockByExpression(statement.left, false);
    let rightBlock  = blockByExpression(statement.right, false);
    let stmBlock    = blockByStatement(statement. body);
    combineIntoBlock(block, leftBlock);
    combineIntoBlock(block, rightBlock);
    combineStatementBlock(block, stmBlock, 2);

    return block;
}

/**
 * 関数定義のブロックを返す
 * @param  {JSON} statement
 * @return {Block}
 */
function functionDeclarationBlock(statement){
    const name      = statement.id.name;
    const params    = statement.params;
    if(functionNameList.indexOf(name) !== -1){
        let block       = createBlock(name);
        let stmBlock    = blockByStatement(statement.body);
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

function returnStatementBlock(statement){
    var block = createBlock('return_statement');
    if(statement.argument){
        var valueBlock = blockByExpression(statement.argument, false);
        combineIntoBlock(block, valueBlock);
    }
    return block;
}

function switchStatementBlock(statement){
    let block = createBlock('switch_block');
    let discriminantBlock = blockByExpression(statement.discriminant, false);
    let caseBlock = createSequenceBlock(statement.cases);
    combineIntoBlock(block, discriminantBlock);
    combineStatementBlock(block, caseBlock, 1);

    return block;
}
function switchCaseBlock(statement){
    let block;
    let stmBlock = createSequenceBlock(statement.consequent);
    if(statement.test){
        block = createBlock('case_block')
        let testBlock = blockByExpression(statement.test, false);
        combineIntoBlock(block, testBlock);
    }else{
        block = createBlock('default_block');
    }
    combineStatementBlock(block, stmBlock, 1);
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

function throwStatementBlock(statement){
    let block       = createBlock('throw_block');
    let exprBlock   = blockByExpression(statement.argument, false);
    combineIntoBlock(block, exprBlock);
    return block;
}

function tryStatementBlock(statement){
    let block       = createBlock('try_block');
    let stmBlock    = blockByStatement(statement.block);
    let lastBlock   = block;
    if(statement.handler){
        let catchBlock = catchClauseBlock(statement.handler);
        combineNextBlock(block, catchBlock);
        lastBlock = catchBlock;
    }
    if(statement.finalizer){
        let finalBlock      = createBlock('finally_block');
        let stmFinalBlock   = blockByStatement(statement.finalizer);
        combineStatementBlock(finalBlock, stmFinalBlock, 0);
        combineNextBlock(lastBlock, finalBlock);
    }
    combineStatementBlock(block, stmBlock, 0)
    return block;
}

function catchClauseBlock(statement){
    let block       = createBlock('catch_block');
    let paramBlock  = blockByExpression(statement.param, false);
    let stmBlock    = blockByStatement(statement.body);
    combineIntoBlock(block, paramBlock);
    combineStatementBlock(block, stmBlock, 1);
    return block;
}

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
        var variable = currentWorkspace.getVariable(name);
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
        case 'ConditionalExpression':
            return conditionalExpressionBlock(expression);
        case 'CallExpression':
        case 'NewExpression':
            return callExpressionBlock(expression, isStatement);
        case 'FunctionExpression':
            return functionExpressionBlock(expression);
        case 'Identifier':
            return identifierBlock(expression);
        case 'Literal':
            return literalBlock(expression);
        case 'LogicalExpression':
            return logicalExpressionBlock(expression);
        case 'MemberExpression':
            return memberExpressionBlock(expression);
        case 'ObjectExpression':
            return objectExpressionBlock(expression);
        case 'ThisExpression':
            return thisExpressionBlock(expression);
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
    if(functionNameList.indexOf(name) !== -1){
        let block = createBlock(name);
        let stmBlock = blockByStatement(node.right.body);
        if(name === 'setup' || name === 'draw')combineStatementBlock(block, stmBlock, 0);
        else combineStatementBlock(block, stmBlock, 0);
        return block;
    } else {
        var block = createBlock("assingment_expression");
        var leftBlock = blockByExpression(node.left, false);
        combineIntoBlock(block, leftBlock);
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

/**
 * 関数名を入れる場所が空いており、引数の数によって引数の入れる場所を設置する
 * @param  {[type]}  node        [description]
 * @param  {Boolean} isStatement 親がExpressionStatementだった場合はExpressionStatementブロックにかませずに文ブロックのまま返す
 * @return {[type]}              [description]
 */
function callExpressionBlock(node, isStatement){
    var block
    if(node.type === 'CallExpression')block = createBlock('return_function');
    else if(node.type === 'NewExpression') block = createBlock('new_expression');
    var nameBlock = blockByExpression(node.callee, isStatement);
    combineIntoBlock(block, nameBlock);
    block.createValueInput(node.arguments.length);
    for (argument of node.arguments) {
        var argBlock = blockByExpression(argument, false);
        var index = getAkiIndex(block.inputList);
        argBlock.outputConnection.connect(block.inputList[index].connection);
    }
    return block;
}

/**
 * 現在a = function b(){}のような関数に名前付きのプログラムはブロックに変換できない。
 * @param  {[type]} node [description]
 * @return {[type]}      [description]
 */
function functionExpressionBlock(node){
    const params = node.params;
    if(node.id !== null) errorMessage('functionExpressionBlock()において名前付きの関数はブロックに正しく変換することができません。');
    var block = createBlock('function_expression');
    block.createValueInput(params.length);
    let stmBlock = blockByStatement(node.body);
    let i = 0;
    for(param of params){
        block.getField("PARAM" + i).setValue(param.name);
        i++;
    }
    combineStatementBlock(block, stmBlock, 1);
    return block;
}

function identifierBlock(node) {
    switch(node.name){
        case 'test':
            return createBlock("test_expression");  //あとで取り除く！！！！！！！！！！
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
            var variable = currentWorkspace.getVariable(node.name);
            var block = new Blockly.BlockSvg(currentWorkspace, "variables_get");
            block.getField("VAR").setValue(variable.getId());
            block.initSvg();
            block.render();
            return block;
    }
}

function literalBlock(node) {
    if(node.value === null){
        return createBlock('null_block');
    }else if(node.raw === "true" || node.raw === "false"){
        var block = new Blockly.BlockSvg(currentWorkspace, "logic_boolean");
        block.initSvg();
        block.render();
        if(node.raw === "true"){
            block.inputList[0].fieldRow[0].setValue("TRUE");
        }else{
            block.inputList[0].fieldRow[0].setValue("FALSE");
        }
        return block;
    }else if(isColor(node.value)){
        var block = new Blockly.BlockSvg(currentWorkspace, "colour_picker");
        block.initSvg();
        block.render();
        block.inputList[0].fieldRow[0].setValue(node.value);
        return block;
    }else if(isNumber(node.value)){
        var block = new Blockly.BlockSvg(currentWorkspace, "math_number");
        block.initSvg();
        block.render();

        block.inputList[0].fieldRow[0].setValue(node.value);
        return block;
    }else if(isString(node.value)){
        var block = createBlock('text');
        block.getField('TEXT').setValue(node.value);
        return block;
    }
    else{
        errorMessage("literalBlockでエラー。該当しないLiteral=>" + node.value, node);
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

function objectExpressionBlock(node){
    let block = createBlock('object_block');
    let propertyBlock = null;
    for(let property of node.properties){
        let newPropertyBlock = createPropertyBlock(property);
        if(propertyBlock) combineNextBlock(propertyBlock, newPropertyBlock);
        else combineStatementBlock(block, newPropertyBlock, 0);
        propertyBlock = newPropertyBlock;
    }
    return block;
}

/**
 * ObjectExpressionのProperty専用の関数。propertyに応じてブロックを生成し返します。
 * shorthandがtrueの場合やkindがget,setに対応できていません。
 * @param  {[type]} property [description]
 * @return {[type]}          [description]
 */
function createPropertyBlock(property){
    if(property.shorthand) errorMessage('propertyBlockにおいてshorthandがtrueの場合が定義されていません。ごめんなさい');
    switch(property.kind){
        case 'init':
            let block = createBlock('property_block');
            let keyBlock = blockByExpression(property.key, false);
            let valueBlock = blockByExpression(property.value, false);
            combineIntoBlock(block, keyBlock);
            combineIntoBlock(block, valueBlock);
            return block;
        case 'get':
        case 'set':
        default:
            errorMessage('propertyBlockにおいてkind: ' + property.kind + 'は定義されていません。ごめんなさい');
    }
}

/**
 * x.a; x.func(); array[i]などのブロックを実装している
 * @param  {JSON} expression
 * @return {Block}
 */
function memberExpressionBlock(node, isCallExpression){
    var block;
    if(node.computed){
        block = createBlock("array_member");
        nameBlock = blockByExpression(node.object, false);
        indexBlock = blockByExpression(node.property, false);
        combineIntoBlock(block, nameBlock);
        combineIntoBlock(block, indexBlock);
    } else {
        block = createBlock('member_block');
        var leftBlock = blockByExpression(node.object, false);
        var rightBlock = blockByExpression(node.property, false);
        combineIntoBlock(block, leftBlock);
        combineIntoBlock(block, rightBlock);
    }
    return block;
}
//TODO: '==='と'!==の実装'
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
        case '===':
            block = createBlock("logic_compare", node.type);
            block.getField("OP").setValue("EQ");
            break;
        case '!=':
        case '!==':
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

function conditionalExpressionBlock(node){
    let block = createBlock('conditional_expression');
    let testBlock = blockByExpression(node.test);
    let consequentBlock = blockByExpression(node.consequent);
    let alternateBlock = blockByExpression(node.alternate);
    combineIntoBlock(block, testBlock);
    combineIntoBlock(block, consequentBlock);
    combineIntoBlock(block, alternateBlock);
    return block;
}

function thisExpressionBlock(){
    return createBlock('this_expression');
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
    var variable = currentWorkspace.getVariable(arg.name);
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
 *
 */
function errorMessage(msg, node) {
    let message = msg;
    if(node){
        const start = node.start;
        const end   = node.end;
        message += '\n場所は' + start.line + "行目" + start.column + "列目から" +
        end.line + "行目" + end.column + "列目までです";
    }
    alert(message);
    console.error(message);
}
/**
 * parentブロックの中にchildブロックを入れこませる
 * @param {Block} parent [入れられる側のブロック]
 * @param {Block} child [入れる側のブロック]
*/
function combineIntoBlock(parent, child, index) {
    if(parent === null || child === null) return;
    if(!index) index = getAkiIndex(parent.inputList);
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
    if(pre === null || post === null) return false;
    if(pre.nextConnection !== null && post.previousConnection !== null){
        post.previousConnection.connect(pre.nextConnection);
        return true;
    }
    return false;
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
    const allVariables = currentWorkspace.getAllVariables();
    for(const variable of allVariables){
        if(variable.name === name) return;
    }
    const newVariable = currentWorkspace.createVariable(name);
    varDict[newVariable.name] = newVariable.getId();
}

function isColor (color) {
    if(!isNaN(color)) return false;
    return color.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/) !== null;
}

function isNumber(obj){
    return typeof(obj) === 'number' || obj instanceof Number;
}
function isString(obj){
    return typeof(obj) == 'string' || obj instanceof String;
}

/**
 * 指定されたnameから対応するブロックを生成する
 * @param  {String} name ブロック名
 * @return {Block}      ブロックを返す
 */
function createBlock(name){
    var block = new Blockly.BlockSvg(currentWorkspace, name);
    block.initSvg();
    block.render();
    return block;
}

function getVariable(name){
    console.log(varDict);
    return currentWorkspace.getVariableById(varDict[name]);
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
