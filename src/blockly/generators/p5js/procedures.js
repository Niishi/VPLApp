/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating p5js for procedure blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.p5js.procedures');

goog.require('Blockly.p5js');


Blockly.p5js['procedures_defreturn'] = function(block) {
  // Define a procedure with a return value.
  var funcName = Blockly.p5js.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var branch = Blockly.p5js.statementToCode(block, 'STACK');
  if (Blockly.p5js.STATEMENT_PREFIX) {
    branch = Blockly.p5js.prefixLines(
        Blockly.p5js.STATEMENT_PREFIX.replace(/%1/g,
        '\'' + block.id + '\''), Blockly.p5js.INDENT) + branch;
  }
  if (Blockly.p5js.INFINITE_LOOP_TRAP) {
    branch = Blockly.p5js.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + block.id + '\'') + branch;
  }
  var returnValue = Blockly.p5js.valueToCode(block, 'RETURN',
      Blockly.p5js.ORDER_NONE) || '';
  if (returnValue) {
    returnValue = '  return ' + returnValue + ';\n';
  }
  var args = [];
  for (var i = 0; i < block.arguments_.length; i++) {
    args[i] = Blockly.p5js.variableDB_.getName(block.arguments_[i],
        Blockly.Variables.NAME_TYPE);
  }
  var code = 'function ' + funcName + '(' + args.join(', ') + ') {\n' +
      branch + returnValue + '}';
  code = Blockly.p5js.scrub_(block, code);
  // Add % so as not to collide with helper functions in definitions list.
  Blockly.p5js.definitions_['%' + funcName] = code;
  return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Blockly.p5js['procedures_defnoreturn'] =
    Blockly.p5js['procedures_defreturn'];

Blockly.p5js['procedures_callreturn'] = function(block) {
  // Call a procedure with a return value.
  var funcName = Blockly.p5js.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var i = 0; i < block.arguments_.length; i++) {
    args[i] = Blockly.p5js.valueToCode(block, 'ARG' + i,
        Blockly.p5js.ORDER_COMMA) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.p5js.ORDER_FUNCTION_CALL];
};

Blockly.p5js['procedures_callnoreturn'] = function(block) {
  // Call a procedure with no return value.
  var funcName = Blockly.p5js.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var i = 0; i < block.arguments_.length; i++) {
    args[i] = Blockly.p5js.valueToCode(block, 'ARG' + i,
        Blockly.p5js.ORDER_COMMA) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ');\n';
  return code;
};

Blockly.p5js['procedures_ifreturn'] = function(block) {
  // Conditionally return value from a procedure.
  var condition = Blockly.p5js.valueToCode(block, 'CONDITION',
      Blockly.p5js.ORDER_NONE) || 'false';
  var code = 'if (' + condition + ') {\n';
  if (block.hasReturnValue_) {
    var value = Blockly.p5js.valueToCode(block, 'VALUE',
        Blockly.p5js.ORDER_NONE) || 'null';
    code += '  return ' + value + ';\n';
  } else {
    code += '  return;\n';
  }
  code += '}\n';
  return code;
};
