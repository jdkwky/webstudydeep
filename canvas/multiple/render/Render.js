// 所有不同的绘制不同图形的基类
class Render {
    constructor(parms) {
        cosnt {
            canvasWrap,
                height,
                width,
                strokeColor,
                fillColor,
                textColor
        } = parms || {};
        const maxSize = 20000;
        if (height > maxSize || width > maxSize) {
            console.error('长或宽超出' + maxSize + '限制');
            return;
        }
        // 默认宽度
        this.initWidth = window.innerWidth;
        // 默认高度
        this.initHeight = window.innerHeight;
        // 初始化宽度
        this.width = width;
        // 初始化高度
        this.height = height;
        // 画布
        this.$canvas = null;
        // 画布绘制上下文
        this.context = null;
        // 描边颜色
        this.strokeColor = strokeColor || 'red';
        this.fillColor = fillColor || 'rgba(0,0,240, 0.2)';
        this.textColor = textColor || 'rgba(0,0,240, 0.9)';
    }
    initCanvas(canvasWrap) {

        if (typeof canvasWrap !== 'string') {
            if (canvasWrap.nodeType) {
                // 当前元素中是否存在canvas标签
                this.alreadyHasCanvas();
            } else {
                console.error('canvasWrap 不是已知元素类型 请重新确认');
            }
        } else if (typeof canvasWrap === 'string') {
            this.alreadyHasCanvas();
        } else {
            console.error('canvasWrap 不是已知元素类型 请重新确认');
        }
        // 初始化canvas 大小
    }
    /**
     * 当前元素下是否存在canvas元素
     */
    alreadyHasCanvas(canvasWrap) {
        const hasCanvas = canvasWrap.getElementsByTagName('canvas');
        if (hasCanvas) {
            this.$canvas = hasCanvas;
        } else {
            this.$canvas = this.createCanvas();
        }
        this.context = this.$canvas.getContext('2d');
        // 初始化canvas大小
        this.initCanvasSize();
        canvasWrap.appendChild(this.$canvas);
    }
    /**
     * 创建canvas
     */
    createCanvas() {
        return document.createElement('canvas');
    }
    /**
     * 初始化canvas大小
     */
    initCanvasSize() {
        const width = this.width || this.initWidth;
        const height = this.height || this.initHeight;
        this.$canvas.setAttribute('width', width);
        this.$canvas.setAttribute('height', height);
    }
    /**
     * 清除画布
     */
    clearCanvas() {
        if (this.context) {
            this.context.clearRect(0, 0, this.width, this.height);
        }
    };

    /**
     * 窗口坐标转换为canvas坐标
     * @param x
     * @param y
     * @param canvas 当前画布对象
     * @returns {{x: number, y: number}}
     */
    windowToCanvas(x, y) {
        const bbox = this.$canvas.getBoundingClientRect(); // 获取canvas元素的边界框
        const width = this.$canvas.width;
        const height = this.$canvas.height;
        return {
            x: x - bbox.left * (width / bbox.width),
            y: y - bbox.top * (height / bbox.height)
        };
    }
    update() {
        console.log('base update nothing');
    }

}