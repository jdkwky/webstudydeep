const $canvas = document.getElementById('canvas');
const context2D = $canvas.getContext('2d');

let _lineDashOffset = 0 ;

function _updateLineDashOffset() {
    _lineDashOffset ++;
    if(_lineDashOffset > 600) {
        _lineDashOffset = 0;
    }
}


// 绘制矩形
function _drawRect(x, y , w, h) {
    if(context2D) {
        context2D.save();
        context2D.fillStyle = 'grey';
        context2D.strokeStyle = "blue";
        context2D.lineWidth = 2;
        // 虚线绘制
        context2D.setLineDash([10,5]);
        context2D.lineDashOffset = _lineDashOffset; // 虚线起始位置
        context2D.beginPath();
        context2D.moveTo(x, y);
        context2D.lineTo(x+w, y);
        context2D.lineTo(x+w, y+h);
        context2D.lineTo(x, y + h);
        context2D.closePath();
        context2D.fill();
        context2D.stroke();
        context2D.restore();
    } 
}


function timeCallback () {
    _updateLineDashOffset();
    _drawRect(10,10, $canvas.width - 20, $canvas.height - 20);
    // requestAnimationFrame(timeCallback)

}

// timeCallback();

// 绘制圆

function fillCircle(x, y, radius, fillStyle = 'red') {
    if(context2D) {
        context2D.save();
        context2D.fillStyle = fillStyle;
        context2D.beginPath();
        context2D.arc(x, y , radius, 0, Math.PI * 2);
        context2D.fill();
        context2D.restore();
    }
}

// 绘制描边圆
function strokeCircle(x, y, radius, strokeStyle = 'black') {
    if(context2D) {
        context2D.save();
        context2D.strokeStyle = strokeStyle;
        context2D.beginPath();
        context2D.arc(x, y, radius, 0, Math.PI * 2);
        context2D.stroke();
        context2D.restore();
    }
}

// 绘制描边矩形
function strokeRect(x, y , width, height, strokeStyle = 'black') {
    if(context2D) {
        context2D.save();
        context2D.strokeStyle = strokeStyle;
        context2D.rect(x, y , width, height);
        context2D.stroke();
        context2D.restore();
    }
}

// 绘制线段
function strokeLine(x0, y0, x1,y1, strokeStyle = 'green') {
    if(context2D) {
        context2D.save();
        context2D.beginPath();
        context2D.moveTo(x0, y0);
        context2D.lineTo(x1,y1);
        context2D.strokeStyle = strokeStyle;
        context2D.stroke()
        context2D.restore();
    }
}

// 绘制坐标轴
function strokeCoord( orginX, orginY, width, height ) {
    if(context2D) {
        strokeLine(orginX, orginY, orginX + width, orginY, 'red');
        strokeLine(orginX,orginY, orginX, orginY + height, 'blue')
    }
}

// 绘制网格背景
function strokeGrid( color = "grey", interval = 10 ) {
    if(context2D) {
        context2D.save();
        context2D.lineWidth = 0.5;
        const width = $canvas.width
        const height = $canvas.height

        for(let i = interval + 0.5; i < width; i +=interval ) {
            strokeLine(i,0, i, height, 'grey')
        }
        for(let i = interval + 0.5; i< height; i +=interval) {
            strokeLine(0, i , width , i, 'grey');
        }

        context2D.restore();

        fillCircle(0,0,5, 'green');

        strokeCoord(0, 0, width, height)
    }
} 

// 绘制文本函数

function fillText(text, x, y , color = 'white', align = 'left', baseline = 'top', font = '10px sans-serif') {
    if(context2D) {
        context2D.save();
        context2D.textAlign = align; // 文本左右对齐方式
        context2D.textBaseline = baseline; // 文本垂直对齐方式
        context2D.font = font;
        context2D.fillStyle = color;
        context2D.fillText(text, x, y)
        context2D.restore();
    }
}

const ELayout = {
    LEFT_TOP: 0,
    RIGHT_TOP: 1,
    RIGHT_BOTTOM: 2,
    LEFT_BOTTOM: 3,
    CENTER_MIDDLE: 4,
    CENTER_TOP: 5,
    RIGHT_MIDDLE: 6,
    CENTER_BOTTOM: 7,
    LEFT_MIDDLE: 8
}

class Math2D {
    /**
     * 将一个点pt投影到start和end形成的线段上
     * 返回值：true表示pt在线段起点和终点之间，此时closePoint输出参数返回线段上的投影点坐标
     *        false 表示在线段起点或终点之外，此时closePoint输出参数返回线段的起点或终点
     * @param {vec2} pt 
     * @param {vec2} start 
     * @param {vec2} end 
     * @param {vec2} closePoint 
     */
    static projectPointOnLineSegment(pt, start, end, closePoint) {
        let v0 = vec2.create()
        let v1 = vec2.create()
        let d = 0
        vec2.difference(pt, start, v0);
        vec2.difference(end, start, v1);
        d = v1.normalize()
        let t = vec2.dotProduct(v0, v1)
        if(t < 0) {
            // 不在当前线段上
            closePoint.x = start.x;
            closePoint.y = start.y;
            return false;
        }else if (t > d * d) {
            // 投影长度大于线段长度，说明鼠标位置超过线段终点范围
            closePoint.x = end.x;
            closePoint.y = end.y;
            return false;
        }else {
            vec2.scaleAdd(start, v1, t, closePoint);
            return true;
        }
    }

