//двухполостный гиперболоид
Surfaces.prototype.twopolhyper = (count = 20, color = '#FF0000') => {
    let points = [];
    let edges = [];
    let polygons = [];
    const PI = Math.PI;
    let delta = 2 * PI / count;
    let a = 1, b = 1, c = 1;

    //точки верхней части
    for (let i = 0; i <= PI; i += delta) {
        for (let j = 0; j < 2 * PI; j += delta) {
            const x = c * Math.cosh(i);
            const y = b * Math.cosh(i) * Math.sin(j);
            const z = a * Math.sinh(i) * Math.cos(j);
            points.push(new Point(x, y, z));
        }
    }

    //точки нижней части
    for (let i = 0; i <= PI; i += delta) {
        for (let j = 0; j < 2 * PI; j += delta) {
            const x = -c * Math.cosh(i);
            const y = -b * Math.cosh(i) * Math.sin(j);
            const z = -a * Math.sinh(i) * Math.cos(j);
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
        if ((i + 1) >= count && (i + 1) % count === 0) {
            edges.push(new Edge(i, i - count + 1))
        }
    }

    //полигоны
    for (let i = 0; i < points.length / 2 - count; i++) {
        if ((i + 1 + count) < points.length && (i + 1) % count !== 0) {
            polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count], color))
        } else if ((i + count) < points.length && (i + 1) % count === 0) {
            polygons.push(new Polygon([i, i + 1 - count, i + 1, i + count], color))
        }
    }

    for (let i = points.length / 2; i < points.length; i++) {
        if ((i + 1 + count) < points.length && (i + 1) % count !== 0) {
            polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count], color))
        } else if ((i + count) < points.length && (i + 1) % count === 0) {
            polygons.push(new Polygon([i, i + 1 - count, i + 1, i + count], color))
        }
    }

    return new Subject(points, edges, polygons);
}