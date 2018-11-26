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
    // function drawCircle() {
    //     context.beginPath();
    //     context.arc(canvas.width / 2, canvas.height / 2, RADIUS, 0, Math.PI * 2, true);
    //     context.stroke();
    // }

    // function drawNumerals() {
    //     var numerals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    //         angle = 0,
    //         numeralWidth = 0;
    //     numerals.forEach(function(numeral) {
    //         angle = (Math.PI / 6) * (numeral - 3);
    //         numeralWidth = context.measureText(numeral).width;
    //         context.fillText(
    //             numeral,
    //             canvas.width / 2 + Math.cos(angle) * HAND_RADIUS - numeralWidth / 2,
    //             canvas.height / 2 + Math.sin(angle) * HAND_RADIUS + FONT_HEIGHT / 3
    //         );
    //     });
    // }
    // function drawCenter() {
    //     context.beginPath();
    //     context.arc(canvas.width / 2, canvas.height / 2, 5, 0, Math.PI * 2, true);
    //     context.fill();
    // }
    // function drawHand(loc, isHour) {
    //     var angle = Math.pi * 2 * (loc / 60) - Math.PI / 2,
    //         handRadius = isHour ? RADIUS - HAND_TRUNCATION - HOUR_HAND_TRUNCATION : RADIUS - HAND_TRUNCATION;
    //     context.moveTo(canvas.width / 2, canvas.height / 2);
    //     context.lineTo(
    //         canvas.width / 2 + Math.cos(angle) * handRadius,
    //         canvas.height / 2 + Math.sin(angle) * handRadius
    //     );
    //     context.stroke();
    // }
    // function drawHands() {
    //     var date = new Date(),
    //         hour = date.getHours();
    //     hour = hour > 12 ? hour - 12 : hour;
    //     drawHand(hour * 5 + (date.getMinutes() / 60) * 5, true, 0.5);
    //     drawHand(date.getMinutes(), false, 0.5);
    //     drawHand(date.getSeconds(), false, 0.2);
    // }
    // function drawClock() {
    //     context.clearRect(0, 0, canvas.width, canvas.height);
    //     drawCircle();
    //     drawCenter();
    //     drawHands();
    //     drawNumerals();
    // }

    // context.font = FONT_HEIGHT + 'px Arial';
    // // loop = setInterval(drawClock, 1000);
    // // end draw click

    // // start rect
    // function drawRect() {
    //     context.lineJoin = 'round';
    //     context.lineWidth = 1;
    //     // 描边
    //     context.strokeStyle = 'red';
    //     // 填充
    //     context.fillStyle = 'green';
    //     // 线性渐变
    //     var gradient = context.createLinearGradient(150, 0, 150, 220); // 两点之间的线性变化 颜色
    //     gradient.addColorStop(0, 'blue');
    //     gradient.addColorStop(0.25, 'white');
    //     gradient.addColorStop(0.5, 'purple');
    //     gradient.addColorStop(0.75, 'red');
    //     gradient.addColorStop(1, 'yellow');
    //     // 放射渐变
    //     var gradient2 = context.createRadialGradient(150, 0, 50, 150, 220, 50);
    //     gradient2.addColorStop(0, 'blue');
    //     gradient2.addColorStop(0.25, 'white');
    //     gradient2.addColorStop(0.5, 'purple');
    //     gradient2.addColorStop(0.75, 'red');
    //     gradient2.addColorStop(1, 'yellow');

    //     // shadow
    //     context.shadowColor = 'rgba(0,0,0,.7)';
    //     (context.shadowOffsetX = 2), (context.shadowOffsetY = 2);
    //     context.shadowBlur = 10;

    //     context.strokeRect(100, 20, 100, 100);

    //     context.fillStyle = gradient2;

    //     context.fillRect(100, 120, 100, 100);
    //     context.strokeText('hello World', 300, 30);
    //     context.fillText('hello world', 100, 200);
    // }
    // // drawRect();
    // // rect end

    // // stroke path
    // function strokeRect() {
    //     context.strokeStyle = 'red';
    //     context.fillStyle = 'green';
    //     context.beginPath();
    //     context.rect(10, 10, 100, 100);
    //     context.stroke();
    //     context.fill();

    //     context.beginPath();
    //     context.rect(50, 50, 100, 100);
    //     context.stroke();
    // }
    // strokeRect();

    // function drawTwoArcs() {
    //     context.beginPath();
    //     context.strokeStyle = undefined;
    //     context.arc(300, 190, 150, 0, Math.PI * 2, false);
    //     context.arc(300, 190, 100, 0, Math.PI * 2, true);
    //     context.fill();
    //     context.shadowColor = undefined;
    //     context.shadowOffsetX = 0;
    //     context.shadowOffsetY = 0;
    //     context.stroke();
    // }
    // drawTwoArcs();
    // // end stroke path

    // // draw line
    // function drawLine() {
    //     context.strokeStyle = 'rgba(0,0,0,.5)';

    //     context.lineWidth = 1;
    //     context.beginPath();
    //     context.moveTo(50, 10);
    //     context.lineTo(450, 10);
    //     context.stroke();

    //     context.beginPath();
    //     context.moveTo(50.5, 50.5);
    //     context.lineTo(450.5, 50.5);
    //     context.stroke();
    // }

    // drawLine();
    // 点类
    var Point = function(x, y) {
        this.x = x;
        this.y = y;
    };
    var points = [];
    // 获取点数组
    function getPolygonPoints(centerX, centerY, radius, sides, startAngle) {
        var points = [];
        var angle = startAngle || 0;
        for (var i = 0; i < sides; i++) {
            points.push(new Point(centerX + radius * Math.sin(angle), centerY - radius * Math.cos(angle)));
            angle += (2 * Math.PI) / sides;
        }
        return points;
    }

    // // end draw line
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
    //  计算canvas中的数据点
    function windowToCanvas(x, y) {
        var bbox = canvas.getBoundingClientRect();
        return {
            x: x - bbox.left * (canvas.width / bbox.width),
            y: y - bbox.top * (canvas.height / bbox.height)
        };
    }
    //  将canvas中的数据 保存
    function saveDrawingSurface() {
        drawingSurfaceImageData = context.getImageData(0, 0, canvas.width, canvas.height);
    }
    //  将保存的canvas数据 回放到canvas中
    function restoreDrawingSurface() {
        context.putImageData(drawingSurfaceImageData, 0, 0);
    }

    function updateRubberbandRectangle(loc) {
        rubberbandRect.width = Math.abs(loc.x - mousedown.x);
        rubberbandRect.height = Math.abs(loc.y - mousedown.y);
        if (loc.x > mousedown.x) {
            rubberbandRect.left = mousedown.x;
        } else {
            rubberbandRect.left = loc.x;
        }
        if (loc.y > mousedown.y) {
            rubberbandRect.top = mousedown.y;
        } else {
            rubberbandRect.top = loc.y;
        }
    }
    //  绘制线条详情方法
    function drawRubberbandShape(loc, sides, startAngle) {
        // createPolygonPath();
        context.stroke();

        // context.lineWidth = 6;
        // context.beginPath();
        // context.moveTo(mousedown.x, mousedown.y);
        // context.lineTo(loc.x, loc.y);
        // context.stroke();
    }
    //   绘制线条
    function updateRubberband(loc) {
        updateRubberbandRectangle(loc);
        drawRubberbandShape(loc);
    }

    function drawHorizontalLine(y) {
        context.beginPath();
        context.moveTo(0, y + 0.5);
        context.lineTo(y + 0.5, context.canvas.width, y + 0.5);
        context.stroke();
    }

    function drawVerticalLine(x) {
        context.beginPath();
        context.moveTo(x + 0.5, 0);
        context.lineTo(x + 0.5, context.canvas.height);
        context.stroke();
    }

    function drawGuidewires(x, y) {
        context.save();
        context.strokeStyle = 'rgba(0,0,230,.4)';
        context.lineWidth = 0.5;
        drawVerticalLine(x);
        drawHorizontalLine(y);
        context.restore();
    }

    /**
     * 绘制状态下画图
     * @param {List} pointWraps
     * @param {List} points
     * @param {Boolean} flag
     */

    function createPolygonPath(pointWraps, points, flag) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        pointWraps.forEach(val => {
            drawPath(val.points, true, true);
        });
        drawPath(points, flag, false);
    }

    /**
     * 绘制多边形路径
     * @param {Array} points
     * @param {Boolean} flag
     * @param {Boolean} fill
     *
     */
    function drawPath(points, flag, fill) {
        context.lineWidth = 0.5;
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; ++i) {
            context.lineTo(points[i].x, points[i].y);
        }
        if (flag) {
            context.closePath();
        }

        context.stroke();
        if (fill) {
            context.fillStyle = 'rgba(0,0,0,.2)';
            context.fill();
        }
    }

    /**
     *绘制正常状态中的选中图形状态
     * @param {*} points
     */

    function drawCheckedPath(points, checkDotIndex) {
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        if (checkDotIndex != 0) {
            context.arc(points[0].x, points[0].y, 5, 0, 2 * Math.PI, true);
            context.fillStyle = 'green';
            context.fill();
        } else if (checkDotIndex == 0) {
            context.arc(points[0].x, points[0].y, 5, 0, 2 * Math.PI, true);
            context.fillStyle = 'red';
            context.fill();
        }

        for (let i = 1; i < points.length; ++i) {
            context.moveTo(points[i].x, points[i].y);
            if (checkDotIndex != i) {
                context.arc(points[i].x, points[i].y, 5, 0, 2 * Math.PI, true);
                context.fillStyle = 'green';
                context.fill();
            } else if (checkDotIndex == i) {
                // 正在移动的点
                context.arc(points[i].x, points[i].y, 5, 0, 2 * Math.PI, true);
                context.fillStyle = 'red';
                context.fill();
            }
        }

        // 画线段
        // context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; ++i) {
            context.lineTo(points[i].x, points[i].y);
        }
        context.strokeStyle = 'rgba(255,255,0,.1)';
        context.fillStyle = 'rgba(0,0,0,.1)';

        context.closePath();

        context.stroke();
        context.fill();
    }

    /**
     *
     * @param {Object} points
     * @param {Object} currentPoint
     * 绘制当前数组路径，并判断当前点是否在当前路径中
     */
    function getPath(points, currentPoint) {
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; ++i) {
            context.lineTo(points[i].x, points[i].y);
        }
        context.closePath();
        if (context.isPointInPath(currentPoint.x, currentPoint.y)) {
            return true;
        }
    }
    /**
     * 返回当前点击的点 在哪条路径中
     * @param {Object} currentPoint
     */

    function checkDotInPath(currentPoint) {
        for (let i = 0, len = pointWraps.length; i < len; i++) {
            if (getPath(pointWraps[i].points, currentPoint)) {
                return i;
            }
        }
        return -1;
    }
    /**
     * 绘制非编辑状态情况下路径
     * @param {Number} dIndex
     * @param { Number } checkDotIndex
     */
    function drawAllCheckedPath(dIndex, checkDotIndex) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        pointWraps.forEach((val, index) => {
            if (dIndex != index) {
                drawPath(val.points, true, true);
            } else {
                drawCheckedPath(val.points, checkDotIndex);
            }
        });
    }

    /**
     * 判断鼠标点靠近哪个点
     * @param {Point} dot
     * @param {List <Point>} pointWraps
     */
    function judgeNearLeastDot(pointWraps, checkedIndex, dot, threshold = 5) {
        const currentPoints = pointWraps[checkedIndex].points || [];
        const newPoints = currentPoints.map(val => val.x);
        const currentLines = pointWraps[checkedIndex].lines || [];

        const results = [];
        const resultsMap = {};
        const [index1, index2] = minLine(newPoints, dot.x);
        const x2 = dot.x || 0;
        const y2 = dot.y || 0;
        const p1 = currentPoints[index1];
        const p2 = currentPoints[index2];
       
        const x1 = p1.x;
        const y1 = p1.y;
        const slop = calSlop(p1, p2);
        const verSlop = calVerticalSlop(slop);
        let x = 0;
        let y = 0;
        if (slop != 0 && verSlop != 0) {
            if (y2 == slop * x2 + p1.y - slop * p1.x) {
                // 点在当前直线上
                x = x2;
                y = y2;
            } else {
                x = parseInt((y2 - y1 + slop * x1 - verSlop * x2) / (slop - verSlop));
                y = parseInt(slop * x + y1 - slop * x1);
            }
        } else {
            // 垂直于x轴或平行于x轴
            if (p1.x == p2.x) {
                // 平行于y轴
                x = p1.x;
                y = y2;
            } else if (p1.y == p2.y) {
                // 平行于x轴
                x = x2;
                y = p1.y;
            }
        }
        const l = parseInt(Math.sqrt(Math.pow(x2 - x, 2) + Math.pow(y2 - y, 2)));
        console.log('===========================');
        console.log('p1,p2,l',p1,p2,l,x,y,currentPoints);
        console.log('===========================');
        return {
            // index: i,
            value: l,
            dot: {
                x,
                y
            },
            checkedIndex,
            // vertex
        };

        // for (let i = 0, len = currentLines.length; i < len; i++) {
        //     const x2 = dot.x || 0;
        //     const y2 = dot.y || 0;
        //     const p1 = currentLines[i].p1;
        //     const p2 = currentLines[i].p2;
        //     const slop = calSlop(p1, p2);
        //     const verSlop = calVerticalSlop(slop);
        //     let x = 0;
        //     let y = 0;
        //     const x1 = p1.x || 0;
        //     const y1 = p1.y || 0;

        //     if (slop != 0 && verSlop != 0) {
        //         if (y2 == slop * x2 + p1.y - slop * p1.x) {
        //             // 点在当前直线上
        //             x = x2;
        //             y = y2;
        //         } else {
        //             x = parseInt((y2 - y1 + slop * x1 - verSlop * x2) / (slop - verSlop));
        //             y = parseInt(slop * x + y1 - slop * x1);
        //         }
        //     } else {
        //         // 垂直于x轴或平行于x轴
        //         if (p1.x == p2.x) {
        //             // 平行于y轴
        //             x = p1.x;
        //             y = y2;
        //         } else if (p1.y == p2.y) {
        //             // 平行于x轴
        //             x = x2;
        //             y = p1.y;
        //         }
        //     }

        //     if ((p1.x <= x && x <= p2.x) || (p2.x <= x && x <= p1.x)) {
        //         const l = parseInt(Math.sqrt(Math.pow(x2 - x, 2) + Math.pow(y2 - y, 2)));

        //         // x y 焦点
        //         let vertex = -1;
        //         if (l == 0) {
        //             // 说明是点在线上
        //             const l1 = parseInt(Math.sqrt(Math.pow(p1.x - x2, 2) + Math.pow(p1.y - y2, 2)));
        //             const l2 = parseInt(Math.sqrt(Math.pow(p2.x - x, 2) + Math.pow(p2.y - y, 2)));
        //             if (l1 < threshold) {
        //                 x = p1.x;
        //                 y = p1.y;
        //                 vertex = 0;
        //             } else if (l2 < threshold) {
        //                 x = p2.x;
        //                 y = p2.y;
        //                 vertex = 1;
        //             }
        //         }

        //         results.push(l);
        //         resultsMap[l] = {
        //             index: i,
        //             value: l,
        //             dot: {
        //                 x,
        //                 y
        //             },
        //             checkedIndex,
        //             vertex
        //         };
        //     }
        // }

        // const min = Math.min(...results);

        // return resultsMap[min];
    }
    /**
     * 计算靠近两个点的斜率
     *
     * @param {Point} line1
     * @param {Point} line2
     */
    function calSlop(line1, line2) {
        if (line1.x - line2.x != 0) {
            return parseFloat((line1.y - line2.y) / (line1.x - line2.x));
        }
        return 0;
    }

    /**
     * 计算垂线的斜率
     * @param {Number} slop
     */
    function calVerticalSlop(slop) {
        if (slop != 0) {
            return parseFloat(-1 / slop);
        }
        return 0;
    }

    /**
     * 计算点是否在线左右  阈值可设置
     * @param {Number} threshold
     * @param { List<Point> } pointWraps
     * @param { Number } checkedIndex
     */

    function calcDotNearLine(pointWraps, checkedIndex, dot, threshold = 5) {
        //判断此点距离哪个点最近
        const result = judgeNearLeastDot(pointWraps, checkedIndex, dot);
        if (result && result.value <= threshold) {
            return result;
        }
        return {};
    }

    /**
     * 将一组多边形中的线段两两连线
     * @param {Object} points
     */
    function getLinePath(points) {
        const lines = [];
        for (let i = 0, len = points.length; i < len; i++) {
            if (i < len - 1) {
                lines.push({
                    p1: points[i],
                    p2: points[i + 1]
                });
            } else {
                lines.push({
                    p1: points[i],
                    p2: points[0]
                });
            }
        }
        return lines;
    }

    /**
     * 将编辑图形时产生的点放入到大数组中
     * @param {*} pointWraps
     * @param {*} points
     */
    function editPoints(pointWraps, points) {
        const checkedIndex = points.checkedIndex;
        // 第几条线
        const index = points.index;
        const dot = points.dot;
        const vertex = points.vertex;
        let checkDotIndex = index + vertex;
        if (vertex == -1) {
            // 说明不是个顶点
            pointWraps[checkedIndex].points.splice(index + 1, 0, dot);
            const lines = getLinePath(pointWraps[checkedIndex].points);
            pointWraps[checkedIndex].lines = lines;
            checkDotIndex = index + 1;
        }
        // 重绘
        drawAllCheckedPath(checkedIndex, checkDotIndex);
    }

    /**
     * 鼠标移动时将点数据动态更新到数组中
     * @param {*} pointWraps
     * @param {*} point
     */
    function editMovePoints(pointWraps, currentChecked, point) {
        const checkedIndex = currentChecked.checkedIndex;
        // 第几条线
        const index = currentChecked.index;
        const vertex = currentChecked.vertex;
        let checkDotIndex = vertex + index;
        if (vertex == -1) {
            // 说明不是个顶点
            pointWraps[checkedIndex].points[index + 1] = point;
            checkDotIndex = index + 1;
        } else {
            // 说明是个顶点
            const i = index + vertex;
            pointWraps[checkedIndex].points[i] = point;
        }
        const lines = getLinePath(pointWraps[checkedIndex].points);
        pointWraps[checkedIndex].lines = lines;
        // 重绘
        drawAllCheckedPath(checkedIndex, checkDotIndex);
    }

    //返回传入值的所有索引值
    function findIndex(arr, num, index) {
        var resultArr = [];
        function findAllIndex(arr, num, index) {
            let minIndex = null;
            minIndex = arr.indexOf(num, index);
            if (minIndex == -1) {
                return;
            }
            resultArr.push(minIndex);
            findAllIndex(arr, num, minIndex + 1);
        }
        findAllIndex(arr, num, index);
        return resultArr;
    }

    function minLine(arr, x) {
        let minValue = null;
        let twiceValue = null;
        let newArr = [];
        let minIndex = null;
        //传入数组预处理
        newArr = arr.map(function(currentValue, index, arr) {
            return Math.abs(currentValue - x);
        });
        console.log(newArr);
        //找到最小值
        minNum = Math.min.apply(Math, newArr);
        console.log(minNum);
        //拿到最小值的所有索引值
        let resArr = findIndex(newArr, minNum, 0);
        console.log(resArr);
        //找到最小值相邻的所有索引值
        let tResultArr = [];
        for (var i in resArr) {
            if (newArr[resArr[i] - 1]) {
                tResultArr.push(newArr[resArr[i] - 1]);
            }
            if (newArr[resArr[i] + 1]) {
                tResultArr.push(newArr[resArr[i] + 1]);
            }
        }
        console.log('tresultarr', tResultArr);

        //找到相邻值的最小值
        let tMinNum = Math.min.apply(Math, tResultArr);
        //找到相邻值最小值的索引
        let tResArr = findIndex(newArr, tMinNum, 0);
        console.log(tResArr, tMinNum);

        //所有第一次的最小值和相邻最小值重新组成新的数组
        let indexArr = resArr.concat(tResArr);
        //排序
        let sortIndexArr = indexArr.sort();
        //找到相邻之差最小的两个数
        let temp = {};
        for (let x = 0; x < indexArr.length; x++) {
            for (let y = x + 1; y < indexArr.length; y++) {
                if (!temp.value) {
                    temp.value = Math.abs(indexArr[x] - indexArr[y]);
                    temp.x = indexArr[x];
                    temp.y = indexArr[y];
                } else {
                    if (temp.value > Math.abs(indexArr[x] - indexArr[y])) {
                        temp.value = Math.abs(indexArr[x] - indexArr[y]);
                        temp.x = indexArr[x];
                        temp.y = indexArr[y];
                    }
                }
            }
        }
        console.log(temp);
        //根据索引值出书原数组的值
        return [temp.x, temp.y];
    }

    var pointWraps = [];
    // 测试属性 开始
    var edit = false;
    var checkedIndex = -1;
    var currentChecked = {};
    // 测试属性  结束

    canvas.onmousedown = function(e) {
        var loc = windowToCanvas(e.clientX, e.clientY);
        context.lineWidth = 1;
        e.preventDefault();

        // 编辑状态
        if (edit) {
            if (checkedIndex > -1) {
                // 当前已有选中状态
                const current = calcDotNearLine(pointWraps, checkedIndex, loc);

                if (current.index > -1) {
                    currentChecked = current;
                    // 将当前选中的点添加到数组中
                    editPoints(pointWraps, currentChecked);
                }
            } else {
                const index = checkDotInPath(loc);

                if (index > -1) {
                    checkedIndex = index;
                    drawAllCheckedPath(index);
                }
            }
        } else {
            
            context.beginPath();
            context.moveTo(loc.x, loc.y);
            points.push(new Point(loc.x, loc.y));
        }
    };

    canvas.onmousemove = function(e) {
        var loc;
        e.preventDefault();

        loc = windowToCanvas(e.clientX, e.clientY);
        // 编辑状态
        if (edit) {
            if (checkedIndex > -1) {
                if (Object.keys(currentChecked).length > 0) {
                    // 按下鼠标左键   已经新增当前点
                    editMovePoints(pointWraps, currentChecked, loc);
                } else {
                    const current = calcDotNearLine(pointWraps, checkedIndex, loc);

                    if (current.index > -1) {
                        // 重绘   + 画点
                        drawAllCheckedPath(checkedIndex);
                        const dot = current.dot;
                        const x = dot.x;
                        const y = dot.y;
                        context.moveTo(x, y);
                        context.beginPath();
                        context.fillStyle = 'red';
                        context.arc(x, y, 5, 0, 2 * Math.PI, true);
                        context.fill();
                    } else {
                        // 重绘
                        drawAllCheckedPath(checkedIndex);
                    }
                }
            }
        } else {
            if (points.length > 0) {
                createPolygonPath(pointWraps, points, false, true);

                context.lineTo(loc.x, loc.y);
                context.closePath();
                context.stroke();
            }
        }
    };

    canvas.onmouseup = function(e) {
        var loc;
        e.preventDefault();

        loc = windowToCanvas(e.clientX, e.clientY);
        if (edit) {
            if (checkedIndex > -1) {
                if (Object.keys(currentChecked).length > 0) {
                    editMovePoints(pointWraps, currentChecked, loc);
                    currentChecked = {};
                }
            }
        }
    };

    document.body.onkeydown = function(e) {
        const { keyCode } = e;
        if (keyCode == 13) {
            if (points.length > 0) {
                const lines = getLinePath(points);
                pointWraps.push({ points, lines });
                createPolygonPath(pointWraps, points, true);
                points = [];
                // 测试代码
                if (pointWraps.length > 1) {
                    edit = true;
                }
            }
        }
    };

    eraseAllButton.onclick = function(e) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid(context, 'lightgray', 10, 10);
        saveDrawingSurface();
    };

    strokeStyleSelect.onchange = function(e) {
        context.strokeStyle = strokeStyleSelect.value;
    };

    guidewireCheckbox.onchange = function(e) {
        guidewires = guidewireCheckbox.checked;
    };

    context.strokeStyle = strokeStyleSelect.value;
    context.lineWidth = 20;

    drawGrid(context, 'lightgray', 10, 10);
    saveDrawingSurface();
    // 画圆
    // context.beginPath();
    // context.moveTo(10,10);
    // // context.strokeStyle = "red";
    // context.arc(canvas.width/2,canvas.height/4,80,Math.PI/4,Math.PI,true);
    // context.stroke();
    // // 画圆 另一种方式
    // context.beginPath();
    // context.moveTo(10,10);
    // // context.strokeStyle="green";
    // context.arcTo(50,40,80,10,30);
    // context.stroke();
    // context.fill();
    // // context.fillStyle = 'cornflowerblue';
    // // context.strokeStyle = 'yellow';

    // context.shadowColor = 'rgba(50,50,50,1.0)';
    // context.shadowOffsetX  = 2;
    // context.shadowOffsetY = 2;
    // context.shadowBlur = 4;
    // context.lineWidth = 20;
    // context.lineCap = 'round';
    // context.beginPath();
    // context.moveTo(120.5,130);
    // context.quadraticCurveTo(150.8,130,160.6,150.5);
    // context.quadraticCurveTo(190,250,210.5,160.5);
    // context.quadraticCurveTo(240,100.5,290,70.5);
    // context.stroke();
};
