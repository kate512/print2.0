Surfaces.prototype.onepolhyper = (count = 70, R = 30) => {
    const points = [];
    const polygons = [];
    const edges = [];
    //z = x^2 /2
    //точки
    //const size = 20;
    //const delta = Math.PI * 2 / count;
    //let t = - count / 2;
/*
    for (let i = - count / 2; i < 0; i ++) {
        R = R - i/count;
        for (let j = 0; j < Math.PI * 2; j += delta) {
            const x = R * Math.cos(j);
            const z = i;
            const y = R * Math.sin(j);
            points.push(new Point(x, y, z));
        } 
        //R = R - i;
    }
    */

   const size = 20;
   const delta = size / count;
   for (let i = 0; i < count; i++) {
       for (let j = 0; j < count; j++) {
           const x = i * delta - size / 2;
           const z = j * delta;
           let y = 5 / x;
           points.push(new Point(x, y, z));
       }
   }

/*
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



*/
    return new Subject(points, edges, polygons);
}