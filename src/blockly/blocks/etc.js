Blockly.Blocks['expression_statement'] = {
    init: function() {
        this.appendValueInput("EXPR")
        .setCheck(null);
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(300);
        this.setTooltip("");
        this.setHelpUrl("");
    },
    setCode(code){
        this.code = code;
    }
};

Blockly.Blocks['unary'] = {
    init: function() {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField(new Blockly.FieldDropdown([["-","MINUS"], ["+","PLUS"], ["~","CHILDA"], ["!","NOT"], ["delete","DELETE"], ["typeof","TYPEOF"], ["void","VOID"]]), "OP");
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setColour(45);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['constants'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["TWO_PI","TWO_PI"], ["PI","PI"], ["HALF_PI","HALF_PI"], ["QUARTER_PI","QUARTER_PI"], ["TAU","TAU"], ["DEGREES","DEGREES"], ["RADIANDS","RADIANS"]]), "CONST");
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setColour(210);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['conditional_expression'] = {
    init: function() {
        this.appendValueInput("test")
            .setCheck(null)
            .appendField("条件");
        this.appendValueInput("consequent")
            .setCheck(null)
            .appendField("が正の時");
        this.appendValueInput("alternate")
            .setCheck(null)
            .appendField("が負の時");
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setColour(180);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['assingment_expression'] = {
    init: function() {
        this.appendValueInput("LEFT")
            .setCheck(null);
        this.appendValueInput("VAL")
            .setCheck(null)
            .appendField(new Blockly.FieldDropdown([["=","EQ"], ["+=","ADD"], ["-=","SUB"], ["*=","MULT"], ["/=","DIVISION"], ["%=","AMARI"], ["**=","BEKI"]]), "OP");
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setColour(315);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['assingment_expression_statement'] = {
    init: function() {
        this.appendValueInput("LEFT")
            .setCheck(null);
        this.appendValueInput("VAL")
            .setCheck(null)
            .appendField(new Blockly.FieldDropdown([["=","EQ"], ["+=","ADD"], ["-=","SUB"], ["*=","MULT"], ["/=","DIVISION"], ["%=","AMARI"], ["**=","BEKI"]]), "OP");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(315);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['member_block'] = {
    init: function() {
        this.appendValueInput("LEFT")
            .setCheck(null);
        this.appendValueInput("RIGHT")
            .setCheck(null)
            .appendField(".");
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setColour(270);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['this_expression'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("this");
        this.setInputsInline(false);
        this.setOutput(true,null);
        this.setColour(0);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['return_statement'] = {
    init: function() {
        this.appendValueInput("VALUE")
            .setCheck(null)
            .appendField("return");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(0);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['break_statement'] = {
    init: function() {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("break");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(0);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['continue_statement'] = {
    init: function() {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("continue");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(0);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['null_block'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("null");
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setColour(0);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

// Blockly.Blocks['test_expression'] = {
//     init: function() {
//         this.appendDummyInput()
//             .appendField(new Blockly.FieldTextInput("default"), "NAME");
//         this.setOutput(true, null);
//         this.setColour(230);
//         this.setTooltip("");
//         this.setHelpUrl("");
//     }
// };
//
// TEST_MUTATOR_MIXIN = {
//
//   /**
//    * Create XML to represent the number of else-if and else inputs.
//    * @return {Element} XML storage element.
//    * @this Blockly.Block
//    */
//   mutationToDom: function() {
//       var container = document.createElement('mutation');
//       return container;
//   },
//   /**
//    * Parse XML to restore the else-if and else inputs.
//    * @param {!Element} xmlElement XML storage element.
//    * @this Blockly.Block
//    */
//   domToMutation: function(xmlElement) {
//   },
//   /**
//    * Populate the mutator's dialog with this block's components.
//    * @param {!Blockly.Workspace} workspace Mutator's workspace.
//    * @return {!Blockly.Block} Root block in mutator.
//    * @this Blockly.Block
//    */
//   decompose: function(workspace) {
//       return workspace.newBlock('test_expression');
//   },
//   /**
//    * Reconfigure this block based on the mutator dialog's components.
//    * @param {!Blockly.Block} containerBlock Root block in mutator.
//    * @this Blockly.Block
//    */
//   compose: function(containerBlock) {
//
//   },
//   saveConnections: function(containerBlock) {
//
//   },
//   updateShape_: function() {
//   }
// };
//
// Blockly.Extensions.registerMutator('test_mutator',
//     TEST_MUTATOR_MIXIN, null,
//     ["test_expression"]);
//
// TEST_TOOLTIP_EXTENSION = function() {
//   this.setTooltip(function() {
//     return '';
//   }.bind(this));
// };
//
// Blockly.Extensions.register('test_tooltip',
//     TEST_TOOLTIP_EXTENSION);
//
// Blockly.defineBlocksWithJsonArray([
//     {
//         "type": "test_expression",
//         "message0": "%1",
//         "args0": [
//         {
//           "type": "field_input",
//           "name": "NAME",
//           "text": "default"
//         }
//         ],
//         "output": null,
//         "colour": 230,
//         "tooltip": "",
//         "helpUrl": "",
//         "mutator": "test_mutator",
//         "extensions": ["test_tooltip"]
//     }
// ]);
