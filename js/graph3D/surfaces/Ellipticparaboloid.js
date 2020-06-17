//эллиптический параболоид
Surfaces.prototype.ellipticparaboloid = (count = 30, color = '#FF0000') => {
    let points = [];
    let edges = [];
    let polygons = [];
    const PI = Math.PI;
    let delta = 2 * PI / count;
    let R = 15;
    //точки
    for (let i = 0; i <= PI; i += delta) {
        for (let j = 0; j < 2 * PI; j += delta) {
            const y = R * Math.sin(i) * Math.cos(j) / 4;
            const z = R * Math.sin(i) * Math.sin(j) / 4;
            const x = y * y / 2 + z * z / 2;
            points.push(new Point(x, y, z));
        }
    }
    //рёбра
    for (let i = 0; i < points.length; i++) {
        if ((i + 1) < points.length && (i + 1) % count !== 0) {
            edges.push(new Edge(i, i + 1))
        }
        if (i + count < points.length) {
            edges.push(new Edge(i, i + count))
        }
    }
    //полигоны
    for (let i = 0; i < points.length; i++) {
        if ((i + 1 + count) < points.length && (i + 1) % count !== 0) {
            polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count], color))
        } else if ((i + count) < points.length && (i + 1) % count === 0) {
            polygons.push(new Polygon([i, i + 1 - count, i + 1, i + count], color))
        }
    }
    
    return new Subject(points, edges, polygons);

}