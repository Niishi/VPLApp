const esprima = require('esprima');
const estraverse = require('estraverse');
const prompt = require('electron-prompt');
var keyStack = [];
const KEY_TIME = 1000;
let varDict = {
};

function func1(e){
  if (e.lines[0].length == 1) {
    keyStack.push(1);
    setTimeout(function( ){
      keyStack.pop();
      if (keyStack.length == 0) {
        codeToBlock();
        keyStack = [];
      }
    }, KEY_TIME);
  }
}

function blockByCode(code){
  try{
    var ast = esprima.parse(code);
  }
  for(statement of ast.body){
    var block = blockByStatement(statement);
    if (block == null) {
      continue;
    }
    return block;
  }
  return null;
  catch(e){
    console.error('構文エラー');
    return 'error';
  }
}

var blockY = 0;
var blockX = 100;
var blockMargin = 30;

function codeToBlock(){
  var editor = getAceEditor();
  var program = editor.getValue();
  try{
    var ast = esprima.parse(program, {
      loc : true
    });
    workspace.clear();
  }
  let block = null;
  for(statement of ast.body){
    var newBlock = blockByStatement(statement);
    if (newBlock == null) {
      continue;
    }
    if (block == null) {
      block = newBlock;
      block.moveBy(blockX, blockY);
      blockY += block.height;
    } else {
      if (combineNextBlock(block, newBlock)) {
        blockY += block.height;
      } else {
        newBlock.moveBy(blockX, blockY);
        blockY += (block.height + blockMargin);
      }
      block = newBlock;
    }
  }
  blockY = 0;
  catch(e){
    console.error('構文エラー');
    return ;
  }
}

function isExist(a){
  return (a != undefined2 && a != null);
}

var callFunctionNameList = ['fill', 'background', 'rect', 'noStroke'];
var functionNameList = ['setup', 'draw', 'mousePressed', 'mouseDragged', 'mouseClicked', 'mouseReleased'];

function blockByStatement(statement){
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
      errorMessage(('blockByStatementでエラー。存在しないstatement=>' + statement.type), statement);
  }
}

function blockStatementBlock(statement){
  return createSequenceBlock(statement.body);
}

function createSequenceBlock(statements){
  var firstBlock = null;
  var block = null;
  for(stm of statements){
    if (block == null) {
      firstBlock = blockByStatement(stm);
      block = firstBlock;
    } else {
      var nextBlock = blockByStatement(stm);
      if (nextBlock != null) {
        combineNextBlock(block, nextBlock);
        block = nextBlock;
      }
    }
  }
  return firstBlock;
}

function breakStatementBlock(statement){
  let block = createBlock('break_statement');
  if (statement.label) {
    let identifierBlock = blockByExpression(statement.label, false);
    combineIntoBlock(block, identifierBlock);
  }
  return block;
}

function continueStatementBlock(statement){
  let block = createBlock('continue_statement');
  if (statement.label) {
    let identifierBlock = blockByExpression(statement.label, false);
    combineIntoBlock(block, identifierBlock);
  }
  return block;
}

function classDeclarationBlock(statement){
  let block = createBlock('class_decl');
  if (statement.id) {
    let nameBlock = blockByExpression(statement.id, false);
    combineIntoBlock(block, nameBlock, 0);
  }
  if (statement.superClass) {
    let superBlock = blockByExpression(statement.superClass, false);
    combineIntoBlock(block, superBlock, 1);
  }
  let stmBlock = blockByStatement(statement.body);
  combineStatementBlock(block, stmBlock, 2);
  return block;
}

function classBodyBlock(statement){
  return createSequenceBlock(statement.body);
}

