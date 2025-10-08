import { useEffect } from 'react';

export default function SmoothScroll() {
  useEffect(() => {
    // Add reveal-on-scroll animation class to elements
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      section.classList.add('reveal-section');
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
