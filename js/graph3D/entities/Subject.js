
let subjectId = 0;

class Subject {
    constructor(points = [], edges = [], polygons = [], animation1 = null, animation2 = null) {
        this.id = ++subjectId;
        this.points = points;
        this.edges = edges;
        this.polygons = polygons;
        this.animation1 = animation1;
        this.animation2 = animation2;
    }
}