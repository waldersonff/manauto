// ========================================
// UX ENHANCEMENTS INTEGRATION
// Integra todas as funcionalidades de UX melhoradas
// ========================================

// Flag para garantir que as funções foram inicializadas
window.UXEnhancementsInitialized = false;

// Função de inicialização consolidada
function initializeUXEnhancements() {
    if (window.UXEnhancementsInitialized) return;
    
    console.log('🎨 Inicializando UX Enhancements...');
    
    // 1. Esperar por DOM e funções globais
    setTimeout(() => {
        // 2. Adicionar toggles de visualização
        enhanceProductCards();
        
        // 3. Setup event listeners para filtros
        setupFilterListeners();
        
        // 4. Configurar suporte a teclado
        setupKeyboardShortcuts();
        
        // 5. Persistência de estado
        loadUserPreferences();
        
        // 6. Melhorias de acessibilidade
        enhanceAccessibility();
        
        console.log('✅ UX Enhancements inicializado com sucesso!');
        window.UXEnhancementsInitialized = true;
    }, 500);
}

// ========== MELHORIAS NOS CARTÕES DE PRODUTOS ==========
function enhanceProductCards() {
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
        // Adicionar classe para identificar quando está em lista
        if (document.querySelector('.products-grid.list-view')) {
            card.classList.add('list-mode');
        }
        
        // Melhorar interatividade
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
}

// ========== LISTENERS PARA FILTROS ==========
function setupFilterListeners() {
    const categoryFilter = document.getElementById('categoryFilter');
    const brandFilter = document.getElementById('brandFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', () => {
            const selected = categoryFilter.options[categoryFilter.selectedIndex].text;
            if (selected !== 'Todas as Categorias') {
                showToast(`Filtrado por: ${selected}`, 'info', 2000);
                updateBreadcrumbs(selected);
            } else {
                clearBreadcrumbs();
            }
        });
    }
    
    if (brandFilter) {
        brandFilter.addEventListener('change', () => {
            const selected = brandFilter.options[brandFilter.selectedIndex].text;
            if (selected !== 'Todas as Marcas') {
                showToast(`Filtrado por marca: ${selected}`, 'info', 2000);
                updateBreadcrumbs(null, selected);
            }
        });
    }
}

// ========== ATALHOS DO TECLADO ==========
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + F: Focar na busca
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
                showToast('Campo de busca ativado', 'info', 1000);
            }
        }
        
        // Ctrl/Cmd + L: Alternar visualização
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            const currentGrid = document.querySelector('.products-grid');
            if (currentGrid) {
                const isListView = currentGrid.classList.contains('list-view');
                toggleViewMode(isListView ? 'grid' : 'list');
            }
        }
        
        // Escape: Fechar modais
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

// ========== PREFERÊNCIAS DO USUÁRIO ==========
function loadUserPreferences() {
    // Carregar modo de visualização
    const savedViewMode = localStorage.getItem('motoparts_viewMode');
    if (savedViewMode && savedViewMode === 'list') {
        setTimeout(() => {
            const listBtn = document.getElementById('listViewBtn');
            if (listBtn) listBtn.click();
        }, 300);
    }
    
    // Carregar filtros salvos
    const savedCategory = localStorage.getItem('motoparts_lastCategory');
    const savedBrand = localStorage.getItem('motoparts_lastBrand');
    
    if (savedCategory) {
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) categoryFilter.value = savedCategory;
    }
    
    if (savedBrand) {
        const brandFilter = document.getElementById('brandFilter');
        if (brandFilter) brandFilter.value = savedBrand;
    }
}

function saveUserPreferences() {
    // Salvar modo de visualização
    localStorage.setItem('motoparts_viewMode', gridViewMode || 'grid');
    
    // Salvar último filtro de categoria
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter && categoryFilter.value !== 'all') {
        localStorage.setItem('motoparts_lastCategory', categoryFilter.value);
    }
    
    // Salvar último filtro de marca
    const brandFilter = document.getElementById('brandFilter');
    if (brandFilter && brandFilter.value !== 'all') {
        localStorage.setItem('motoparts_lastBrand', brandFilter.value);
    }
}

// Salvar preferências quando mudar filtros
window.addEventListener('beforeunload', saveUserPreferences);

// ========== MELHORIAS DE ACESSIBILIDADE ==========
function enhanceAccessibility() {
    // Adicionar labels acessíveis aos botões
    const buttons = document.querySelectorAll('.view-toggle-btn, .zoom-btn, .toast-close');
    
    buttons.forEach(btn => {
        if (!btn.hasAttribute('aria-label')) {
            const text = btn.textContent.trim() || btn.title || 'Botão';
            btn.setAttribute('aria-label', text);
        }
    });
    
    // Melhorar contraste dos textos
    ensureContrastRatio();
}

function ensureContrastRatio() {
    // Verificar e melhorar contraste de elementos críticos
    const elements = document.querySelectorAll('.breadcrumb-list a, .product-code, .product-description');
    
    elements.forEach(el => {
        const computed = window.getComputedStyle(el);
        // Se o texto for muito claro, adicionar classe
        if (computed.color === 'rgb(255, 255, 255)') {
            el.style.fontWeight = '600';
        }
    });
}

// ========== SUPORTE A DARK MODE (Futuro) ==========
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('motoparts_darkMode', 
        document.body.classList.contains('dark-mode') ? 'true' : 'false');
}

// Carregar preferência de dark mode
function loadDarkModePreference() {
    const isDarkMode = localStorage.getItem('motoparts_darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
}

// ========== ANALYTICS DE UX ==========
function trackUXEvent(eventName, eventData = {}) {
    // Preparado para integração com analytics
    // Exemplo: Google Analytics, Mixpanel, etc.
    console.log('📊 UX Event:', {
        event: eventName,
        timestamp: new Date().toISOString(),
        ...eventData
    });
}

// Rastrear eventos importantes
document.addEventListener('DOMContentLoaded', () => {
    // Rastrear visualização de página
    trackUXEvent('page_view', {
        page: 'products_catalog'
    });
    
    // Rastrear interações
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-details')) {
            trackUXEvent('product_detail_clicked', {
                productId: e.target.dataset.productId
            });
        }
    });
});

// ========== NOTIFICAÇÕES DE FEEDBACK ==========
function showProductAddedNotification(productName) {
    showToast(`✅ ${productName} adicionado!`, 'success', 2500);
}

function showFilterNotification(filterName) {
    showToast(`🔍 Filtro aplicado: ${filterName}`, 'info', 2000);
}

function showErrorNotification(errorMessage) {
    showToast(`❌ ${errorMessage}`, 'error', 3000);
}

// ========== MELHORIAS DE PERFORMANCE ==========
// Lazy loading para imagens (se Intersection Observer disponível)
function setupLazyLoading() {
    if (!('IntersectionObserver' in window)) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========== INICIALIZAÇÃO GLOBAL ==========
// Inicializar quando o script for carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeUXEnhancements);
} else {
    initializeUXEnhancements();
}

// Re-inicializar após atualizações dinâmicas
window.addEventListener('UX_PRODUCTS_UPDATED', () => {
    setTimeout(() => {
        enhanceProductCards();
        setupLazyLoading();
    }, 100);
});

// Exportar funções globais
window.enhanceProductCards = enhanceProductCards;
window.toggleDarkMode = toggleDarkMode;
window.loadDarkModePreference = loadDarkModePreference;
window.trackUXEvent = trackUXEvent;
window.showProductAddedNotification = showProductAddedNotification;
window.showFilterNotification = showFilterNotification;
window.showErrorNotification = showErrorNotification;
