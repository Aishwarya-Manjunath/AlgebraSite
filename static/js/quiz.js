function setOpts (standard, user) {
  if (typeof user === 'object') {
    for (var key in user) {
      standard[key] = user[key];
    }
  }
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function drawRotatedShape(shape,x,y,width,height,degrees,color,direction){
  
      // first save the untranslated/unrotated context
      context.save();

      context.beginPath();
      // move the rotation point to the center of the rect
      context.translate( x+width/2, y+height/2 );
      // rotate the rect
      if(direction == 'clockwise' ) {
         context.rotate(degrees*Math.PI/180);
      } else {
        context.rotate(-(degrees*Math.PI/180));
      }
  
  		context.fillStyle = color;
      context.lineWidth = 5;

      // draw the rect on the transformed context
      // Note: after transforming [0,0] is visually [x,y]
      //       so the rect needs to be offset accordingly when drawn
  		switch(shape) {
        case 'rect':
          context.rect( -width/2, -height/2, width,height);
          context.fill();
          break;
        case 'circle':
          context.arc(-width/2,-height/2, width*0.5, 0, Math.PI*2, true); 
          context.fill();
          break;
        case 'triangle':
          context.moveTo(0,0);
          context.lineTo(width,0);
          context.lineTo(width, height);
          context.fill();
          break;
        case 'minus':
          context.moveTo(0,0);
          context.lineTo(30, 0);
          context.stroke();
          break;
        case 'plus':
          context.moveTo(0,15);
          context.lineTo(30, 15);
          context.moveTo(15, 0);
          context.lineTo(15, 30);
          context.stroke();
          break;
        case 'equals':
          context.moveTo(0,5);
          context.lineTo(30, 5);
          context.moveTo(0, 15);
          context.lineTo(30, 15);
          context.stroke();
          break;
      }
      
      // restore the context to its untranslated/unrotated state
      context.restore();

}

// Initialise an empty canvas and place it on the page
var canvas = document.getElementById("geometric");
var context = canvas.getContext("2d");




 var particles = {},
     particleIndex = 0,
    settings;

 // Set up a function to create multiple particles
function Particle(x,y) {
  // Establish starting positions and velocities
  this.x = x;
  this.y = y;

  // Determine original X-axis speed based on setting limitation
  this.vx = Math.floor(randomNumber(0, 10));
  this.vy = Math.floor(randomNumber(0, 10));
  
  this.size = Math.floor(randomNumber(settings.minSize, settings.maxSize));
  
  this.rotation = Math.floor(randomNumber(0, 180));
  
  if(randomNumber(0,100) > 50) {
    this.rotationDirection = 'clockwise';
  } else {
    this.rotationDirection = 'counter-clockwise';
  }
  
  this.shape = settings.shapes[randomNumber(0, settings.shapes.length)];

  // Add new particle to the index
  // Object used as it's simpler to manage that an array
  particleIndex ++;
  particles[particleIndex] = this;
  this.id = particleIndex;
  
  this.life = 0;
  this.maxLife = 10000;
}

// Some prototype methods for the particle's "draw" function
Particle.prototype.draw = function() {
 // this.x +=  1;
  this.y +=  settings.gravity * Math.floor(randomNumber(1, 2));

  // Adjust for gravity
  this.vy += settings.gravity * Math.floor(randomNumber(0.5, 8));

  // Age the particle
  this.life++;
  
  if(this.rotation == 'clockwise') {
    this.rotation += settings.rotationVelocity;
  } else {
     this.rotation -= settings.rotationVelocity;
  }
  

  // If Particle is old, it goes in the chamber for renewal
  if (this.life >= this.maxLife) {
    delete particles[this.id];
  }
  
   // Create the shapes
    var size = this.size;
    context.clearRect(canvas.width, canvas.height, canvas.width, canvas.height);
    //context.beginPath();
    context.fillStyle = settings.color;
    //context.rect(this.x,this.y, size, size);
    drawRotatedShape(this.shape, this.x, this.y, size, size, this.rotation, settings.color, this.rotationDirection);
    //context.closePath();
    
    //context.fill();
    
    
/*    if(settings.rotation == true) {
      context.rotate(this.rotation);
    }*/
  
  
};

function shapify(preset) {

  switch(preset) {
    case 'math':
       settings = {
        density: 60,
        velocity: 1,
        //startingX: canvas.width / 2,
        //startingY: canvas.height / 4,
        gravity: -0.6,
        color: 'rgba(0,0,0,0.3)',
        maxSize: 100,
        minSize: 15,
        rotation: true,
        rotationVelocity: 0.1,
        shapes: ['rect', 'circle', 'triangle', 'plus', 'minus', 'equals']
      };
      break;
    case 'science':
      settings = {
        density: 5,
        velocity: 1,
        //startingX: canvas.width / 2,
        //startingY: canvas.height / 4,
        gravity: -0.6,
        color: 'rgba(0,0,0,0.3)',
        maxSize: 100,
        minSize: 15,
        rotation: true,
        rotationVelocity: 0.05,
        shapes: ['cell', 'dna']
      };
      break;
  }
  for(var i=0; i < settings.density; i++) {
    new Particle(Math.floor(randomNumber(0, canvas.width)), Math.floor(randomNumber(0, canvas.height)));
  }
  for (var p in particles) {
    particles[p].draw();
  }
  setInterval(function() {
    context.fillStyle = "#2F3242";
    context.fillRect(0, 0, canvas.width, canvas.height);

     
    // Draw the particles
    for (var i = 0; i < settings.density; i++) {
      if (Math.random() > 0.999) {
        // Introducing a random chance of creating a particle
        // corresponding to an chance of 1 per second,
        // per "density" value
        new Particle(Math.floor(randomNumber(0, canvas.width)), (canvas.height + 70));
      }
    }

    for (var p in particles) {
      particles[p].draw();
    }
  }, 30);
}

shapify('math');
  
function view_soln(){
				for(i=0;i<5;i++){
					soln_innerdiv = document.createElement("div");
					soln_innerdiv.id = "soln_innerdiv";
					q = document.createElement("p");
					q.innerHTML = "Q" + (i+1).toString()+")"+ quest_arr[i.toString()]["question"];
	        		p = document.createElement("p");
	        		p.innerHTML = "Answer = "+ quest_arr[i.toString()]["rationale"];
	        		value = quest_arr[i.toString()]["correct"];
				p.style.color = "white";
	        		q.style.color = "white";
	        		if(document.getElementById(i.toString() + "_" + value).checked){
	        			soln_innerdiv.style.backgroundColor = "#68c950";
	        		}
	        		else{
	        			soln_innerdiv.style.backgroundColor = "#EF3B3A";
	        		}
	        		soln_innerdiv.appendChild(q);
	        		soln_innerdiv.appendChild(p);
				soln_div.appendChild(soln_innerdiv);
	        	}

}

function view_results(correct_ans){
  document.getElementById("stopwatch").style.display="none";
  console.log(correct_ans);
  data_to_send = {"correct_ans":correct_ans,"wrong_quest":wrong_quest};
  xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if (xhr.readyState == 4 && xhr.status == 200){

	chart_div = document.getElementById("chartContainer");
	chart_div.style.display = "block";
	chart_div.style.backgroundColor = "red";
	document.body.style.backgroundColor = "#e5e5e5";
	var chart = new CanvasJS.Chart("chartContainer", {
	animationEnabled: true,
	title: {
		text: "Your Performance"
	},
	data: [{
		type: "pie",
		startAngle: 240,
		yValueFormatString: "##0.0",
		indexLabel: "{label} {y}",
		dataPoints: [
			{y: correct_ans, label: "Correct"},
			{y: 5 - correct_ans, label: "Wrong"},
		]
		}]
	});
	chart.render();

        soln_div = document.createElement("div");
        document.body.appendChild(soln_div);
		retake = document.createElement("button");
		soln = document.createElement("button");
		soln.innerHTML = "View soln";
		soln.id = "solnbtn";
		soln.style.position = "relative";
		soln.style.left ="20em";
		soln.onclick = function viewSoln(){
			document.body.removeChild(soln);
			view_soln();
		}  
		document.body.appendChild(soln);


       
   	}



  }
xhr.open('POST', '/quiz_results',true);
xhr.responseType = 'blob';
xhr.setRequestHeader("Content-Type", 'application/json');
xhr.send(JSON.stringify(data_to_send)); 
}



