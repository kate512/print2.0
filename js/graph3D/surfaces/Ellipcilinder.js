Surfaces.prototype.ellipcilinder = (count = 10, R = 20) => {
    const points = [];
    const polygons = [];
    const edges = [];
    //z = x^2 /2
    //точки
    //const size = 20;
    const delta = Math.PI * 2 / count;
    let t = 0;
    for (let i = 0; i <= Math.PI * 2; i += delta) {
        for (let j = 0; j < Math.PI * 2; j += delta) {
            const x = R * Math.cos(j);
            const y = R * Math.sin(j);
            const z = t;
            points.push(new Point(x, y, z));
        }
        t++;
    }

    for (let i = 0; i < points.length; i++) {
        //ребра по 
        if (i + 1 < points.length && (i + 1) % count != 0) {
            edges.push(new Edge(i, i + 1));
        } else if ((i + 1) % count === 0) {
            edges.push(new Edge(i, i + 1 - count));
        }
        //ребра по вертикали
        if (i + count < points.length) {
            edges.push(new Edge(i, i + count));
        }
        //полигоны
        if (i + 1 + count < points.length && (i + 1) % count != 0) {
            polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count]));
        } else if (i + count < points.length && (i + 1) % count === 0) {
            polygons.push(new Polygon([i, i + 1 - count, i + 1, i + count]));
        }
    }




    return new Subject(points, edges, polygons);
}