    /**
     * 判断点是否在圆内
     * @param {vec2} pt 
     * @param {vec2} center 
     * @param {number} radius 
     */
    static isPointInCircle (pt, center, radius) {
        const diff = vec2.difference(pt, center);
        const len2 = diff.squaredLength;
        if(len2 <=radius * radius) {
            return true;
        }
        return false;
    }

    /**
     * 点与线段或圆的碰撞检测
     * @param {vec2} pt 
     * @param {vec2} start 
     * @param {vec2} end 
     * @param {number} radius 
     */
    static isPointOnLineSegment(pt, start, end, radius) {
        const closePt = vec2.create();
        if(Math2D.projectPointOnLineSegment(pt, start,end,closePt) === false) {
            return false
        }
        // 需要进行点与圆的碰撞检测
        return Math2D.isPointInCircle(pt, closePt, radius);
    }

    /**
     * 检测 点与矩形的碰撞
     * @param {number} ptX 
     * @param {number} ptY 
     * @param {number} x 
     * @param {number} y 
     * @param {number} w 
     * @param {number} h 
     */
    static isPointInRect(ptX, ptY, x, y, w, h) {
        if(ptX >= x && ptX <= x + w && ptY >=y && ptY <= y+h) {
            return true;
        }
        return false;
    }
    /**
     * 检测点是否在椭圆上
     * @param {number} ptX 
     * @param {number} ptY 
     * @param {number} centerX 
     * @param {number} centerY 
     * @param {number} radiusX 
     * @param {number} radiusY 
     */
    static isPointInEllipse(ptX, ptY, centerX, centerY, radiusX, radiusY) {
        const diffX = ptX - centerX;
        const diffY = ptY - centerY;
        const n = (diffX * diffX)/(radiusX * radiusX) + (diffY * diffY)/(radiusY * radiusY);
        return n <=1.0;
    }

    static transform(mat, pt, result = null) {
        if(!result) {
            result = vec2.create();
        }

        result.values[0] = mat.values[0]* pt.values[0] + mat.values[2] * pt.values[1] +  mat.values[4];
        result.values[1] = mat.values[1] * pt.values[0] + mat.values[3] * pt.values[1] + mat.values[5];
        return result;
    }

    

}

class mat2d {
    constructor() {
        this.values = new Float32Array(9);
    }
    static makeTranslation (tx, ty, result) {
        if(!result) {
            result = new mat2d(); 
        }
        result.values[0] = 1
        result.values[1] = 0;
        result.values[2] = 0;
        result.values[3] = 1;
        result.values [4] = tx;
        result.values[5] = ty;
        return result;
    } 

}
const EPSILON = 0.00001;

// 一些类
class vec2 {
    constructor(x, y) {
        this.values = new Float32Array([x, y]);
    }
    toString() {
        return `[${this.values[0]}, ${this.values[1]}]`
    }

    get x() {
        return this.values[0]
    }

    set x (value) {
        this.values[0] = value;
    }
    get y () {
        return this.values[1]
    }

    set y(value) {
        this.values[1] = value;
    }

    // 为了重用向量，有时需要重置向量的x,y值
    reset(x, y) {
        this.values[0] = x;
        this.values[y] = y;
        return this;
    }
    // 为了避免浮点数误差，使用epsilon进行容差处理，默认情况下为0.00001
    equals(vector) {
       if(Math.abs(this.values[0] - vector.values[0]) > EPSILON) {
           return false;
       } 
       if(Math.abs(this.values[1] - vector.values[1]) > EPSILON) {
           return false;
       }
       return true;
    }

    // 返回没有开根号的向量大小
    get squaredLength() {
        let x = this.values[0];
        let y = this.values[1];
        return x*x + y*y;
    }
    // 返回真正的向量的膜的大小（向量值的大小）
    get length () {
        return Math.sqrt(this.squaredLength);
    }

    // 计算方向向量，
    // 调用本方法后在北部修改当前向量的x和y值，修改后的向量大小为1.0
    normalize() {
        let len = this.length;
        if(len === 0) {
            console.log('this length = 0 ')
            this.values[0] = 0
            this.values[1] = 0
            return 0
        }
        if(len === 1) {
            return 1.0
        }

        this.values[0] /= len;
        this.values[1] /= len;
        return len;
    }
    static create(x, y) {
        return new vec2(x, y); 
    }

    static copy(src,result) {
        if(!result) {
            result = new vec2();
        }
        result.values[0] = src.values[0]
        result.values[1] = src.values[1]
        return result;
    }

    // 向量加法
    static sum(left, right, result) {
        if(!result) {
            result = new vec2();
        }
        result.values[0] = left.values[0] + right.values[0];
        result.values[1] = left.values[1] + right.values[1];

        return result;
    }

    // vec2类的公开实例方法
    add(right) {
        vec2.sum(this, right, this)
        return this;
    }
    // 向量减法
    static difference(end, start, result) {
        if(!result) {
            result= new vec2()
        }
        result.values[0] = end.values[0] - start.values[0];
        result.values[1] = end.values[1] - start.values[1];
        return result;
    }
    // vec2类的实例方法 减
    substract(another) {
        vec2(this, another, this);
        return this;
    }

    // 负向量
    negative() {
        this.values[0] = -this.values[0];
        this.values[1] = -this.values[1];
        return this;
    }

