var blockList = ["setup","size", "draw", "fill","background","ellipse","rect","stroke", "noFill","noStroke"];

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


var workspaceOffset = workspace.getOriginOffsetInPixels();
function changeEvent(e) {
    var code = Blockly.p5js.workspaceToCode(workspace);
    document.getElementById("outputArea").value = code;
    runCode();

    //ブロック生成時のイベントを設定
    if(e.type === Blockly.Events.CREATE){
        var selectBlock = workspace.getBlockById(e.blockId);
        // selectBlock.setShadow(true);
    }
    // topBlocks = workspace.getTopBlocks();
    // for (block of topBlocks) {
    // }
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
    for(blockName of blockList){
        if(textBox.value == blockName + "()"){
            var block = new Blockly.BlockSvg(workspace, blockName);
            block.moveBy(clientRect.left - workspaceOffset.x, clientRect.top - workspaceOffset.y);
            block.initSvg();
            block.render();
            const parentBlock = getSelectedBlock();
            if(parentBlock !== null && block.previousConnection !== null){
                if(parentBlock.inputList[0].connection != null){
                    block.previousConnection.connect(parentBlock.inputList[0].connection);
                }else if(parentBlock.nextConnection !== null){
                    block.previousConnection.connect(parentBlock.nextConnection);
                }
            }
            textBox.style.visibility = "hidden";
        }
    }
}

document.getElementById("blockTextBox").onkeypress = function(e){
    var textBox = document.getElementById("blockTextBox");
    var clientRect = textBox.getBoundingClientRect();
    if ( e.keyCode === 13 ) {
        var block = calc(textBox.value);
        block.moveBy(clientRect.left - workspaceOffset.x, clientRect.top - workspaceOffset.y);
        block.initSvg();
        block.render();

        var xy = block.getRelativeToSurfaceXY();
        var connectionDB = block.outputConnection.dbOpposite_;
        var closestConnection = connectionDB.searchForClosest(block.outputConnection, 3000, new goog.math.Coordinate(0,0)).connection;
        if(closestConnection !== null && closestConnection.targetConnection === null){
            block.outputConnection.connect(closestConnection);
        }
        textBox.style.visibility = "hidden";
    }
    if(e.keyCode === 108){
        var allBlocks = workspace.getAllBlocks();
        for(block of allBlocks){
            console.log(block);
        }
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

function runCode() {
    window.sketchCode = document.getElementById("outputArea").value;
    runSketch();
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
