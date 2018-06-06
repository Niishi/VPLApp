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
    this.appendStatementInput("NAME")
    .appendField("mousePressed")
        .setCheck(null);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['mouseDragged'] = {
  init: function() {
    this.appendStatementInput("NAME")
    .appendField("mouseDragged")
        .setCheck(null);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['mouseReleased'] = {
  init: function() {
    this.appendStatementInput("NAME")
    .appendField("mouseReleased")
        .setCheck(null);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['mouseClicked'] = {
  init: function() {
    this.appendStatementInput("NAME")
    .appendField("mouseClicked")
        .setCheck(null);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
