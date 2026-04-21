// Interactive 3D image with selectable background effects and atomic rotation

// Core interaction and effect selector
document.querySelectorAll('[data-hover-3d]').forEach(container => {
    const img = container.querySelector('img');
    container.style.perspective = '1000px';
    img.style.transition = 'transform 0.05s ease';
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';
    img.style.display = 'block';
    container.style.position = 'relative';

    let effectType = container.getAttribute('data-hover-3d');
    let currentBackground = null;

    if (container.hasAttribute('data-effect-selector')) {
        const select = document.createElement('select');
        select.classList.add('effect-selector');
        ['triangles', 'hexagons', 'circuits', 'atomic-circle'].forEach(effect => {
            const option = document.createElement('option');
            option.value = effect;
            option.textContent = effect.charAt(0).toUpperCase() + effect.slice(1);
            if (effect === effectType) option.selected = true;
            select.appendChild(option);
        });

        select.style.position = 'absolute';
        select.style.top = '10px';
        select.style.left = '10px';
        select.style.padding = '5px 10px';
        select.style.borderRadius = '5px';
        select.style.border = '1px solid #ccc';
        select.style.background = '#fff';
        select.style.cursor = 'pointer';
        select.style.zIndex = '0';

        container.appendChild(select);

        select.addEventListener('change', () => {
            effectType = select.value;
            container.setAttribute('data-hover-3d', effectType);
            container.querySelectorAll('.effect-background, .atomic-wrapper').forEach(el => el.remove());
            currentBackground = createEffectBackground(container, effectType);
        });

    }

    currentBackground = createEffectBackground(container, effectType);

    container.addEventListener('mousemove', e => {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        img.style.transform = `rotateX(${-y * 15}deg) rotateY(${x * 15}deg)`;
    });

    container.addEventListener('mouseleave', () => {
        img.style.transform = `rotateX(0deg) rotateY(0deg)`;
    });
});

function createEffectBackground(container, effectType) {
    if (effectType === 'triangles') return initTriangles(container);
    if (effectType === 'hexagons') return initHexagons(container);
    if (effectType === 'circuits') return initCircuits(container);
    if (effectType === 'pulsing-circles') return initPulsingCircles(container);
    if (effectType === 'atomic-circle') return initAtomicCircle(container);
}

// Triangles Effect
function initTriangles(container) {
    const canvas = document.createElement('canvas');
    canvas.classList.add('effect-background');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const triangles = [];

    for (let i = 0; i < 20; i++) {
        triangles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 40 + Math.random() * 30,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        triangles.forEach(t => {
            t.x += t.speedX;
            t.y += t.speedY;

            if (t.x < 0 || t.x > canvas.width) t.speedX *= -1;
            if (t.y < 0 || t.y > canvas.height) t.speedY *= -1;

            ctx.beginPath();
            ctx.moveTo(t.x, t.y);
            ctx.lineTo(t.x + t.size, t.y + t.size / 2);
            ctx.lineTo(t.x, t.y + t.size);
            ctx.closePath();
            ctx.fillStyle = 'rgba(0,212,255,0.2)';
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }

    animate();

    return canvas;
}

// Hexagons Effect
function initHexagons(container) {
    const canvas = document.createElement('canvas');
    canvas.classList.add('effect-background');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const hexagons = [];

    for (let i = 0; i < 15; i++) {
        hexagons.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 30 + Math.random() * 20,
            speedX: (Math.random() - 0.5) * 0.7,
            speedY: (Math.random() - 0.5) * 0.7
        });
    }

    function drawHexagon(x, y, size) {
        const angleStep = Math.PI / 3;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = i * angleStep;
            const px = x + size * Math.cos(angle);
            const py = y + size * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 100, 0, 0.2)';
        ctx.fill();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hexagons.forEach(h => {
            h.x += h.speedX;
            h.y += h.speedY;

            if (h.x < 0 || h.x > canvas.width) h.speedX *= -1;
            if (h.y < 0 || h.y > canvas.height) h.speedY *= -1;

            drawHexagon(h.x, h.y, h.size);
        });
        requestAnimationFrame(animate);
    }

    animate();

    return canvas;
}

