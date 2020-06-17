class UI {
  constructor({ callbacks = {} }) {
    //callbacks
    this.move = (callbacks.move instanceof Function) ? callbacks.move : function () { };

    const printPoints = (callbacks.printPoints instanceof Function)? callbacks.printPoints: function () { }
    const printEdges = (callbacks.printEdges instanceof Function)? callbacks.printEdges: function () { }
    const printPolygons = (callbacks.printPolygons instanceof Function)? callbacks.printPolygons: function () { }
    const randomColor = (callbacks.randomColor instanceof Function)? callbacks.randomColor: function () { }
    const subjectOn = (callbacks.subjectOn instanceof Function)? callbacks.subjectOn: function () { }


    //events
    document.addEventListener('keydown', event => this.keyDown(event));
    document.getElementById('printPoints').addEventListener('click', function () { printPoints(this.checked); })
    document.getElementById('printEdges').addEventListener('click', function () { printEdges(this.checked); })
    document.getElementById('printPolygons').addEventListener('click', function () { printPolygons(this.checked); })
    document.getElementById('randomColor').addEventListener('click', function () { randomColor(this.checked); })

    document.getElementById('sunsistem').addEventListener('click', function () { subjectOn(this.checked, 'sunsistem'); })
    document.getElementById('hypercilinder').addEventListener('click', function () { subjectOn(this.checked, 'hypercilinder'); })
    document.getElementById('parabolcilinder').addEventListener('click', function () { subjectOn(this.checked, 'parabolcilinder'); })
    document.getElementById('ellipcilinder').addEventListener('click', function () { subjectOn(this.checked, 'ellipcilinder'); })
    document.getElementById('onepolhyper').addEventListener('click', function () { subjectOn(this.checked, 'onepolhyper'); })
    document.getElementById('twopolhyper').addEventListener('click', function () { subjectOn(this.checked, 'twopolhyper'); })
    document.getElementById('ellipsoid').addEventListener('click', function () { subjectOn(this.checked, 'ellipsoid'); })
    document.getElementById('cone').addEventListener('click', function () { subjectOn(this.checked, 'cone'); })
    document.getElementById('sphera').addEventListener('click', function () { subjectOn(this.checked, 'sphera'); })
    document.getElementById('ellipticparaboloid').addEventListener('click', function () { subjectOn(this.checked, 'ellipticparaboloid'); })
    document.getElementById('hyperparaboloid').addEventListener('click', function () { subjectOn(this.checked, 'hyperparaboloid'); })

    document.getElementById('spheraRand').addEventListener('click', function () { subjectOn(this.checked, 'spheraRand'); })
    
  }

  keyDown(event) {
    switch (event.keyCode) {
      case 37: return this.move('left');
      case 38: return this.move('up');
      case 39: return this.move('right');
      case 40: return this.move('down');
    }
  }
}