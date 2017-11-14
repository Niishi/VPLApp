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
var connectionDB = new Blockly.ConnectionDB();

function changeEvent(e) {
    var code = Blockly.p5js.workspaceToCode(workspace);
    document.getElementById("outputArea").value = code;
    //   run();
    // if(e.type === Blockly.Events.CREATE){
    //     const selectBlock = workspace.getBlockById(e.blockId);
    //     selectBlock.setColour("#6DC16B");
    //     selectBlock.setShadow(false);
    // }
    topBlocks = workspace.getTopBlocks();
    for (block of topBlocks) {
        // block.setShadow(true);
    }
    // for (var block in topBlocks) {
    //     if (topBlocks.hasOwnProperty(block)) {
    //         topBlocks[block].moveBy(1000,1000);
    //     }
    // }

}
// workspaceのリスナーへ登録を忘れずに
workspace.addChangeListener(changeEvent);

var Pjs;

function run() {
    saveCode();
    // location.reload();
    loadScript("./src/sketch.js", function() {
        console.log('script loaded');
    });
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

document.getElementById("blockTextBox").oninput = function(event) {
    var textBox = document.getElementById("blockTextBox");
    var clientRect = textBox.getBoundingClientRect();
    if(textBox.value == "setup()"){
        var block = new Blockly.BlockSvg(workspace, "setup");
        block.moveBy(clientRect.left, clientRect.top);
        block.initSvg();
        block.render();
        textBox.style.visibility = "hidden";
    }else if(textBox.value == "draw()"){
        var block = new Blockly.BlockSvg(workspace, "draw");
        block.moveBy(clientRect.left, clientRect.top);
        block.initSvg();
        block.render();
        textBox.style.visibility = "hidden";
    }else if(textBox.value == "background()"){
        var block = new Blockly.BlockSvg(workspace, "background");
        var parentBlock = getSelectedBlock();
        block.initSvg();
        block.render();
        if(parentBlock == null){
            block.moveBy(clientRect.left, clientRect.top);
        }else{
            block.previousConnection.connect(parentBlock.inputList[0].connection);
        }
        textBox.style.visibility = "hidden";
    }else if(textBox.value == "stroke()"){
        var block = new Blockly.BlockSvg(workspace, "void_stroke");
        block.moveBy(clientRect.left, clientRect.top);
        block.initSvg();
        block.render();
        textBox.style.visibility = "hidden";
        console.log(block);
    }
}
document.getElementById("blockTextBox").onkeypress = function(e){
    var textBox = document.getElementById("blockTextBox");
    var clientRect = textBox.getBoundingClientRect();
    console.log(connectionDB);
    if ( e.keyCode === 13 ) {
        var block = new Blockly.BlockSvg(workspace, "math_number");
        block.moveBy(clientRect.left, clientRect.top);
        block.initSvg();
        block.render();

        var xy = block.getRelativeToSurfaceXY();
        var closestConnection = connectionDB.searchForClosest(block.outputConnection, 3000, block.getRelativeToSurfaceXY()).connection;
        console.log(connectionDB.searchForClosest(block.outputConnection, 3000, block.getRelativeToSurfaceXY()));
        if(closestConnection !== null){
            block.outputConnection.connect(closestConnection);
        }else{
            console.log("connection is null");
        }
        textBox.style.visibility = "hidden";
    }
}

function getSelectedBlock() {
    return Blockly.selected;
}

function saveCode() {
    var codeText = document.getElementById("outputArea").value;
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
    $('head').append('<script id="sketchjs" src="sketch.js"></script>');
    callback();
}

readFile("./src/sketch.js");

function readFile(path) {
    fs.readFile(path, function(error, text) {
        if (error != null) {
            alert("error : " + error);
            return;
        }
        document.getElementById("outputArea").value = text;
    });
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
