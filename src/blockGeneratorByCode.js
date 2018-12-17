const esprima    = require('esprima');
const estraverse = require('estraverse');
const prompt     = require('electron-prompt');
const peg        = require("pegjs");

let tokens = [];    //構文解析した後のトークンが入る
var currentWorkspace;
let bCursorPosition = {row:0, column:0};

function createFunctionTuple(name, argLengthList){
    return {"name": name, "argLengthList": argLengthList};
}
var callFunctionNameList = [createFunctionTuple("fill",[3]),
                            createFunctionTuple("background",[1, 3]),
                            createFunctionTuple("ellipse", [4]),
                            createFunctionTuple("rect", [4]),
                            createFunctionTuple("noStroke",[0])];

function setCurrentWorkspace(workspace){
    currentWorkspace = workspace;
}

/**
 * コードを与えてそれがJavaScriptの構文に沿っているかどうか判定する関数
 * @param  {string}  code 正しいかどうか判断したいJavaScript
 * @return {Boolean}      JavaScriptの仕様に沿っているコードならtrueを返す
 */
function isValidCode(code){
    try {
        esprima.parse(code);
        return true;
    } catch(e){
        return false;
    }
}

function createTokensWithWhiteSpace(tokens){
    let result = [];
    for(let i = 0; i < tokens.length - 1; i++){
        token = tokens[i];
        nextToken = tokens[i + 1];
        let l1 = token.loc.start.line;
        let l2 = nextToken.loc.start.line;
        let c1 = token.loc.end.column;
        let c2 = nextToken.loc.end.column;

        let w = "";
        let start = 0;
        let end = token.range[0];
        if(i == 0){
            for(let j = 0; j < end; j++) w += ' ';
            result.push(createToken("WhiteSpace", w, [start, end]));
            result.push(tokens[0]);
        }
        start   = token.range[1];
        end     = nextToken.range[0];
        w = "";
        const l = l2 - l1;
        for(let j = 0; j < l; j++){
            w += "\n";
        }
        for(let j = start; j < end - l; j++){
            w += " ";
        }
        result.push(createToken("WhiteSpace", w, [start, end]));
        result.push(nextToken);

    }
    return result;
}

function createToken(type, value, range){
    return {"type": type, "value": value, "range":range};
}

function createCodeByTokens(tokens){
    let result = "";
    for(token of tokens){
        result += token.value;
    }
    return result;
}

/**
 * 与えられたStatement内にあるトークンを空白トークンも含めて返す
 * @param  {[type]} statement [description]
 * @return {[type]}           [description]
 */
function getTokensOfStatement(statement){
    let result      = [];
    const START     = statement.range[0];
    const END       = statement.range[1];
    let isFirst     = true;
    for(var i = 0; i < tokens.length; i++){
        const token = tokens[i];
        if(token.range && START <= token.range[0] && token.range[1] <= END){
            if(isFirst){
                if(i > 0 && tokens[i-1].type === "WhiteSpace") result.push(tokens[i-1]);
                isFirst = false;
            }
            result.push(token);
        }
    }
    return result;
}

function getWhiteSpaceTokens(tokens){
    let result = [];
    for(token of tokens){
        if(token.type === "WhiteSpace") result.push(token);
    }
    return result;
}

/**
 * PEGjsのparserを生成して返す
 * @return {[type]} [description]
 */
function createParser(){
    return peg.generate(fs.readFileSync("./pegjs_test/error_correction2.pegjs").toString());
}
const parser = createParser();
/**
 * PEGjsを用いて構文エラーのあるコードを書き換えて補完する
 * @return {string}       補完されたコード
 */
function trimError() {
    const program = getAceEditor().getValue();
    fixCode = parser.parse(program);
    return fixCode;
}

/**
 * 文字列を指定した位置に挿入する。
 * @param  {string} str    挿入前の文字列
 * @param  {number} index  挿入位置
 * @param  {string} insert 挿入るする文字列
 * @return {string}        挿入した後の文字列
 */
function insertStr(str, index, insert) {
    return str.slice(0, index) + insert + str.slice(index, str.length);
}

