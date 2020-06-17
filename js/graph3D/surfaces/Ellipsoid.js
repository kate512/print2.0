    //эллипсоид
Surfaces.prototype.ellipsoid = (ax = 1, ay = 1.5, az = 1, R = 15, count = 20) => {
    const points = [];
    const edges = [];
    const polygons = [];
    //точки
    const fi = 2 * Math.PI / count;
    let ty = Math.PI * 2;  
    for(let j = 0; j < ty; j += fi){
        for(let i = 0; i < ty; i += fi){
            points.push(new Point(R * Math.cos(i) * Math.sin(j) / ax, 
                                  R * Math.cos(j) / ay,
                                  R * Math.sin(j) * Math.sin(i))) / az;
        }
    }

    //ребра
    //вертикальные линии
    for(let i = 0; i < points.length - count; i++){
        edges[i] = new Edge(i, i + count); 
        
    }
    edges.push(new Edge(count, count + count - 1));
    // горизонтальные линии
    for(let j = count; j < points.length - count; j += count){
        let k = 0;
        for(let i = j; k < count - 1; i++){
            edges.push(new Edge(i, i + 1));
            k++;
        }
    }
    
    //polygons рисуем
    for (let i = 0; i < points.length; i ++) {
    
        if ((i + 1  + count) < points.length && ((i + 1) % count) != 0) {
            polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count], '#ffff00'));
        } else if ((i + 1 + count) < points.length ) {
            polygons.push(new Polygon([i, i + 1 - count, i + 1, i + count], '#ffff00'));
            }
    }
    
    return new Subject(points, edges, polygons);
}