import colors from 'material-colors';
const themes = Reflect.ownKeys(colors)
  .filter(
    themeName =>
      !themeName.includes('Text') &&
      !themeName.includes('Icons') &&
      themeName !== 'white' &&
      themeName !== 'black' &&
      themeName !== 'grey'
  )
  .map(themeName => Object.values(colors[themeName]));

let theme;

const setRandomTheme = () => {
  theme = themes[Math.floor(Math.random() * themes.length)];
};

setRandomTheme();

const randomColor = () => theme[Math.floor(Math.random() * theme.length)];

document.body.style.margin = 0;
document.body.style.padding = 0;
document.body.style.overflow = 'hidden';
document.body.style.cursor = 'none';

const canvas = document.createElement('canvas');

let hideCursorTimeout;
canvas.addEventListener('mousemove', () => {
  document.body.style.cursor = 'default';
  if (hideCursorTimeout) {
    clearTimeout(hideCursorTimeout);
  }
  hideCursorTimeout = setTimeout(() => {
    document.body.style.cursor = 'none';
  }, 1000);
});

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

const ctx = canvas.getContext('2d');

const animation = (nextX, nextY, nextWidth, nextHeight) => (
  duration,
  color
) => {
  const start = Date.now();
  const animate = (x = 0, y = 0, width = 0, height = 0) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    if (width < WIDTH || height < HEIGHT || x > 0 || y > 0) {
      window.requestAnimationFrame(() => {
        const pct = (Date.now() - start) / duration;
        animate(nextX(pct), nextY(pct), nextWidth(pct), nextHeight(pct));
      });
    }
  };
  return animate;
};

const identity = val => () => val;

const fromLeft = animation(
  identity(0),
  identity(0),
  pct => pct * WIDTH,
  identity(HEIGHT)
);

const fromTop = animation(
  identity(0),
  identity(0),
  identity(WIDTH),
  pct => pct * HEIGHT
);

const fromRight = animation(
  pct => WIDTH - pct * WIDTH,
  identity(0),
  pct => pct * WIDTH,
  identity(HEIGHT)
);

const fromBottom = animation(
  identity(0),
  pct => HEIGHT - pct * HEIGHT,
  identity(WIDTH),
  pct => pct * HEIGHT
);

const animations = [fromLeft, fromTop, fromRight, fromBottom];

let themeShapeCount = 1;
const draw = () => {
  if (themeShapeCount > 10 && Math.random() < 0.1) {
    themeShapeCount = 1;
    setRandomTheme();
  } else {
    themeShapeCount += 1;
  }
  const randomAnimation =
    animations[Math.floor(Math.random() * animations.length)];

  const color = randomColor();

  window.requestAnimationFrame(randomAnimation(90000, color));

  setTimeout(() => {
    draw();
  }, Math.random() * 30000);
};

document.addEventListener('DOMContentLoaded', () => {
  Object.assign(canvas, { width: WIDTH, height: HEIGHT });

  ctx.fillStyle = randomColor();
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  document.body.append(canvas);

  draw();
});

window.addEventListener('resize', () => {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;

  Object.assign(canvas, { width: WIDTH, height: HEIGHT });
});
