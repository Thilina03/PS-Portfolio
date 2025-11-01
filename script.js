// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links (do not block external/# placeholder links)
document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(26, 11, 61, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(139, 92, 246, 0.3)';
    } else {
        navbar.style.background = 'rgba(26, 11, 61, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.lecture-card, .stat-card, .contact-item, .skill-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Food Festival Slideshow
    const slideshow = document.getElementById('food-festival-slideshow');
    if (slideshow) {
        const slides = Array.from(slideshow.querySelectorAll('.slide'));
        const prevBtn = slideshow.querySelector('.slideshow-control.prev');
        const nextBtn = slideshow.querySelector('.slideshow-control.next');
        const dotsContainer = slideshow.querySelector('.slideshow-dots');
        let currentIndex = slides.findIndex(s => s.classList.contains('active'));
        if (currentIndex < 0) currentIndex = 0;
        let autoPlayTimer = null;

        // Build dots
        slides.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
            if (idx === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(idx, true));
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(dotsContainer.querySelectorAll('button'));

        function pauseVideo(slide) {
            const video = slide.querySelector('video');
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        }

        function playVideoIfAny(slide) {
            const video = slide.querySelector('video');
            if (video) {
                // Autoplay muted inline; unmute requires user interaction by browsers
                video.play().catch(() => {});
            }
        }

        function updateActiveSlide(newIndex) {
            slides.forEach((slide, idx) => {
                const isActive = idx === newIndex;
                slide.classList.toggle('active', isActive);
                slide.setAttribute('aria-hidden', String(!isActive));
                if (!isActive) pauseVideo(slide);
            });
            dots.forEach((d, idx) => d.classList.toggle('active', idx === newIndex));
        }

        function goToSlide(index, userInitiated = false) {
            currentIndex = (index + slides.length) % slides.length;
            updateActiveSlide(currentIndex);
            playVideoIfAny(slides[currentIndex]);
            if (userInitiated) restartAutoplay();
        }

        function next() { goToSlide(currentIndex + 1); }
        function prev() { goToSlide(currentIndex - 1); }

        function startAutoplay() {
            clearInterval(autoPlayTimer);
            autoPlayTimer = setInterval(() => {
                const active = slides[currentIndex];
                // If the active slide is a video and it's not ended, wait for it
                const video = active.querySelector('video');
                if (video) {
                    if (video.ended || video.paused) {
                        next();
                    }
                } else {
                    next();
                }
            }, 4000);
        }

        function restartAutoplay() {
            clearInterval(autoPlayTimer);
            startAutoplay();
        }

        prevBtn.addEventListener('click', () => prev());
        nextBtn.addEventListener('click', () => next());

        // Start
        updateActiveSlide(currentIndex);
        playVideoIfAny(slides[currentIndex]);
        startAutoplay();
    }
});

// Form submission handling
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const subject = contactForm.querySelector('input[placeholder="Subject"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Simulate form submission
        const submitBtn = contactForm.querySelector('.btn-primary');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Thank you for your message! I\'ll get back to you soon.');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Add loading animation to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        if (this.classList.contains('btn-primary') && this.type === 'submit') {
            return; // Let form handler deal with this
        }
        
        // Add ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add typing animation to hero title
document.addEventListener('DOMContentLoaded', () => {
    const titleElement = document.querySelector('.hero-title');
    if (titleElement) {
        const text = titleElement.textContent;
        titleElement.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                titleElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing animation after a short delay
        setTimeout(typeWriter, 500);
    }
});

// Add scroll progress indicator
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(135deg, #8B5CF6, #3B82F6);
    z-index: 9999;
    transition: width 0.1s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
});
