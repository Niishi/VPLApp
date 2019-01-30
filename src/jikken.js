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
// function fibo(n){
//     if(n == 0 || n == 1) return n;
//     else return fibo(n-2) + fibo(n-1);
// }
// let time_ntimes_and_sets = function(f, n, sets){
//     let iter = function(i, i_s, t, res, log){
//         if(i < n){
//             f(20);
//             iter(i + 1, i_s, t, res, log);
//         }else if(i_s < sets - 1){
//             recent_t = performance.now();
//             elapsed_time = recent_t - t;
//             log.push(elapsed_time);
//             iter(0, i_s + 1, recent_t, res, log);
//         }else{
//             recent_t = performance.now();
//             elapsed_time = (recent_t - t);
//             log.push(elapsed_time);
//             for(time of log){
//                 console.log(time);
//             }
//         }
//     }
//     t = performance.now();
//     a = [];
//     iter(0, 0, t, 0, a);
// }
// function timeMeasurement(){
//     console.log("start");
//     mytime();
//     console.log("-------------------");
//     time_ntimes_and_sets(fibo, 50, 20);
// }
//
// function mytime(){
//     for(i = 0; i < 20; i++){
//         startTime = performance.now();
//         for(j = 0; j < 50; j++){
//             fibo(20);
//         }
//         endTime = performance.now();
//         console.log(endTime - startTime);
//     }
// }
