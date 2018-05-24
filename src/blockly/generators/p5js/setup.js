Blockly.p5js['setup'] = function(block) {
    var statements_setup_methods = Blockly.p5js.statementToCode(block, 'SETUP_METHODS');
    var code = 'setup = function(){\n';
    // code += "    var canvas = createCanvas(710,400);\n";
    // code += "    canvas.parent('sketch');\n";
    code += statements_setup_methods;
    code += "}\n";
    return code;
};

Blockly.p5js['draw'] = function(block) {
    var branch = Blockly.p5js.statementToCode(block, 'NAME');
    var code = 'draw = function(){\n' +
    branch +"}\n";
    return code;
};
