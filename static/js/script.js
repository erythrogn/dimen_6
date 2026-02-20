/* =============================================================
   script.js — DIMEN6 | SISTEMA DE ANIMAÇÕES UNIFICADO
   Responsabilidades:
    1.  Scroll Reveal          (.scroll-reveal  +  .d6-reveal  +  .sr / .sr-left / .sr-right)
    2.  Magic Navigation Bar   (indicador responsivo)
    3.  Accordion de Serviços  (.acc-item)
    4.  Carrossel Holográfico  (#holoTrack)
    5.  Menu Vertical          (.vertical-nav / .detail-pane)
    6.  Canvas de Partículas   (#particles-canvas)
    7.  Overlay de Transição   (#dimensional-overlay)
    8.  Wizard de Contato      (#step-1 … #step-confirm)
    9.  Loading Screen         (#loader)
   10.  Cursor Customizado      (#cursorDot / #cursorRing)
   11.  Animação de Contadores  (.d6-counter)
   12.  Marquee Tech Stack      (.d6-marquee)
   13.  Parallax Suave          ([data-parallax])
   14.  Word / Char Reveal Hero (.hero-title .word)
   15.  Efeito Magnético        (.btn-primary-mag / .btn-outline-mag)
   16.  Animação Terminal       (.terminal-block)
   17.  Tilt 3D                 (.d6-tilt)
   ============================================================= */

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. SCROLL REVEAL UNIFICADO
   Suporta: .scroll-reveal  |  .d6-reveal  |  .sr  |  .sr-left  |  .sr-right
   Todos respeitam data-delay="0.2" (segundos) se presente.
────────────────────────────────────────────────────────────── */
function initScrollReveal() {
    const selectors = '.scroll-reveal, .d6-reveal, .sr, .sr-left, .sr-right';
    const elements  = document.querySelectorAll(selectors);
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
        elements.forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const delay = parseFloat(entry.target.dataset.delay || 0) * 1000;
            setTimeout(() => entry.target.classList.add('visible'), delay);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}


/* ─────────────────────────────────────────────────────────────
   2. MAGIC NAV — INDICADOR ANIMADO
────────────────────────────────────────────────────────────── */
function initMagicNav() {
    const nav       = document.querySelector('.magic-nav ul');
    const indicator = document.querySelector('.indicator');
    if (!nav || !indicator) return;

    function moveIndicator(activeItem) {
        if (!activeItem) return;
        const itemIndex = Array.from(nav.querySelectorAll('li')).indexOf(activeItem);
        const itemWidth = activeItem.offsetWidth || 70;
        indicator.style.transform = `translateX(${itemIndex * itemWidth}px)`;
    }

    moveIndicator(nav.querySelector('li.active'));

    nav.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
            nav.querySelectorAll('li').forEach(i => i.classList.remove('active'));
            li.classList.add('active');
            moveIndicator(li);
        });
    });

    window.addEventListener('resize', () => {
        moveIndicator(nav.querySelector('li.active'));
    });
}


/* ─────────────────────────────────────────────────────────────
   3. ACCORDION DE SERVIÇOS
────────────────────────────────────────────────────────────── */
function initAccordion() {
    const items = document.querySelectorAll('.acc-item');
    if (!items.length) return;

    items.forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            items.forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });
}


/* ─────────────────────────────────────────────────────────────
   4. CARROSSEL HOLOGRÁFICO
────────────────────────────────────────────────────────────── */
function initCarousel() {
    const track   = document.getElementById('holoTrack');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    if (!track) return;

    function getScrollAmount() {
        const card = track.querySelector('.holo-card');
        if (!card) return 300;
        const gap = parseInt(window.getComputedStyle(track).gap) || 30;
        return card.offsetWidth + gap;
    }

    prevBtn?.addEventListener('click', () => track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' }));
    nextBtn?.addEventListener('click', () => track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' }));
}


/* ─────────────────────────────────────────────────────────────
   5. MENU VERTICAL DE SERVIÇOS
────────────────────────────────────────────────────────────── */
function initVerticalNav() {
    const navItems = document.querySelectorAll('.vertical-nav li');
    const panes    = document.querySelectorAll('.detail-pane');
    const pill     = document.getElementById('activePill');
    if (!navItems.length) return;

    function updatePill(activeItem) {
        if (!pill || !activeItem) return;
        const navUl = activeItem.closest('ul');
        pill.style.transform = `translateY(${navUl.offsetTop + activeItem.offsetTop}px)`;
        pill.style.height    = `${activeItem.offsetHeight}px`;
    }

    updatePill(document.querySelector('.vertical-nav li.active'));

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            updatePill(item);
            panes.forEach(pane => pane.classList.toggle('active', pane.id === targetId));
        });
    });
}


