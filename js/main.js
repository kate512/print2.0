window.requestAnimFrame = (function () { 
    return window.requestAnimationFrame     || 
        window.webkitRequestAnimationFrame  || 
        window.mozRequestAnimationFrame     || 
        window.oRequestAnimationFrame       || 
        window.msRequestAnimationFrame      || 
        function (callback) { 
            window.setTimeout(callback, 1000 / 60); 
        }; 
})();
window.onload = function() {
    //окно через которое мы смотрим
    const WINDOW = {
        LEFT : -10,
        BOTTOM : -10, 
        WIDTH : 20,
        HEIGHT : 20,
        CENTER : new Point(0, 0, -90),
        CAMERA : new Point(0, 0, -100)
    };

    const ZOOM_OUT = 1.1;
    const ZOOM_IN = 0.9;
    let canMove = false;
    let canPrint =  {
        points : false,
        edges : false,
        polygons : true
    }

    const sur = new Surfaces;
    const canvas = new Canvas({id: 'canvas', width: 600, height: 600, WINDOW, 
                               callbacks : {wheel, mousedown, mousemove, mouseup} }); 
    const graph3D = new Graph3D({WINDOW});
    const ui = new UI({callbacks : {move, printPoints, printEdges, printPolygons}});

    const LIGHT1 = new Light(-10, 2, -30, 100); //источник света1
    const LIGHT2 = new Light( 15, 2, -30, 100); //источник света2
    const LIGHTS = [ LIGHT1, LIGHT2];

    //const SCENE = [sur.sphere(80,40)];
    const SCENE = [sur.ellipsoid()];
    //const SCENE = [sur.hyperparaboloid()];

    function wheel(event) {
        const delta = (event.wheelDelta > 0) ? ZOOM_IN : ZOOM_OUT;
        SCENE.forEach (subject => subject.points.forEach(point => graph3D.zoom(delta, point)));
        
    }
    
    function mousedown(){
        canMove = true;
    }
    function mouseup(){
        canMove = false;
    }
    function mousemove(event) {
        if(canMove){
        let alphaX = -0.01 * event.movementX;
        let alphaY = -0.01 * event.movementY;
        SCENE.forEach(subject => subject.points.forEach(point => graph3D.rotateOx(alphaY, point)));
        SCENE.forEach(subject => subject.points.forEach(point => graph3D.rotateOy(alphaX, point)));
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

    function move (direction) {
        if (direction === 'up' || direction === 'down') {
            const delta = (direction === 'up') ? 1 : -1;
            SCENE.forEach(subject => subject.points.forEach(point => graph3D.moveOy(delta, point)));
        }
        if (direction === 'left' || direction === 'right') {
            const delta = (direction === 'right') ? 1 : -1;
            SCENE.forEach(subject => subject.points.forEach(point => graph3D.moveOx(delta, point)));
        }
    }


    //рисовка    
    function printSubject(subject) {
    if (canPrint.polygons) {//полигоны
        
        //отсечь невидимые грани
        graph3D.calcGorner(subject, WINDOW.CAMERA);

        //алгоритм художника
        let t = 0;
        graph3D.calcDistance(subject, WINDOW.CAMERA, 'distance', t);// дистанция от полигона до камеры        
        subject.polygons.sort((a, b) => b.distance[t] - a.distance[t]);
        
        LIGHTS.forEach(LIGHT => {graph3D.calcDistance(subject, LIGHT, 'lumen', t);
                                 t++; })// дистанция для освещенности
        //graph3D.calcDistance(subject, LIGHT, 'lumen');

        for (let i = 0; i < subject.polygons.length; i++ ) {
            if (subject.polygons[i].visible) {
            const polygon = subject.polygons[i];
            const point1 = {
                x : graph3D.xs(subject.points[polygon.points[0]]), 
                y : graph3D.ys(subject.points[polygon.points[0]])};
            const point2 = {
                x : graph3D.xs(subject.points[polygon.points[1]]), 
                y : graph3D.ys(subject.points[polygon.points[1]])};
            const point3 = {
                x : graph3D.xs(subject.points[polygon.points[2]]), 
                y : graph3D.ys(subject.points[polygon.points[2]])};
            const point4 = {
                x : graph3D.xs(subject.points[polygon.points[3]]), 
                y : graph3D.ys(subject.points[polygon.points[3]])};
                let {r, g, b } = polygon.color;

                //const lumen = graph3D.calcIllumination(polygon.lumen, LIGHT.lumen);
                const lumen = [];
                LIGHTS.forEach(LIGHT => {
                    for (let i = 0; i < polygon.lumen.length; i++) {
                    lumen[i] = graph3D.calcIllumination(polygon.lumen[i], LIGHT.lumen);
                    }
                })
                let lum = 0;//min поиск максимального освещения полигона
                
                for(let i = 0; i < lumen.length; i++) {
                    if (lum < lumen[i]) {
                        lum = lumen[i];
                    }
                }
                r = Math.round(r * lum);
                g = Math.round(g * lum);
                b = Math.round(b * lum);
                canvas.polygon([point1, point2, point3, point4], polygon.rgbToHex(r, g, b));
            }
            

        }
    }
    if (canPrint.edges) {//рисуем ребра
        subject.edges.forEach( edge => {
            let point1 = subject.points[edge.p1];
            let point2 = subject.points[edge.p2];
           
            canvas.line(graph3D.xs(point1),
                        graph3D.ys(point1),
                        graph3D.xs(point2),
                        graph3D.ys(point2));
        });
    }
    if (canPrint.points) {//рисуем точки
        subject.points.forEach(point => {canvas.point(graph3D.xs(point), graph3D.ys(point))
        }); 

    }
    }
    
    function render() {
        //console.log('dgdr');

        canvas.clear();
        SCENE.forEach(subject => printSubject(subject));
        canvas.text(canvas.sx(15), canvas.sy(25), 'FPS:');
        canvas.text(canvas.sx(65), canvas.sy(25), FPSout);
    }

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