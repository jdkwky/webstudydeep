window.onload = function() {
    // draw click begin
    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),
        FONT_HEIGHT = 15,
        MARGIN = 35,
        HAND_TRUNCATION = canvas.width / 25,
        HOUR_HAND_TRUNCATION = canvas.width / 10,
        NUMERAL_SPACING = 20,
        RADIUS = canvas.width / 2 - MARGIN,
        HAND_RADIUS = RADIUS + NUMERAL_SPACING;
    function drawCircle() {
        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 2, RADIUS, 0, Math.PI * 2, true);
        context.stroke();
    }

    function drawNumerals() {
        var numerals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            angle = 0,
            numeralWidth = 0;
        numerals.forEach(function(numeral) {
            angle = (Math.PI / 6) * (numeral - 3);
            numeralWidth = context.measureText(numeral).width;
            context.fillText(
                numeral,
                canvas.width / 2 + Math.cos(angle) * HAND_RADIUS - numeralWidth / 2,
                canvas.height / 2 + Math.sin(angle) * HAND_RADIUS + FONT_HEIGHT / 3
            );
        });
    }
    function drawCenter() {
        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 2, 5, 0, Math.PI * 2, true);
        context.fill();
    }
    function drawHand(loc, isHour) {
        var angle = Math.pi * 2 * (loc / 60) - Math.PI / 2,
            handRadius = isHour ? RADIUS - HAND_TRUNCATION - HOUR_HAND_TRUNCATION : RADIUS - HAND_TRUNCATION;
        context.moveTo(canvas.width / 2, canvas.height / 2);
        context.lineTo(
            canvas.width / 2 + Math.cos(angle) * handRadius,
            canvas.height / 2 + Math.sin(angle) * handRadius
        );
        context.stroke();
    }
    function drawHands() {
        var date = new Date(),
            hour = date.getHours();
        hour = hour > 12 ? hour - 12 : hour;
        drawHand(hour * 5 + (date.getMinutes() / 60) * 5, true, 0.5);
        drawHand(date.getMinutes(), false, 0.5);
        drawHand(date.getSeconds(), false, 0.2);
    }
    function drawClock() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawCircle();
        drawCenter();
        drawHands();
        drawNumerals();
    }

    context.font = FONT_HEIGHT + 'px Arial';
    // loop = setInterval(drawClock, 1000);
    // end draw click

    // start rect
    function drawRect() {
        context.lineJoin = 'round';
        context.lineWidth = 1;
        // 描边
        context.strokeStyle = 'red';
        // 填充
        context.fillStyle = 'green';
        // 线性渐变
        var gradient = context.createLinearGradient(150, 0, 150, 220); // 两点之间的线性变化 颜色
        gradient.addColorStop(0, 'blue');
        gradient.addColorStop(0.25, 'white');
        gradient.addColorStop(0.5, 'purple');
        gradient.addColorStop(0.75, 'red');
        gradient.addColorStop(1, 'yellow');
        // 放射渐变
        var gradient2 = context.createRadialGradient(150, 0, 50, 150, 220, 50);
        gradient2.addColorStop(0, 'blue');
        gradient2.addColorStop(0.25, 'white');
        gradient2.addColorStop(0.5, 'purple');
        gradient2.addColorStop(0.75, 'red');
        gradient2.addColorStop(1, 'yellow');

        // shadow
        context.shadowColor = 'rgba(0,0,0,.7)';
        (context.shadowOffsetX = 2), (context.shadowOffsetY = 2);
        context.shadowBlur = 10;

        context.strokeRect(100, 20, 100, 100);

        context.fillStyle = gradient2;

        context.fillRect(100, 120, 100, 100);
        context.strokeText('hello World', 300, 30);
        context.fillText('hello world', 100, 200);
    }
    // drawRect();
    // rect end

    // stroke path
    function strokeRect() {
        context.strokeStyle = 'red';
        context.fillStyle = 'green';
        context.beginPath();
        context.rect(10, 10, 100, 100);
        context.stroke();
        context.fill();

        context.beginPath();
        context.rect(50, 50, 100, 100);
        context.stroke();
    }
    strokeRect();

    function drawTwoArcs() {
        context.beginPath();
        context.strokeStyle = undefined;
        context.arc(300, 190, 150, 0, Math.PI * 2, false);
        context.arc(300, 190, 100, 0, Math.PI * 2, true);
        context.fill();
        context.shadowColor = undefined;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.stroke();
    }
    drawTwoArcs();
    // end stroke path

    // draw line
    function drawLine() {
        context.strokeStyle = 'rgba(0,0,0,.5)';

        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(50, 10);
        context.lineTo(450, 10);
        context.stroke();

        context.beginPath();
        context.moveTo(50.5, 50.5);
        context.lineTo(450.5, 50.5);
        context.stroke();
    }

    drawLine();

    // end draw line
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    function drawGrid(context, color, stepx, stepy) {
        // 测试数据
        context.strokeStyle = color;
        context.lineWidth = 0.5;
        for (var i = stepx + 0.5; i < context.canvas.width; i += stepx) {
            context.beginPath();
            context.moveTo(i, 0);
            context.lineTo(i, context.canvas.height);
            context.stroke();
        }
        for (var i = stepy + 0.5; i < context.canvas.height; i += stepy) {
            context.beginPath();
            context.moveTo(0, i);
            context.lineTo(context.canvas.width, i);
            context.stroke();
        }
    }
    drawGrid(context, 'lightgray', 10, 10);

    // 清空缓存
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    var eraseAllButton = document.getElementById('eraseAllButton');
    var strokeStyleSelect = document.getElementById('strokeStyleSelect');
    var guidewireCheckbox = document.getElementById('guidewireCheckbox');
    var drawingSurfaceImageData = null;
    var mousedown = {};
    var rubberbandRect = {};
    var dragging = false;
    var guidewires = guidewireCheckbox.checked;

    function windowToCanvas(x, y) {
        var bbox = canvas.getBoundingClientRect();
        return {
            x: x - bbox.left * (canvas.width / bbox.width),
            y: y - bbox.top * (canvas.height / bbox.height)
        };
    }

    function saveDrawingSurface(){
        drawingSurfaceImageData = context.getImageData(0,0,canvas.width,canvas.height);
    }

    function restoreDrawingSurface(){
        context.putImageData(drawingSurfaceImageData,0,0);
    }

    function updateRubberbandRectangle(loc){
        rubberbandRect.width = Math.abs(loc.x - mousedown.x);
        rubberbandRect.height = Math.abs(loc.y - mousedown.y);
        if(loc.x > mousedown.x) {
            rubberbandRect.left = mousedown.x
        }else{
            rubberbandRect.left = loc.x
        }
        if(loc.y > mousedown.y){
            rubberbandRect.top = mousedown.y;
        }else{
            rubberbandRect.top = loc.y
        }
    }

    function drawRubberbandShape(loc){
        context.beginPath();
        context.moveTo(mousedown.x,mousedown.y);
        context.lineTo(loc.x,loc.y);
        context.stroke();
    }

    function updateRubberband(loc){
        updateRubberbandRectangle(loc);
        drawRubberbandShape(loc);
    }

    function drawHorizontalLine(y){
        context.beginPath();
        context.moveTo(0,y+0.5);
        context.lineTo(x+0.5,context.canvas.width,y+0.5);
        context.stroke();
    }

    function drawVerticalLine(x){
        context.beginPath();
        context.moveTo(x+0.5,0);
        context.lineTo(x+0.5,context.canvas.height);
        context.stroke();
    }

    function drawGuidewires(x,y){
        context.save();
        context.strokeStyle = 'rgba(0,0,230,.4)';
        context.lineWidth = 0.5;
        drawVerticalLine(x);
        drawHorizontalLine(y);
        context.restore();
    }

    canvas.onmousedown = function( e){
        var loc = windowToCanvas(e.clientX,e.clientY);
        e.preventDefault();
        mousedown.x = loc.x ;
        mousedown.y = loc.y;
        dragging = true;
    }

    canvas.onmousemove = function ( e ){
        var loc ;
        if(dragging){
            e.preventDefault();
            loc = windowToCanvas(e.clientX,e.clientY);
            // saveDrawingSurface();
            restoreDrawingSurface();
            updateRubberband(loc);
        }
        if( guidewires ){
            drawGuidewires(loc.x,loc.y);
        }
    }

    canvas.onmouseup = function(e){
        loc = windowToCanvas(e.clientX,e.clientY);
        saveDrawingSurface();
        restoreDrawingSurface();
        updateRubberband(loc);
        dragging = false;
    }

    eraseAllButton.onclick = function(e){
        context.clearRect(0,0,canvas.width,canvas.height);
        drawGrid(context,'lightgray',10,10);
        saveDrawingSurface();
    }

    strokeStyleSelect.onchange = function(e){
        context.strokeStyle = strokeStyleSelect.value;
    }

    guidewireCheckbox.onchange = function(e){
        guidewires = guidewireCheckbox.checked;
    }

    context.strokeStyle = strokeStyleSelect.value;
    
    drawGrid(context,'lightgray',10,10);
    saveDrawingSurface();


};