function methodDefinitionBlock(statement){
  if (statement.computed) {
    errorMessage(('methodDefinitionBlockにおいて' + 'computedがtrueの場合が実装されていません'), statement);
  }
  switch(statement.kind){
    case 'method':
      var block = createBlock('method');
      if (statement.key) {
        let nameBlock = blockByExpression(statement.key, false);
        combineIntoBlock(block, nameBlock);
      }
      var functionExpression = statement.value;
      block.createValueInput(functionExpression.params.length);
      var i = 0;
      for(param of functionExpression.params){
        block.getField(('PARAM' + i)).setValue(param.name);
        (i++);
      }
      var stmBlock = blockByStatement(functionExpression.body);
      combineStatementBlock(block, stmBlock, 2);
      if (statement.static) {
        block.getField('NAME').setValue(true);
      }
      return block;
    case 'constructor':
      var block = createBlock('constructor');
      var functionExpression = statement.value;
      block.createValueInput(functionExpression.params.length);
      var i = 0;
      for(param of functionExpression.params){
        block.getField(('PARAM' + i)).setValue(param.name);
        (i++);
      }
      var stmBlock = blockByStatement(functionExpression.body);
      combineStatementBlock(block, stmBlock, 1);
      return block;
    case 'set':
    case 'get':
      var block = createBlock('getset_method');
      block.getField('KIND').setValue(statement.kind);
      if (statement.key) {
        let nameBlock = blockByExpression(statement.key, false);
        combineIntoBlock(block, nameBlock);
      }
      var functionExpression = statement.value;
      block.createValueInput(functionExpression.params.length);
      var i = 0;
      for(param of functionExpression.params){
        block.getField(('PARAM' + i)).setValue(param.name);
        (i++);
      }
      var stmBlock = blockByStatement(functionExpression.body);
      combineStatementBlock(block, stmBlock, 2);
      if (statement.static) {
        block.getField('NAME').setValue(true);
      }
      return block;
    default:
      errorMessage(('methodDefinitionBlockにおいて,以下のkindは設定されていません: ' + statement.kind));
  }
}

function doWhileStatementBlock(statement){
  let block = createBlock('do_while');
  let stmBlock = blockByStatement(statement.body);
  let testBlock = blockByExpression(statement.test, false);
  combineStatementBlock(block, stmBlock, 0);
  combineIntoBlock(block, testBlock);
  return block;
}

function expressionStatementBlock(statement){
  var exprBlock = blockByExpression(statement.expression, true);
  if (functionNameList.indexOf(exprBlock.type) != -1) {
    return exprBlock;
  }
  var block = createBlock('expression_statement');
  combineIntoBlock(block, exprBlock);
  return block;
}

function forStatementBlock(statement){
  if (statement.init.type == 'VariableDeclaration') {
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
  var initBlock = blockByExpression(statement.init);
  var testBlock = blockByExpression(statement.test);
  var updateBlock = blockByExpression(statement.update);
  var stmBlock = blockByStatement(statement.body);
  combineIntoBlock(block, initBlock);
  combineIntoBlock(block, testBlock);
  combineIntoBlock(block, updateBlock);
  combineStatementBlock(block, stmBlock, 3);
  return block;
}

function forInStatementBlock(statement){
  let block = createBlock('for_in');
  let leftBlock = blockByExpression(statement.left, false);
  let rightBlock = blockByExpression(statement.right, false);
  let stmBlock = blockByStatement(statement.body);
  combineIntoBlock(block, leftBlock);
  combineIntoBlock(block, rightBlock);
  combineStatementBlock(block, stmBlock, 2);
  return block;
}

function forOfStatementBlock(statement){
  let block = createBlock('for_of');
  let leftBlock = blockByExpression(statement.left, false);
  let rightBlock = blockByExpression(statement.right, false);
  let stmBlock = blockByStatement(statement.body);
  combineIntoBlock(block, leftBlock);
  combineIntoBlock(block, rightBlock);
  combineStatementBlock(block, stmBlock, 2);
  return block;
}

function functionDeclarationBlock(statement){
  const name = statement.id.name;
  const params = statement.params;
  if (functionNameList.indexOf(name) != -1) {
    let block = createBlock(name);
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
      block.getField(('PARAM' + i)).setValue(param.name);
      (i++);
    }
    combineStatementBlock(block, stmBlock, 1);
    return block;
  }
}

