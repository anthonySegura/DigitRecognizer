
var drawing = false;
var next = false;

//Canvas separados para dibujar y para el grafico de las probabilidades

var drawingZone = new p5(function(sketch){
    sketch.setup = function(){
        var canvas = sketch.createCanvas(200,200);
        canvas.parent("LeftSketch");
        canvas.mousePressed(sketch.startDrawing);
        canvas.mouseReleased(sketch.stopDrawing);

        sketch.background(0);
    }

    sketch.draw = function(){

        if(drawing){
            sketch.stroke(255);
            sketch.strokeWeight(16);
            sketch.line(sketch.pmouseX, sketch.pmouseY, sketch.mouseX, sketch.mouseY);
        }
    }

    sketch.predict = function(){
        var img = sketch.get();
        var base64 = img.canvas.toDataURL();
        var cleaned = base64.replace('data:image/png;base64,', '');

        uploadImage(cleaned);
        next = true;
    }

    sketch.startDrawing = function(){
        drawing = true;
        if(next){
            sketch.background(0);
            next = false;
        }
    }

    sketch.stopDrawing = function(){
        drawing = false;
        //Clasifica el número
        sketch.predict();
    }

    sketch.limpiar_Canvas = function(){
        sketch.background(0);
    }

},"LeftSketch");

var chart = new p5(function(sketch){

    sketch.setup = function(){

        var canvas = sketch.createCanvas(200, 200);
        canvas.parent("RightSketch");
    }

    sketch.plot = function(data){
        sketch.background(255);
        var width = 200, // canvas width and height
              height = 200,
              margin = 20,
              w = width - 2 * margin, // chart area width and height
              h = height - 2 * margin;
        w = width - 2 * margin, // chart area width and height
        h = height - 2 * margin;
        var barWidth = (h / data.length) * 0.8; // width of bar
        var barMargin = (h / data.length) * 0.4; // margin between two bars
        sketch.textSize(14);
        sketch.push();

        for(var i = 0; i  < data.length; i++){
              sketch.push();

              sketch.noStroke();
              sketch.translate(0, i* (barWidth + barMargin));
              sketch.fill('steelblue');

              sketch.rect(0,0,200, barWidth);
              sketch.fill('red');
              sketch.rect(0,0,data[i] * 200, barWidth);
              sketch.fill('#FFF');
              sketch.text(i + " : "+(Math.round(data[i] * 100)).toFixed(1) + "%", 5, barWidth/2 + 5); // write data

              sketch.pop();
        }
        sketch.pop();
    }


}, "RightSketch");

uploadImage = function(base64){
    $.post("/upload",{
        img: base64
    })
    .done(function(response){
        console.log(response.number);
        chart.plot(response.probabilities);
    });
}
