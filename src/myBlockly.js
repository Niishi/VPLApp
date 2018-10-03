Blockly.Names.equals = function(name1, name2) {
  return name1 == name2;
};

Blockly.Names.prototype.getName = function(name, type) {
  var normalized = name + '_' + type;
  var prefix = (type == Blockly.Variables.NAME_TYPE) ?
      this.variablePrefix_ : '';
  if (normalized in this.db_) {
    return prefix + this.db_[normalized];
  }
  var safeName = this.getDistinctName(name, type);
  this.db_[normalized] = safeName.substr(prefix.length);
  return safeName;
};

Blockly.prompt = function (a,b,c){
    return showModalDialogElement().then((text) =>{return c(text);});
};

Blockly.Block.prototype.setCollapsed = function(collapsed){
    if(this.collapsed === collapsed) return;

    var renderList = [];
    // Show/hide the inputs.
    for (var i = 0, input; input = this.inputList[i]; i++) {
        renderList.push.apply(renderList, input.setVisible(!collapsed));
    }


    if(collapsed){
        let icons = this.getIcons();
        for (let icon of icons) {
          icon.setVisible(false);
        }
        const text = getText(this);
        this.appendDummyInput("myCollapse").appendField(new Blockly.FieldTextInput(text), "COLLAPSED_TEXT").init();
    } else {
      this.removeInput("myCollapse");
      // Clear any warnings inherited from enclosed blocks.
      this.setWarningText(null);
    }
    this.collapsed_ = collapsed;
    if (!renderList.length) {
      // No child blocks, just render this block.
      renderList[0] = this;
    }
    if (this.rendered) {
      for (var i = 0, block; block = renderList[i]; i++) {
        block.render();
      }
      // Don't bump neighbours.
      // Although bumping neighbours would make sense, users often collapse
      // all their functions and store them next to each other.  Expanding and
      // bumping causes all their definitions to go out of alignment.
    }
};

Blockly.Block.prototype.myCollapse = function(collapsed){
    if(this.collapsed === collapsed) return;

    var renderList = [];
    // Show/hide the inputs.
    for (var i = 0, input; input = this.inputList[i]; i++) {
        renderList.push.apply(renderList, input.setVisible(!collapsed));
    }

    if(collapsed){
        let icons = this.getIcons();
        for (let icon of icons) {
          icon.setVisible(false);
        }
        const text = getText(this);
        this.appendDummyInput("myCollapse").appendField(new Blockly.FieldTextInput(text), "COLLAPSED_TEXT").init();
    } else {
      this.removeInput("myCollapse");
      // Clear any warnings inherited from enclosed blocks.
      this.setWarningText(null);
    }
    if (!renderList.length) {
      // No child blocks, just render this block.
      renderList[0] = this;
    }
    if (this.rendered) {
      for (var i = 0, block; block = renderList[i]; i++) {
        block.render();
      }
      // Don't bump neighbours.
      // Although bumping neighbours would make sense, users often collapse
      // all their functions and store them next to each other.  Expanding and
      // bumping causes all their definitions to go out of alignment.
    }
};
