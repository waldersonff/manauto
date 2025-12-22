// ===== MELHORIAS DE UX/UI =====

// 1. SISTEMA DE NOTIFICAÇÕES (TOAST)
class NotificationSystem {
    static show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${this.getIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideInDown 0.3s ease-in-out forwards';
        }, 10);

        setTimeout(() => {
            toast.style.animation = 'slideOutDown 0.3s ease-in-out forwards';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    static getIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    static success(message) { this.show(message, 'success'); }
    static error(message) { this.show(message, 'error'); }
    static warning(message) { this.show(message, 'warning'); }
    static info(message) { this.show(message, 'info'); }
}

// 2. FEEDBACK VISUAL DE CARREGAMENTO
class LoadingState {
    static show(element, message = 'Carregando...') {
        element.classList.add('loading');
        element.setAttribute('data-loading', message);
        element.innerHTML = `<div class="spinner"></div> ${message}`;
    }

    static hide(element, content = '') {
        element.classList.remove('loading');
        element.removeAttribute('data-loading');
        element.innerHTML = content;
    }
}

// 3. VALIDAÇÃO DE FORMULÁRIOS
class FormValidator {
    static validate(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    static validateField(input) {
        let isValid = true;
        let errorMessage = '';

        // Validação de campo vazio
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            errorMessage = 'Campo obrigatório';
        }

        // Validação de email
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                errorMessage = 'Email inválido';
            }
        }

        // Validação de número
        if (input.type === 'number' && input.value) {
            if (isNaN(input.value)) {
                isValid = false;
                errorMessage = 'Deve ser um número';
            }
        }

        // Validação de tamanho mínimo
        if (input.hasAttribute('minlength') && input.value.length < parseInt(input.getAttribute('minlength'))) {
            isValid = false;
            errorMessage = `Mínimo de ${input.getAttribute('minlength')} caracteres`;
        }

        // Visual feedback
        if (isValid) {
            input.classList.remove('error');
            const errorEl = input.parentElement.querySelector('.error-message');
            if (errorEl) errorEl.remove();
        } else {
            input.classList.add('error');
            const existingError = input.parentElement.querySelector('.error-message');
            if (!existingError) {
                const errorEl = document.createElement('div');
                errorEl.className = 'error-message';
                errorEl.textContent = errorMessage;
                input.parentElement.appendChild(errorEl);
            }
        }

        return isValid;
    }
}

// 4. ANIMAÇÕES DE ENTRADA
class EntryAnimations {
    static observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in', 'slide-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.product-card, .category-card').forEach(el => {
            observer.observe(el);
        });
    }
}

// 5. SISTEMA DE FAVORITOS COM PERSISTÊNCIA
class FavoritesSystem {
    static KEY = 'motoparts_favorites';

    static add(productId) {
        const favorites = this.getAll();
        if (!favorites.includes(productId)) {
            favorites.push(productId);
            localStorage.setItem(this.KEY, JSON.stringify(favorites));
            NotificationSystem.success('Adicionado aos favoritos');
            return true;
        }
        return false;
    }

    static remove(productId) {
        let favorites = this.getAll();
        favorites = favorites.filter(id => id !== productId);
        localStorage.setItem(this.KEY, JSON.stringify(favorites));
        NotificationSystem.success('Removido dos favoritos');
    }

    static getAll() {
        const stored = localStorage.getItem(this.KEY);
        return stored ? JSON.parse(stored) : [];
    }

    static isFavorite(productId) {
        return this.getAll().includes(productId);
    }

    static toggle(productId) {
        if (this.isFavorite(productId)) {
            this.remove(productId);
            return false;
        } else {
            this.add(productId);
            return true;
        }
    }
}

// 6. DEBOUNCE PARA SEARCH
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// 7. SMOOTH SCROLL PARA LINKS INTERNOS
class SmoothScroll {
    static init() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
}

// 8. TOOLTIP MELHORADO
class Tooltip {
    static init() {
        document.querySelectorAll('[data-tooltip]').forEach(el => {
            el.addEventListener('mouseenter', function() {
                const tooltipText = this.getAttribute('data-tooltip');
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip-text';
                tooltip.textContent = tooltipText;
                this.appendChild(tooltip);
            });

            el.addEventListener('mouseleave', function() {
                const tooltip = this.querySelector('.tooltip-text');
                if (tooltip) tooltip.remove();
            });
        });
    }
}