    // 向量与标量相乘 本质 放大缩小问题
    static scale(direction, scalar, result) {
        if(!result) {
            result = new vec2()
        }
        result.values[0] = direction.values[0] * scalar;
        result.values[1] = direction.values[1] * scalar;
        return result;
    }

    // 缩放
    static scaleAdd(start, direction, scalar, result) {
        if(!result) {
            result = new vec2();
        }
        vec2.scale(direction, scalar, result);
        return vec2.sum(start, result, result);
    }

    // 点乘
    static dotProduct(left, right) {
        return left.values[0] * right.values[0] + left.values[1] * right.values[1];
    }

    // 内积
    innerProduct (right) {
        return vec2.dotProduct(this, right)
    }
    // 向量的夹角及朝向
    static getAngle (a, b , isRadian =false) {
        let dot = vec2.dotProduct(a,b)
        let radian = Math.acos(dot / a.length * b.length);

        if(isRadian === false) {
            return toDegree(radian)
        }
        return isRadian;
    }

    static getOrientation (from, to, isRadian = false) {
        let diff = vec2.difference(to, from);
        let radian = Math.atan2(diff.y, diff.x);
        if(!isRadian) {
            return toDegree(radian)
        }
        return radian;
    }
    
}

class Size {
    constructor(w, h) {
        this.values = new Float32Array([w,h]);
    }

    set width(value) {
        this.values[0] = value;
    }
    get width() {
        return this.values[0]
    }

    set height(value) {
        this.values[1] = value
    }
    get height () {
        return this.values[1]
    }

    static create(w, h) {
        return new Size(w, h);
    }
}

class Rectangle {
    constructor(orign, size) {
        this.orign = orign;
        this.size = size;
    }

    static create(x, y, w, h) {
        let orign = new vec2(x, y);
        let size = new Size(w, h);
        return new Rectangle(orign, size);
    }
}

// 计算文字大小
function calcTextSize(text, char = 'W', scale = 0.5) {
    if(context2D) {
        let size = new Size();
        size.width = context2D.measureText(text).width;
        let w = context2D.measureText(char).width
        size.height = w + w * scale;
        return size;
    }
    throw new Error('context2D渲染上下文为null');
}

function calcLocalTextRectangle(layout, text, parentWidth, parentHeight) {
    let s  = calcTextSize(text);
    let o = vec2.create(0,0);

    let left = 0;
    let top = 0;
    let right = parentWidth - s.width;
    let bottom = parentHeight - s.height;
    let center = right * 0.5;
    let middle = bottom * 0.5;

    switch(layout) {
        case ELayout.LEFT_TOP:
            o.x = left;
            o.y = top;
            break;
        case ELayout.RIGHT_TOP:
            o.x = right;
            o.y = top;
            break;
        case ELayout.RIGHT_BOTTOM:
            o.x = right;
            o.y = bottom;
            break;
        case ELayout.LEFT_BOTTOM: 
            o.x = left;
            o.y = bottom;
            break;
        case ELayout.CENTER_MIDDLE:
            o.x = center;
            o.y = middle;
            break;
        case ELayout.CENTER_TOP:
            o.x = center;
            o.y= 0;
            break;
        case ELayout.RIGHT_MIDDLE:
            o.x = right;
            o.y = middle;
            break;
        case ELayout.CENTER_BOTTOM:
            o.x = center;
            o.y = bottom;
            break;
        case ELayout.LEFT_MIDDLE: 
            o.x = left;
            o.y = middle;
            break;
    }


    return new Rectangle(o, s);
}
// 绘制文字

function fillRectWithTitle( x, y, width, height, title, layout =ELayout.CENTER_MIDDLE , color = 'grey', showCoord= true) {
    if(context2D) {
        context2D.save();
        context2D.fillStyle = color;
        context2D.beginPath();
        context2D.rect(x, y, width, height);
        context2D.fill();

        if(title) {
            let rect = calcLocalTextRectangle(layout, title, width, height)
            fillText(title, x + rect.orign.x, y + rect.orign.y, 'white', 'left', 'top');
            fillCircle(x+rect.orign.x, y + rect.orign.y, 2);
        }
        if(showCoord) {
            strokeCoord(x, y, width + 20, height + 20);
            fillCircle(x, y , 3);
        }

        context2D.restore();
    }

}

/**
 * 绘制各个不同方位的文字信息
 */
