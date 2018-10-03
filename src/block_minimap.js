let marginX = 0;
let marginY = 0;
const minimapRate = 0.1;
const minimapCanvas = document.getElementById("minimap_canvas");
const context = minimapCanvas.getContext("2d");
function drawMinimap(){
    context.clearRect(0, 0, minimapCanvas.width, minimapCanvas.height);
    const allBlocks = workspace.getAllBlocks(true);
    for(ablock of allBlocks){
        const x = ablock.getBoundingRectangle().topLeft.x;
        const y = ablock.getBoundingRectangle().topLeft.y;
        const w = ablock.getBoundingRectangle().bottomRight.x - x;
        const h = ablock.getBoundingRectangle().bottomRight.y - y;
        context.fillStyle = ablock.getColour();
        context.fillRect(x * minimapRate, y * minimapRate,
            w * minimapRate,h * minimapRate);
    }
}
/**
 * カーソルの位置座標をJSON形式で返す。
 * @return {[type]} [description]
 */
function getMousePosition(e){
    // キャンバスの左上端の座標を取得
    var offsetX = minimapCanvas.getBoundingClientRect().left;
    var offsetY = minimapCanvas.getBoundingClientRect().top;
    // マウスが押された座標を取得
    x = e.clientX - offsetX;
    y = e.clientY - offsetY;
    return {"x": x, "y":y};
}
let isDragging = false;
let startX = 0;
let startY = 0;
function onDown(e) {
    const pos = getMousePosition(e);
    startX = pos.x;
    startY = pos.y;
    isDragging = true;
}
function onMove(e){
    if(isDragging){
        const pos = getMousePosition(e);
        marginX = pos.x - startX;
        marginY = pos.y - startY;
        startX = pos.x;
        startY = pos.y;
        const topBlocks = workspace.getTopBlocks(true);
        for(topBlock of topBlocks){
            topBlock.moveBy(marginX * 3, marginY * 3);
        }
        drawMinimap();
    }
}
function onUp(){
    isDragging = false;
}
minimapCanvas.addEventListener('mousedown', onDown, false);
minimapCanvas.addEventListener('mouseup', onUp, false);
minimapCanvas.addEventListener("mousemove", onMove, false);
minimapCanvas.addEventListener("mouseout", onUp, false);
