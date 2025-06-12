let colorfulRings = []; // Save all colored circles

let canvasSize = 1000; // Set canvas size
let canvasScale = 1; // The canvas scaling ratio corresponding to the set canvas size
let ringNumbers = 100; // The maximum number of randomly generated circles
let minRadius = canvasSize * 0.2; // Smallest possible radius
let maxRadius = canvasSize * 0.8; // Maximum possible radius
let maxAttempts = 100000; // Maximum number of attempts to generate a circle
let lineWeight = 4; // Line thickness
let c1, c2; //Gradient of two colors

function setup() {
  createCanvas(canvasSize, canvasSize, P2D);
  windowResized();
  generateRandomRings();
  c1 = color(183, 96, 178, 255); // blue
  c2 = color(37, 88, 109); // Purple
}

function draw() {
  // Gradient background
  let amt = map(sin(frameCount * 0.01), -1, 1, 0, 1);
  let bg = lerpColor(c1, c2, amt);//https://p5js.org/reference/p5/lerpColor/
  background(bg);
  showAllRings();
}

// Adjust the canvas size as the window changes, so that the canvas is always in 1:1 ratio
function windowResized() {
  let minWinSize = min(windowWidth, windowHeight);
  resizeCanvas(minWinSize, minWinSize);
  canvasScale = minWinSize / canvasSize;
}

// Randomly generate non-overlapping circle objects of different positions and sizes
function generateRandomRings() {
  let attempts = 0;
  // The generation will stop only when the number of generation or attempts reaches the upper limit.
  while (colorfulRings.length < ringNumbers && attempts < maxAttempts) {
    // Random position, radius
    let x = random(canvasSize);
    let y = random(canvasSize);
    let size = random(minRadius, maxRadius);

    let overlapping = false;
    // Check if it overlaps with the generated circle
    for (let other of colorfulRings) {
      let d = dist(x, y, other.xpos, other.ypos);//Reference:https://p5js.org/reference/p5/dist/ This function generates non-overlapping rings by randomly placing them and checking their distance from existing ones. 

      if (d < size * 0.25 + other.size * 0.25) {
        overlapping = true;
        break;
      }
    }

    // If there is no overlap, add it to the generated array
    if (!overlapping) {
      colorfulRings.push(new ColorfulRing(x, y, size));
    } else {
      attempts++;
    }
  }
}

// Show all circles
function showAllRings() {
  for (let i = 0; i < colorfulRings.length; i++) {
    let ring = colorfulRings[i];

    // Rotation and scaling
    let rot = sin(frameCount * 0.01 + i) * 0.5;
    let scaleFactor = 0.9 + 0.1 * sin(frameCount * 0.02 + i * 2);

    ring.addNoise();
    ring.show(rot, scaleFactor);
  }
}