function  testMyTextLayout ( ) {
    let x  = 20 ;
    let y  = 20 ;
    let width  = $canvas . width - x * 2 ;
    let height  = $canvas . height - y * 2 ;
    let right  = x + width ;
    let bottom  = y + height ;
    let drawX  = x  ;
    let drawY  = y  ;
    let drawWidth  = 80 ;
    let drawHeight  = 50 ;
    // 1. 画背景rect
    fillRectWithTitle ( x , y , width , height ) ;
    // 2. 左上
    fillRectWithTitle ( drawX , drawY , drawWidth , drawHeight ,'left - top' , ELayout.LEFT_TOP , 'rgba( 255 , 255 , 0 , 0.2 )' ) ;
    // 3. 右上
    drawX = right - drawWidth ;
    drawY = y ;
    fillRectWithTitle ( drawX , drawY , drawWidth , drawHeight ,'right - top' , ELayout.RIGHT_TOP , 'rgba( 255 , 255 , 0 , 0.2 )' ) ;

    // 4. 右下
    drawX = right - drawWidth ;
    drawY = bottom - drawHeight ;
    fillRectWithTitle ( drawX , drawY , drawWidth , drawHeight ,'right - bottom' , ELayout.RIGHT_BOTTOM , 'rgba( 255 , 255 ,0 , 0.2 )' ) ;
    // 5. 左下
    drawX = x ;
    drawY = bottom - drawHeight ;
    fillRectWithTitle ( drawX , drawY , drawWidth , drawHeight ,'left - bottom' , ELayout.LEFT_BOTTOM , 'rgba( 255 , 255 , 0 ,0.2 )' ) ;
    // 6. 中心
    drawX = ( right - drawWidth ) * 0.5 ;
    drawY = ( bottom - drawHeight ) * 0.5 ;
    fillRectWithTitle ( drawX , drawY , drawWidth , drawHeight ,'center - middle' , ELayout.CENTER_MIDDLE , 'rgba( 255 , 0 , 0 , 0.2 )' ) ;
    // 7. 中上
    drawX = ( right - drawWidth ) * 0.5 ;
    drawY = y ;
    fillRectWithTitle ( drawX , drawY , drawWidth , drawHeight ,'center - top' , ELayout.CENTER_TOP , 'rgba( 0 , 255 , 0 , 0.2 )' ) ;
    // 8. 右中
    drawX = ( right - drawWidth ) ;
    drawY = ( bottom - drawHeight ) * 0.5 ;
    fillRectWithTitle ( drawX , drawY , drawWidth , drawHeight ,'right - middle' , ELayout.RIGHT_MIDDLE , 'rgba( 0 , 255 , 0 ,0.2 )' ) ;
    // 9. 中下
    drawX = ( right - drawWidth ) * 0.5 ;
    drawY = ( bottom - drawHeight ) ;
    fillRectWithTitle ( drawX , drawY , drawWidth , drawHeight ,'center - bottom' , ELayout.CENTER_BOTTOM , 'rgba( 0 , 255 ,0 , 0.2 )' ) ;
    // 10. 左中
    drawX = x ;
    drawY = ( bottom - drawHeight ) * 0.5 ;
    fillRectWithTitle ( drawX , drawY , drawWidth , drawHeight ,'left - middle' , ELayout.LEFT_MIDDLE , 'rgba( 0 , 255 , 0 ,0.2 )' ) ;
}


// 绘制canvas画布的中心点及相交于中心点的x和y轴。

function drawCanvasCoordCenter() {
    if(context2D) {
        // 计算canvas的中心点坐标
        let halfWidth = $canvas.width / 2;
        let halfHeight = $canvas.height / 2

        context2D.save();
        context2D.lineWidth = 2;
        strokeLine(0, halfHeight, $canvas.width, halfHeight, 'rgba(255,0,0,0.5)');
        strokeLine(halfWidth, 0 , halfWidth, $canvas.height, 'rgba(0,0,255, 0.5)');
        context2D.restore();

        fillCircle(halfWidth, halfHeight, 5 ,'rgba(0,0,0,0.5)')
    }
}


// 绘制某个点处的坐标信息
function drawCoordInfo (info, x, y) {
    fillText(info,x, y, 'black', 'center', 'bottom')
}

// AB 两点之间的距离
function distance(x0, y0, x1, y1) {
    const diffX = x1- x0;
    const diffY = y1 - y0;
    return Math.sqrt(diffX * diffX + diffY * diffY)
}

const PiBy180 = Math.PI / 180;

// 角度 转换成弧度
function toRadian(degree) {
    return degree * PiBy180;
}

// 弧度转换成角度
function toDegree(radian) {
    return radian / PiBy180;
}


let _mouseX = $canvas.width / 2;
let _mouseY = $canvas.height / 2;

function dispatchMouseMove(evt) {
    _mouseX = evt.canvasPosition.x;
    _mouseY = evt.canvasPosition.y;
}


function render() {
    if(context2D) {
        strokeGrid();
        drawCanvasCoordCenter();
        drawCoordInfo(`[${_mouseX},${_mouseY}]`, _mouseX, _mouseY)
    }
}

// 通过平移方法绘制一个左上角位于画布中心的矩形
function doTransform(degree, rotateFirst = true) {
    if(context2D) {
        let radians = toRadian(degree);
        let width = 100;
        let height =  60;
        let x = $canvas.width* 0.5;
        let y = $canvas.height*0.5;
        context2D.save();
        if(rotateFirst) {
            // 先顺时针旋转
            context2D.rotate(radians);
            context2D.translate(x, y );
            fillRectWithTitle(0,0,width, height, '0 度旋转')
        }else {
            // 先平移再旋转
            context2D.translate(x, y);
            context2D.rotate(radians)
            fillRectWithTitle(0,0,width, height, '0 度旋转') 
        }
        // 绘制旋转或者平移轨迹
        
        context2D.restore();
    }
}


// 计算本地矩形坐标值
/**
 * 
 * @param {矩形的宽} width 
 * @param {矩形的高} height 
 * @param {要写入的文字} title 
 * @param {坐标系原点位置，默认居中} referencePt 
 * @param {文字框位置，默认居中} layout 
 * @param {要绘制矩形的填充颜色} color 
 * @param {是否显示局部坐标系，默认显示} showCoord 
 */
