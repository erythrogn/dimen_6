// Sistema DIMEN_6 - v2.0
// Corrigido e otimizado

class DimenSystem {
    constructor() {
        this.currentDimension = 6;
        this.soundEnabled = true;
        this.energyLevel = 94;
        this.connectionStable = true;
        this.init();
    }

    init() {
        console.log('🔷 DIMEN_6 SYSTEM INITIALIZED');
        this.setupEventListeners();
        this.startEnergyMonitor();
        this.startDimensionPulse();
        this.updateDisplay();
    }

    setupEventListeners() {
        // Navegação
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.getAttribute('href');
                this.navigateTo(target);
            });
        });

        // Botões de ação
        const exploreBtn = document.querySelector('.btn-primary');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                this.triggerDimensionShift();
            });
        }

        const soundBtn = document.getElementById('soundToggle');
        if (soundBtn) {
            soundBtn.addEventListener('click', () => {
                this.toggleSound();
            });
        }

        const modeBtn = document.getElementById('modeToggle');
        if (modeBtn) {
            modeBtn.addEventListener('click', () => {
                this.toggleMode();
            });
        }

        // Efeitos de hover nos grid items
        document.querySelectorAll('.grid-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.playHoverSound();
                this.createParticles(item);
            });
        });

        // Monitor de conexão
        window.addEventListener('online', () => this.updateConnection(true));
        window.addEventListener('offline', () => this.updateConnection(false));
    }

    navigateTo(page) {
        console.log(`🌌 Navigating to: ${page}`);
        
        // Efeito de transição
        document.body.style.opacity = '0.5';
        document.body.style.transition = 'opacity 0.3s';
        
        setTimeout(() => {
            if (page.startsWith('http')) {
                window.location.href = page;
            } else {
                window.location.href = page;
            }
        }, 300);
    }

    triggerDimensionShift() {
        console.log('🌀 Initiating dimension shift...');
        
        // Efeitos visuais
        document.body.style.animation = 'none';
        setTimeout(() => {
            document.body.style.animation = 'dimensionShift 0.5s';
        }, 10);
        
        // Alternar entre dimensões 6 e 4
        this.currentDimension = this.currentDimension === 6 ? 4 : 6;
        
        // Atualizar display
        const dimDisplay = document.querySelector('.status-value:nth-child(2)');
        if (dimDisplay) {
            dimDisplay.textContent = this.currentDimension;
        }
        
        // Atualizar título
        const titleWord3 = document.querySelector('.title-word-3');
        if (titleWord3) {
            titleWord3.textContent = `_${this.currentDimension}`;
        }
        
        // Log no console
        console.log(`🔄 Switched to DIMENSION ${this.currentDimension}`);
        
        // Efeito sonoro
        this.playShiftSound();
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const soundBtn = document.getElementById('soundToggle');
        if (soundBtn) {
            const btnText = soundBtn.querySelector('.btn-text');
            btnText.textContent = this.soundEnabled ? 'SONORO: ON' : 'SONORO: OFF';
        }
        console.log(`🔊 Sound ${this.soundEnabled ? 'ENABLED' : 'DISABLED'}`);
    }

    toggleMode() {
        const modeBtn = document.getElementById('modeToggle');
        const isD6 = modeBtn.textContent.includes('D6');
        
        modeBtn.textContent = isD6 ? 'MODO: D4' : 'MODO: D6';
        
        // Alternar classes para mudança de tema
        document.body.classList.toggle('mode-d4', !isD6);
        document.body.classList.toggle('mode-d6', isD6);
        
        console.log(`🎮 Mode switched to: ${isD6 ? 'D4' : 'D6'}`);
    }

    playHoverSound() {
        if (!this.soundEnabled) return;
        
        // Criar contexto de áudio para efeitos
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            console.log('Audio context not supported');
        }
    }

    playShiftSound() {
        if (!this.soundEnabled) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.5);
            
            oscillator.type = 'sawtooth';
            
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            // Fallback silencioso
        }
    }

    createParticles(element) {
        if (!window.particlesJS) return;
        
        const rect = element.getBoundingClientRect();
        const particlesConfig = {
            particles: {
                number: { value: 20, density: { enable: false } },
                color: { value: "#00ffaa" },
                shape: { type: "circle" },
                opacity: { value: 0.8, random: true },
                size: { value: 2, random: true },
                move: {
                    enable: true,
                    speed: 3,
                    direction: "outside",
                    random: true,
                    straight: false,
                    out_mode: "destroy"
                }
            }
        };
        
        // Criar partículas temporárias
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = `${rect.left + rect.width/2}px`;
        tempContainer.style.top = `${rect.top + rect.height/2}px`;
        tempContainer.style.width = '1px';
        tempContainer.style.height = '1px';
        document.body.appendChild(tempContainer);
        
        particlesJS('particles-js', particlesConfig);
        
        setTimeout(() => {
            document.body.removeChild(tempContainer);
        }, 1000);
    }

    startEnergyMonitor() {
        // Simular consumo de energia
        setInterval(() => {
            if (this.energyLevel > 0) {
                this.energyLevel -= 0.1;
                this.updateDisplay();
                
                // Alerta de baixa energia
                if (this.energyLevel < 20) {
                    this.showAlert('⚠️ BAIXA ENERGIA! RECARREGUE O SISTEMA.');
                }
            }
        }, 10000); // Atualizar a cada 10 segundos
    }

    startDimensionPulse() {
        // Pulsação dimensional
        setInterval(() => {
            const title = document.querySelector('.main-title');
            if (title) {
                title.style.textShadow = '0 0 20px #00ffaa';
                setTimeout(() => {
                    title.style.textShadow = '0 0 10px #00ffaa';
                }, 500);
            }
        }, 3000);
    }

    updateConnection(status) {
        this.connectionStable = status;
        const connectionEl = document.querySelector('.status-value.active');
        if (connectionEl) {
            connectionEl.textContent = status ? 'ESTÁVEL' : 'INSTÁVEL';
            connectionEl.style.color = status ? '#00ff00' : '#ff0000';
        }
        
        if (!status) {
            this.showAlert('⚠️ CONEXÃO INSTÁVEL! VERIFIQUE SUA REDE.');
        }
    }

    updateDisplay() {
        // Atualizar nível de energia
        const energyEl = document.querySelector('.status-value:nth-child(4)');
        if (energyEl) {
            energyEl.textContent = `${Math.round(this.energyLevel)}%`;
            
            // Mudar cor baseada no nível
            if (this.energyLevel < 30) {
                energyEl.style.color = '#ff0000';
            } else if (this.energyLevel < 60) {
                energyEl.style.color = '#ffff00';
            } else {
                energyEl.style.color = '#00ff00';
            }
        }
    }

    showAlert(message) {
        // Criar alerta temporário
        const alert = document.createElement('div');
        alert.className = 'system-alert';
        alert.textContent = message;
        alert.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 1rem 2rem;
            border: 2px solid #ff0000;
            font-family: 'Blanka', sans-serif;
            letter-spacing: 1px;
            z-index: 10000;
            animation: slideIn 0.3s;
        `;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }

    // Utilitários
    getDimensionInfo(dim) {
        const dimensions = {
            4: { name: "TESSERACT", color: "#ff00aa" },
            6: { name: "HYPERCUBE", color: "#00aaff" }
        };
        return dimensions[dim] || { name: "UNKNOWN", color: "#ffffff" };
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString('pt-BR', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
}

// Inicializar sistema quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.dimenSystem = new DimenSystem();
    
    // Adicionar animação CSS para dimension shift
    const style = document.createElement('style');
    style.textContent = `
        @keyframes dimensionShift {
            0% { filter: hue-rotate(0deg) blur(0px); }
            50% { filter: hue-rotate(180deg) blur(2px); }
            100% { filter: hue-rotate(0deg) blur(0px); }
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .system-alert {
            animation: slideIn 0.3s;
        }
    `;
    document.head.appendChild(style);
    
    // Log de inicialização
    console.log(`
        ╔══════════════════════════════╗
        ║    DIMEN_6 ONLINE v2.0       ║
        ║    SISTEMA OPERACIONAL       ║
        ╚══════════════════════════════╝
    `);
});

// Monitor de performance
window.addEventListener('load', () => {
    const loadTime = window.performance.timing.domContentLoadedEventEnd - 
                     window.performance.timing.navigationStart;
    console.log(`📈 Page loaded in ${loadTime}ms`);
});