function blockByCode(code, workspace, count=0){
    if(count > 1){
        console.log("blockByCode()が1回以上呼ばれたので、これ以上の再帰呼び出しをやめます。");
        return "error";
    }
    if(count === 0){
        const editor = getAceEditor();
        bCursorPosition = editor.getCursorPosition();
    }
    setCurrentWorkspace(workspace);
    try {
         //オプションのtolerantをtrueにすることである程度の構文エラーに耐えられる
        var ast = esprima.parseScript(code, { tolerant: true, tokens: true,range:true, loc:true });
        tokens = createTokensWithWhiteSpace(ast.tokens);
    } catch (e) {
        let fixCode = parser.parse(code);
        return blockByCode(fixCode, workspace, count+1);
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
let firstProgram1 = "";
function codeToBlock(program, count=0) {
    if (count > 2) {
        console.log("codeToBlock()が2回以上呼ばれたので、これ以上の再帰呼び出しをやめます。");
        const editor = getAceEditor();
        editor.setValue(firstProgram1,-1);
        editor.moveCursorToPosition(bCursorPosition);
        return;
    }
    if(!program) program = getAceEditor().getValue();
    if(count === 0) {
        firstProgram1 = program;
        const editor = getAceEditor();
        bCursorPosition = editor.getCursorPosition();
    }
    setCurrentWorkspace(workspace);
    try {
        const options = {
            loc: true,
            range: true,
            tokens: true,
            comment: true,
            tolerant: false
        };
        var ast = esprima.parseScript(program, options);
        tokens = createTokensWithWhiteSpace(ast.tokens);
        currentWorkspace.clear();
    } catch (e) {
        const fixCode = trimError();
        codeToBlock(fixCode, count+1);
        return;
    }
    let preBlock = null;
    for (statement of ast.body) {
        var newBlock = blockByStatement(statement);
        if(newBlock === null) continue;
        if(preBlock === null){
            preBlock = newBlock;
            preBlock.moveBy(blockX, blockY);
            blockY += preBlock.height;
        }else{
            if(combineNextBlock(preBlock, newBlock)){
                blockY += preBlock.height;
            }else{
                blockY += preBlock.height + blockMargin;
                newBlock.moveBy(blockX, blockY);
            }
            preBlock = newBlock;
        }
    }

    blockY = 0;
}
function isExist(a) {
    return a !== undefined && a !== null;
}


var functionNameList = ["setup", "draw", 'mousePressed', 'mouseDragged',
                        'mouseClicked', 'mouseReleased'];

function blockByStatement(statement) {
    let firstCommentBlock = null;
    let lastCommentBlock = null;
    if(statement.comments){
        for(leadingComment of statement.comments){
            let block = createLeadingCommentBlock(leadingComment);
            if(!firstBlock){
                firstBlock = block;
                lastBlock = block;
            }else{
                combineNextBlock(lastBlock, block);
                lastBlock = block;
            }
        }
    }
    let block = null;

    switch(statement.type){
        case 'BlockStatement':
            block = blockStatementBlock(statement);
            break;
        case 'BreakStatement':
            block = breakStatementBlock(statement);
            break;
        case 'ContinueStatement':
            block = continueStatementBlock(statement);
            break;
        case 'ClassDeclaration':
            block = classDeclarationBlock(statement);
            break;
        case 'ClassBody':
            block = classBodyBlock(statement);
            break;
        case 'DoWhileStatement':
            block = doWhileStatementBlock(statement);
            break;
        case 'EmptyStatement':
            block = emptyStatementBlock(statement);
            break;
        case 'ExpressionStatement':
            block = expressionStatementBlock(statement);
            break;
        case 'ForStatement':
            block = forStatementBlock(statement);
            break;
        case 'ForInStatement':
            block = forInStatementBlock(statement);
            break;
        case 'ForOfStatement':
            block = forOfStatementBlock(statement);
            break;
        case 'FunctionDeclaration':
            block = functionDeclarationBlock(statement);
            break;
        case 'IfStatement':
            block = ifStatementBlock(statement);
            break;
        case 'MethodDefinition':
            block = methodDefinitionBlock(statement);
            break;
        case 'ReturnStatement':
            block = returnStatementBlock(statement);
            break;
        case 'SwitchCase':
            block = switchCaseBlock(statement);
            break;
        case 'SwitchStatement':
            block = switchStatementBlock(statement);
            break;
        case 'ThrowStatement':
            block = throwStatementBlock(statement);
            break;
        case 'TryStatement':
            block = tryStatementBlock(statement);
            break;
        case 'VariableDeclaration':
            block = variableDeclarationBlock(statement);
            break;
        case 'VariableDeclarator':
            block = variableDeclaratorBlock(statement);
            break;
        case 'WhileStatement':
            block = whileStatementBlock(statement);
            break;
        default:
            errorMessage("blockByStatementでエラー。存在しないstatement=>" +
                statement.type, statement);
    }
    if(lastCommentBlock) combineNextBlock(lastCommentBlock, block);
    if(firstCommentBlock) return firstCommentBlock;
    else return block;
}

function createLeadingCommentBlock(comment){
    const block = createBlock("leading_comment_block");
    block.getField("comment").setValue(comment.value);
    return block;
}
/**
 * statement列からブロック列を生成しその先頭のブロックだけを返す。
 * 生成されたブロックは順番通りに連結されている。nullを返すおそれがある。
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
 *
 * @param  {[type]} statement [description]
 * @return {[type]}           [description]
 */
function emptyStatementBlock(statement){
    let block = createBlock('expression_statement');
    if(statement.comments) block.setCode(statement.comments[0].value);
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
    const whitespaces = getWhiteSpaceTokens(getTokensOfStatement(statement));
    console.log(whitespaces);
    if(statement.expression.type === 'CallExpression' && statement.expression.callee.name === "_error"){
        let block = createBlock('expression_statement');
        block.setCode(statement.expression.arguments[0].value + "\n");
        return block;
    }
    var exprBlock = blockByExpression(statement.expression, true);
    if(functionNameList.indexOf(exprBlock.type) !== -1) return exprBlock;
    if(statement.expression.type === 'CallExpression' ||
        statement.expression.type === 'AssignmentExpression'){
            exprBlock.whitespaces = whitespaces;
        return exprBlock;
    }
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
        combineStatementBlock(block, initBlock, 0);
        if(statement.test){
            var testBlock   = blockByExpression(statement.test);
            combineIntoBlock(block, testBlock, 1);
        }
        if(statement.update){
            var updateBlock = blockByExpression(statement.update);
            combineIntoBlock(block, updateBlock,2);
        }
        var stmBlock    = blockByStatement(statement.body);
        combineStatementBlock(block, stmBlock, 3);
        return block;
    }
    var block       = createBlock('my_for');
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
    const whitespaceTokens = getWhiteSpaceTokens(getTokensOfStatement(statement));
    var block;
    if(statement.alternate === null){   //else文がない場合
        block = createBlock("controls_if");
    }else{  //else文がある場合
        block = createBlock("controls_ifelse");
    }
    var condBlock = blockByExpression(statement.test, false);   //条件式のブロック作成
    combineIntoBlock(block, condBlock, 0);
    var stmBlock = blockByStatement(statement.consequent);  //if文内のブロック作成
    combineStatementBlock(block, stmBlock, 1);
    if(statement.alternate !== null){   //else文がある場合
        stmBlock = blockByStatement(statement.alternate);   //else文内のブロック作成
        combineStatementBlock(block, stmBlock, 2);
    }
    block.whitespaces = whitespaceTokens;
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
    const whitespaceTokens = getWhiteSpaceTokens(getTokensOfStatement(statement));
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
            return assignmentExpressionBlock(expression, isStatement);
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

function assignmentExpressionBlock(node, isStatement) {
    let block;
    const name = node.left.name;
    if(functionNameList.indexOf(name) !== -1){
        block = createBlock(name);
        let stmBlock = blockByStatement(node.right.body);
        if(name === 'setup' || name === 'draw')combineStatementBlock(block, stmBlock, 0);
        else combineStatementBlock(block, stmBlock, 0);
        return block;
    } else {
        if(isStatement) block = createBlock('assingment_expression_statement');
        else block = createBlock("assingment_expression");
        const leftBlock = blockByExpression(node.left, false);
        combineIntoBlock(block, leftBlock, 0);
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
        combineIntoBlock(block, rightHandBlock,1);

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
    //ブロックとして事前に登録されている関数の場合、それに対応するブロックを取得する
    let block = searchBlock(node.callee.name, node.arguments.length, callFunctionNameList);
    if(!block){ //事前に登録されていないブロックであれば、関数ブロックを作成する
        if(isStatement && node.type === 'CallExpression') block = createBlock('no_return_function');
        else if(node.type === 'CallExpression')block = createBlock('return_function');
        else if(node.type === 'NewExpression') block = createBlock('new_expression');
        var nameBlock = blockByExpression(node.callee, isStatement);    //関数名のブロックを取得
        combineIntoBlock(block, nameBlock);
        block.createValueInput(node.arguments.length);
    }
    let index = getAkiIndex(block.inputList);
    for (argument of node.arguments) {  //引数の数だけ
        var argBlock = blockByExpression(argument, false);  //引数ブロックを作成
        combineIntoBlock(block, argBlock, index);
        index++;
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
        case '_':
            return null;
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
        console.log(block);
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
    combineIntoBlock(block, leftBlock,0);
    combineIntoBlock(block, rightBlock,1);

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
    combineIntoBlock(block, leftBlock, 0);
    combineIntoBlock(block, rightBlock, 1);
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

function searchBlock(name, argLength, functionList) {
    for(obj of functionList){
        if(name == obj.name && obj.argLengthList.indexOf(argLength) >= 0){
            console.log(name + '_' + argLength);
            return createBlock(name + '_' + argLength);
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
