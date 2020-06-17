class Canvas {
    constructor({ id, width = 500, height = 500, WINDOW = { LEFT: -5, BOTTOM: -5, WIDTH: 20, HEIGHT: 20 }, callbacks = {} } = {}) {
        if (id) {
            this.canvas = document.getElementById(id);
        } else {
            this.canvas = document.createElement('canvas');
            document.querySelector('body').appendChild(this.canvas);
        }
        this.context = this.canvas.getContext('2d');
        this.canvas.width = width;
        this.canvas.height = height;

        this.canvasV = document.createElement('canvas');
        this.contextV = this.canvasV.getContext('2d');
        this.canvasV.width = width;
        this.canvasV.height = height;

        this.WINDOW = WINDOW;
        this.PI2 = 2 * Math.PI;

        const wheel = (callbacks.wheel instanceof Function) ? callbacks.wheel : function () { };
        const mousemove = (callbacks.mousemove instanceof Function) ? callbacks.mousemove : function () { };
        const mouseup = (callbacks.mouseup instanceof Function) ? callbacks.mouseup : function () { };
        const mousedown = (callbacks.mousedown instanceof Function) ? callbacks.mousedown : function () { };
        this.canvas.addEventListener('wheel', wheel);
        this.canvas.addEventListener('mousemove', mousemove);
        this.canvas.addEventListener('mouseup', mouseup);
        this.canvas.addEventListener('mousedown', mousedown);
    }

    xs(x) {
        return (x - this.WINDOW.LEFT) / this.WINDOW.WIDTH * this.canvas.width;
    }
    ys(y) {
        return this.canvas.height - (y - this.WINDOW.BOTTOM) / this.WINDOW.HEIGHT * this.canvas.height;
    }
    xsPolygon(x) {
        return x / this.WINDOW.WIDTH * this.canvas.width  ;
    }
    ysPolygon(y) {
        return this.canvas.height - y / this.WINDOW.HEIGHT * this.canvas.height ;
    }
    sx(x) {
        return x * this.WINDOW.WIDTH / this.canvas.width;
    }
    sy(y) {
        return - y * this.WINDOW.HEIGHT / this.canvas.height;
    }

    clear(color = '#eee') {
        this.contextV.fillStyle = color;
        this.contextV.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    line(x1, y1, x2, y2, color = '#0f0', width = 2) {
        this.contextV.beginPath();
        this.contextV.strokeStyle = color;
        this.contextV.lineWidth = width;
        this.contextV.moveTo(this.xsPolygon(x1), this.ysPolygon(y1));
        this.contextV.lineTo(this.xsPolygon(x2), this.ysPolygon(y2));
        this.contextV.stroke();
    }

    point(x, y, color = '#f00', size = 1) {
        this.contextV.beginPath();
        this.contextV.strokeStyle = color;
        this.contextV.arc(this.xsPolygon(x), this.ysPolygon(y), size, 0, this.PI2);
        this.contextV.stroke();
    }

    text(x, y, text, font = '25px bold Arial', color = '#000') {
        this.contextV.fillStyle = color;
        this.contextV.font = font;
        this.contextV.fillText(text, this.xs(x), this.ys(y));

    }


    polygon(points, color = '#008800BB') {
        this.contextV.fillStyle = color;
        this.contextV.fillStroke = color;
        this.contextV.beginPath();
        this.contextV.moveTo(this.xsPolygon(points[0].x), this.ysPolygon(points[0].y));
        for (let i = 1; i < points.length; i++) {
            this.contextV.lineTo(this.xsPolygon(points[i].x), this.ysPolygon(points[i].y));
        }
        this.contextV.closePath();
        this.contextV.fill();
    }

    render() {
        this.context.drawImage(this.canvasV, 0, 0);
    }
}