function fillLocalRectWithTitle (width, height, title, referencePt = ELayout.LEFT_TOP, layout = ELayout.CENTER_MIDDLE, color = 'grey', showCoord=false) {
    if(context2D) {
        let x = 0;
        let y = 0;
        
        switch(referencePt) {
            case ELayout.LEFT_TOP:
                x = 0; 
                y = 0;
                break;
            case ELayout.LEFT_MIDDLE:
                x = 0;
                y = - height * 0.5;
                break;
            case ELayout.LEFT_BOTTOM:
                x = 0;
                y = -height;
                break;
            case ELayout.RIGHT_TOP:
                x = -width;
                y = 0;
                break;
            case ELayout.RIGHT_MIDDLE: 
                x = -width;
                y = -height * 0.5;
                break;
            case ELayout.RIGHT_BOTTOM:
                x = -width;
                y = -height;
                break;
            case ELayout.CENTER_TOP:
                x = -width * 0.5;
                y = 0;
                break;
            case ELayout.CENTER_MIDDLE: 
                x = -width * 0.5;
                y = -height * 0.5;
                break;
            case ELayout.CENTER_BOTTOM: 
                x = -width * 0.5;
                y = -height;
                break;
        }

        context2D.save();
        context2D.fillStyle = color;
        context2D.beginPath();
        context2D.rect(x, y, width, height);
        context2D.fill();
        if(title) {
            let rect = calcLocalTextRectangle(layout, title, width, height);
            fillText(title, x+ rect.orign.x, y + rect.orign.y, 'white', 'left', 'top')
            strokeRect(x+ rect.orign.x, y + rect.orign.y, rect.size.width, rect.size.height, 'rgba(0,0,0,0.5)')
            fillCircle(x+ rect.orign.x, y + rect.orign.y, 2)
        }
        if(showCoord) {
            strokeCoord(0,0,width + 20, height + 20);
            fillCircle(0,0,3);
        }
        context2D.restore();
    }
}

// 测试 fillLocalRectWithTitle
function rotateTranslate(degree, layout = ELayout.LEFT_TOP, width = 40, height = 20) {
    if(context2D) {
        // 将角度转换为弧度
        let radians = toRadian(degree)
        context2D.save();
        context2D.rotate(radians)
        context2D.translate($canvas.width * 0.5, $canvas.height * 0.5);
        fillLocalRectWithTitle(width,height, '',layout);
        context2D.restore();
    }
}

// 该方法分别在圆的路径上绘制9种不同的坐标系
function testFillLocalRectWithTitle () {
    if(context2D) {
        rotateTranslate(0, ELayout.LEFT_TOP);
        rotateTranslate(10, ELayout.LEFT_MIDDLE);
        rotateTranslate(20, ELayout.LEFT_BOTTOM);
        rotateTranslate(30, ELayout.CENTER_TOP);

        rotateTranslate(40, ELayout.CENTER_MIDDLE);
        rotateTranslate(-10, ELayout.CENTER_BOTTOM);
        rotateTranslate(-20, ELayout.RIGHT_TOP);
        rotateTranslate(-30, ELayout.RIGHT_MIDDLE);
        rotateTranslate(-40, ELayout.RIGHT_BOTTOM);


        let radius = distance(0, 0, $canvas.width * 0.5 , $canvas.height * 0.5)

        strokeCircle(0, 0, radius, 'black');

    }
}

// 彻底掌握坐标系变换奥秘
function doLocalTransform () {
    if(context2D) {
        
        let width = 100;
        let height = 60;
        let coordWidth = width * 1.2;
        let coordHeight = height * 1.2;
        let radius = 5;
        fillLocalRectWithTitle(width, height, '1、初始状态')
        context2D.save();
        context2D.translate($canvas.width * 0.5, 10);
        strokeCoord(0, 0, coordWidth, coordHeight);
        fillCircle(0,0, radius);
        fillLocalRectWithTitle(width, height, '2、平移')
        context2D.translate(0, $canvas.height * 0.5 -10);
        strokeCoord(0,0, coordWidth, coordHeight);
        fillCircle(0, 0, radius)
        fillLocalRectWithTitle(width, height, '3、平移到画布中心')


        // 旋转
        context2D.rotate(toRadian(-120))
        fillLocalRectWithTitle(width, height, '4、旋转-120')
        strokeCoord(0,0, coordWidth, coordHeight);
        fillCircle(0, 0, radius)

        context2D.rotate(toRadian(-120))
        fillLocalRectWithTitle(width, height, '5、再旋转-120')
        strokeCoord(0,0, coordWidth, coordHeight);
        fillCircle(0, 0, radius)

        context2D.translate(100, 100);
        fillLocalRectWithTitle(width, height, '6、局部平移100个单位')
        strokeCoord(0,0, coordWidth, coordHeight);
        fillCircle(0, 0, radius)


        // scale方法放大局部坐标系X轴1.5倍，y轴2.0倍
        context2D.scale(1.5, 2.0)
        fillLocalRectWithTitle(width, height, '7、x轴放大1.5倍，y轴放大2倍', ELayout.LEFT_MIDDLE)
        strokeCoord(0,0, coordWidth, coordHeight);
        fillCircle(0, 0, radius)

        context2D.restore();

        // context2D.save();
        
        // context2D.restore();
        
    }
}