function ifStatementBlock(statement){
  var block;
  if (statement.alternate == null) {
    block = createBlock('controls_if');
  } else {
    block = createBlock('controls_ifelse');
  }
  var condBlock = blockByExpression(statement.test, false);
  combineIntoBlock(block, condBlock, 0);
  var stmBlock = blockByStatement(statement.consequent);
  combineStatementBlock(block, stmBlock, 1);
  if (statement.alternate != null) {
    stmBlock = blockByStatement(statement.alternate);
    combineStatementBlock(block, stmBlock, 2);
  }
  return block;
}

function returnStatementBlock(statement){
  var block = createBlock('return_statement');
  if (statement.argument) {
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
  if (statement.test) {
    block = createBlock('case_block');
    let testBlock = blockByExpression(statement.test, false);
    combineIntoBlock(block, testBlock);
  } else {
    block = createBlock('default_block');
  }
  combineStatementBlock(block, stmBlock, 1);
  return block;
}

function whileStatementBlock(statement){
  var block = createBlock('controls_whileUntil');
  var condBlock = blockByExpression(statement.test, false);
  combineIntoBlock(block, condBlock);
  var stmBlock = blockByStatement(statement.body);
  combineStatementBlock(block, stmBlock, 1);
  return block;
}

function throwStatementBlock(statement){
  let block = createBlock('throw_block');
  let exprBlock = blockByExpression(statement.argument, false);
  combineIntoBlock(block, exprBlock);
  return block;
}

function tryStatementBlock(statement){
  let block = createBlock('try_block');
  let stmBlock = blockByStatement(statement.block);
  let lastBlock = block;
  if (statement.handler) {
    let catchBlock = catchClauseBlock(statement.handler);
    combineNextBlock(block, catchBlock);
    lastBlock = catchBlock;
  }
  if (statement.finalizer) {
    let finalBlock = createBlock('finally_block');
    let stmFinalBlock = blockByStatement(statement.finalizer);
    combineStatementBlock(finalBlock, stmFinalBlock, 0);
    combineNextBlock(lastBlock, finalBlock);
  }
  combineStatementBlock(block, stmBlock, 0);
  return block;
}

function catchClauseBlock(statement){
  let block = createBlock('catch_block');
  let paramBlock = blockByExpression(statement.param, false);
  let stmBlock = blockByStatement(statement.body);
  combineIntoBlock(block, paramBlock);
  combineStatementBlock(block, stmBlock, 1);
  return block;
}

function variableDeclarationBlock(statement){
  var firstBlock = null;
  var block = null;
  const kind = statement.kind;
  for(declaration of statement.declarations){
    var nextBlock = variableDeclaratorBlock(declaration, kind);
    if (block == null && nextBlock != null) {
      firstBlock = nextBlock;
    } else {
      if (block != null && nextBlock != null) {
        combineNextBlock(block, nextBlock);
      }
    }
    block = nextBlock;
  }
  return firstBlock;
}

function variableDeclaratorBlock(statement, kind){
  if (statement.id.type == 'Identifier') {
    var name = statement.id.name;
    createVariable(name);
    var block = createBlock('var_decl');
    var variable = workspace.getVariable(name);
    block.getField('NAME').setValue(variable.getId());
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
        errorMessage(('variableDeclaratorBlockにおいて以下の変数の種類が定義できません: ' + kind));
    }
    if (statement.init != null) {
      var rightHandBlock = blockByExpression(statement.init, false);
      combineIntoBlock(block, rightHandBlock);
    }
    return block;
  } else {
    errorMessage(('VariableDeclaratorにおいて以下のタイプに対応していない : ' + statement.id.type));
  }
}

function blockByExpression(expression, isStatement){
  switch(expression.type){
    case 'ArrayExpression':
      return arrayExpressionBlock(expression);
    case 'AssignmentExpression':
      return assignmentExpressionBlock(expression);
    case 'BinaryExpression':
      return binaryExpressionBlock(expression);
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
      errorMessage(('blockByExpressionでエラー。該当しないExpression=>' + expression.type));
      return null;
  }
}
