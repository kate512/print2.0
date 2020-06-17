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

    const WINDOW = {
        LEFT: -10,
        BOTTOM: -10,
        WIDTH: 20,
        HEIGHT: 20,
        P1: new Point(-10, 10, -30), // левый верхний угол
        P2: new Point(-10, -10, -30), // левый нижний угол
        P3: new Point(10, -10, -30), // правый нижний угол
        CENTER: new Point(0, 0, -30), // центр окошка
        CAMERA: new Point(0, 0, -50) // точка, из которой мы смотрим
    };
    const sur = new Surfaces;
    const ZOOM_OUT = 1.1;
    const ZOOM_IN = 0.9;
    const canvas = new Canvas({ width: 600, height: 600, WINDOW, callbacks: { wheel, mouseup, mouseleave, mousedown, mousemove } });
    const graph3D = new Graph3D({ WINDOW });
    const ui = new UI({ callbacks: { move, printPoints, printEdges, printPolygons, randomColor, subjectOn } });
    const MATH = new Math3D;

    let LIGHT = [
        new Light(10, 10, -30, 900)
    ]; 
   
    let SCENE = [];
    

    let canRotate = false;
    let canPrint = {
        points: false,
        edges: false,
        polygons: true,
        color: false
    }

    function wheel(event) {
        const delta = (event.wheelDelta > 0) ? ZOOM_IN : ZOOM_OUT;
        graph3D.zoomMatrix(delta);
        SCENE.forEach(subject => {
            subject.points.forEach(point => graph3D.transform(point));
            if (subject.animation1) {
                for (let key in subject.animation1) {
                    graph3D.transform(subject.animation1[key]);
                    if (subject.animation2) {
                        for (let key in subject.animation2) {
                            graph3D.transform(subject.animation2[key])
                        }
                    }
                }
            }
        });
    }

    function mouseup() {
        canRotate = false;
    }

    function mouseleave() {
        mouseup();
    }

    function mousedown() {
        canRotate = true;
    }

    function move(direction) {
        if (direction === 'up' || direction === 'down') {
            const delta = (direction === 'up') ? -0.1 : 0.1;
            graph3D.moveMatrix(delta, 0, 0);

        }
        if (direction === 'left' || direction === 'right') {
            const delta = (direction === 'right') ? -0.1 : 0.1;
            graph3D.moveMatrix(0, delta, 0);
        }
        graph3D.transform(WINDOW.CAMERA);
        graph3D.transform(WINDOW.CENTER);
        graph3D.transform(WINDOW.P1);
        graph3D.transform(WINDOW.P2);
        graph3D.transform(WINDOW.P3);
    }

    function mousemove(event) {
        if (canRotate) {
            if (event.movementX) {// крутить вокруг OY
                const alpha = - canvas.sx(event.movementX) / 10;
                graph3D.rotateOxMatrix(alpha);
                graph3D.transform(WINDOW.CAMERA);
                graph3D.transform(WINDOW.CENTER);
                graph3D.transform(WINDOW.P1);
                graph3D.transform(WINDOW.P2);
                graph3D.transform(WINDOW.P3);

            }
            if (event.movementY) {// крутить вокруг OX
                const alpha = canvas.sy(event.movementY) / 10;
                graph3D.rotateOyMatrix(alpha);
                graph3D.transform(WINDOW.CAMERA);
                graph3D.transform(WINDOW.CENTER);
                graph3D.transform(WINDOW.P1);
                graph3D.transform(WINDOW.P2);
                graph3D.transform(WINDOW.P3);
            }
        }
    }

    
    //создание массива объектов
    function subjectOn(canSubjPrint, id) {
        if (canSubjPrint) {
            if (id === 'sunsistem') {
                SCENE = [
                    sur.sphera(40, 20, new Point(0, 0, 0), '#ffff00', {rotateOz : new Point(0, 0, 0)}),// sun
            
                    sur.sphera(20, 2, new Point(-30, 0, 0), '#FFA07A', {rotateOz : new Point(0, 0, 0)}),// mercurei
                    sur.sphera(20, 4, new Point(40, 10, 0), '#FF4500', {rotateOz : new Point(0, 0, 0)}),// venera
                    sur.sphera(20, 6, new Point(55, -20, 0), '#00BFFF', {rotateOz : new Point(0, 0, 0)}),// zemly
                    sur.sphera(20, 1, new Point(65, -20, 0), '#FFFFE0', {rotateOz : new Point(0, 0, 0)}), //, rotateOz: SCENE[3].point// luna
                    sur.sphera(20, 3, new Point( 0, -75, 0), '#B22222', {rotateOz : new Point(0, 0, 0)}),// mars
                    //пояс астероидов
                    sur.sphera(20, 12, new Point( 0, 105, 0), '#8B4513', {rotateOz : new Point(0, 0, 0)}),// upiter
                    sur.sphera(20, 10, new Point(-130, 0, 0), '#FFE4C4', {rotateOz : new Point(0, 0, 0)}),// saturn
                    sur.bublik(15, 30, new Point(-130, 0, 0), '#FFE4C4', {rotateOz : new Point(0, 0, 0)}),
                    sur.sphera(20, 8, new Point(160, 0, 0), '#ADD8E6', {rotateOz : new Point(0, 0, 0)}),// uran
                    sur.sphera(20, 7, new Point( 0,-180, 0), '#0000FF', {rotateOz : new Point(0, 0, 0)}),// neptun
                ];
                LIGHT = [
                    new Light(20, 0, 0, 1000)
                ];
            }
            if (id === 'hypercilinder') {
                SCENE = [
                    sur.hypercilinder(),//гиперболический цилиндр
                ];
            }
            if (id === 'parabolcilinder') {
                SCENE = [
                    sur.parabolcilinder(), //параболический цилиндр 
                ];
            }
            if (id === 'ellipcilinder') {
                SCENE = [
                    sur.ellipcilinder(),//эллиптический цилиндр
                ];
            }
            if (id === 'onepolhyper') {
                SCENE = [
                    sur.onepolhyper(),//однополостный гиперболоид
                ];
            }
            if (id === 'twopolhyper') {
                SCENE = [
                    sur.twopolhyper(),//двухполостный гиперболоид
                ];
            }
            if (id === 'ellipsoid') {
                SCENE = [
                    sur.ellipsoid(),//эллипсоид
                ];
            }
            if (id === 'cone') {
                SCENE = [
                    sur.cone(),//конус
                ];
            }
            if (id === 'sphera') {
                SCENE = [
                    sur.sphera(),//сфера
                ];
            }
            if (id === 'ellipticparaboloid') {
                SCENE = [
                    sur.ellipticparaboloid(),//эллиптический параболоид
                ];
            }
            if (id === 'hyperparaboloid') {
                SCENE = [
                   sur.hyperparaboloid(),//гиперболический параболоид(седло)
                ];
            }
            if (id === 'spheraRand') {
                SCENE = [
                    sur.sphera(20, 10, new Point(0,0,0), 'NULL'),//сфера
                ];
            }
        } else {
            SCENE = [];
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
    function randomColor(value) {
        canPrint.color = value;
    }

    let colorcount = 0;
    let clr;
    let i = 0;
    function randomColorON() {
        if (canPrint.color) {
            if (i === colorcount) {
                clr = graph3D.getRandomColor();
                colorcount--;
            }
            canvas.clear(clr);
            colorcount--;
        } else {
            canvas.clear();
            colorcount = 0;
        }
    }

    function printAllPolygons() {
        // нарисовать полигоны
        if (canPrint.polygons) {
            //набрать полигоны в кучу
            const polygons = [];
            // предаврительные расчёты
            SCENE.forEach(subject => {
                for (let k = 0; k < LIGHT.length; k++) {
                    //graph3D.calcGorner(subject, WINDOW.CAMERA);
                    graph3D.calcCenters(subject);// центры всех полигонов
                    graph3D.calcDistance(subject, WINDOW.CAMERA, 'distance');
                    graph3D.calcDistance(subject, LIGHT[k], 'lumen');
                }
            });
            // расчёт освещённости полигона и его проекции на экран
            SCENE.forEach(subject => {
                //алгоритм художника
                for (let k = 0; k < LIGHT.length; k++) {
                    //отрисовка полигонов
                    for (let i = 0; i < subject.polygons.length; i++) {
                        if (subject.polygons[i].visible) {
                            const polygon = subject.polygons[i];
                            const point1 = graph3D.getProection(subject.points[polygon.points[0]]);
                            const point2 = graph3D.getProection(subject.points[polygon.points[1]]);
                            const point3 = graph3D.getProection(subject.points[polygon.points[2]]);
                            const point4 = graph3D.getProection(subject.points[polygon.points[3]]);
                            let { r, g, b } = polygon.color;
                            const { isShadow, dark } = graph3D.calcShadow(polygon, subject, SCENE, LIGHT[k]);
                           
                            const lumen = (isShadow) ? dark : graph3D.calcIllumination(polygon.lumen, LIGHT[k].lumen)
                            r = Math.round(r * lumen);
                            g = Math.round(g * lumen);
                            b = Math.round(b * lumen);
                            polygons.push({
                                points: [point1, point2, point3, point4],
                                color: polygon.rgbToHex(r, g, b),
                                distance: polygon.distance
                            });
                        }
                    }
                }
            });
            polygons.sort((a, b) => b.distance - a.distance);
            polygons.forEach(polygon => canvas.polygon(polygon.points, polygon.color));
        }
    }

    function printSubject(subject) {
        // нарисовать рёбра
        if (canPrint.edges) {
            for (let i = 0; i < subject.edges.length; i++) {
                const edge = subject.edges[i];
                const point1 = graph3D.getProection(subject.points[edge.p1]);
                const point2 = graph3D.getProection(subject.points[edge.p2]);
                canvas.line(point1.x, point1.y, point2.x, point2.y)
            }
        }

        //нарисовать точки
        if (canPrint.points) {
            for (let i = 0; i <= subject.points.length - 1; i++) {
                const points = graph3D.getProection(subject.points[i]);
                canvas.point(points.x, points.y);
            }
        }
    }

    function render() {

        randomColorON();
        printAllPolygons();
        SCENE.forEach(subject => printSubject(subject));
        canvas.text(WINDOW.LEFT + 0.1, WINDOW.HEIGHT / 2 - 1, 'FPS :')
        canvas.text(WINDOW.LEFT + 2, WINDOW.HEIGHT / 2 - 1, FPSout);
        canvas.render();
    }

    function animation() {
        //закрутим фигуру

        const alpha = Math.PI / 360;

        SCENE.forEach(subject => {

            if (subject.animation1) {

                for (let key in subject.animation1) {

                    let key1 = key;
                    const { x, y, z } = subject.animation1[key1];
                    const xn1 = 0 - x;
                    const yn1 = 0 - y;
                    const zn1 = 0 - z;
                    if (subject.animation2) {

                        for (let key in subject.animation2) {

                            let key2 = key;
                            const { x, y, z } = subject.animation2[key2];
                            const xn2 = 0 - x;
                            const yn2 = 0 - y;
                            const zn2 = 0 - z;

                            let resultrotatematrix = graph3D.multMatrixes(MATH[`${key1}Matrix`](alpha), MATH[`${key2}Matrix`](alpha));
                            let resultmovematrix1 = graph3D.multMatrixes(MATH.moveMatrix(xn1, yn1, zn1), MATH.moveMatrix(xn2, yn2, zn2));
                            let resultmovematrix2 = graph3D.multMatrixes(MATH.moveMatrix(-xn1, -yn1, -zn1), MATH.moveMatrix(-xn2, -yn2, -zn2));

                            graph3D.twoAnimateMatrix(resultmovematrix1, resultrotatematrix, resultmovematrix2);
                            subject.points.forEach(point => graph3D.transform(point));
                        }
                    } else {
                        graph3D.animateMatrix(xn1, yn1, zn1, key1, -alpha, -xn1, -yn1, -zn1);
                        subject.points.forEach(point => graph3D.transform(point));
                    }
                }
            }
        });
    }

    setInterval(animation, 10);

    let FPS = 0;
    let FPSout;
    let timestamp = (new Date()).getTime();


    (function animloop() {
        FPS++;
        const currentTimestamp = (new Date()).getTime();
        if (currentTimestamp - timestamp >= 1000) {
            timestamp = currentTimestamp;
            FPSout = FPS;
            FPS = 0;
        };
        graph3D.calcPlaneEquation();
        graph3D.calcWindowVectors();
        render();
        requestAnimationFrame(animloop);
    })();
}