// 更加通用的相对局部坐标系原点变换的算法
function fillLocalRectWithTitleUV( width, height, title, u = 0, v = 0, layout = ELayout.CENTER_MIDDLE,color="grey",showCoord = true ) {
    if(context2D) {
        let x = -width * u;
        let y = -height * v;
        context2D.save();
        context2D.fillStyle = color;
        context2D.beginPath();
        context2D.rect(x, y, width, height);
        context2D.fill();
        if(title) {
            let rect = calcLocalTextRectangle(layout, title, width, height);
            fillText(title, x+ rect.orign.x, y + rect.orign.y, 'white', 'left', 'top')
            strokeRect(x+ rect.orign.x, y + rect.orign.y, rect.size.width, rect.size.height, 'rgba(0,0,0,0.5)')
            fillCircle(x+ rect.orign.x, y + rect.orign.y, 2)
        }
        if(showCoord) {
            strokeCoord(0,0,width + 20, height + 20);
            fillCircle(0,0,3);
        }
        context2D.restore();
    }
}

function translateRotateTranslateDrawRect(degree, u = 0 ,v = 0, radius = 200, width = 40, height = 20) {
    if(context2D) {
        let radians = toRadian(degree);
        context2D.save();
        context2D.translate($canvas.width * 0.5 , $canvas.height * 0.5)
        context2D.rotate(radians);
        context2D.translate(radius, 0)
        fillLocalRectWithTitleUV(width, height, '', u, v);
        context2D.restore();
    }
}

function testFillLocalReectWithTitleUV() {
    if(context2D) {
        let radius = 200;
        let steps = 18;
        for( let i = 0; i <=steps; i++ ) {
            let n = i / steps;
            translateRotateTranslateDrawRect(i * 10, n, 0 , radius);
        }
        for( let i = 0; i <=steps; i++ ) {
            let n = i / steps;
            translateRotateTranslateDrawRect(-i * 10,  0 , n, radius);
        }
    }
}

// 自转和公转
let _rotationSunSpeed = 50;
let _rotationMoonSpeed = 10;
let _revolutionSpeed = 60;
let _rotationSun = 10;
let _rotationMoon = 30;
let _revolution = 0;


function update(elapsedMsec, intervalSec) {
    // 角位移公式 v = s * t;
    _rotationMoon += _rotationMoonSpeed * intervalSec;
    _rotationSun += _rotationSunSpeed * intervalSec;
    _revolution += _revolutionSpeed * intervalSec;
}

// 公转自转模拟
function rotationAndRevolutionSimulation(radius) {
    if(context2D) {
        const rotationMoon = toRadian(_rotationMoon)
        const rotationSun = toRadian(_rotationSun)
        const revolution = toRadian(_revolution)

        context2D.save();
        context2D.translate($canvas.width* 0.5, $canvas.height*0.5)
        context2D.save();
        context2D.rotate(rotationSun);
        fillLocalRectWithTitleUV(100,100,'自转',0.5,0.5);
        context2D.restore();
        context2D.save();
        context2D.rotate(rotationMoon);
        context2D.translate(radius, 0)
        fillLocalRectWithTitleUV(80,80,'自转+公转',0.5,0.5)
        context2D.restore();
    }
    // requestAnimationFrame(()=>{
    //     update();
    //     rotationAndRevolutionSimulation();
    // })
}

// 绘制象限
function draw4Quadrant() {
    if(context2D) {
        context2D.save();
        fillText('第一象限',$canvas.width,$canvas.height, 'rgba(0,0,255,0.5)', 'right', 'bottom', '20px sans-serif')
        fillText('第二象限',0,$canvas.height, 'rgba(0,0,255,0.5)', 'left', 'bottom', '20px sans-serif')
        fillText('第三象限',0,0, 'rgba(0,0,255,0.5)', 'left', 'top', '20px sans-serif')
        fillText('第四象限',$canvas.width,0, 'rgba(0,0,255,0.5)', 'right', 'top', '20px sans-serif')
        context2D.restore()
    }
}

// 坦克形体

class Tank {
    width = 80
    height = 50
    x = $canvas.width * 0.5
    y = $canvas.height * 0.5
    scaleX = 1.0
    scaleY = 1.0
    // 坦克朝向
    tankRotation = 0
    // 炮筒朝向
    turretRotation = 0;
    initYAxis = true;
    showLine = false;
    showCoord = false;
    gunLength = Math.max(this.width, this.height);
    gunMuzzleRadius = 5;
    linearSpeed = 100; // 移动速度

    // 涉及到朝向运动的位置变量改成向量表示
    pos = new vec2(100, 100);
    target = new vec2()

    // 鼠标指针的位置
    targetX = 0;
    targetY = 0;

    _lookAt() {
        let diffX = this.target.x - this.pos.x;
        let diffY = this.target.y - this.pos.y;

        let radian = Math.atan2(diffY, diffX)
        console.log('radian', radian);
        this.tankRotation = radian;
    }

    // 移动朝向
    _moveTowardTo(intervalSec = 1) {
        // 计算坦克当前位置到鼠标点之间的向量
        let dir = vec2.difference(this.target, this.pos)
        dir.normalize(); // 转换成单位方向向量
        this.pos = vec2.scaleAdd(this.pos, dir, this.linearSpeed * intervalSec)
    }