// 9. LAZY LOADING DE IMAGENS
class LazyImageLoader {
    static init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('fade-in');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
}

// 10. PERSISTÊNCIA DE FILTROS
class FilterPersistence {
    static KEY = 'motoparts_filters';

    static save(filters) {
        localStorage.setItem(this.KEY, JSON.stringify(filters));
    }

    static load() {
        const stored = localStorage.getItem(this.KEY);
        return stored ? JSON.parse(stored) : {};
    }

    static clear() {
        localStorage.removeItem(this.KEY);
    }
}

// 11. ANALYTICS SIMPLIFICADO
class SimpleAnalytics {
    static track(action, data = {}) {
        const event = {
            timestamp: new Date().toISOString(),
            action,
            data,
            page: window.location.pathname
        };
        
        console.log('[Analytics]', event);
        // Aqui você poderia enviar para um servidor
    }

    static trackProductView(productId) {
        this.track('product_view', { productId });
    }

    static trackSearch(query) {
        this.track('search', { query });
    }

    static trackAddToFavorites(productId) {
        this.track('add_to_favorites', { productId });
    }
}

// 12. SISTEMA DE FILTROS DINÂMICOS
class DynamicFilters {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.filters = {};
    }

    addFilter(name, values, type = 'checkbox') {
        const section = document.createElement('div');
        section.className = 'filter-section';
        section.innerHTML = `
            <div class="filter-title">
                <i class="fas fa-sliders-h"></i>
                ${name}
            </div>
            <div class="filter-options">
                ${values.map((value, index) => `
                    <div class="filter-option">
                        <input type="${type}" id="filter-${name}-${index}" name="${name}" value="${value}">
                        <label for="filter-${name}-${index}">${value}</label>
                    </div>
                `).join('')}
            </div>
        `;

        this.container.appendChild(section);
        this.attachFilterListeners(name);
    }

    attachFilterListeners(name) {
        const inputs = this.container.querySelectorAll(`input[name="${name}"]`);
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                this.updateFilters();
            });
        });
    }

    updateFilters() {
        const selected = {};
        this.container.querySelectorAll('input:checked').forEach(input => {
            if (!selected[input.name]) selected[input.name] = [];
            selected[input.name].push(input.value);
        });
        
        this.filters = selected;
        FilterPersistence.save(selected);
        
        // Disparar evento customizado
        window.dispatchEvent(new CustomEvent('filtersChanged', { detail: selected }));
    }

    getFilters() {
        return this.filters;
    }

    reset() {
        this.container.querySelectorAll('input').forEach(input => {
            input.checked = false;
        });
        this.filters = {};
        FilterPersistence.clear();
    }
}

// 13. CONTADOR DE RESULTADOS
class ResultsCounter {
    constructor(selector) {
        this.element = document.querySelector(selector);
    }

    update(count, total) {
        if (this.element) {
            this.element.textContent = `Mostrando ${count} de ${total} produtos`;
        }
    }
}

// 14. INICIALIZAÇÃO GLOBAL
function initializeUXImprovements() {
    // Smooth scroll
    SmoothScroll.init();

    // Observar elementos para animações
    EntryAnimations.observeElements();

    // Lazy loading
    LazyImageLoader.init();

    // Tooltips
    Tooltip.init();

    // Validação em tempo real de formulários
    document.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('blur', function() {
            FormValidator.validateField(this);
        });
    });

    // Debounce para busca
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            SimpleAnalytics.trackSearch(e.target.value);
        }, 300));
    }
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeUXImprovements);
} else {
    initializeUXImprovements();
}

// Exportar para uso global
window.NotificationSystem = NotificationSystem;
window.FormValidator = FormValidator;
window.FavoritesSystem = FavoritesSystem;
window.SimpleAnalytics = SimpleAnalytics;
window.DynamicFilters = DynamicFilters;
window.LoadingState = LoadingState;
