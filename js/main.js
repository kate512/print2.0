window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
window.onload = function () {
    //окно через которое мы смотрим
    const WINDOW = {
        LEFT: -10,
        BOTTOM: -10,
        WIDTH: 20,
        HEIGHT: 20,
        CENTER: new Point(0, 0, -900),
        CAMERA: new Point(0, 0, -1000)
    };

    const ZOOM_OUT = 1.1;
    const ZOOM_IN = 0.9;
    let canMove = false;
    let canPrint = {
        points: false,
        edges: false,
        polygons: true
    }

    const sur = new Surfaces;
    const canvas = new Canvas({
        id: 'canvas', width: 800, height: 800, WINDOW,
        callbacks: { wheel, mousedown, mousemove, mouseup }
    });
    const graph3D = new Graph3D({ WINDOW });
    const ui = new UI({ callbacks: { move, printPoints, printEdges, printPolygons } });

    const LIGHT = new Light(0, 0, 0, 700); //источник света2
    const LIGHTS = [LIGHT];

    /*const LIGHT1 = new Light(-10, 2, -30, 700); //источник света1
    const LIGHT2 = new Light(15, 14, -30, 300); //источник света2
    const LIGHTS = [LIGHT1, LIGHT2];*/

    //const SCENE = [sur.cube()];
    //const SCENE = [sur.bublik()];
    /*const SCENE = [
        sur.sphera(40, 6, new Point(0, 0, 0), '#ffff00', {rotateOz : new Point(0, 0, 0)}),
        sur.sphera(40, 3, new Point(-6, 1, -6), '#2499ff', {rotateOz : new Point(-6, 1, -6)}),//голубой
        sur.sphera(40, 2, new Point(6, 0, -8), '#ffde5a'),//оранжевый
    ];*/
    //const SCENE = [sur.ellipsoid()];
    //const SCENE = [sur.hyperparaboloid()];
    //const SCENE = [sur.hypercilinder()];
    //const SCENE = [sur.parabolcilinder()];
    //const SCENE = [sur.ellipcilinder()];
    //const SCENE = [sur.onepolhyper()];
    //const SCENE = [sur.twopolhyper()];

    const SCENE = [
        sur.sphera(40, 20, new Point(0, 0, 0), '#ffff00', {rotateOz : new Point(0, 0, 0)}),// sun

        sur.sphera(40, 2, new Point(-30, 0, 0), '#FFA07A', {rotateOz : new Point(0, 0, 0)}),// mercurei
        sur.sphera(40, 4, new Point(40, 10, 0), '#FF4500', {rotateOz : new Point(0, 0, 0)}),// venera
        sur.sphera(40, 6, new Point(55, -20, 0), '#00BFFF', {rotateOz : new Point(0, 0, 0)}),// zemly
        sur.sphera(40, 1, new Point(65, -20, 0), '#FFFFE0', {rotateOz : new Point(0, 0, 0)}),// luna
        sur.sphera(40, 3, new Point( 0, -75, 0), '#B22222', {rotateOz : new Point(0, 0, 0)}),// mars
        //пояс астероидов
        sur.sphera(40, 12, new Point( 0, 105, 0), '#8B4513', {rotateOz : new Point(0, 0, 0)}),// upiter
        sur.sphera(40, 10, new Point(-130, 0, 0), '#FFE4C4', {rotateOz : new Point(0, 0, 0)}),// saturn
        sur.bublik(15, 30, new Point(-130, 0, 0), '#FFE4C4', {rotateOz : new Point(0, 0, 0)}),
        sur.sphera(40, 8, new Point(160, 0, 0), '#ADD8E6', {rotateOz : new Point(0, 0, 0)}),// uran
        sur.sphera(40, 7, new Point( 0,-180, 0), '#0000FF', {rotateOz : new Point(0, 0, 0)}),// neptun








    ]
    
    //about callbacks
    function wheel(event) {
        const delta = (event.wheelDelta > 0) ? ZOOM_IN : ZOOM_OUT;
        SCENE.forEach(subject => {
            subject.points.forEach(point => graph3D.zoom(delta, point));
            if (subject.animation) {
                for(let key in subject.animation){
                    graph3D.zoom(delta, subject.animation[key]);
                }
            }
        });
    }
    function mousedown() {
        canMove = true;
    }
    function mouseup() {
        canMove = false;
    }
    function mousemove(event) {
        if (canMove) {
            let alphaX = -0.01 * event.movementX;
            let alphaY = -0.01 * event.movementY;
            SCENE.forEach(subject => {
                subject.points.forEach(point => graph3D.rotateOx(alphaY, point));
                if (subject.animation) {
                    for(let key in subject.animation){
                        graph3D.rotateOx(alphaY, subject.animation[key]);
                    }
                }
            });
            SCENE.forEach(subject => {
                subject.points.forEach(point => graph3D.rotateOy(alphaX, point));
                if (subject.animation) {
                    for(let key in subject.animation){
                        graph3D.rotateOy(alphaX, subject.animation[key]);
                    }
                }
            });
        }
    }

    function printPoints(value) {
        canPrint.points = value;
    }

    function printEdges(value) {
        canPrint.edges = value;

    }

    function printPolygons(value) {
        canPrint.polygons = value;

    }

    function move(direction) {
        if (direction === 'up' || direction === 'down') {
            const delta = (direction === 'up') ? 1 : -1;
            SCENE.forEach(subject => subject.points.forEach(point => graph3D.moveOy(delta, point)));
        }
        if (direction === 'left' || direction === 'right') {
            const delta = (direction === 'right') ? 1 : -1;
            SCENE.forEach(subject => subject.points.forEach(point => graph3D.moveOx(delta, point)));
        }
    }

    function printAllPolygons() {
        if (canPrint.polygons) {//полигоны
            const polygons = [];
            let lit;//для света
            SCENE.forEach(subject => {
                //отсечь невидимые грани
                //graph3D.calcGorner(subject, WINDOW.CAMERA);

                //алгоритм художника
                let t = 0;//для света
                graph3D.calcDistance(subject, WINDOW.CAMERA, 'distance', t);// дистанция от полигона до камеры        

                LIGHTS.forEach(LIGHT => {
                    graph3D.calcDistance(subject, LIGHT, 'lumen', t);
                    t++;
                })// дистанция для освещенности
                lit = t;
                //graph3D.calcDistance(subject, LIGHT, 'lumen');

                for (let i = 0; i < subject.polygons.length; i++) {
                    if (subject.polygons[i].visible) {
                        const polygon = subject.polygons[i];
                        const point1 = {
                            x: graph3D.xs(subject.points[polygon.points[0]]),
                            y: graph3D.ys(subject.points[polygon.points[0]])
                        };
                        const point2 = {
                            x: graph3D.xs(subject.points[polygon.points[1]]),
                            y: graph3D.ys(subject.points[polygon.points[1]])
                        };
                        const point3 = {
                            x: graph3D.xs(subject.points[polygon.points[2]]),
                            y: graph3D.ys(subject.points[polygon.points[2]])
                        };
                        const point4 = {
                            x: graph3D.xs(subject.points[polygon.points[3]]),
                            y: graph3D.ys(subject.points[polygon.points[3]])
                        };

                        let { r, g, b } = polygon.color;
                        //const lumen = graph3D.calcIllumination(polygon.lumen, LIGHT.lumen);
                        const lumen = [];
                        LIGHTS.forEach(LIGHT => {
                            for (let i = 0; i < polygon.lumen.length; i++) {
                                lumen[i] = graph3D.calcIllumination(polygon.lumen[i], LIGHT.lumen);
                            }
                        })
                        let lum = 0;//min поиск максимального освещения полигона

                        for (let i = 0; i < lumen.length; i++) {
                            if (lum < lumen[i]) {
                                lum = lumen[i];
                            }
                        }
                        r = Math.round(r * lum);
                        g = Math.round(g * lum);
                        b = Math.round(b * lum);
                        polygons.push({
                            points: [point1, point2, point3, point4],
                            color: polygon.rgbToHex(r, g, b),
                            distance: polygon.distance
                        });
                    }


                }
            });

            //отрисовка всех полигонов
            for (let t = 0; t < lit; t++) {
                polygons.sort((a, b) => b.distance[t] - a.distance[t]);
            }
            polygons.forEach(polygon => canvas.polygon(polygon.points, polygon.color));
            
        }
    }


    //рисовка    
    function printSubject(subject) {
        if (canPrint.edges) {//рисуем ребра
            subject.edges.forEach(edge => {
                let point1 = subject.points[edge.p1];
                let point2 = subject.points[edge.p2];

                canvas.line(graph3D.xs(point1),
                    graph3D.ys(point1),
                    graph3D.xs(point2),
                    graph3D.ys(point2));
            });
        }
        if (canPrint.points) {//рисуем точки
            subject.points.forEach(point => {
                canvas.point(graph3D.xs(point), graph3D.ys(point))
            });

        }
    }

    function render() {
        canvas.clear();
        printAllPolygons();
        SCENE.forEach(subject => printSubject(subject));
        canvas.text(canvas.sx(15), canvas.sy(25), 'FPS:');
        canvas.text(canvas.sx(65), canvas.sy(25), FPSout);
    }

    function animation() {
        // закрутить фигуру
        SCENE.forEach(subject => {
            if (subject.animation) {
                for (let key in subject.animation) {
                    const {x, y, z} = subject.animation[key];
                    const xn = WINDOW.CENTER.x - x;
                    const yn = WINDOW.CENTER.y - y;
                    const zn = WINDOW.CENTER.z - z;
                    //переместить центр объекта в центр координат
                    subject.points.forEach(point => graph3D.move(xn, yn, zn, point));
                    //повращать объект
                    const alpha = Math.PI / 100;
                    subject.points.forEach(point => graph3D[key] (alpha, point));
                    //переместить обратно
                    subject.points.forEach(point => graph3D.move(-xn, -yn, -zn, point));
                    }
            }
        });
    }

    setInterval(animation, 10);


    let FPS = 0;
    let FPSout = 0;
    let timestamp = (new Date()).getTime();
    (function animloop() {
        //считаем FPS
        FPS++;
        const currentTimestamp = (new Date()).getTime();
        if (currentTimestamp - timestamp >= 1000) {
            timestamp = currentTimestamp;
            FPSout = FPS;
            FPS = 0;
        }
        //рисуем сцену
        render();
        requestAnimFrame(animloop);
    })();
}