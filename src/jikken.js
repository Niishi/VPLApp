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