/* ─────────────────────────────────────────────────────────────
   6. CANVAS DE PARTÍCULAS
────────────────────────────────────────────────────────────── */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = [];
        const count = Math.floor((canvas.width * canvas.height) / 15000);
        for (let i = 0; i < count; i++) {
            particles.push({
                x:       Math.random() * canvas.width,
                y:       Math.random() * canvas.height,
                radius:  Math.random() * 1.5 + 0.3,
                speedX:  (Math.random() - 0.5) * 0.4,
                speedY:  (Math.random() - 0.5) * 0.4,
                opacity: Math.random() * 0.5 + 0.1,
            });
        }
    }

    function drawLine(p1, p2, dist, maxDist) {
        const alpha = (1 - dist / maxDist) * 0.15;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(0, 243, 255, ${alpha})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const MAX_DIST = 120;

        particles.forEach((p, i) => {
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width)  p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 243, 255, ${p.opacity})`;
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const dx   = p.x - particles[j].x;
                const dy   = p.y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DIST) drawLine(p, particles[j], dist, MAX_DIST);
            }
        });

        animationId = requestAnimationFrame(animate);
    }

    document.addEventListener('visibilitychange', () => {
        document.hidden ? cancelAnimationFrame(animationId) : animate();
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { resize(); createParticles(); }, 200);
    });

    resize();
    createParticles();
    animate();
}


/* ─────────────────────────────────────────────────────────────
   7. OVERLAY DE TRANSIÇÃO ENTRE PÁGINAS
────────────────────────────────────────────────────────────── */
function initPageTransitions() {
    const overlay = document.getElementById('dimensional-overlay');
    if (!overlay) return;

    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel')) return;

        link.addEventListener('click', (e) => {
            e.preventDefault();
            overlay.classList.add('active');
            setTimeout(() => { window.location.href = href; }, 400);
        });
    });

    window.addEventListener('pageshow', () => overlay.classList.remove('active'));
}


/* ─────────────────────────────────────────────────────────────
   8. WIZARD DE CONTATO MULTI-STEP
────────────────────────────────────────────────────────────── */
function initContactWizard() {
    const step1       = document.getElementById('step-1');
    const step2       = document.getElementById('step-2');
    const step3       = document.getElementById('step-3');
    const stepConfirm = document.getElementById('step-confirm');
    if (!step1) return;

    const btnNext1  = document.getElementById('btn-next-1');
    const btnNext2  = document.getElementById('btn-next-2');
    const btnBack2  = document.getElementById('btn-back-2');
    const btnBack3  = document.getElementById('btn-back-3');
    const chips     = document.querySelectorAll('.chip');
    const textarea  = document.getElementById('projeto');
    const charCount = document.getElementById('charCount');
    const nomeInput = document.getElementById('nome');
    const dots      = document.querySelectorAll('.step-dot');
    const lines     = document.querySelectorAll('.step-line');

    let state = { servico: '', projeto: '', nome: '' };

    const CHANNELS = {
        whatsapp:  'https://wa.me/5594992691894',
        instagram: 'https://instagram.com/dimen_6_',
        email:     'mailto:contato@dimen6.com',
        linkedin:  'https://linkedin.com/in/seu-linkedin'
    };

    function goTo(fromStep, toStep, isBack = false) {
        fromStep.classList.remove('active');
        toStep.classList.remove('going-back');
        if (isBack) toStep.classList.add('going-back');
        toStep.classList.add('active');
    }

    function updateProgress(stepNum) {
        dots.forEach((dot, i) => {
            dot.classList.remove('active', 'done');
            if (i + 1 < stepNum)  dot.classList.add('done');
            if (i + 1 === stepNum) dot.classList.add('active');
        });
        lines.forEach((line, i) => line.classList.toggle('done', i + 1 < stepNum));
    }

    textarea?.addEventListener('input', () => {
        if (charCount) charCount.textContent = textarea.value.length;
    });

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('selected'));
            chip.classList.add('selected');
            state.servico = chip.getAttribute('data-val');
        });
    });

    btnNext1?.addEventListener('click', () => {
        state.projeto = textarea?.value.trim() || '';
        if (!state.projeto) {
            if (textarea) { textarea.focus(); textarea.style.borderColor = 'rgba(231,76,60,0.6)'; setTimeout(() => textarea.style.borderColor = '', 1500); }
            return;
        }
        const prevServico = document.getElementById('prev-servico');
        const prevProjeto = document.getElementById('prev-projeto');
        if (prevServico) prevServico.textContent = state.servico || 'Não especificado';
        if (prevProjeto) prevProjeto.textContent = state.projeto;
        goTo(step1, step2);
        updateProgress(2);
        nomeInput?.focus();
    });

    btnBack2?.addEventListener('click', () => { goTo(step2, step1, true); updateProgress(1); });

    btnNext2?.addEventListener('click', () => {
        state.nome = nomeInput?.value.trim() || '';
        if (!state.nome) {
            if (nomeInput) { nomeInput.focus(); nomeInput.style.borderColor = 'rgba(231,76,60,0.6)'; setTimeout(() => nomeInput.style.borderColor = '', 1500); }
            return;
        }
        const fpNome    = document.getElementById('fp-nome');
        const fpServico = document.getElementById('fp-servico');
        const fpProjeto = document.getElementById('fp-projeto');
        if (fpNome)    fpNome.textContent    = state.nome;
        if (fpServico) fpServico.textContent = state.servico || 'Não especificado';
        if (fpProjeto) fpProjeto.textContent = state.projeto;
        goTo(step2, step3);
        updateProgress(3);
    });

    btnBack3?.addEventListener('click', () => { goTo(step3, step2, true); updateProgress(2); });

    document.querySelectorAll('.channel-card').forEach(card => {
        card.addEventListener('click', () => {
            const channel = card.getAttribute('data-channel');
            const nome    = encodeURIComponent(state.nome    || 'cliente');
            const servico = encodeURIComponent(state.servico || 'serviço');
            const projeto = encodeURIComponent(state.projeto || '');
            let url       = null;

            const confirmEl = document.getElementById('confirmChannelName');
            const labels    = { whatsapp: 'WhatsApp', instagram: 'Instagram', email: 'Enviando e-mail...', linkedin: 'LinkedIn' };
            if (confirmEl) confirmEl.textContent = labels[channel] || channel;

            switch (channel) {
                case 'whatsapp':
                    url = `${CHANNELS.whatsapp}?text=Olá! Sou ${nome} e tenho interesse em: ${servico}.%0A%0A${projeto}`;
                    break;
                case 'instagram':
                    url = CHANNELS.instagram;
                    break;
                case 'linkedin':
                    url = CHANNELS.linkedin;
                    break;
                case 'email':
                    fetch('/api/contato', {
                        method:  'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body:    JSON.stringify({ nome: state.nome, servico: state.servico, projeto: state.projeto })
                    })
                    .then(r => r.json())
                    .then(res => { if (confirmEl) confirmEl.textContent = res.ok ? 'E-mail enviado com sucesso!' : 'Erro ao enviar — tente outro canal'; })
                    .catch(() => { if (confirmEl) confirmEl.textContent = 'Erro de conexão'; });
                    break;
            }

            goTo(step3, stepConfirm);
            if (url) setTimeout(() => window.open(url, '_blank', 'noopener'), 1200);
        });
    });
}


/* ─────────────────────────────────────────────────────────────
   9. LOADING SCREEN
   Anima a barra de progresso e libera o hero após completar.
────────────────────────────────────────────────────────────── */
function initLoader() {
    const loader     = document.getElementById('loader');
    const loaderBar  = document.getElementById('loaderBar');
    const loaderPct  = document.getElementById('loaderPercent');
    if (!loader) return;

    let pct = 0;
    const interval = setInterval(() => {
        pct += Math.random() * 18;
        if (pct > 100) pct = 100;
        if (loaderBar)  loaderBar.style.width     = pct + '%';
        if (loaderPct)  loaderPct.textContent     = Math.floor(pct) + '%';
        if (pct >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('hidden');
                revealHeroWords();
            }, 300);
        }
    }, 80);
}



/* ─────────────────────────────────────────────────────────────
   11. CONTADORES ANIMADOS (.d6-counter)
   Dispara quando o elemento entra no viewport.
   Lê data-target e data-suffix.
────────────────────────────────────────────────────────────── */
function initCounters() {
    const counters = document.querySelectorAll('.d6-counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el     = entry.target;
            const target = parseInt(el.dataset.target) || 0;
            const suffix = el.dataset.suffix || '';
            let current  = 0;
            const step   = target / 60;

            const interval = setInterval(() => {
                current += step;
                if (current >= target) { current = target; clearInterval(interval); }
                el.textContent = Math.floor(current) + suffix;
            }, 16);

            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
}


/* ─────────────────────────────────────────────────────────────
   12. MARQUEE TECH STACK (.d6-marquee)
   Respeita data-speed para ajustar a duração da animação.
────────────────────────────────────────────────────────────── */
function initMarquee() {
    document.querySelectorAll('.d6-marquee').forEach(marquee => {
        const speed   = parseFloat(marquee.dataset.speed || 1);
        const content = marquee.querySelector('.marquee-content');
        if (!content) return;

        // Usa CSS animation definida no CSS; aqui apenas ajusta a duração
        const baseDuration = 20; // segundos base
        content.style.animationDuration = (baseDuration / speed) + 's';
    });
}


/* ─────────────────────────────────────────────────────────────
   13. PARALLAX SUAVE ([data-parallax])
   Move o elemento verticalmente com base no scroll.
   Valor positivo = desce mais devagar. Negativo = sobe.
────────────────────────────────────────────────────────────── */
function initParallax() {
    const elements = document.querySelectorAll('[data-parallax]');
    if (!elements.length) return;

    function onScroll() {
        const scrollY = window.scrollY;
        elements.forEach(el => {
            const factor = parseFloat(el.dataset.parallax || 0);
            el.style.transform = `translateY(${scrollY * factor}px)`;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Inicializa na posição atual
}


/* ─────────────────────────────────────────────────────────────
   14. WORD REVEAL HERO (.hero-title .word)
   Chamado pelo loader após completar. Se não houver loader,
   dispara automaticamente após 200ms.
────────────────────────────────────────────────────────────── */
function revealHeroWords() {
    document.querySelectorAll('.hero-title .word').forEach(w => {
        w.classList.add('revealed');
    });
}


/* ─────────────────────────────────────────────────────────────
   15. EFEITO MAGNÉTICO NOS BOTÕES
────────────────────────────────────────────────────────────── */
function initMagneticButtons() {
    const btns = document.querySelectorAll('.btn-primary-mag, .btn-outline-mag, .d6-magnetic-btn');
    btns.forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r  = btn.getBoundingClientRect();
            const dx = (e.clientX - r.left - r.width  / 2) * 0.25;
            const dy = (e.clientY - r.top  - r.height / 2) * 0.25;
            btn.style.transform = `translate(${dx}px, ${dy}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
}


/* ─────────────────────────────────────────────────────────────
   16. ANIMAÇÃO TERMINAL (.terminal-block)
   Cada linha aparece em sequência quando o bloco entra
   no viewport.
────────────────────────────────────────────────────────────── */
function initTerminal() {
    document.querySelectorAll('.terminal-block').forEach(block => {
        const lines = block.querySelectorAll('.t-line');
        if (!lines.length) return;

        // Esconde inicialmente
        lines.forEach(l => { l.style.opacity = '0'; l.style.transition = 'opacity 0.3s ease'; });

        let triggered = false;
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !triggered) {
                triggered = true;
                lines.forEach((line, i) => {
                    setTimeout(() => { line.style.opacity = '1'; }, i * 250);
                });
                observer.disconnect();
            }
        }, { threshold: 0.5 });

        observer.observe(block);
    });
}


