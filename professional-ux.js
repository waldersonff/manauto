/* ========================================
   PROFESSIONAL UX/UI JAVASCRIPT ENHANCEMENTS
   Sistema de melhorias interativas e funcionais
   ======================================== */

// === TOAST NOTIFICATION SYSTEM ===
class ToastManager {
    constructor() {
        this.container = this.createContainer();
    }

    createContainer() {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    show(message, type = 'info', duration = 4000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconMap = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        toast.innerHTML = `
            <i class="fas ${iconMap[type]}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; cursor: pointer; font-size: 1.2rem; color: var(--neutral-500);">
                <i class="fas fa-times"></i>
            </button>
        `;

        this.container.appendChild(toast);

        if (duration > 0) {
            setTimeout(() => {
                toast.style.animation = 'slideOutRight 0.3s ease-out forwards';
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }

        return toast;
    }

    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }
}

// Instância global do toast
const toast = new ToastManager();

// === SMOOTH SCROLL WITH OFFSET ===
function smoothScrollTo(target, offset = 80) {
    const element = document.querySelector(target);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Interceptar cliques em links com #
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                smoothScrollTo(href);
            }
        });
    });
});

// === INTERSECTION OBSERVER PARA ANIMAÇÕES ===
const observeElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = entry.target.dataset.animation || 'fadeInUp 0.6s ease-out';
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observar elementos com classe .animate-on-scroll
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
};

// === LAZY LOADING DE IMAGENS ===
const lazyLoadImages = () => {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
};

// === LOADING STATES ===
function showLoading(element, text = 'Carregando...') {
    const originalContent = element.innerHTML;
    element.dataset.originalContent = originalContent;
    element.disabled = true;
    element.style.opacity = '0.6';
    element.innerHTML = `
        <span style="display: flex; align-items: center; gap: 8px; justify-content: center;">
            <i class="fas fa-spinner fa-spin"></i>
            ${text}
        </span>
    `;
}

function hideLoading(element) {
    if (element.dataset.originalContent) {
        element.innerHTML = element.dataset.originalContent;
        element.disabled = false;
        element.style.opacity = '1';
    }
}

// === DEBOUNCE PARA OTIMIZAÇÃO ===
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// === THROTTLE PARA EVENTOS DE SCROLL ===
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// === HEADER STICKY COM ANIMAÇÃO ===
let lastScroll = 0;
const header = document.querySelector('.header');

const handleScroll = throttle(() => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header?.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header?.classList.contains('scroll-down')) {
        // Scroll down
        header?.classList.remove('scroll-up');
        header?.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header?.classList.contains('scroll-down')) {
        // Scroll up
        header?.classList.remove('scroll-down');
        header?.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
}, 100);

window.addEventListener('scroll', handleScroll);

// === SKELETON LOADING ===
function createSkeleton(type = 'card') {
    const skeletons = {
        card: `
            <div class="product-card skeleton" style="height: 350px;">
                <div style="height: 200px; background: #e0e0e0;"></div>
                <div style="padding: 16px;">
                    <div style="height: 20px; background: #e0e0e0; margin-bottom: 8px; border-radius: 4px;"></div>
                    <div style="height: 16px; background: #e0e0e0; width: 70%; margin-bottom: 8px; border-radius: 4px;"></div>
                    <div style="height: 40px; background: #e0e0e0; margin-top: 16px; border-radius: 8px;"></div>
                </div>
            </div>
        `,
        list: `
            <div class="skeleton" style="height: 60px; margin-bottom: 12px; border-radius: 8px;"></div>
        `
    };
    
    return skeletons[type] || skeletons.card;
}

// === COPY TO CLIPBOARD ===
async function copyToClipboard(text, showToast = true) {
    try {
        await navigator.clipboard.writeText(text);
        if (showToast) {
            toast.success('Copiado para área de transferência!');
        }
        return true;
    } catch (err) {
        console.error('Erro ao copiar:', err);
        if (showToast) {
            toast.error('Erro ao copiar');
        }
        return false;
    }
}

// === FORM VALIDATION HELPER ===
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            input.parentElement?.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
            input.parentElement?.classList.remove('error');
        }
    });
    
    return isValid;
}

// === MODAL SYSTEM ===
class ModalManager {
    constructor() {
        this.activeModal = null;
    }

