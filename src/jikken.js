function collapseAllBlock(){

    // const topBlocks = workspace.getTopBlocks(true);
    // for(topBlock of topBlocks){
    //
    // }
    const leafBlocks = getAllLeafBlock();
    for(leafBlock of leafBlocks){
        let parentBlock = leafBlock.getSurroundParent();
        // if(parentBlock) parentBlock.setCollapsed(true);
        if(parentBlock) parentBlock.setColour("#ff0000");
    }
}

function collapseBlock(parent, level = 0){

    // let block = parent.nextConnection === null ? parent.getChildren()[0];
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


const minimapRate = 0.1;
function drawMinimap(){
    const minimapCanvas = document.getElementById("minimap_canvas");
    const context = minimapCanvas.getContext("2d");
    context.clearRect(0,0,minimapCanvas.width,minimapCanvas.height);
    const allBlocks = workspace.getAllBlocks(true);
    for(ablock of allBlocks){
        console.log(ablock);
        
        const x = ablock.getBoundingRectangle().topLeft.x;
        const y = ablock.getBoundingRectangle().topLeft.y;
        const w = ablock.getBoundingRectangle().bottomRight.x - x;
        const h = ablock.getBoundingRectangle().bottomRight.y - y;
        context.fillStyle = ablock.getColour();
        context.fillRect(x*minimapRate,y*minimapRate,w*minimapRate,h*minimapRate);
    }
}
