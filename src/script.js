
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

var rangeId;
var workspaceOffset = workspace.getOriginOffsetInPixels();
function changeEvent(e) {
    var code = Blockly.p5js.workspaceToCode(workspace);
    var editor = getAceEditor();
    var cursorPosition = editor.getCursorPosition();
    editor.setValue(code,-1);
    editor.moveCursorToPosition(cursorPosition);
    // runCode();

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
 * 指定したブロックに対応するテキストをハイライト表示させる
 * @param {[type]} block [description]
 */
function addMarkerToBlock(block){
    var text = Blockly.p5js.blockToCode(block);
    if(typeof(text) === "object"){
        text = text[0];
    }else if(typeof(text) === "string"){
        text = text.split("\n")[0];

    }

    var editor = getAceEditor();
    var editSession = editor.getSession();
    var search = new Search();
    searchOption.needle = text;
    search.set(searchOption);
    var range = search.find(editSession);
    if(rangeId){
        editSession.removeMarker(rangeId);
    }
    if(range){
        rangeId = editSession.addMarker(range, "highlight_line", "text");
        // range = editSession.highlightLines(range.start.row, range.end.row-1, "highlight_line");
        // rangeId = range.id;
    }else{
        console.log("Not Found : " + text);
    }
}
// workspaceのリスナーへ登録を忘れずに
workspace.addChangeListener(changeEvent);

var Pjs;
var flag = false;
function run() {
    saveCode();
    // runCode();
    var codeText = getAceEditor().getValue();
    // try{
    //     var s = new Function("p", codeText);
    //     Pjs = new p5(s,"sketch");
    // }catch(e){
    //     // alert(e);
    // }
    eval(codeText);
}

document.getElementById("blocklyDiv").ondblclick = function (event) {
    var blockTextBox = document.getElementById("blockTextBox");
    if(blockTextBox.style.visibility == 'hidden'){
        blockTextBox.style.left = event.pageX + 'px';
        blockTextBox.style.top = event.pageY + 'px';
        blockTextBox.style.visibility = 'visible';
        blockTextBox.value = "";
        blockTextBox.focus();
    }else{
        blockTextBox.style.visibility = 'hidden';
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

var blockList = ["setup","size", "draw", "fill","background","ellipse","rect","stroke", "noFill","noStroke"];

var Search = require('ace/search').Search;
var Range = require('ace/range').Range;
var searchOption = {
    needle : "function",
    backwards : false,
    wrap : true,
    caseSensitive : false,
    wholeWord : false,
    range : null,
    regExp : false
};

document.getElementById("blockTextBox").onkeypress = function(e){
    var textBox = document.getElementById("blockTextBox");
    var clientRect = textBox.getBoundingClientRect();
    if ( e.keyCode === 13 ) {   //エンターキーが押されたとき
        var block = blockByCode(textBox.value);
        if(block === "error"){
            alert("SyntaxError : " + textBox.value);
            return;
        }
        // block.moveBy(clientRect.left - workspaceOffset.x, clientRect.top - workspaceOffset.y);
        block.moveBy(clientRect.left- 85, clientRect.top-25);  //TODO　マジックナンバー使用！要変更

        if(block.outputConnection !== null){
            var connectionDB = block.outputConnection.dbOpposite_;
            var closestConnection = connectionDB.searchForClosest(block.outputConnection, 2000, new goog.math.Coordinate(-block.width,0)).connection;
            if(closestConnection !== null && closestConnection.targetConnection === null){
                block.outputConnection.connect(closestConnection);
            }
        }else{
            const parentBlock = getSelectedBlock();
            if(parentBlock !== null && block.previousConnection !== null){
                // if(parentBlock.inputList[0].connection != null){

                if(parentBlock.inputList[0].connection != null && !parentBlock.inputList[0].connection.isConnected()){
                    block.previousConnection.connect(parentBlock.inputList[0].connection);
                }else if(parentBlock.nextConnection !== null){
                    block.previousConnection.connect(parentBlock.nextConnection);
                }
            }
        }

        textBox.style.visibility = "hidden";
    }
    if(e.keyCode === 108){
        // var allBlocks = workspace.getAllBlocks();
        // for(block of allBlocks){
        //     console.log(block);
        // }
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
    saveFile("./src/sketch.js", codeText);
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


const fs = require('fs');
const ipc = require('electron').ipcRenderer;
function loadScript(path, callback) {
    $('#sketchjs').remove();
    $('#sketchjs-container').append('<script id="sketchjs" src="sketch.js"></script>');
    callback();
}

readFile("./src/sketch.js");
function readFile(path) {
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
    // saveCode();
    $("#sketch").remove();
    $("#sketch-container").append('<div id="sketch" width="500" height="500"></div>');

    // $("#sketch").append('<canvas id="defaultCanvas0" style="width: 500px; height: 500px;" width="500" height="500"></canvas>');
    // $("#sketchjs").remove();
    // $("#sketchjs-container").append('<script id="sketchjs" src="sketch.js"></script>');
    // draw();

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
