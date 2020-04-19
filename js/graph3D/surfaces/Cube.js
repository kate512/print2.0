Surfaces.prototype.cube = (x = 0, y = 0, z = 0, size = 10) => {
        return new Subject([new Point(x + size, y + size, z + size), 
                            new Point(x + size, y - size, z + size),
                            new Point(x + size, y - size, z - size),
                            new Point(x + size, y + size, z - size),
                            new Point(x - size, y - size, z - size),
                            new Point(x - size, y + size, z - size),
                            new Point(x - size, y + size, z + size),
                            new Point(x - size, y - size, z + size)],
               [new Edge(0, 1), new Edge(1, 2), new Edge(2, 3), new Edge(3, 0),
                new Edge(4, 5), new Edge(5, 6), new Edge(6, 7), new Edge(7, 4),
                new Edge(0, 6), new Edge(1, 7), new Edge(2, 4), new Edge(3, 5)],
                [
                        new Polygon([0,1,2,3], '#cc80ff'),//фиолетовый
                        new Polygon([2,3,5,4], '#ffff00'),//желтый
                        new Polygon([4,5,6,7], '#2499ff'),//голубой
                        new Polygon([0,3,5,6], '#ff0000'),//красный
                        new Polygon([1,2,4,7], '#ff69b4'),//розовый
                        new Polygon([0,1,7,6], '#ffde5a'),//оранжевый
                        
                ]);
}