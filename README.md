# Gradient Bloom
## Project Overview
**Gradient Bloom** is an interactive generative art piece developed with `p5.js`, featuring organically animated rings driven by **Perlin noise** and **randomness**. The visuals blend concentric circles, dotted gradients, and rotating line segments into a cohesive flow that reacts procedurally over time.

## Key Visual Features
- **Concentric Circles** fade from light to dark, building depth.
- **Dotted Rings** use internal radial gradients with random offsets.
- **Line Segment Rings** pulse with noise-modulated angles and opacity.
- Background is a continuously transitioning **gradient**, updated with sine waves for natural breathing motion.
- Each ring rotates and scales slightly over time using trigonometric modulation.

## How to Run
- Open index.html in a browser.
- Or paste the code into editor.p5js.org and press play.
- Observe the continuous animated scene—no clicks required.

## Difference from Group Members
| Feature         | My Version                   | Others' Versions                             |
| --------------- | ---------------------------- | -------------------------------------------- |
| Interaction     | Autonomous (no mouse needed) | Mouse click triggers circle expansion        |
| Animation Type  | Smooth Perlin-driven motion  | Jumping and bouncing effects                 |
| Visual Style    | Soft gradients, concentric   | Expanding rings, 3D feel, sudden transitions |
| Technical Focus | Perlin noise & randomness    | Event-driven changes and size jumps          |

## Artistic Inspiration
- ![Alt Text](images/inspiration.png)[Inspiration Source]（https://openprocessing.org/sketch/1795182）
- This piece draws visual inspiration from generative works such as "Crazy Circles", which use mathematical precision and randomness to create intricate, organic spiral patterns. The use of fine line structures, dynamic color transitions, and the illusion of motion influenced my approach to animated, Perlin-driven ring formations in Gradient Bloom.

## Technical Breakdown
### Technologies Used

- **p5.js** (JavaScript Creative Coding Library)
- Object-oriented structure (`ColorfulRing` class)
- Built-in Perlin noise (`noise()`) and randomness (`random()`)

### Code Structure

- `main.js` – canvas setup, ring generation logic, draw loop
- `ColorfulRing.js` – contains all logic for individual animated ring objects
- `index.html` – references scripts and sets up the sketch environment


## Animation Logic

| Component     | Technique                        | Description                                                                 |
|---------------|----------------------------------|-----------------------------------------------------------------------------|
| Position      | Perlin noise                    | Each ring drifts around its origin point.                                   |
| Size          | Perlin noise                    | Subtle pulsation from min to max radius.                                   |
| Color Index   | Perlin noise                    | Gradually shifts which color is used from a palette.                        |
| Ring Rotation | Sine wave (`sin(frameCount)`)   | Small back-and-forth angular rotation.                                     |
| Ring Scaling  | Sine wave                       | Creates a breathing effect (scale from 90% to 110%).                        |
| Background    | Lerp between two colors         | Gradient background that subtly cycles using sine modulation.              |

## How It Works

### Random Generation

- Up to `100` rings are generated randomly without overlap.
- Each ring has randomized:
  - Type order (`concentric`, `dotted`, `radial lines`)
  - Color palette (shuffled on creation)
  - Perlin noise seeds for position, size, and color evolution

### Perlin Noise in Action

```javascript
let xtime = TIME_SCALE * frameCount + X_TIME_UNIQUE;
let xNoise = noise(xtime, XSEED);
let offsetX = map(xNoise, 0, 1, -80, 80);