// Meteor Shower Effect - Balanced Density

function initMeteorShowerEffect() {
    const canvas = document.getElementById('meteorShowerCanvas');
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const meteors = [];
    const maxMeteors = 50;
    const spawnChance = 0.08;

    function createMeteor() {
        return {
            x: Math.random() * width,
            y: -20,
            length: 40 + Math.random() * 30,
            speed: 2 + Math.random() * 1.5,
            opacity: 0.2 + Math.random() * 0.4,
            width: 1 + Math.random() * 1
        };
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        if (meteors.length < maxMeteors && Math.random() < spawnChance) {
            meteors.push(createMeteor());
        }

        for (let i = 0; i < meteors.length; i++) {
            const meteor = meteors[i];
            meteor.y += meteor.speed;

            ctx.beginPath();
            ctx.moveTo(meteor.x, meteor.y);
            ctx.lineTo(meteor.x, meteor.y - meteor.length);
            ctx.strokeStyle = `rgba(255, 255, 255, ${meteor.opacity})`;
            ctx.lineWidth = meteor.width;
            ctx.stroke();

            if (meteor.y > height + 100) {
                meteors.splice(i, 1);
                i--;
            }
        }

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    });
}

window.addEventListener('DOMContentLoaded', () => {
    initMeteorShowerEffect();
});
