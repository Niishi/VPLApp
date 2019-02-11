function collapseAllBlock(){
    const leafBlocks = getAllLeafBlock();
    for(leafBlock of leafBlocks){
        let parentBlock = leafBlock.getSurroundParent();
        // if(parentBlock) parentBlock.setCollapsed(true);
        if(parentBlock) parentBlock.setColour("#ff0000");
    }
}

function collapseBlock(parent, level = 0){
    while(block !== null){
        block = block.getNextBlock();
    }
}

function collapseBlock(block, level, goal = 0){
    if(level === goal){
        block.setCollapsed(true);
    }else{
        const children = block.getChildren();
        for(child of children){
            collapseBlock(child, level + 1);
        }
    }
}

function getAllLeafBlock(){
    const allBlocks = workspace.getAllBlocks(true);
    let leafBlocks = [];
    for(ablock of allBlocks){
        if(ablock.getChildren().length === 0) leafBlocks.push(ablock);
        console.log("parent");
        console.log(ablock);
        console.log("children");
        console.log(ablock.inputList);
    }
    return leafBlocks;
}

function expandAllBlock(){
    const allBlocks = workspace.getAllBlocks(true);
    for(ablock of allBlocks){
        if(ablock.myCollapse) ablock.setCollapsed(false);
    }
}

function resetup(){
    setup();
}

function sum(a){
    let result = 0;
    for(aa of a) result += aa;
    return result;
}
function timeMeasurement(){
    const N = 10;
    const I = 10;
    let code = "=;";
    const aveTimes = [];
    for(i = 0; i < 5; i++){
        let times = [];
        //最初の1回目は計測に時間がかかるので除外する
        for(count = 0; count < N + 1; count++){
            startTime = performance.now();
            parser.parse(code);
            endTime = performance.now();
            if(count > 0) times.push(roundFloat(endTime - startTime, 3));
        }
        aveTime = roundFloat(sum(times) / N, 3);
        console.log(pow(I, i) + " : " + aveTime + "ms(" + N + "回の平均)");
        aveTimes.push(aveTime);
        let addCode = code;
        for(j = 0; j < I; j++) code += addCode;
    }
    console.log(aveTimes.join(","));
}
function generateBlock(){

}
