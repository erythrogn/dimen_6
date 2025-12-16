document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ==================================================
    // 1. AJUSTES DE TELA E MENU
    // ==================================================
    function setVH() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', vh + 'px');
    }
    setVH();
    window.addEventListener('resize', setVH);

    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const header = document.getElementById('header');

    // Lógica do Menu Mobile
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
                document.body.style.overflow = 'hidden'; // Trava scroll
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = 'auto'; // Libera scroll
            }
        });

        // Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = 'auto';
            }
        });

        // Fechar ao clicar em link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // Efeito de Scroll no Header
    window.addEventListener('scroll', () => {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }
    }, { passive: true });


    // ==================================================
    // 2. SCROLL REVEAL (Animação ao descer a tela)
    // ==================================================
    function checkReveal() {
        const revealElements = document.querySelectorAll('.scroll-reveal');
        const triggerBottom = window.innerHeight * 0.85;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                element.classList.add('visible');
            }
        });
    }
    window.addEventListener('scroll', checkReveal, { passive: true });
    checkReveal(); // Checa ao carregar


    // ==================================================
    // 3. FORMULÁRIO DE CONTATO (Validação e Envio)
    // ==================================================
    const contactForm = document.querySelector('.contact-form');
    const emailInput = document.querySelector('.email-input');
    const validationDiv = document.querySelector('.email-validation');
    const overlay = document.getElementById('dimensional-overlay');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validação visual do email em tempo real
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
                validationDiv.style.color = '#2ecc71';
                emailInput.style.borderColor = '#2ecc71';
            } else {
                validationDiv.textContent = '✗ Formato inválido';
                validationDiv.className = 'email-validation show invalid';
                validationDiv.style.color = '#e74c3c';
                emailInput.style.borderColor = '#e74c3c';
            }
        }
        emailInput.addEventListener('input', validateVisual);
        emailInput.addEventListener('blur', validateVisual);
    }

    // Envio do Formulário com AJAX (Fetch)
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Impede o redirecionamento padrão

            const emailVal = emailInput ? emailInput.value : '';
            
            // Verificação final do email
            if (!emailRegex.test(emailVal)) {
                if (validationDiv) {
                    validationDiv.textContent = '✗ Insira um email válido para continuar';
                    validationDiv.style.color = '#e74c3c';
                }
                if (emailInput) {
                    emailInput.focus();
                    emailInput.style.borderColor = '#e74c3c';
                }
                return;
            }

            // Ativa o loading
            if(overlay) overlay.classList.add('active');

            const formData = new FormData(this);

            fetch(this.action, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                setTimeout(() => {
                    if(overlay) overlay.classList.remove('active');
                    
                    if (response.ok) {
                        alert("MENSAGEM ENVIADA PARA O UNIVERSO DIMEN6!");
                        contactForm.reset();
                        if (emailInput) emailInput.style.borderColor = '';
                        if (validationDiv) validationDiv.textContent = '';
                    } else {
                        alert("Erro na transmissão. Tente novamente.");
                    }
                }, 1500); // Delay para mostrar o loading
            })
            .catch(() => {
                if(overlay) overlay.classList.remove('active');
                alert("Falha na conexão dimensional. Verifique sua internet.");
            });
        });
    }


    // ==================================================
    // 4. PARTÍCULAS (Canvas)
    // ==================================================
    const canvas = document.getElementById('particles-canvas');
    
    // TRAVA DE SEGURANÇA: Só roda se o canvas existir na página
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        
        const particleCount = window.innerWidth < 768 ? 40 : 80; // Otimizado para mobile
        const connectionDistance = 150;
        const mouseDistance = 150;

        let mouse = { x: null, y: null };

        function resize() {
            const parent = canvas.parentElement;
            if (parent) {
                width = canvas.width = parent.offsetWidth;
                height = canvas.height = parent.offsetHeight;
            } else {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
            }
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
                this.size = Math.random() * 2 + 1;
                this.color = '#00F3FF';
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouseDistance) {
                        const force = (mouseDistance - distance) / mouseDistance;
                        const directionX = (dx / distance) * force * 2; 
                        const directionY = (dy / distance) * force * 2;
                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        function init() {
            particles = [];
            resize();
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i; j < particles.length; j++) {
                    let dx = particles[i].x - particles[j].x;
                    let dy = particles[i].y - particles[j].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 243, 255, ${1 - distance / connectionDistance})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', () => { resize(); init(); });
        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

        init();
        animate();
    }
});