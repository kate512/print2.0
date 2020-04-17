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
        CENTER : new Point(0, 0, -30),
        CAMERA : new Point(0, 0, -50)
    };

    const ZOOM_OUT = 1.1;
    const ZOOM_IN = 0.9;
    let canMove = false;

    const sur = new Surfaces;
    const canvas = new Canvas({width: 600, height: 600, WINDOW, 
                               callbacks : {wheel, mousedown, mousemove, mouseup, keydown} }); 
    const graph3D = new Graph3D({WINDOW});

    //const SCENE = [sur.cube()];
    const SCENE = [sur.ellipsoid()];

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

    /*let direction = '';
    function keydown (event) {
        
        if(event.keyCode == 40) { // это код кнопки «Вниз»
            direction = 'down';
          }
        if(event.keyCode == 38) { // это код кнопки «Вниз»
            direction = 'up';
          }
        if (event.keyCode == 39) {
            direction = 'right';
          } 
        if(event.keyCode == 37) {
            direction = 'left';
          }
        console.log(direction);
        if (direction === 'up' || direction === 'down') {
            const delta = (direction === 'up') ? 0.1 : -0.1;
            console.log(delta);
            SCENE.forEach(subject => subject.points.forEach(point => {graph3D.moveOy(delta, point);
                                                                      console.log(point)}));
        }
        if (direction === 'left' || direction === 'right') {
            const delta = (direction === 'right') ? 0.1 : -0.1;
            SCENE.forEach(subject => subject.points.forEach(point => graph3D.moveOx(delta, point)));
        }
    }*/

    function keydown(event){
        if(event.keyCode == 37){
        SCENE.forEach(subject => subject.points.forEach(point => graph3D.moveOx(-1, point)));
        }
        if(event.keyCode == 38){
        SCENE.forEach(subject => subject.points.forEach(point => graph3D.moveOy(1, point)));
        }
        if(event.keyCode == 39){
        SCENE.forEach(subject => subject.points.forEach(point => graph3D.moveOx(1, point)));
        }
        if(event.keyCode == 40){
        SCENE.forEach(subject => subject.points.forEach(point => graph3D.moveOy(-1, point)));
        }
    }

    //рисовка
    let pol = document.querySelector('#polygons');     
    let edg = document.querySelector('#edges');     
    let poi = document.querySelector('#points');     
    function printSubject(subject) {
        //полигоны
    if (pol.checked) {
        graph3D.calcDistance(subject, WINDOW.CAMERA);
        subject.polygons.sort((a, b) => b.distance - a.distance);
        for (let i = 0; i < subject.polygons.length; i++ ) {
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
            canvas.polygon([point1, point2, point3, point4], polygon.color);
        }
    }
        //рисуем ребра
    if (edg.checked) {
        subject.edges.forEach( edge => {
            let point1 = subject.points[edge.p1];
            let point2 = subject.points[edge.p2];
           
            canvas.line(graph3D.xs(point1),
                        graph3D.ys(point1),
                        graph3D.xs(point2),
                        graph3D.ys(point2));
        });
    }
    if (poi.checked) {
        //рисуем точки
        subject.points.forEach(point => {canvas.point(graph3D.xs(point), graph3D.ys(point))
        }); 
    }
    }
    
    function render() {
        canvas.clear();
        SCENE.forEach(subject => printSubject(subject));
        canvas.text(canvas.sx(15), canvas.sy(25), FPSout);
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