    draw () {
        if(context2D) {
            context2D.save();
            context2D.translate(this.pos.x,this.pos.y);
            context2D.rotate(this.tankRotation);
            context2D.scale(this.scaleX, this.scaleY);
            // 绘制底座
            context2D.save();
            context2D.fillStyle= 'grey';
            context2D.beginPath();
            context2D.rect(-this.width * 0.5, -this.height * 0.5, this.width, this.height)
            context2D.fill();
            context2D.restore();
            // 绘制炮塔
            context2D.save();
            context2D.rotate(this.turretRotation);
            context2D.fillStyle = 'red';
            context2D.beginPath();
            context2D.ellipse(0,0,15,10,0,0, Math.PI * 2);
            context2D.fill();
            // 炮管
            context2D.strokeStyle = 'blue';
            context2D.lineWidth = 5;
            context2D.lineCap = 'round';

            context2D.beginPath();
            context2D.moveTo(0,0)
            context2D.lineTo(this.gunLength, 0);
            context2D.stroke();
            context2D.translate(this.gunLength,0);
            context2D.translate(this.gunMuzzleRadius, 0);
            fillCircle(0,0, 5, 'black')
            context2D.restore();
            // 绘制坦克朝向
            context2D.save();
            context2D.translate(this.width * 0.5, 0);
            fillCircle(0,0,10, 'green');
            context2D.restore();

            if(this.showCoord) {
                context2D.save();
                context2D.lineWidth = 1;
                strokeCoord(0,0, this.width * 1.2, this.height * 1.2);
                context2D.restore()
            }
            context2D.restore();
            
        }
    }
}

class TestApplcication {
    lineStart = vec2.create(150,150);
    lineEnd = vec2.create(400,300);
    closePt = vec2.create();
    _hitted = false;
    _mouseX = 0;
    _mouseY = 0;

    /**
     * 沿着局部坐标系x轴的正方向，绘制长度为len的向量
     * @param {number} len 要绘制的向量的长度，例如 291.55
     * @param {number} arrowLen  要绘制的向量的箭头长度
     * @param {string} beginText 要绘制的向量头部信息
     * @param {string} endText 要绘制向量尾部信息
     * @param {number} lineWidth 用来加粗表示向量
     * @param {Boolean} isLineDash 是否用虚线的方式显示向量
     * @param {boolean} showInfo 是否显示向量的长度
     * @param {boolean} alpha 是否以半透明方式显示向量
     */
     drawVec(len, arrowLen= 10, beginText='',endText='',lineWidth = 1, isLineDash = false, showInfo = true, alpha = false) {
        if(context2D) {
            if(len < 0 ) {
                arrowLen = -arrowLen;
            }
            context2D.save();
            context2D.lineWidth = lineWidth;
            if(isLineDash) {
                context2D.setLineDash([2,2])
            }

            if(lineWidth > 1) {
                fillCircle(0,0,5)
            }else {
                fillCircle(0,0,3)
            }
            context2D.save();
            if(alpha) {
                context2D.strokeStyle = 'rgba(0,0,0,0.3)'
            }

            strokeLine(0,0,len, 0)
            // 绘制箭头上半部分
            context2D.save();
            strokeLine(len, 0, len-arrowLen, arrowLen);
            context2D.restore();
            // 绘制箭头下半部分
            context2D.save();
            strokeLine(len, 0, len - arrowLen, -arrowLen);
            context2D.restore();
            context2D.restore();
            const font = '15px sans-serif';
            if(beginText){
                if(len > 0) {
                    fillText(beginText, 0, 0 , 'black','right', 'bottom', font)
                }else {
                    fillText(beginText, 0, 0 , 'black','left', 'bottom', font)
                }
            }
            len = parseFloat(len.toFixed(2));
            if(beginText && endText) {
                if(len > 0) {
                    fillText(endText,len, 0 ,'black', 'left', 'bottom', font)
                }else {
                    fillText(endText,len, 0 ,'black', 'right', 'bottom', font)
                }
            }
            // 绘制向量长度信息
            if(showInfo) {
                fillText(Math.abs(len).toString(), len * 0.5, 0, 'black', 'center', 'bottom', font);
            }

            context2D.restore()
        }
    }
    /**
     * 一个更常用的绘制向量的方法
     * 从两个点计算出一个向量，然后调用drawVec绘制该向量
     * 返回值：当前向量与x正方向的夹角，以弧度表示
     * @param {*} start 
     * @param {*} end 
     * @param {*} arrowLen 
     */
    drawVecFromLine(start, end, arrowLen= 10, beginText = '', endText='', lineWidth = 1, isLineDash = false, showInfo = false, alpha = false) {
        let angle = vec2.getOrientation(start, end, true)
        if(context2D) {
            let diff = vec2.difference(end, start)
            let len = diff.length;
            context2D.save();
            context2D.translate(start.x, start.y);
            context2D.rotate(angle);
            this.drawVec(len, arrowLen, beginText, endText, lineWidth, isLineDash, showInfo, alpha);
            context2D.restore()
        }
        return angle;
    }

    dispatchMouseMove(evt) {
        const { clientX, clientY } = evt || {};
        this._mouseX = clientX;
        this._mouseY = clientY;
        this._hitted = Math2D.projectPointOnLineSegment(vec2.create(clientX,clientY),this.lineStart, this.lineEnd, this.closePt)
        this.drawMouseLineProjection()
    }

