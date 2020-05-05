Surfaces.prototype.bublik = ( R = 20,  count = 10, point = new Point(0, 0, 0), color = '#ffffff', animation = null ) => {
    let points = [];
    const points1 = [];
    const points2 = [];
    const edges = [];
    const polygons = [];
    const r = R - R / 4;
    const fi = 2 * Math.PI / count;
    //points
    for(let i = 0; i < count; i++){
        let t = fi * i;
        points1[i] = new Point(point.x + R*Math.cos(t), point.y + R*Math.sin(t)); 
        points2[i] = new Point(point.x + r*Math.cos(t), point.y + r*Math.sin(t)); 
    }
    points = points1.concat(points2);
    //ребра соединяем
    let i = 0;
    for(i = 0; i < count; i++){
        edges[i] = new Edge(i, i + count); 
    }
    i++;
    edges[i] = new Edge(count - 1, 0);
    i++;
    for(let j = 0; j < count - 1; j++){
        edges[i] = new Edge(j, j + 1);
        i++;
    }
    i++;
    edges[i] = new Edge(2 * count - 1, count);
    i++;
    for(let j = count; j < points.length - 1; j++){
        edges[i] = new Edge(j, j + 1);
        i++;
    }
    
    //polygons соединяем
    i++;
    let j = count - 1;
    for (let i = 0; i < count - 1; i ++) {
        j ++;
        if (i % 2 == 0){
            polygons.push(new Polygon([i, i + 1, j + 1, j], color));//pink
        }else{
            polygons.push(new Polygon([i, i + 1, j + 1, j], color));//yellow
        }
    }
    if (i % 2 == 0){
        polygons.push(new Polygon([0, count - 1, 2 * count - 1,  count], color))//pink
    }else{
        polygons.push(new Polygon([0, count - 1, 2 * count - 1,  count], color))//yellow
    }
    return new Subject(points, edges, polygons, animation);
}