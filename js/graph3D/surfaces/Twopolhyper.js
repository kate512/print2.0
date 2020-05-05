Surfaces.prototype.twopolhyper = (count = 10, R = 6) => {
    const points = [];
    const polygons = [];
    const edges = [];

    const delta = 2 * Math.PI / count;
    for (let i = 0; i < Math.PI; i += delta) {
        for (let j = -count; j <= count; j ++) {
            points.push(new Point(j, j * j/count, Math.sin(i)));
        }
    }
/*
    //ребра соединяем
    for (let i = 0; i < points.length - count; i++) {
        //вертикальные линии
        if (i + 1 < points.length && (i + 1) % count != 0) {
            edges.push(new Edge(i, i + 1))
        } else if ((i + 1) % count === 0) {
            edges.push(new Edge(i, i + 1 - count));
        }
        // горизонтальные линии
        if (i + count < points.length) {
            edges.push(new Edge(i, i + count));
        }


    }
    
    //polygons рисуем
    for (let i = 0; i < points.length; i++) {
        if (i + 1 + count < points.length && (i + 1) % count !== 0) {
            polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count], color));
        } else if (i + count < points.length && (i + 1) % count === 0) {
            polygons.push(new Polygon([i, i + 1 - count, i + 1, i + count], color));
        }
    }*/

    return new Subject(points, edges, polygons);
}