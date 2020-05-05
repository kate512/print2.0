Surfaces.prototype.sphera = (count = 20, R = 6, point = new Point(0,0,0), color = '#ff0000', animation) => {
    const points = [];
    const polygons = [];
    const edges = [];

    const delta = 2 * Math.PI / count;
    for (let i = 0; i <= Math.PI; i += delta) {
        for (let j = 0; j < 2 * Math.PI; j += delta) {
            points.push(new Point(point.x +R * Math.cos(j) * Math.sin(i),
                                  point.y +R * Math.sin(j) * Math.sin(i),
                                  point.z +R * Math.cos(i)));
        }
    }

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
    }

    return new Subject(points, edges, polygons, animation);
}