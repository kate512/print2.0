    //эллиптический цилиндр
Surfaces.prototype.ellipcilinder = (count = 10, R = 10, color = '#ff0000', animation) => {
    const points = [];
    const polygons = [];
    const edges = [];
    //точки
    const delta = Math.PI * 2 / count;
    let t = 0;
    for (let i = 0; i <= Math.PI * 2; i += delta) {
        for (let j = 0; j < Math.PI * 2; j += delta) {
            const x = R * Math.cos(j);
            const y = R * Math.sin(j);
            const z = t;
            points.push(new Point(x, y, z));
        }
        t+=2;
    }

    for (let i = 0; i < points.length; i++) {
        //ребра по 
        if (i + 1 < points.length && (i + 1) % count !== 0) {
            edges.push(new Edge(i, i + 1));
        }  
        if ((i + 1) % count === 0) {
            edges.push(new Edge(i, i + 1 - count));
        }
        //ребра по вертикали
        if (i + count < points.length) {
            edges.push(new Edge(i, i + count));
        }

        //полигоны
        if (i + 1 + count < points.length && (i + 1) % count !== 0) {
            polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count], color));
        } else if (i + count < points.length && (i + 1) % count === 0) {
            polygons.push(new Polygon([i, i + 1 - count, i + 1, i + count], color));
        }
    }
    //заливаем крышечки
    const pol = Math.trunc(count/2);
    for(let i = 0; i < pol -1; i++) {
        polygons.push(new Polygon([i, i + 1, pol + i, pol + 1 + i], color));
        polygons.push(new Polygon([count * count + i, count *count + 1 + i, count *count + pol + i,count *count + pol + 1 + i], color));
    }
    polygons.push(new Polygon([0, count - 1, pol, pol - 1], color));
    polygons.push(new Polygon([count * count,count *count + count - 1, count *count + pol, count *count + pol - 1], color));





    return new Subject(points, edges, polygons);
}