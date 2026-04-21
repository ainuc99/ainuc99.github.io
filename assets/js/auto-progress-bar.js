// Auto Progress Bar Library with Scroll Activation
document.addEventListener('DOMContentLoaded', () => {
    // Select all elements with the 'data-progress' attribute
    const progressBars = document.querySelectorAll('[data-progress]');

    // Intersection Observer configuration
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.3 // trigger when 30% of the element is visible
    };

    const animateProgressBar = (bar) => {
        const percentage = bar.getAttribute('data-percentage');
        const fill = bar.querySelector('.progress-bar__fill');

        // Animate fill
        setTimeout(() => {
            fill.style.width = `${percentage}%`;
        }, 100);
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgressBar(entry.target);
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    // Build the progress bars
    progressBars.forEach(bar => {
        const label = bar.getAttribute('data-label');
        const percentage = bar.getAttribute('data-percentage');
        const fillColor = bar.getAttribute('data-color');
        const trackColor = bar.getAttribute('data-bg');
        const textColor = bar.getAttribute('data-text-color');

        // Create header
        const header = document.createElement('div');
        header.classList.add('progress-bar__header');

        const labelSpan = document.createElement('span');
        labelSpan.classList.add('progress-bar__label');
        labelSpan.style.color = textColor;
        labelSpan.textContent = label;

        const percentageSpan = document.createElement('span');
        percentageSpan.classList.add('progress-bar__percentage');
        percentageSpan.style.color = textColor;
        percentageSpan.textContent = `${percentage}%`;

        header.appendChild(labelSpan);
        header.appendChild(percentageSpan);

        // Create track
        const track = document.createElement('div');
        track.classList.add('progress-bar__track');
        track.style.backgroundColor = trackColor;

        const fill = document.createElement('div');
        fill.classList.add('progress-bar__fill');
        fill.style.backgroundColor = fillColor;

        track.appendChild(fill);
        bar.appendChild(header);
        bar.appendChild(track);

        // Observe the progress bar for scroll
        observer.observe(bar);
    });
});
