
var drawing = false;
//Boton de limpiar
var limpiar;
//Canvas separados para dibujar y para el grafico de las probabilidades

var drawingZone = new p5(function(sketch){
    sketch.setup = function(){
        var canvas = sketch.createCanvas(200,200);
        canvas.parent("LeftSketch");
        canvas.mousePressed(sketch.startDrawing);
        canvas.mouseReleased(sketch.stopDrawing);
        limpiar = sketch.createButton('Limpiar');
        limpiar.parent("Button");
        limpiar.mousePressed(sketch.limpiar_Canvas);
        sketch.background(0);
    }

    sketch.draw = function(){

        if(drawing){
            sketch.stroke(255);
            sketch.strokeWeight(16);
            sketch.line(sketch.pmouseX, sketch.pmouseY, sketch.mouseX, sketch.mouseY);
        }
    }


    sketch.startDrawing = function(){
        drawing = true;
    }

    sketch.stopDrawing = function(){
        drawing = false;
        //Clasifica el número
    }

    sketch.limpiar_Canvas = function(){
        sketch.background(0);
    }
},"LeftSketch");

var chart = new p5(function(sketch){

    sketch.setup = function(){

        var canvas = sketch.createCanvas(200, 200);
        canvas.parent("RightSketch");
        var width = 200, // canvas width and height
              height = 200,
              margin = 20,
              w = width - 2 * margin, // chart area width and height
              h = height - 2 * margin;

        var data = [105, 212, 158, 31, 98, 54,158, 31, 98, 54];
        var width = 200, // canvas width and height
        height = 200,
        margin = 20,
        w = width - 2 * margin, // chart area width and height
        h = height - 2 * margin;
        var barWidth = (h / data.length) * 0.8; // width of bar
        var barMargin = (h / data.length) * 0.4; // margin between two bars

      sketch.createCanvas(width, height);
      sketch.textSize(14);
      sketch.push();

      for(var i = 0; i  < data.length; i++){
          sketch.push();
          if(data[i] === Math.max.apply(null, data)){
              sketch.fill('red');
          }
          else sketch.fill('steelblue');

          sketch.noStroke();
          sketch.translate(0, i* (barWidth + barMargin));
          sketch.rect(0,0,data[i],barWidth);
          sketch.fill('#FFF');
          sketch.text(data[i], 5, barWidth/2 + 5); // write data

          sketch.pop();
      }
      sketch.pop();
    }


}, "RightSketch");
