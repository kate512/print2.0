    //однополостный гиперболоид
Surfaces.prototype.onepolhyper = (count = 20, color = '#FF0000') => {
    let points = [];
    let edges = [];
    let polygons = [];
    const PI = Math.PI;
    let delta = 2 * PI / count;
    let a = 2, b = 2, c = 1;

    //точки
    for (let i = -PI; i <= PI; i += delta) {
        for (let j = 0; j < 2 * PI; j += delta) {
            const x = c * Math.sinh(i);
            const y = a * Math.cosh(i) * Math.cos(j);
            const z = b * Math.cosh(i) * Math.sin(j);
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
    for (let i = 0; i < points.length; i++) {
        if ((i + 1 + count) < points.length && (i + 1) % count !== 0) {
            polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count], color))
        } else if ((i + count) < points.length && (i + 1) % count === 0) {
            polygons.push(new Polygon([i, i + 1 - count, i + 1, i + count], color))
        }
    }
    /*
    Эта штука работает, но с ней не так интересно!)
    //заливаем крышечки
    const pol = Math.trunc(count/2);
    for(let i = 0; i < pol - 1; i++) {
        polygons.push(new Polygon([i, i + 1, pol + i, pol + 1 + i], color));
        polygons.push(new Polygon([count * count + i, count *count + 1 + i, count *count + pol + i,count *count + pol + 1 + i], color));
    }
    polygons.push(new Polygon([0, count - 1, pol, pol - 1], color));
    polygons.push(new Polygon([count * count,count *count + count - 1, count *count + pol, count *count + pol - 1], color));
*/
    return new Subject(points, edges, polygons);
}