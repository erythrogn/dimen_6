document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    function setVH() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', vh + 'px');
    }
    setVH();
    window.addEventListener('resize', setVH);

    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const header = document.getElementById('header');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            
            const isActive = navLinks.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isActive);
            
            const icon = menuToggle.querySelector('i');
            if (isActive) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        checkReveal();
    }, { passive: true });

    const revealElements = document.querySelectorAll('.scroll-reveal');
    function checkReveal() {
        const triggerBottom = window.innerHeight * 0.85;
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                element.classList.add('visible');
            }
        });
    }
    checkReveal();

    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current) && current !== "") {
                 if(link.getAttribute('href') === `#${current}` || link.getAttribute('href') === `index.html#${current}`) {
                    link.classList.add('active');
                 }
            }
        });
    }, { passive: true });

    const contactForm = document.querySelector('.contact-form');
    const emailInput = document.querySelector('.email-input');
    const validationDiv = document.querySelector('.email-validation');
    const overlay = document.getElementById('dimensional-overlay');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailInput && validationDiv) {
        function validateVisual() {
            if (!emailInput.value) {
                validationDiv.classList.remove('show');
                emailInput.style.borderColor = '';
                return;
            }
            if (emailRegex.test(emailInput.value)) {
                validationDiv.textContent = '✓ Email válido';
                validationDiv.className = 'email-validation show valid';
                emailInput.style.borderColor = '#2ecc71';
            } else {
                validationDiv.textContent = '✗ Formato inválido';
                validationDiv.className = 'email-validation show invalid';
                emailInput.style.borderColor = '#e74c3c';
            }
        }
        emailInput.addEventListener('input', validateVisual);
        emailInput.addEventListener('blur', validateVisual);
    }

    if (contactForm && overlay) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailVal = emailInput ? emailInput.value : '';
            if (!emailRegex.test(emailVal)) {
                if (validationDiv) {
                    validationDiv.textContent = '✗ Insira um email válido para continuar';
                    validationDiv.className = 'email-validation show invalid';
                }
                if (emailInput) {
                    emailInput.focus();
                    emailInput.style.borderColor = '#e74c3c';
                }
                return;
            }

            overlay.classList.add('active');

            const formData = new FormData(this);

            fetch(this.action, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                setTimeout(() => {
                    overlay.classList.remove('active');
                    if (response.ok) {
                        alert("MENSAGEM ENVIADA PARA O UNIVERSO DIMEN6!");
                        contactForm.reset();
                        if (emailInput) emailInput.style.borderColor = '';
                        if (validationDiv) validationDiv.classList.remove('show');
                    } else {
                        alert("Erro na transmissão. Tente novamente.");
                    }
                }, 2500); 
            })
            .catch(() => {
                overlay.classList.remove('active');
                alert("Falha na conexão dimensional. Verifique sua internet.");
            });
        });
    }

});