// Circuits Effect
function initCircuits(container) {
    const canvas = document.createElement('canvas');
    canvas.classList.add('effect-background');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const lines = [];

    for (let i = 0; i < 20; i++) {
        lines.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: 30 + Math.random() * 40,
            speed: 0.5 + Math.random(),
            vertical: Math.random() > 0.5
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        lines.forEach(l => {
            if (l.vertical) l.y += l.speed;
            else l.x += l.speed;

            if (l.x > canvas.width || l.y > canvas.height) {
                l.x = Math.random() * canvas.width;
                l.y = Math.random() * canvas.height;
            }

            ctx.beginPath();
            if (l.vertical) ctx.moveTo(l.x, l.y - l.length);
            else ctx.moveTo(l.x - l.length, l.y);
            ctx.lineTo(l.x, l.y);
            ctx.strokeStyle = 'rgba(0, 255, 100, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
        requestAnimationFrame(animate);
    }

    animate();

    return canvas;
}

// Atomic Circle Effect
function initAtomicCircle(container) {
    const img = container.querySelector('img');
    const containerRect = container.getBoundingClientRect();

    container.style.perspective = '1000px';
    container.style.transformStyle = 'preserve-3d';

    const wrapper = document.createElement('div');
    wrapper.classList.add('atomic-wrapper');
    wrapper.style.position = 'absolute';
    wrapper.style.top = '50%';
    wrapper.style.left = '50%';
    wrapper.style.transformStyle = 'preserve-3d';
    wrapper.style.transform = 'translate(-50%, -50%)';
    container.appendChild(wrapper);

    const orbitCount = 2;
    const orbitRadii = [1.2, 1.3, 1.4];
    const orbitAxes = ['X', 'Y', 'Z'];

    const orbitBaseSize = Math.min(containerRect.width, containerRect.height) * 0.9;

    for (let i = 0; i < orbitCount; i++) {
        const orbit = document.createElement('div');
        orbit.classList.add('atomic-orbit');
        orbit.style.position = 'absolute';
        orbit.style.top = '50%';
        orbit.style.left = '50%';
        orbit.style.width = `${orbitBaseSize * orbitRadii[i]}px`;
        orbit.style.height = `${orbitBaseSize * orbitRadii[i]}px`;
        orbit.style.border = '2px solid rgba(0, 212, 255, 0.6)';
        orbit.style.borderRadius = '50%';
        orbit.style.transform = 'translate(-50%, -50%)';
        orbit.style.animation = `rotateOrbit${orbitAxes[i]} ${6 + i * 2}s linear infinite`;

        wrapper.appendChild(orbit);
    }

    img.style.position = 'relative';
    img.style.zIndex = '1';
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';
    img.style.display = 'block';

    return wrapper;
}

// 3D Orbit Animations
const style = document.createElement('style');
style.textContent = `
@keyframes rotateOrbitX {
    from { transform: translate(-50%, -50%) rotateX(0deg); }
    to { transform: translate(-50%, -50%) rotateX(360deg); }
}
@keyframes rotateOrbitY {
    from { transform: translate(-50%, -50%) rotateY(0deg); }
    to { transform: translate(-50%, -50%) rotateY(360deg); }
}
@keyframes rotateOrbitZ {
    from { transform: translate(-50%, -50%) rotateZ(0deg); }
    to { transform: translate(-50%, -50%) rotateZ(360deg); }
}
`;
document.head.appendChild(style);

// ✅ FIX: Recalculate effects on resize/orientation change
function recalcEffects() {
    document.querySelectorAll('[data-hover-3d]').forEach(container => {
        container.querySelectorAll('.effect-background, .atomic-wrapper').forEach(el => el.remove());
        const effectType = container.getAttribute('data-hover-3d');
        createEffectBackground(container, effectType);
    });
}
window.addEventListener('resize', recalcEffects);
window.addEventListener('orientationchange', recalcEffects);