    create(content, options = {}) {
        const defaults = {
            title: '',
            closeButton: true,
            backdrop: true,
            keyboard: true,
            size: 'medium' // small, medium, large
        };

        const settings = { ...defaults, ...options };

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = `modal-content modal-${settings.size}`;
        
        if (settings.title) {
            modal.innerHTML = `
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <h2 style="margin: 0; font-size: 1.5rem; color: var(--neutral-900);">${settings.title}</h2>
                    ${settings.closeButton ? '<button class="modal-close" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--neutral-500);"><i class="fas fa-times"></i></button>' : ''}
                </div>
                <div class="modal-body">${content}</div>
            `;
        } else {
            modal.innerHTML = `
                ${settings.closeButton ? '<button class="modal-close" style="position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--neutral-500);"><i class="fas fa-times"></i></button>' : ''}
                <div class="modal-body">${content}</div>
            `;
        }

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        this.activeModal = overlay;

        // Event listeners
        if (settings.closeButton) {
            const closeBtn = modal.querySelector('.modal-close');
            closeBtn?.addEventListener('click', () => this.close());
        }

        if (settings.backdrop) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.close();
                }
            });
        }

        if (settings.keyboard) {
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    this.close();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        }

        // Prevenir scroll do body
        document.body.style.overflow = 'hidden';

        return overlay;
    }

    close() {
        if (this.activeModal) {
            this.activeModal.style.animation = 'fadeOut 0.2s ease-out';
            setTimeout(() => {
                this.activeModal?.remove();
                this.activeModal = null;
                document.body.style.overflow = '';
            }, 200);
        }
    }
}

const modal = new ModalManager();

// === ANIMATED COUNTER ===
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = Math.round(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, 16);
}

// === RIPPLE EFFECT ===
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.className = 'ripple-effect';

    const existingRipple = button.querySelector('.ripple-effect');
    if (existingRipple) {
        existingRipple.remove();
    }

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

// Adicionar efeito ripple em botões
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn, .contact-btn').forEach(button => {
        button.addEventListener('click', createRipple);
    });
});

// === PARALLAX EFFECT ===
const parallaxElements = document.querySelectorAll('[data-parallax]');
window.addEventListener('scroll', throttle(() => {
    parallaxElements.forEach(el => {
        const speed = el.dataset.parallax || 0.5;
        const yPos = -(window.pageYOffset * speed);
        el.style.transform = `translateY(${yPos}px)`;
    });
}, 10));

// === PROGRESS BAR UPDATER ===
function updateProgressBar(element, percentage) {
    const fill = element.querySelector('.progress-bar-fill');
    if (fill) {
        fill.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
    }
}

// === AUTO-SAVE INDICATOR ===
let saveTimeout;
function showAutoSaveIndicator(status = 'saving') {
    const indicator = document.querySelector('.autosave-indicator') || createAutoSaveIndicator();
    
    const messages = {
        saving: '<i class="fas fa-spinner fa-spin"></i> Salvando...',
        saved: '<i class="fas fa-check"></i> Salvo automaticamente',
        error: '<i class="fas fa-exclamation-circle"></i> Erro ao salvar'
    };
    
    indicator.innerHTML = messages[status];
    indicator.className = `autosave-indicator ${status}`;
    indicator.style.display = 'block';
    
    if (status === 'saved' || status === 'error') {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            indicator.style.display = 'none';
        }, 3000);
    }
}

function createAutoSaveIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'autosave-indicator';
    indicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: white;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: none;
        z-index: 1000;
        font-size: 0.875rem;
    `;
    document.body.appendChild(indicator);
    return indicator;
}

// === SEARCH HIGHLIGHT ===
function highlightSearchTerm(text, term) {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark style="background: #fff59d; padding: 2px 4px; border-radius: 2px;">$1</mark>');
}

// === KEYBOARD SHORTCUTS ===
const shortcuts = new Map();

function registerShortcut(key, callback, description = '') {
    shortcuts.set(key.toLowerCase(), { callback, description });
}

document.addEventListener('keydown', (e) => {
    const key = `${e.ctrlKey ? 'ctrl+' : ''}${e.shiftKey ? 'shift+' : ''}${e.altKey ? 'alt+' : ''}${e.key.toLowerCase()}`;
    const shortcut = shortcuts.get(key);
    
    if (shortcut) {
        e.preventDefault();
        shortcut.callback(e);
    }
});

// Registrar alguns atalhos úteis
registerShortcut('ctrl+k', () => {
    const searchInput = document.querySelector('#searchInput, #searchProducts');
    searchInput?.focus();
}, 'Focar na busca');

registerShortcut('escape', () => {
    modal.close();
}, 'Fechar modal');

// === LOADING SCREEN HANDLER ===
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
        }, 500);
    }

    // Inicializar funcionalidades
    observeElements();
    lazyLoadImages();
});

// === UTILS PARA ACESSIBILIDADE ===
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
}

// === PERFORMANCE MONITORING ===
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`⚡ Tempo de carregamento: ${pageLoadTime}ms`);
        }, 0);
    });
}

// === EXPORTAR FUNÇÕES GLOBAIS ===
window.UXHelpers = {
    toast,
    modal,
    smoothScrollTo,
    copyToClipboard,
    validateForm,
    showLoading,
    hideLoading,
    animateCounter,
    updateProgressBar,
    highlightSearchTerm,
    registerShortcut,
    debounce,
    throttle,
    createSkeleton
};

console.log('✅ Professional UX/UI System carregado com sucesso!');