    drawMouseLineProjection() {
        if(context2D) {

            if(!this._hitted) {
                // 鼠标点没有在线段上
            this.drawVecFromLine(this.lineStart, this.lineEnd, 10, this.lineStart.toString(), this.lineEnd.toString(), 1 ,false, true)

            }else {
                // 鼠标位置在线段范围内
                let angle = 0 ;
                let mousePt = vec2.create(this._mouseX, this._mouseY);
                context2D.save();
                angle = this.drawVecFromLine(this.lineStart, this.lineEnd, 10, this.lineStart.toString(), this.lineEnd.toString(), 3, false ,true);
                fillCircle(this.closePt.x, this.closePt.y, 5)
                this.drawVecFromLine(this.lineStart, mousePt, 10 ,'', '', 1, true, true, false);
                this.drawVecFromLine(mousePt, this.closePt, 10, '', '', 1, true, true, false);
                context2D.restore();
                context2D.save();
                context2D.translate(this.closePt.x, this.closePt.y);
                context2D.rotate(angle)
                drawCoordInfo(`[${this.closePt.x.toFixed(2)},${this.closePt.y.toFixed(2)}]`, 0, 0, 'center', 'top');
                context2D.restore();

                angle = vec2.getAngle(vec2.difference(this.lineEnd, this.lineStart), vec2.difference(mousePt, this.lineStart), false);

                // 绘制出夹角信息
                drawCoordInfo(angle.toFixed(2), this.lineStart.x+ 10, this.lineStart.y +10, 'center', 'top')
            }
        }
    }
}


// 绘制贝塞尔曲线类

class QuadraticBezierCurve {
    _startAnchorPoint;
    _endAnchorPoint;
    _controlPoint0;
    _drawLine;
    _lineColor;
    _lineWidth;
    _radiusOrLen;

    constructor(start, control,end) {
        // 初始化控制点
        this._startAnchorPoint = start;
        this._endAnchorPoint = end;
        this._controlPoint0 = control;
        // 初始化渲染属性
        this._drawLine = true;
        this._lineColor  ='black';
        this._lineWidth = 1;
        this._radiusOrLen = 5;
    }

    draw () {
        if(context2D) {
            context2D.save();
            context2D.lineWidth = this._lineWidth;
            context2D.strokeStyle = this._lineColor;

            // 二次贝塞尔曲线绘制代码

            context2D.beginPath();
            context2D.moveTo(this._startAnchorPoint.x, this._startAnchorPoint.y);
            context2D.quadraticCurveTo(this._controlPoint0.x, this._controlPoint0.y, this._endAnchorPoint.x, this._endAnchorPoint.y)
            context2D.stroke();

            if(this._drawLine) {
                // 绘制辅助线
                // 控制起点P0到控制点p1的连线
                strokeLine(this._startAnchorPoint.x, this._startAnchorPoint.y,this._controlPoint0.x, this._controlPoint0.y);

                strokeLine(this._endAnchorPoint.x, this._endAnchorPoint.y, this._controlPoint0.x, this._controlPoint0.y);

                fillRectWithTitle(this._startAnchorPoint.x - (this._radiusOrLen + 5 ) *0.5, this._startAnchorPoint.y - (this._radiusOrLen + 5) * 0.5, (this._radiusOrLen + 5) * 0.5, this._radiusOrLen + 5, undefined, undefined, 'green', false)
                fillRectWithTitle(this._endAnchorPoint.x - (this._radiusOrLen + 5 ) *0.5, this._endAnchorPoint.y - (this._radiusOrLen + 5) * 0.5, (this._radiusOrLen + 5) * 0.5, this._radiusOrLen + 5, undefined, undefined, 'blue', false)
                fillCircle(this._controlPoint0.x, this._controlPoint0.y, this._radiusOrLen)
                context2D.restore();
            }
        }
    }

}

// 绘制三次贝塞尔曲线

class CubeBezierCurve extends QuadraticBezierCurve {
    _controlPoint1;
    constructor(start, control0, control1, end) {
        super(start,control0,end);
        this._controlPoint1 = control1;
    }

    draw () {
        if(context2D) {
            context2D.save();
            context2D.lineWidth = this._lineWidth;
            context2D.strokeStyle = this._lineColor;

            // 二次贝塞尔曲线绘制代码

            context2D.beginPath();
            context2D.moveTo(this._startAnchorPoint.x, this._startAnchorPoint.y);
            context2D.bezierCurveTo(this._controlPoint0.x, this._controlPoint0.y,this._controlPoint1.x, this._controlPoint1.y, this._endAnchorPoint.x, this._endAnchorPoint.y)
            context2D.stroke();

            if(this._drawLine) {
                // 绘制辅助线
                // 控制起点P0到控制点p1的连线
                strokeLine(this._startAnchorPoint.x, this._startAnchorPoint.y,this._controlPoint0.x, this._controlPoint0.y);

                strokeLine(this._endAnchorPoint.x, this._endAnchorPoint.y, this._controlPoint1.x, this._controlPoint1.y);

                fillRectWithTitle(this._startAnchorPoint.x - (this._radiusOrLen + 5 ) *0.5, this._startAnchorPoint.y - (this._radiusOrLen + 5) * 0.5, (this._radiusOrLen + 5) * 0.5, this._radiusOrLen + 5, undefined, undefined, 'green', false)
                fillRectWithTitle(this._endAnchorPoint.x - (this._radiusOrLen + 5 ) *0.5, this._endAnchorPoint.y - (this._radiusOrLen + 5) * 0.5, (this._radiusOrLen + 5) * 0.5, this._radiusOrLen + 5, undefined, undefined, 'blue', false)
                fillCircle(this._controlPoint0.x, this._controlPoint0.y, this._radiusOrLen);
                fillCircle(this._controlPoint1.x, this._controlPoint1.y, this._radiusOrLen)
                context2D.restore();
            }
        }
    }
}


