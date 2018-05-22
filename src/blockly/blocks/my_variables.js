Blockly.Blocks['var_decl'] = {
    init: function() {
        this.appendValueInput("name")
            .setCheck(null)
            .appendField("変数定義")
            .appendField(new Blockly.FieldDropdown([["var","VAR"], ["const","CONST"], ["let","LET"]]), "KIND")
            .appendField(new Blockly.FieldVariable("item"), "NAME")
            .appendField("=");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(315);
        this.setTooltip("");
        this.setHelpUrl("");
    }
}
