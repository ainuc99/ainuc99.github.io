// ==========================================================================
// FAQ ACCORDION FUNCTIONALITY
// ==========================================================================

class FAQAccordion {
  constructor(element, options = {}) {
    if (!(element instanceof Element)) {
      console.error('FAQAccordion error: Expected a valid Element, got:', element);
      return;
    }

    this.faqSection = element;
    this.faqItems = this.faqSection.querySelectorAll('.faq-item');

    this.accentColor = this.faqSection.getAttribute('data-color') || '#4f46e5';
    this.backgroundColor = this.faqSection.getAttribute('data-bg') || '#ffffff';
    this.titleColor = this.faqSection.getAttribute('data-title-color') || '#111827';
    this.textColor = this.faqSection.getAttribute('data-text-color') || '#374151';
    this.borderStyle = this.faqSection.getAttribute('data-border') || '1px solid #e0e0e0';

    this.config = {
      allowMultiple: this.faqSection.getAttribute('data-multiple') === 'true',
      ...options
    };

    this.init();
  }

  init() {
    this.applyStyles();
    this.bindEvents();
  }

  applyStyles() {
    this.faqItems.forEach(item => {
      item.style.backgroundColor = this.backgroundColor;
      item.style.border = this.borderStyle;

      const questionText = item.querySelector('.question-text');
      const answerText = item.querySelector('.faq-answer');
      const toggle = item.querySelector('.faq-toggle');

      if (questionText) questionText.style.color = this.titleColor;
      if (answerText) {
        answerText.querySelectorAll('*').forEach(child => {
          child.style.color = this.textColor;
        });
      }

      if (toggle) toggle.style.color = this.accentColor;
    });
  }

  bindEvents() {
    this.faqItems.forEach((item, index) => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      if (!question || !answer) return;

      question.setAttribute('tabindex', '0');
      question.setAttribute('aria-expanded', 'false');
      question.setAttribute('role', 'button');
      question.setAttribute('aria-controls', `faq-answer-${index}`);
      answer.setAttribute('id', `faq-answer-${index}`);

      answer.style.maxHeight = '0px';
      answer.style.overflow = 'hidden';
      answer.style.transition = 'max-height 0.4s ease';

      question.addEventListener('click', () => this.toggleItem(item));
      question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleItem(item);
        }
      });
    });
  }

  toggleItem(item) {
    const isOpen = item.classList.contains('active');

    if (!this.config.allowMultiple) {
      this.faqItems.forEach(i => this.closeItem(i));
    }

    if (!isOpen) {
      this.openItem(item);
    } else {
      this.closeItem(item);
    }
  }

  openItem(item) {
    const answer = item.querySelector('.faq-answer');
    const question = item.querySelector('.faq-question');

    item.classList.add('active');
    answer.style.maxHeight = answer.scrollHeight + 'px';
    if (question) question.setAttribute('aria-expanded', 'true');
  }

  closeItem(item) {
    const answer = item.querySelector('.faq-answer');
    const question = item.querySelector('.faq-question');

    item.classList.remove('active');
    answer.style.maxHeight = '0px';
    if (question) question.setAttribute('aria-expanded', 'false');
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-faq]').forEach(section => {
    new FAQAccordion(section);
  });
});

// Optional export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FAQAccordion;
}
