class ColorfulRing {
  constructor(x, y, size) {
    this.xpos = x; 
    this.ypos = y; 
    this.size = size; 

    // Randomly shuffle the order of the circle types
    this.typeOrder = shuffle([1, 2, 3]);
    // Color scheme
    this.colorPatterns = shuffle([
      " #1d1f73",
      " #3e9189",
      " #57b652",
      " #7eafcb",
      " #d7442a",
      " #de76be",
      " #e78e43",
      " #e1c162",
      " #3e0707",
    ]);

    this.NOISEVALUE = 0; // Noise value
    this.NOISE_SCALE = 0.0187; // Noise scaling factor
    this.TIME_SCALE = 0.006; // Time scaling factor
    this.X_TIME_UNIQUE = random(1000); // Time Seed
    this.Y_TIME_UNIQUE = random(1000); // Time Seed
    this.R_TIME_UNIQUE = random(1000); // Time Seed
    this.XSEED = random(1000); // x-coordinate random seed
    this.YSEED = random(1000); // y-coordinate random seed
    this.RSEED = random(1000); // Radius random seed
    this.MAX_RAD = this.size * 1.5; // Maximum variable radius
    this.MIN_RAD = this.size * 0.5; // Minimum variable radius
    this.BORN_XPOS = this.xpos; 
    this.BORN_YPOS = this.ypos; 

    this.COLOR_NOISEVALUE = 0; // Color changing noise value
    this.COLOR_NOISE_SCALE = 0.0387; // Noise scaling factor for color changes
    this.COLOR_TIME_SCALE = 0.008; // Time scaling factor for color change
    this.COLOR_TIME_UNIQUE = random(1000); // Random seed for color change
    this.COLOR_SEED = random(1000); // Random seed for color change
    this.COLOR_OFFSET = 0;
  }

  // Adding a Noise Effect
  addNoise() {
    // Calculate the noise value of the position
    var xtime = this.TIME_SCALE * frameCount + this.X_TIME_UNIQUE;
    var xNoise = noise(xtime, this.XSEED);
    var ytime = this.TIME_SCALE * frameCount + this.Y_TIME_UNIQUE;
    var yNoise = noise(ytime, this.YSEED);
    // Map x,y locations affected by noise
    var offsetX = map(xNoise, 0, 1, -80, 80);
    var offsetY = map(yNoise, 0, 1, -80, 80);
    this.xpos = this.BORN_XPOS + offsetX;
    this.ypos = this.BORN_YPOS + offsetY;
    // Calculate the noise value of the radius
    var time = this.TIME_SCALE * frameCount + this.R_TIME_UNIQUE;
    this.NOISEVALUE = noise(time, this.RSEED);
    this.size = lerp(this.MIN_RAD, this.MAX_RAD, this.NOISEVALUE);
   
    // Calculate the noise value of the color change
    var ctime = this.COLOR_TIME_SCALE * frameCount + this.COLOR_TIME_UNIQUE;
    this.COLOR_NOISEVALUE = noise(ctime, this.COLOR_SEED);
    // Map color noise values ​​to color shift values
    this.COLOR_OFFSET = map(
      this.COLOR_NOISEVALUE,
      0,
      1,
      0,
      this.colorPatterns.length - 1
    );
  }

  // Display visual effects + rotation and zoom
  show(rotation = 0, scaleFactor = 1) {
    push();
    translate(this.xpos * canvasScale, this.ypos * canvasScale);
    rotate(rotation); // Rotation
    scale(scaleFactor); // Zoom

    for (let i = 0; i < this.typeOrder.length; i++) {
      let scaling = 1 - (i + 1) / this.typeOrder.length;
      let size = this.size * canvasScale * scaling;
      let type = this.typeOrder[i];
      if (type === 1) {
        this.drawType1Circle(size);
      } else if (type === 2) {
        this.drawType2Circle(size);
      } else if (type === 3) {
        this.drawType3Circle(size);
      }
    }
    pop();
  }

  // Draw a circle effect of type 1 (spotted circle)
  drawType1Circle(s) {
    // Draw the background color
    stroke(this.colorPatterns[1]);
    strokeWeight(lineWeight);
     var colorindex = floor((1 + this.COLOR_OFFSET) % this.colorPatterns.length);
    fill(this.colorPatterns[0]);
    circle(0, 0, s);

    // Draw spots from the inside out in circles
    noStroke();
    fill(this.colorPatterns[1]);

    let r = s / 2;
    let sapcing = s * 0.04; // The interval between each circle
    if (sapcing <= 0) return;
    let circleNum = ceil(r / sapcing); // The number of circles to draw
    let spotNum = s * 0.2; // The number of spots on each circle
    let spotDt = TWO_PI / spotNum; // The angular spacing of each spot
    let offset = 0; // Offset between spots
    let nn = lerp(0.01, 0.05, this.NOISEVALUE);
    let offsetDt = s * nn;

    // Calculate the position of each spot and plot it
    for (let i = 0; i < circleNum - 1; i++) {
      offset += offsetDt;
      for (let j = 0; j < spotNum; j++) {
        let angle = j * spotDt + offset;
        let raduis = i * sapcing;

        let spotX = raduis * cos(angle);
        let spotY = raduis * sin(angle);
        circle(spotX, spotY, s * 0.03);
      }
    }
  }

  // Draw a circle effect of type 2 (line segment circle)
  drawType2Circle(s) {
    // Draw the background color
    stroke(this.colorPatterns[2]);
    strokeWeight(lineWeight);
    fill(this.colorPatterns[1]);
    circle(0, 0, s);

    // Calculate the line segments inside the circle
    let nn = lerp(0.1, 0.4, this.NOISEVALUE);
    let lineNum = s * nn; // Number of line segments
    let lineDt = TWO_PI / lineNum; // The angle interval of each line segment
    let linePath = []; // Line Path
    let nn1 = lerp(0.1, 0.3, this.NOISEVALUE);
    let nn2 = lerp(0.4, 0.6, this.NOISEVALUE);
    let innerRadius = s * nn1; // Inner radius
    let outterRadius = s * nn2; // Outer radius

    for (let i = 0; i < lineNum; i++) {
      let angle = i * lineDt;

      let innerx = innerRadius * cos(angle);
      let innery = innerRadius * sin(angle);
      let outterx = outterRadius * cos(angle);
      let outtery = outterRadius * sin(angle);

      linePath.push({ x: innerx, y: innery });
      linePath.push({ x: outterx, y: outtery });
    }

    // Draw line segments inside a circle
    stroke(this.colorPatterns[2]);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let pt of linePath) {
      vertex(pt.x, pt.y);
    }
    endShape(CLOSE);
  }

  // Draw type 3 circle effect (concentric circles)
  drawType3Circle(s) {
    // Draw the background color
    stroke(this.colorPatterns[3]);
    strokeWeight(lineWeight);
    fill(this.colorPatterns[2]);
    circle(0, 0, s);

    // Draw concentric circles
    let nn = lerp(0.01, 0.1, this.NOISEVALUE);
    let sapcing = s * nn; // The interval between each circle
    if (sapcing <= 0) return;
    let circleNum = round(s / sapcing); // The number of circles to draw

    for (let i = circleNum - 1; i >= 0; i--) {
      let raduis = i * sapcing;
      let c = i % 2 === 0 ? this.colorPatterns[3] : this.colorPatterns[2];
      noStroke();
      fill(c);
      circle(0, 0, raduis);
    }
  }
}