/* ─────────────────────────────────────────────────────────────
   17. TILT 3D (.d6-tilt)
   Efeito de perspectiva ao mover o mouse sobre o elemento.
   Lê data-tilt-max (graus) e data-tilt-speed (ms).
────────────────────────────────────────────────────────────── */
function initTilt() {
    const elements = document.querySelectorAll('.d6-tilt');
    if (!elements.length || window.matchMedia('(hover: none)').matches) return;

    elements.forEach(el => {
        const max = parseFloat(el.dataset.tiltMax || 10);

        el.addEventListener('mousemove', e => {
            const r  = el.getBoundingClientRect();
            const x  = (e.clientX - r.left) / r.width  - 0.5;
            const y  = (e.clientY - r.top)  / r.height - 0.5;
            el.style.transform = `perspective(800px) rotateY(${x * max}deg) rotateX(${-y * max}deg) scale(1.02)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transition = 'transform 0.5s ease';
            el.style.transform  = '';
            setTimeout(() => { el.style.transition = ''; }, 500);
        });
    });
}


/* ─────────────────────────────────────────────────────────────
   INICIALIZAÇÃO GLOBAL
   Ordem importa: loader primeiro, partículas no início,
   o resto após DOM pronto.
────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

    // Se não houver loader mas tiver palavras do hero, revela direto
    if (!document.getElementById('loader')) {
        setTimeout(revealHeroWords, 200);
    }

    initLoader();           //  9 — Loading screen (chama revealHeroWords ao fim)
    initParticles();        //  6 — Canvas de partículas (começa cedo)
    initScrollReveal();     //  1 — Reveal unificado
    initMagicNav();         //  2 — Navigation bar
    initAccordion();        //  3 — Accordion serviços
    initCarousel();         //  4 — Carrossel holográfico
    initVerticalNav();      //  5 — Menu vertical serviços
    initPageTransitions();  //  7 — Overlay de transição
    initContactWizard();    //  8 — Wizard de contato

    initCounters();         // 11 — Contadores animados
    initMarquee();          // 12 — Marquee tech stack
    initParallax();         // 13 — Parallax suave
    initMagneticButtons();  // 15 — Efeito magnético botões
    initTerminal();         // 16 — Animação terminal
    initTilt();             // 17 — Tilt 3D
});