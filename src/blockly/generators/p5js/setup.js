Blockly.p5js['setup'] = function(block) {
    var statements_setup_methods = Blockly.p5js.statementToCode(block, 'SETUP_METHODS');
    // TODO: Assemble p5js into code variable.
    var code = 'function setup(){\n';
    code += "    var canvas = createCanvas(500,500);\n";
    code += "    canvas.parent('sketch');\n";
    code += statements_setup_methods;
    code += "}\n";
    return code;
};

Blockly.p5js['draw'] = function(block) {
    var branch = Blockly.p5js.statementToCode(block, 'NAME');
    // TODO: Assemble p5js into code variable.
    var code = 'function draw(){\n' +
    branch +"}\n";
    return code;
};
