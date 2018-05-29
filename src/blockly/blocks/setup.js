Blockly.Blocks['setup'] = {
    init: function() {
        this.appendStatementInput("SETUP_METHODS")
            .setCheck(null)
            .appendField("setup");
        this.setColour(0);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['draw'] = {
  init: function() {
    this.appendStatementInput("NAME")
        .setCheck(null)
        .appendField("draw");
    this.setInputsInline(true);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['mousePressed'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("mousePressed");
    this.appendStatementInput("NAME")
        .setCheck(null);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['mouseDragged'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("mouseDragged");
    this.appendStatementInput("NAME")
        .setCheck(null);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['mouseReleased'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("mouseReleased");
    this.appendStatementInput("NAME")
        .setCheck(null);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['mouseClicked'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("mouseClicked");
    this.appendStatementInput("NAME")
        .setCheck(null);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