function display_questions(quest_arr){
		main_div = document.createElement("div");
		
	        for(i=0;i<5;i++){
			question_div = document.createElement("div");
			question_div.className='question';
	        	p = document.createElement("p");
	        	p.innerHTML = "Q" + (i+1).toString()+")"+ quest_arr[i.toString()]["question"];
			p.className = "question-headline";
	        	question_div.appendChild(p);

	        	for(j=0;j<quest_arr[i.toString()]["options"].length;j++){
	        		op = document.createElement("input");
	        		op.type = "radio";
	        		op.value = i.toString() + "_" + quest_arr[i.toString()]["options"][j][0];
	        		op.id = i.toString() + "_" + quest_arr[i.toString()]["options"][j][0];
				op.name = "my-radio_"+i.toString();
	        		label = document.createElement("label");
	        		label.innerHTML = quest_arr[i.toString()]["options"][j];
	        		question_div.appendChild(op);
	        		question_div.appendChild(label);
	        		question_div.appendChild(document.createElement("br"));
	        	}
			main_div.appendChild(question_div);
	        }
		sub_div = document.createElement("div");
		sub_div.id = "submit_btn";
		sub_div.className = "buttons-con";
		sub_div_div = document.createElement("div");
		sub_div_div.className = "action-link-wrap";

		sub_a = document.createElement("a");
		sub_a.className = "link-button";
	 
	        sub_a.innerHTML = "Evaluate";
	        sub_a.onclick = function evaluate(){
	        	correct_ans = 0;
			wrong_quest = [];
				for(i=0;i<5;i++){
					value = quest_arr[i.toString()]["correct"];
					console.log(document.getElementById(i.toString() + "_" + value));
					if(document.getElementById(i.toString() + "_" + value).checked){
						correct_ans += 1;
					}
					else{
						wrong_quest.push(quest_arr[i.toString()]["question"]);
					}
				}
				console.log(wrong_quest);
				main_div.style.display="none";
				view_results(correct_ans);
			}
		sub_div_div.appendChild(sub_a);
		sub_div.appendChild(sub_div_div);
	        main_div.appendChild(sub_div);
	        document.body.appendChild(main_div);
}

function start_quiz(){
	xhr = new XMLHttpRequest();
  	xhr.onreadystatechange = function(){
  		document.getElementById("startbtn").style.display="none";
		document.getElementById("geometric").style.display="none";
		document.getElementById("math-heading").style.display="none";
		document.getElementById("math-powered").style.display="none";
		document.getElementById("stopwatch").style.display="block";
	    if (xhr.readyState == 4 && xhr.status == 200){
	    	quest_arr = JSON.parse(xhr.responseText);
	        display_questions(quest_arr);
		}    
	}
	xhr.open('GET', '/QuizStart',true);
	xhr.send(); 
}
