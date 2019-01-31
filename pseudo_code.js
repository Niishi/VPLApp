function codeToBlock(code){
    if(errorExists(code)){
        fixedCode = fix(code);
        codeToBlock(fixedCode);
    }else{
        ast = parseScript(program);  //構文解析
    }
  for(statement of ast.body){
    statementToBlock(statement);
  }
}

function statementToBlock(statement){
    block = createBlock(statement.type);
    for(property of statement.property){
        if(isExpression(property))
            combineBlock(block, expressionToBlock(property));
        else if(isStatement(property))
            combineBlock(block, statementToBlock(property));
        else if(isPhantomToken(property))
            continue;
        else
            changeBlock(block, property);
    }
    return block;
}

function expressionToBlock(expression){
    switch(expresion.type){

    }
}
