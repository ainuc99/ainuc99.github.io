const canvas = document.getElementById('dataLinesCanvas');
const ctx = canvas.getContext('2d');

let lines = [];
const numberOfLines = 9;

// Resize canvas to match 100% CSS size
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;   // Match visible width
    canvas.height = canvas.offsetHeight; // Match visible height
    updateLinePositions();
}

// Create vertical line positions
function updateLinePositions() {
    lines = [];
    let spacing = canvas.width / numberOfLines;

    for (let i = 0; i < numberOfLines; i++) {
        let xPosition = spacing * i + spacing / 2;
        lines.push({
            x: xPosition,
            currentDrop: createDrop(),
        });
    }
}

// Create drop properties
function createDrop() {
    return {
        y: -10,
        speed: Math.random() * 0.5 + 0.3,
        radius: Math.random() * 1.1 + 1.0,
        pauseTime: Math.random() * 3000 + 1000,
        isPaused: false,
        pauseCounter: 0
    };
}

// Draw animation
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw vertical lines
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 0.2;
    lines.forEach(line => {
        ctx.beginPath();
        ctx.moveTo(line.x, 0);
        ctx.lineTo(line.x, canvas.height);
        ctx.stroke();
    });

    // Draw drops
    lines.forEach(line => {
        let drop = line.currentDrop;

        ctx.beginPath();
        ctx.arc(line.x, drop.y, drop.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#38BDF8';
        ctx.fill();

        // Pause handling
        if (drop.isPaused) {
            drop.pauseCounter -= 16;
            if (drop.pauseCounter <= 0) {
                drop.isPaused = false;
            }
            return;
        }

        drop.y += drop.speed;

        // Random pause
        if (Math.random() > 0.9985) {
            drop.isPaused = true;
            drop.pauseCounter = drop.pauseTime;
        }

        // Reset when leaving screen
        if (drop.y - drop.radius > canvas.height) {
            line.currentDrop = createDrop();
        }
    });

    requestAnimationFrame(draw);
}

// Init
resizeCanvas();
draw();

// Resize event
window.addEventListener('resize', resizeCanvas);
