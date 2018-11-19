const {BrowserWindow, dialog} = require('electron').remote;
const fs = require('fs');
const ipc = require('electron').ipcRenderer;
var Search = require('ace/search').Search;
var Range = require('ace/range').Range;
let currentFilePath = "";
var blocklyDiv = document.getElementById("blocklyDiv");
var workspace = Blockly.inject(blocklyDiv, {
    toolbox: document.getElementById('toolbox'),
    grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true
    },
    trashcan: true
});

var hiddenBlocklyDiv = document.getElementById('hiddenBlocklyDiv');
var hiddenWorkspace = Blockly.inject(hiddenBlocklyDiv, {
    grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true
    }
});

var rangeIds = [];
var workspaceOffset = workspace.getOriginOffsetInPixels();
function changeEvent(e) {
    var code = Blockly.p5js.workspaceToCode(workspace);
    var editor = getAceEditor();
    var cursorPosition = editor.getCursorPosition();
    editor.$blockScrolling = Infinity;
    editor.setValue(code,-1);
    editor.moveCursorToPosition(cursorPosition);
    // runCode();
    drawMinimap();
    run();

    //ブロック生成時のイベントを設定
    if(e.type === Blockly.Events.CREATE){
        var selectBlock = workspace.getBlockById(e.blockId);
        addMarkerToBlock(selectBlock);
        run();
    }else if(e.type === Blockly.Events.MOVE){
        var block = workspace.getBlockById(e.blockId);
        addMarkerToBlock(block);
        run();
    }else if(e.type === Blockly.Events.CHANGE){
        var block = workspace.getBlockById(e.blockId);
        addMarkerToBlock(block);
        run();
    }else{
        var block = workspace.getBlockById(e.blockId);
        addMarkerToBlock(block);
    }

}

/**
 * 指定したブロックに対応するテキスト型のコードを返す
 * @param  {[type]} block 指定したブロック
 * @return {[type]} テキストを返す
 */
function getText(block){
    let text = Blockly.p5js.blockToCode(block);
    if(typeof(text) === 'object'){
        text = text[0];
    }else if(typeof(text) === 'string'){
        text = text.split("\n")[0];
    }
    return text;
}
/**
 * 指定したブロックに対応するテキストをハイライト表示させる
 * @param {[type]} block [description]
 */
function addMarkerToBlock(block){
    var text = getText(block);
    var editor = getAceEditor();
    var editSession = editor.getSession();
    var search = new Search();
    searchOption.needle = text;
    searchOption.wholeWord = true;
    search.set(searchOption);
    const ranges = search.findAll(editSession);
    for(rangeId of rangeIds){
        editSession.removeMarker(rangeId);
    }
    rangeIds = [];
    const allBlocks = workspace.getAllBlocks(true);
    let count = 0;
    for(ablock of allBlocks){
        atext = getText(ablock);
        if(block === ablock) break;
        if(atext === text) count++;
    }
    if(ranges.length > 0){
        rangeId = editSession.addMarker(ranges[count], "highlight_line", "text");
        rangeIds.push(rangeId);
    }
}
// workspaceのリスナーへ登録を忘れずに
workspace.addChangeListener(changeEvent);

var Pjs;
var flag = false;
function run() {
    saveCode();
    var codeText = getAceEditor().getValue();
    eval(codeText);
    setup();
}

function getPropertyValue(elementName, propertyName){
    const element = document.getElementById(elementName);
    const cssStyle = getComputedStyle(element, null);
    return cssStyle.getPropertyValue(propertyName);
}


document.getElementById("blocklyDiv").ondblclick = function (event) {
    if(getPropertyValue("blockTextBox", "visibility") === 'hidden'){
        blockTextBox.style.left = (event.pageX+30) + 'px';
        blockTextBox.style.top = (event.pageY+130) + 'px';
        blockTextBox.style.visibility = 'visible';
        blockTextBox.value = "";
        blockTextBox.focus();
    }else{
        blockTextBox.style.visibility = 'hidden';
    }

    //周りの背景にぼかしを入れる
    var blocklyDiv = document.getElementById("blocklyDiv");
    blocklyDiv.style.filter = "blur(4px)";

    if(getPropertyValue("hiddenBlocklyDiv", "visibility") === 'hidden'){
        hiddenBlocklyDiv.style.left = (event.pageX-250) + 'px';
        hiddenBlocklyDiv.style.top =  (event.pageY-250) + 'px';
        hiddenBlocklyDiv.style.visibility = 'visible';
        hiddenBlocklyDiv.style.width = 500 + 'px';
        hiddenBlocklyDiv.style.height = 500 + 'px';
    }
}

//このままだとテキストエディタに入力しているときもイベントが発火してしまう
document.onkeydown  = function (e) {
    var selectedBlock = getSelectedBlock();
    if(selectedBlock !== null){
        if (e.keyCode == '38') {
            // up arrow
            var prevConn = selectedBlock.previousConnection;
            if(prevConn !== null && prevConn.isConnected()){

                var prevBlock = prevConn.targetBlock();

                var prevprevConn = prevBlock.previousConnection;
                var nextConn = selectedBlock.nextConnection;
                prevConn.disconnect();
                if(prevprevConn !== null && prevprevConn.isConnected()){
                    var prevprevBlock = prevprevConn.targetBlock();
                    prevprevConn.disconnect();
                    prevConn.connect(prevprevBlock.nextConnection);
                }
                if(nextConn !== null && nextConn.isConnected()){
                    var nextBlock = nextConn.targetBlock();
                    nextConn.disconnect();
                    nextBlock.previousConnection.connect(prevBlock.nextConnection);
                }
                prevBlock.previousConnection.connect(selectedBlock.nextConnection);
                // prevprevConn.connect(nextConn);
            }
        }
        else if (e.keyCode == '40') {
            // down arrow
            var nextConn = selectedBlock.nextConnection;
            if(nextConn !== null && nextConn.isConnected()){

                var nextBlock = nextConn.targetBlock();

                var nextnextConn = nextBlock.nextConnection;
                var prevConn = selectedBlock.previousConnection;
                nextConn.disconnect();
                if(nextnextConn !== null && nextnextConn.isConnected()){
                    var nextnextBlock = nextnextConn.targetBlock();
                    nextnextConn.disconnect();
                    nextnextBlock.previousConnection.connect(nextConn);
                }
                if(prevConn !== null && prevConn.isConnected()){
                    var prevBlock = prevConn.targetBlock();
                    prevConn.disconnect();
                    nextBlock.previousConnection.connect(prevBlock.nextConnection);
                }
                prevConn.connect(nextnextConn);
                // prevprevConn.connect(nextConn);
            }
        }
        else if (e.keyCode == '37') {
           // left arrow
        }
        else if (e.keyCode == '39') {
           // right arrow
        }
    }
}


