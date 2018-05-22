Blockly.Blocks['array_block'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("配列：");
        this.appendValueInput("value0")
            .setCheck(null)
            .appendField("[0]");
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setColour(100);
        this.setTooltip("");
        this.setHelpUrl("");
        this.argLength = 1;
    },
    createValueInput: function(count) {
        for(var i = 0; i < count; i++){
            var input = this.appendValueInput('value' + (i+1))
                .appendField("[" + (i+1) + "]")
                .setAlign(Blockly.ALIGN_RIGHT);
            input.init();
            this.argLength++;
        }
    }
};

Blockly.Blocks['array_member'] = {
  init: function() {
    this.appendValueInput("name")
        .setCheck(null);
    this.appendDummyInput()
        .appendField("の");
    this.appendValueInput("index")
        .setCheck(null);
    this.appendDummyInput()
        .appendField("番目");
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
