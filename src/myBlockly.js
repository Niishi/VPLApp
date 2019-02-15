Blockly.p5js['logic_operation'] = function(block) {
  // Operations 'and', 'or'.
  var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
  var order = (operator == '&&') ? Blockly.p5js.ORDER_LOGICAL_AND :
      Blockly.p5js.ORDER_LOGICAL_OR;
  var argument0 = Blockly.p5js.valueToCode(block, 'A', order);
  var argument1 = Blockly.p5js.valueToCode(block, 'B', order);
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, Blockly.p5js.ATOMIC];
};

Blockly.p5js['controls_if'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var code = '', branchCode, conditionCode;
  do {
    conditionCode = Blockly.p5js.valueToCode(block, 'IF' + n,
      Blockly.p5js.ORDER_NONE);
    branchCode = Blockly.p5js.statementToCode(block, 'DO' + n);
    code += (n > 0 ? ' else ' : '') +
        'if (' + conditionCode + ') {\n' + branchCode + '}';

    ++n;
  } while (block.getInput('IF' + n));

  if (block.getInput('ELSE')) {
    branchCode = Blockly.p5js.statementToCode(block, 'ELSE');
    code += ' else {\n' + branchCode + '}';
  }
  return code + '\n';
};

Blockly.p5js['math_arithmetic'] = function(block) {
  // Basic arithmetic operators, and power.
  var OPERATORS = {
    'ADD': [' + ', Blockly.p5js.ORDER_ADDITION],
    'MINUS': [' - ', Blockly.p5js.ORDER_SUBTRACTION],
    'MULTIPLY': [' * ', Blockly.p5js.ORDER_MULTIPLICATION],
    'DIVIDE': [' / ', Blockly.p5js.ORDER_DIVISION],
    'POWER': [null, Blockly.p5js.ORDER_COMMA]  // Handle power separately.
  };
  var tuple = OPERATORS[block.getFieldValue('OP')];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.p5js.valueToCode(block, 'A', order);
  var argument1 = Blockly.p5js.valueToCode(block, 'B', order);
  var code;
  // Power in p5js requires a special case since it has no operator.
  if (!operator) {
    code = 'Math.pow(' + argument0 + ', ' + argument1 + ')';
    return [code, Blockly.p5js.ORDER_FUNCTION_CALL];
  }
  code = argument0 + operator + argument1;
  return [code, Blockly.p5js.ORDER_ATOMIC];
};

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

Blockly.Generator.prototype.valueToCode = function(block, name, outerOrder) {
    const emptyCode = '';
    if (isNaN(outerOrder)) {
        goog.asserts.fail('Expecting valid order from block "%s".', block.type);
    }
    var targetBlock = block.getInputTargetBlock(name);
    if (!targetBlock) {
        return emptyCode;
    }
    var tuple = this.blockToCode(targetBlock);
    if (tuple === emptyCode) {
        // Disabled block.
        return emptyCode;
    }
    // Value blocks must return code and order of operations info.
    // Statement blocks must only return code.
    goog.asserts.assertArray(tuple, 'Expecting tuple from value block "%s".',
      targetBlock.type);
    var code = tuple[0];
    var innerOrder = tuple[1];
    if (isNaN(innerOrder)) {
        goog.asserts.fail('Expecting valid order from value block "%s".',
            targetBlock.type);
    }
    if (!code) {
        return emptyCode;
    }

    // Add parentheses if needed.
    var parensNeeded = false;
    var outerOrderClass = Math.floor(outerOrder);
    var innerOrderClass = Math.floor(innerOrder);
    if (outerOrderClass <= innerOrderClass) {
        if (outerOrderClass == innerOrderClass &&
            (outerOrderClass == 0 || outerOrderClass == 99)) {
                // Don't generate parens around NONE-NONE and ATOMIC-ATOMIC pairs.
                // 0 is the atomic order, 99 is the none order.  No parentheses needed.
                // In all known languages multiple such code blocks are not order
                // sensitive.  In fact in Python ('a' 'b') 'c' would fail.
        } else {
            // The operators outside this code are stronger than the operators
            // inside this code.  To prevent the code from being pulled apart,
            // wrap the code in parentheses.
            parensNeeded = true;
            // Check for special exceptions.
            for (var i = 0; i < this.ORDER_OVERRIDES.length; i++) {
                if (this.ORDER_OVERRIDES[i][0] == outerOrder &&
                    this.ORDER_OVERRIDES[i][1] == innerOrder) {
                        parensNeeded = false;
                        break;
                }
            }
        }
    }
    if (parensNeeded) {
        // Technically, this should be handled on a language-by-language basis.
        // However all known (sane) languages use parentheses for grouping.
        code = '(' + code + ')';
    }
    return code;
};
