document.addEventListener("DOMContentLoaded", () => {
  const testimonialsGrids = document.querySelectorAll('[data-testimonials]');

  testimonialsGrids.forEach((grid) => {
    let commentCards = grid.querySelectorAll('[data-comment]');
    const leftArrow = grid.querySelector('[data-nav-arrow="prev"]');
    const rightArrow = grid.querySelector('[data-nav-arrow="next"]');
    
    let autoInterval;
    let autoTimeoutReset;
    let allComments = [];
    const totalComments = commentCards.length;
    const AUTOPLAY_INTERVAL = 5000;
    const RESET_DELAY = 5000;

    function getCommentsData() {
      const comments = grid.querySelectorAll('[data-comment]');
      allComments = [];

      comments.forEach((comment) => {
        const clonedComment = comment.cloneNode(true);
        allComments.push(clonedComment);
      });

      return allComments;
    }

    function updateComments() {
      removeAllComments();

      allComments.forEach((commentData, index) => {
        if (index < 3) { 
          addCommentToDOM(commentData);
        }

        if (index === (totalComments - 1)) { 
          addCommentToDOM(commentData, 'start');
        }

        if (index === 3) {
          addCommentToDOM(commentData, 'end');
        }
      });

      commentCards = grid.querySelectorAll('[data-comment]');
      positionCommentsWithTranslate();
    }

    function addCommentToDOM(comment, position = 'end') {
      const card = comment.cloneNode(true);

      if (position === 'start') {
        grid.insertBefore(card, grid.firstChild);
      } else {
        grid.appendChild(card);
      }

      return card;
    }

    function positionCommentsWithTranslate(gap = 24) {
      const cardWidth = commentCards[0].offsetWidth;
      const offset = -(cardWidth + gap) * 2;

      commentCards.forEach((card, index) => {
        const translateX = offset + (cardWidth + gap) * index;
        card.style.position = 'absolute';
        card.style.visibility = 'visible';
        card.style.transform = `translateX(${translateX}px)`;
      });
    }

    window.addEventListener('resize', () => {
      positionCommentsWithTranslate();
    });

    function removeAllComments() {
      grid.innerHTML = '';
    }

    function removeCommentFromDOM(index) {
      if (index < 0 || index >= commentCards.length) {
        return false;
      }

      commentCards[index].remove();
      return true;
    }

    // Autoplay functions
    function startAutoPlay() {
      if (autoInterval) return;
      
      autoInterval = setInterval(() => {
        moveLeft();
      }, AUTOPLAY_INTERVAL);
    }

    function stopAutoPlay() {
      if (autoInterval) {
        clearInterval(autoInterval);
        autoInterval = null;
      }
    }

    function resetAutoPlayTimeout() {
      clearTimeout(autoTimeoutReset);
      stopAutoPlay();
      
      autoTimeoutReset = setTimeout(() => {
        startAutoPlay();
      }, RESET_DELAY);
    }

    function moveLeft() {
      removeCommentFromDOM(0);

      const reorganizeComments = [];
      for (let index = 0; index < totalComments - 1; index++) {
        reorganizeComments[index] = allComments[index + 1];  
      }
      reorganizeComments[totalComments - 1] = allComments[0];

      allComments = reorganizeComments;
      const card = addCommentToDOM(allComments[3], 'end');

      commentCards = grid.querySelectorAll('[data-comment]');
      positionCommentsWithTranslate();

      card.style.visibility = 'hidden';
      setTimeout(() => {
        card.style.visibility = 'visible';
      }, 1000);
    }

    function moveRight() {
      removeCommentFromDOM(commentCards.length - 1);

      const reorganizeComments = [];
      reorganizeComments[0] = allComments[totalComments - 1];
      for (let index = 0; index < totalComments - 1; index++) {
        reorganizeComments[index + 1] = allComments[index];  
      }

      allComments = reorganizeComments;
      const card = addCommentToDOM(allComments[0], 'start');

      commentCards = grid.querySelectorAll('[data-comment]');
      positionCommentsWithTranslate();

      card.style.visibility = 'hidden';
      setTimeout(() => {
        card.style.visibility = 'visible';
      }, 1000);
    }

    if (leftArrow) {
      leftArrow.addEventListener('click', () => {
        moveLeft();
        resetAutoPlayTimeout();
      });
    }

    if (rightArrow) {
      rightArrow.addEventListener('click', () => {
        moveRight();
        resetAutoPlayTimeout();
      });
    }

    // Pause autoplay on hover
    grid.addEventListener('mouseenter', () => {
      stopAutoPlay();
    });

    grid.addEventListener('mouseleave', () => {
      startAutoPlay();
    });

    function initial() {
      getCommentsData();
      updateComments();
    }

    window.addEventListener('load', () => {
      initial();
      positionCommentsWithTranslate();
      
      // Start autoplay after 1 second
      setTimeout(() => startAutoPlay(), 1000);
    });
  });
});