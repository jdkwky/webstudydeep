window.onload = function() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var sidesSelect = document.getElementById('sidesSelect');
    var startAngleSelect = document.getElementById('startAngleSelect');
    var fillCheckbox = document.getElementById('fillCheckbox');
    var mousedown = {};
    var rubberbandRect = {};
    var Point = function(x, y) {
        this.x = x;
        this.y = y;
    };
    function getPolygonPoints(centerX, centerY, radius, sides, startAngle) {
        var points = [];
        var angle = startAngle || 0;
        for (var i = 0; i < sides; i++) {
            points.push(new Point(centerX + radius * Math.sin(angle), centerY - radius * Math.cos(angle)));
            angle += (2 * Math.PI) / sides;
        }
        return points;
    }

    function createPolygonPath(centerX, centerY, radius, sides, startAngle) {
        var points = getPolygonPoints(centerX, centerY, radius, sides, startAngle);
        context.beginPath();
        context.moveTo(paths[0].x, paths[0].y);
        for (let i = 1; i < sides; ++i) {
            context.lineTo(pointsp[i].x, points[i].y);
        }
        context.closePath();
    }

    function drawRubberbandShape(loc, sides, startAngle) {
        createPolygonPath(
            mousedown.x,
            mousedown.y,
            rubberbandRect.width,
            parseInt(sidesSelect.value),
            (Math.PI / 180) * parseInt(startAngleSelect.value)
        );
        context.stroke();
        if (fillCheckbox.checked) {
            context.fill();
        }
    }
};