var searchOption = {
    needle : "function",
    backwards : false,
    wrap : true,
    caseSensitive : false,
    wholeWord : false,
    range : null,
    regExp : false
};

function completion(e){
    if(event.shiftKey){
        switch (e.keyCode) {
            case 50:
                return '"';
            case 39:
                return "'";
            case 56:    //'('
                return ')';
            case 219:   //'{'
                return '}';
            default:
                return null;
        }
    }
    switch(e.keyCode){
        case 56:
            return ']';
    }
}

function insertTextBox(textBox, word){
    let sentence = textBox.value;
    const len = sentence.length;
    const pos = textBox.selectionStart;

    const before = sentence.substr(0, pos);
    const after  = sentence.substr(pos, len);

    sentence = before + word + after;

    textBox.value = sentence;
    textBox.setSelectionRange(pos, pos);
}

let block = null;
document.getElementById("blockTextBox").onkeyup = function(e){
    let textBox = document.getElementById("blockTextBox");

    const c = completion(e);    //'('や""などの補完作業を行う
    if(c) insertTextBox(textBox, c);
    let clientRect = textBox.getBoundingClientRect();
    let code = textBox.value;
    let newBlock = blockByCode(code, hiddenWorkspace);
    if(newBlock === 'error'){   //構文エラーが起こった場合にブロックの提案を行う
        console.log("オワオワリ");
    }else if(newBlock !== null) {
        newBlock.moveBy(50, 100);
        if(block) block.dispose();
        block = newBlock;
    }
    if(e.keyCode === 13){   //エンターキーが押されたとき
        if(block){
            hiddenWorkspace.clear();
            let newBlock = blockByCode(textBox.value, workspace);
            const x = parseInt(getPropertyValue("hiddenBlocklyDiv", "left"),10) + 50;
            const y = parseInt(getPropertyValue("hiddenBlocklyDiv", "top"),10) + 100;
            newBlock.moveBy(x,y);
            textBox.style.visibility = "hidden";
            hiddenBlocklyDiv.style.visibility = "hidden";
            var blocklyDiv = document.getElementById("blocklyDiv");
            blocklyDiv.style.filter = "";
        }
    }
    if(e.keyCode === 108){
        console.log(getSelectedBlock());
    }

}
/**
 * 現在選択中のブロックを返す
 * @return {Blockly.BlockSvg} 選択ちゅうのブロック
 */
function getSelectedBlock() {
    return Blockly.selected;
}

function saveCode() {
    var codeText = getAceEditor().getValue();
    // saveFile("./src/sketch.js", codeText);
    saveFile(currentFilePath, codeText);
}

/**
 * ファイルを書き込む
 */
function saveFile(path, data) {
    fs.writeFile(path, data, function(error) {
        if (error != null) {
            alert('error : ' + error);
            return;
        }
    });
}



/**
 * ファイルを開きます。
 */
function openLoadFile() {
  const win = BrowserWindow.getFocusedWindow();

  dialog.showOpenDialog(
    win,
    // どんなダイアログを出すかを指定するプロパティ
    {
      properties: ['openFile'],
      filters: [
        {
          name: 'Documents',
          extensions: ['js']
        }
      ]
    },
    // [ファイル選択]ダイアログが閉じられた後のコールバック関数
    (fileNames) => {
      if (fileNames) {
          console.log(fileNames[0]);
        readFile(fileNames[0]);
      }
    });
}


// function loadScript(path, callback) {
//     $('#sketchjs').remove();
//     $('#sketchjs-container').append('<script id="sketchjs" src="sketch.js"></script>');
//     callback();
// }

readFile("./src/sketch.js");
function readFile(path) {
    currentFilePath = path;
    fs.readFile(path, function(error, buffer) {
        if (error != null) {
            alert("error : " + error);
            return;
        }
        var editor = getAceEditor();
        var text = buffer.toString('utf-8',0,buffer.length);    //Bufferのままではaceのエディタに設定できないので文字列に変換している
        editor.setValue(text,-1);
        editor.blur();
        codeToBlock();
    });
}
function getAceEditor() {
    return ace.edit("input_txt");
}

function runCode() {
    $("#sketch").remove();
    $("#sketch-container").append('<div id="sketch" width="500" height="500"></div>');
}

function setBlobUrl(id, content) {

    // 指定されたデータを保持するBlobを作成する。
    var blob = new Blob([content], {
        "type": "text/js"
    });

    // Aタグのhref属性にBlobオブジェクトを設定し、リンクを生成
    window.URL = window.URL || window.webkitURL;
    $("#" + id).attr("href", window.URL.createObjectURL(blob));
    $("#" + id).attr("download", "tmp.js");
}
