// Load products from localStorage or use defaults
function loadProductsData() {
    try {
        const stored = localStorage.getItem('motoparts_products');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
    } catch (e) {
        console.warn('Falha ao ler produtos do localStorage. Usando defaults.', e);
    }
    return defaultProducts;
}

// Produtos padrão (fallback quando não há dados salvos)
const defaultProducts = [
    {
        id: 11,
        name: 'Retrovisor Universal',
        category: 'carroceria',
        brand: 'universal',
        code: 'RU-011',
        description: 'Retrovisor ajustável',
        icon: '🪞'
    },
    {
        id: 12,
        name: 'Carenagem Frontal',
        category: 'carroceria',
        brand: 'suzuki',
        code: 'CF-012',
        description: 'Carenagem aerodinâmica',
        icon: '🎨'
    },
    {
        id: 13,
        name: 'Cabo de Embreagem',
        category: 'transmissao',
        brand: 'honda',
        code: 'CE-013',
        description: 'Cabo de embreagem reforçado',
        icon: '🔗'
    },
    {
        id: 14,
        name: 'Pneu Dianteiro',
        category: 'carroceria',
        brand: 'universal',
        code: 'PD-014',
        description: 'Pneu de alta aderência',
        icon: '⭕'
    },
    {
        id: 15,
        name: 'Kit de Embreagem',
        category: 'transmissao',
        brand: 'yamaha',
        code: 'KE-015',
        description: 'Kit completo de embreagem',
        icon: '⚙️'
    },
    {
        id: 16,
        name: 'Guidão Esportivo',
        category: 'carroceria',
        brand: 'kawasaki',
        code: 'GE-016',
        description: 'Guidão em alumínio',
        icon: '🏍️'
    },
    {
        id: 17,
        name: 'Pistão Completo',
        category: 'motor',
        brand: 'honda',
        code: 'PC-017',
        description: 'Pistão com anéis e pino',
        icon: '🔧'
    },
    {
        id: 18,
        name: 'Cabo de Freio',
        category: 'freios',
        brand: 'universal',
        code: 'CF-018',
        description: 'Cabo de freio em aço',
        icon: '🔗'
    },
    {
        id: 19,
        name: 'Jogo de Manetes',
        category: 'carroceria',
        brand: 'universal',
        code: 'JM-019',
        description: 'Manetes de freio e embreagem',
        icon: '🎮'
    },
    {
        id: 20,
        name: 'Kit de Juntas do Motor',
        category: 'motor',
        brand: 'honda',
        code: 'KJ-020',
        description: 'Kit completo de juntas',
        icon: '📦'
    },
    {
        id: 21,
        name: 'Vela de Ignição Premium',
        category: 'motor',
        brand: 'yamaha',
        code: 'VP-021',
        description: 'Vela de ignição de iridium',
        icon: '⚡'
    },
    {
        id: 22,
        name: 'Amortecedor Traseiro',
        category: 'suspensao',
        brand: 'suzuki',
        code: 'AT-022',
        description: 'Amortecedor a gás',
        icon: '🔩'
    },
    {
        id: 23,
        name: 'Kit de Transmissão',
        category: 'transmissao',
        brand: 'kawasaki',
        code: 'KT-023',
        description: 'Kit com corrente e coroas',
        icon: '⛓️'
    },
    {
        id: 24,
        name: 'Bancada Completa',
        category: 'carroceria',
        brand: 'universal',
        code: 'BC-024',
        description: 'Banco piloto e garupa',
        icon: '💺'
    }
];

// Load products
let products = loadProductsData();

// Global variables
let filteredProducts = [...products];
let selectedProduct = null;
let inlineDetailsImages = [];
let lastLoadedProducts = JSON.stringify(products);

// Update products periodically from localStorage and IndexedDB
setInterval(async () => {
    try {
        let updatedProducts = null;
        
        // Tentar carregar do IndexedDB primeiro
        if (typeof loadAllProductsFromDB === 'function') {
            updatedProducts = await loadAllProductsFromDB();
            if (updatedProducts && updatedProducts.length > 0) {
                const currentString = JSON.stringify(updatedProducts);
                if (currentString !== lastLoadedProducts) {
                    products = updatedProducts;
                    lastLoadedProducts = currentString;
                    filteredProducts = [...products];
                    populateBrandFilter();
                    populateApplicationFilter();
                    filterProductsEnhanced();
                }
                return; // Sucesso com IndexedDB
            }
        }
        
        // Fallback para localStorage
        const updated = localStorage.getItem('motoparts_products');
        if (updated) {
            updatedProducts = JSON.parse(updated);
            const currentString = JSON.stringify(updatedProducts);
            if (currentString !== lastLoadedProducts) {
                products = updatedProducts;
                lastLoadedProducts = currentString;
                filteredProducts = [...products];
                populateBrandFilter();
                populateApplicationFilter();
                filterProductsEnhanced();
            }
        }
    } catch (e) {
        console.error('Erro ao atualizar produtos:', e);
    }
}, 500);

// Initialize IndexedDB on page load
if (typeof initDB === 'function') {
    initDB().then(() => {
        // Carregar produtos do IndexedDB assim que inicializar
        if (typeof loadAllProductsFromDB === 'function') {
            loadAllProductsFromDB().then(dbProducts => {
                if (dbProducts && dbProducts.length > 0) {
                    products = dbProducts;
                    lastLoadedProducts = JSON.stringify(products);
                    filteredProducts = [...products];
                    populateBrandFilter();
                    filterProductsEnhanced();
                    console.log(`✓ Carregados ${products.length} produtos do IndexedDB`);
                }
            }).catch(e => console.error('Erro ao carregar do IndexedDB:', e));
        }
    }).catch(e => console.error('Erro ao inicializar IndexedDB:', e));
}

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const contactModal = document.getElementById('contactModal');
const contactBtn = document.querySelector('.contact-btn');
const closeModalBtn = document.querySelector('.close-modal');
const searchInput = document.getElementById('searchInput');
const searchSuggestions = document.getElementById('searchSuggestions');
const categoryFilter = document.getElementById('categoryFilter');
const brandFilter = document.getElementById('brandFilter');
const applicationFilter = document.getElementById('applicationFilter');
const sortFilter = document.getElementById('sortFilter');
const contactForm = document.getElementById('contactForm');
const productInterestInput = document.getElementById('productInterest');
const contactProductSummary = document.getElementById('contactProductSummary');
const contactProductImage = document.getElementById('contactProductImage');
const contactProductPlaceholder = document.getElementById('contactProductPlaceholder');
const contactProductTitle = document.getElementById('contactProductTitle');
const contactProductMeta = document.getElementById('contactProductMeta');
const contactProductBadges = document.getElementById('contactProductBadges');
const contactSubmitBtn = document.getElementById('contactSubmitBtn');
const ctaRibbon = document.getElementById('ctaRibbon');
const ctaRibbonClose = document.getElementById('ctaRibbonClose');
const ctaRibbonContact = document.getElementById('ctaRibbonContact');

// Initialize
function init() {
    // Garantir que os elementos DOM foram encontrados
    if (!productsGrid) {
        productsGrid = document.getElementById('productsGrid');
    }
    if (!searchInput) {
        window.searchInput = document.getElementById('searchInput');
    }
    if (!categoryFilter) {
        window.categoryFilter = document.getElementById('categoryFilter');
    }
    if (!brandFilter) {
        window.brandFilter = document.getElementById('brandFilter');
    }
    if (!applicationFilter) {
        window.applicationFilter = document.getElementById('applicationFilter');
    }
    if (!sortFilter) {
        window.sortFilter = document.getElementById('sortFilter');
    }
    
    currentPage = 1;
    populateBrandFilter();
    populateApplicationFilter();
    filterProductsEnhanced();
    updateSearchSuggestions();
    setupCtaRibbon();
    
    // Usar renderProductsPaginated se existir, senão usar renderProducts
    if (typeof renderProductsPaginated === 'function') {
        if (typeof updatePagination === 'function') {
            updatePagination();
        }
        renderProductsPaginated();
    } else {
        renderProducts();
    }
    
    setupEventListeners();
}

// Render products
function renderProducts() {
    if (!productsGrid) {
        productsGrid = document.getElementById('productsGrid');
    }
    
    if (!productsGrid) {
        console.error('❌ productsGrid não encontrado!');
        return;
    }
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 3rem; color: #999;">Nenhum produto encontrado.</p>';
        return;
    }

    productsGrid.innerHTML = filteredProducts.map(product => {
        const description = (product.description || '').trim();
        
        // Criar carrossel se houver galeria de imagens
        let imageHTML = '';
        const allImages = collectImages(product);
        
        if (allImages.length > 1) {
            // Criar carrossel
            const carouselId = `carousel-${product.id}`;
            imageHTML = `
                <div class="product-carousel" id="${carouselId}">
                    <div class="product-carousel-inner">
                        ${allImages.map((img, index) => `
                            <div class="product-carousel-item ${index === 0 ? 'active' : ''}">
                                <img src="${img}" alt="${product.name}">
                            </div>
                        `).join('')}
                    </div>
                    <button class="product-carousel-prev" onclick="moveCarousel('${carouselId}', -1)">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="product-carousel-next" onclick="moveCarousel('${carouselId}', 1)">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    <div class="product-carousel-indicators">
                        ${allImages.map((_, index) => `
                            <button class="product-carousel-indicator ${index === 0 ? 'active' : ''}" 
                                    onclick="goToCarouselSlide('${carouselId}', ${index})"></button>
                        `).join('')}
                    </div>
                </div>
            `;
        } else if (product.image) {
            imageHTML = `<img src="${product.image}" alt="${product.name}">`;
        } else {
            imageHTML = product.icon || '📦';
        }

        return `
        <div class="product-card" data-id="${product.id}" onclick="showProductDetails(${product.id})" role="button" tabindex="0" onkeydown="if(event.key==='Enter'){showProductDetails(${product.id})}">
            <div class="product-image">${imageHTML}</div>
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <h4 class="product-name">${product.name}</h4>
                <div class="product-details-compact">
                    <div class="product-code"><i class="fas fa-barcode"></i> ${product.code}</div>
                    <div class="product-brand"><i class="fas fa-trademark"></i> ${product.brand.toUpperCase()}</div>
                    ${(() => { const apps = collectApplications(product); const label = apps[0] || product.application; return label ? `<div class="product-application"><i class="fas fa-motorcycle"></i> ${label}</div>` : ''; })()}
                    ${product.year ? `<div class="product-year"><i class="fas fa-calendar"></i> ${product.year}</div>` : ''}
                </div>
                ${description ? `<p class="product-description">${description}</p>` : ''}
            </div>
        </div>
    `;
    }).join('');

}

// Função para mover o carrossel
function moveCarousel(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    
    const items = carousel.querySelectorAll('.product-carousel-item');
    const indicators = carousel.querySelectorAll('.product-carousel-indicator');
    let currentIndex = Array.from(items).findIndex(item => item.classList.contains('active'));
    
    items[currentIndex].classList.remove('active');
    indicators[currentIndex].classList.remove('active');
    
    currentIndex = (currentIndex + direction + items.length) % items.length;
    
    items[currentIndex].classList.add('active');
    indicators[currentIndex].classList.add('active');
}

// Função para ir para um slide específico
function goToCarouselSlide(carouselId, index) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    
    const items = carousel.querySelectorAll('.product-carousel-item');
    const indicators = carousel.querySelectorAll('.product-carousel-indicator');
    
    items.forEach(item => item.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    items[index].classList.add('active');
    indicators[index].classList.add('active');
}

// Expor funções globalmente
window.moveCarousel = moveCarousel;
window.goToCarouselSlide = goToCarouselSlide;

// Zoom de imagem seguindo a posição do mouse (lupa dinâmica)
function initProductImageZoom(rootEl) {
    const root = rootEl || document;
    const imgs = root.querySelectorAll('.product-image img');
    const ZOOM = 1.8;
    const LENS_SIZE = 140;

    imgs.forEach(img => {
        const container = img.closest('.product-image');
        if (!container) return;
        if (container.__lensBound) return;
        container.__lensBound = true;

        let lens = null;
        const createLens = () => {
            lens = document.createElement('div');
            lens.className = 'zoom-lens';
            lens.style.width = `${LENS_SIZE}px`;
            lens.style.height = `${LENS_SIZE}px`;
            lens.style.backgroundImage = `url('${img.src}')`;
            container.appendChild(lens);
        };

        const onEnter = () => {
            if (!lens) createLens();
            // Calcular tamanho de background conforme tamanho exibido
            const rect = container.getBoundingClientRect();
            lens.style.backgroundSize = `${rect.width * ZOOM}px ${rect.height * ZOOM}px`;
        };

        const onMove = (e) => {
            if (!lens) return;
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Posicionar lente centrada no cursor
            const lensX = x - LENS_SIZE / 2;
            const lensY = y - LENS_SIZE / 2;
            lens.style.left = `${lensX}px`;
            lens.style.top = `${lensY}px`;

            // Ajustar posição do background para simular zoom na área
            const bgX = -(x * ZOOM - LENS_SIZE / 2);
            const bgY = -(y * ZOOM - LENS_SIZE / 2);
            lens.style.backgroundPosition = `${bgX}px ${bgY}px`;
        };

        const onLeave = () => {
            if (lens && lens.parentNode) lens.parentNode.removeChild(lens);
            lens = null;
        };

        container.addEventListener('mouseenter', onEnter);
        container.addEventListener('mousemove', onMove);
        container.addEventListener('mouseleave', onLeave);
        container.addEventListener('touchstart', onLeave, { passive: true });
    });
}

// Expor opcionalmente
window.initProductImageZoom = initProductImageZoom;

// Populate brand filter dynamically from products
function populateBrandFilter() {
    if (!brandFilter) return;
    const current = brandFilter.value;
    const set = new Set();
    (products || []).forEach(p => {
        [p.brand, p.manufacturer, p.supplierBrand, p.vendorBrand].forEach(b => {
            if (typeof b === 'string' && b.trim()) set.add(b.trim());
        });
    });
    const brands = Array.from(set).sort((a, b) => a.localeCompare(b));
    brandFilter.innerHTML = ['<option value="all">Todas as Marcas</option>', ...brands.map(b => `<option value="${b}">${(b || '').toUpperCase()}</option>`)].join('');
    if (current && current !== 'all' && brands.includes(current)) {
        brandFilter.value = current;
    } else {
        brandFilter.value = 'all';
    }
}

// Coleta aplicações combinando campo único e lista
function collectApplications(product) {
    const set = new Set();
    const pushStringList = (raw) => {
        if (typeof raw !== 'string') return;
        raw.split(/[;,/|\n\r]+/).map(s => s.trim()).filter(Boolean).forEach(s => set.add(s));
    };
    if (Array.isArray(product?.applications)) {
        product.applications.forEach(app => {
            if (app && typeof app === 'string') pushStringList(app);
        });
    } else if (typeof product?.applications === 'string') {
        pushStringList(product.applications);
    }
    pushStringList(product?.application);
    if (Array.isArray(product?.compatibleModels)) {
        product.compatibleModels.forEach(app => {
            if (app && typeof app === 'string') pushStringList(app);
        });
    }
    return Array.from(set);
}

// Normaliza imagens do produto (principal + galeria)
function collectImages(product) {
    const imgs = [];
    const pushIf = (val) => { if (val && typeof val === 'string') imgs.push(val.trim()); };
    pushIf(product?.image);
    if (Array.isArray(product?.gallery)) {
        product.gallery.forEach(pushIf);
    } else if (typeof product?.gallery === 'string') {
        product.gallery.split(/[;,\n]+/).map(s => s.trim()).filter(Boolean).forEach(pushIf);
    }
    return imgs.filter(Boolean);
}

// Populate application filter dynamically from products
function populateApplicationFilter() {
    if (!applicationFilter) return;
    const current = applicationFilter.value;
    const set = new Set();
    (products || []).forEach(p => {
        collectApplications(p).forEach(app => set.add(app));
    });
    const applications = Array.from(set).sort((a, b) => a.localeCompare(b));
    applicationFilter.innerHTML = ['<option value="all">Todas as Aplicações</option>', ...applications.map(a => `<option value="${a}">${a}</option>`)].join('');
    if (current && current !== 'all' && applications.includes(current)) {
        applicationFilter.value = current;
    } else {
        applicationFilter.value = 'all';
    }
}

// Get category name
function getCategoryName(category) {
    const categories = {
        'motor': 'Motor',
        'freios': 'Freios',
        'suspensao': 'Suspensão',
        'eletrica': 'Elétrica',
        'transmissao': 'Transmissão',
        'carroceria': 'Carroceria',
        'acessorios': 'Acessórios',
        'cabos': 'Cabos',
        'carburador_injecao': 'Carburador / Injeção',
        'chassis': 'Chassi',
        'ferramentas': 'Ferramentas / Equipamentos',
        'fixacao': 'Fixação',
        'roda': 'Roda'
    };
    return categories[category] || category;
}

// Request product information
function requestInfo(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    selectedProduct = product;
    fillContactProductSummary(product);
    contactModal.classList.add('active');
}

// Open contact modal
function openContactModal() {
    fillContactProductSummary(null);
    contactModal.classList.add('active');
}

// Filter products
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const selectedBrand = brandFilter.value;

    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;
        
        return matchesSearch && matchesCategory && matchesBrand;
    });

    sortProducts();
    renderProducts();
}

// Sort products
function sortProducts() {
    const sortValue = sortFilter.value;

    switch (sortValue) {
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
    }
}

// Render suggestions while typing
function updateSearchSuggestions() {
    if (!searchSuggestions || !searchInput) return;
    const term = searchInput.value.trim().toLowerCase();
    if (!term) {
        hideSearchSuggestions();
        return;
    }

    const matches = products
        .filter(product => {
            const name = (product.name || '').toLowerCase();
            const code = (product.code || '').toLowerCase();
            const brand = (product.brand || '').toLowerCase();
            const desc = (product.description || '').toLowerCase();
            return name.includes(term) || code.includes(term) || brand.includes(term) || desc.includes(term);
        })
        .slice(0, 6);

    if (matches.length === 0) {
        hideSearchSuggestions();
        return;
    }

    searchSuggestions.innerHTML = matches.map(product => {
        const category = getCategoryName(product.category) || 'Categoria';
        return `
            <button class="suggestion-item" data-product-id="${product.id}">
                <div class="suggestion-title">${product.name || 'Produto'}</div>
                <div class="suggestion-meta">
                    <span>${(product.code || 'Código N/D')}</span>
                    <span>${(product.brand || '').toUpperCase() || 'Marca'}</span>
                    <span>${category}</span>
                </div>
            </button>
        `;
    }).join('');

    searchSuggestions.classList.remove('hidden-section');
}

function hideSearchSuggestions() {
    if (!searchSuggestions) return;
    searchSuggestions.classList.add('hidden-section');
    searchSuggestions.innerHTML = '';
}

function handleSuggestionClick(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    if (searchInput) {
        searchInput.value = product.name || '';
    }
    filterProductsEnhanced();
    const catalog = document.getElementById('catalog');
    if (catalog) {
        catalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(() => {
        if (typeof showProductDetails === 'function') {
            showProductDetails(productId);
        }
    }, 200);
    hideSearchSuggestions();
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #2ecc71;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

function setupCtaRibbon() {
    if (!ctaRibbon) return;
    const dismissed = localStorage.getItem('cta_ribbon_dismissed');
    if (dismissed === '1') {
        ctaRibbon.classList.add('hidden-section');
    }

    if (ctaRibbonClose) {
        ctaRibbonClose.addEventListener('click', () => {
            ctaRibbon.classList.add('hidden-section');
            localStorage.setItem('cta_ribbon_dismissed', '1');
        });
    }

    if (ctaRibbonContact) {
        ctaRibbonContact.addEventListener('click', (e) => {
            e.preventDefault();
            openContactModal();
        });
    }
}

// Setup event listeners
function setupEventListeners() {
    // Contact modal
    if (contactBtn) {
        contactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openContactModal();
        });
    }

    // Get all close buttons
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Close contact modal when clicking outside
    [contactModal, document.getElementById('productDetailsModal')].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    });

    // Evitar fechar ao interagir dentro do conteúdo do modal
    document.querySelectorAll('.modal .modal-content').forEach(content => {
        content.addEventListener('click', (e) => e.stopPropagation());
    });

    // Contact form
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!contactForm.checkValidity()) {
            showNotification('Preencha os campos obrigatórios para continuar.');
            return;
        }

        if (contactSubmitBtn) {
            contactSubmitBtn.disabled = true;
            contactSubmitBtn.textContent = 'Enviando...';
        }

        setTimeout(() => {
            showNotification('Sua solicitação foi enviada! Entraremos em contato em breve.');
            contactForm.reset();
            fillContactProductSummary(selectedProduct || null);
            contactModal.classList.remove('active');
            document.body.style.overflow = '';

            if (contactSubmitBtn) {
                contactSubmitBtn.disabled = false;
                contactSubmitBtn.textContent = 'Enviar Solicitação';
            }
        }, 500);
    });

    // Search and filters
    searchInput.addEventListener('input', () => {
        filterProductsEnhanced();
        updateSearchSuggestions();
    });
    searchInput.addEventListener('focus', updateSearchSuggestions);
    categoryFilter.addEventListener('change', filterProductsEnhanced);
    brandFilter.addEventListener('change', filterProductsEnhanced);
    if (applicationFilter) {
        applicationFilter.addEventListener('change', filterProductsEnhanced);
    }
    sortFilter.addEventListener('change', () => {
        sortProductsEnhanced();
        currentPage = 1;
        updatePagination();
        renderProductsPaginated();
        updateCatalogInsights();
    });

    if (searchSuggestions) {
        searchSuggestions.addEventListener('click', (event) => {
            const item = event.target.closest('.suggestion-item');
            if (!item) return;
            const productId = Number(item.dataset.productId);
            handleSuggestionClick(productId);
        });
        document.addEventListener('click', (event) => {
            if (!searchSuggestions.contains(event.target) && event.target !== searchInput) {
                hideSearchSuggestions();
            }
        });
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    mobileMenuToggle.addEventListener('click', () => {
        nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        if (nav.style.display === 'flex') {
            nav.style.position = 'absolute';
            nav.style.top = '100%';
            nav.style.left = '0';
            nav.style.right = '0';
            nav.style.background = 'white';
            nav.style.flexDirection = 'column';
            nav.style.padding = '1rem';
            nav.style.boxShadow = '0 5px 10px rgba(0,0,0,0.1)';
        }
    });

    // Chat widget functionality
    const chatWidgetBtn = document.getElementById('chatWidgetBtn');
    const chatBox = document.getElementById('chatBox');
    const chatCloseBtn = document.getElementById('chatCloseBtn');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatMessages = document.getElementById('chatMessages');
    const chatSuggestions = document.getElementById('chatSuggestions');

    if (chatWidgetBtn && chatBox) {
        chatWidgetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            chatBox.classList.toggle('active');
            if (chatBox.classList.contains('active') && chatInput) {
                setTimeout(() => chatInput.focus(), 100);
            }
        });
    }

    if (chatCloseBtn && chatBox) {
        chatCloseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            chatBox.classList.remove('active');
        });
    }

    // Fechar chat ao clicar fora (não fecha se houver modal aberto)
    document.addEventListener('click', (e) => {
        if (!chatBox) return;
        const isChatOpen = chatBox.classList.contains('active');
        if (!isChatOpen) return;

        // Se um modal estiver ativo, mantém o chat aberto
        const anyModalOpen = document.querySelector('.modal.active');
        if (anyModalOpen) return;

        // Fecha apenas se clicou fora do chat e não no botão do widget
        const clickedOutsideChat = !chatBox.contains(e.target);
        const clickedWidgetBtn = chatWidgetBtn && chatWidgetBtn.contains(e.target);
        if (clickedOutsideChat && !clickedWidgetBtn) {
            chatBox.classList.remove('active');
        }
    });

    // Enviar mensagem
    function sendChatMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        addUserMessage(message);
        chatInput.value = '';

        // Simular digitação do bot
        setTimeout(() => {
            showTypingIndicator();
            setTimeout(() => {
                hideTypingIndicator();
                processChatMessage(message);
            }, 1500);
        }, 500);
    }

    if (chatSendBtn) {
        chatSendBtn.addEventListener('click', sendChatMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }

    // Sugestões rápidas
    if (chatSuggestions) {
        chatSuggestions.addEventListener('click', (e) => {
            const btn = e.target.closest('.suggestion-btn');
            if (!btn) return;
            const message = btn.dataset.message;
            chatInput.value = message;
            sendChatMessage();
        });
    }

    function addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message user';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <p>${escapeHtml(text)}</p>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addBotMessage(html) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message bot';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                ${html}
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'chat-message bot typing-indicator-wrapper';
        indicator.id = 'typingIndicator';
        indicator.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // IA Simples e Profissional
    function processChatMessage(message) {
        const msg = message.toLowerCase().trim();
        if (!msg) return;

        // Detecta marca/categoria específica mencionada
        const brandSpecific = detectBrandFromMessage(msg);
        if (brandSpecific) {
            showFilteredResults('brand', brandSpecific, 1);
            return;
        }

        const categorySpecific = detectCategoryFromMessage(msg);
        if (categorySpecific) {
            showFilteredResults('category', categorySpecific, 1);
            return;
        }

        // Solicitação explícita para listar peças/produtos
        if (isListProductsRequest(msg)) {
            // Termo vazio lista todos, paginado
            showProductResultsPaginated('', 1);
            return;
        }

        // 1️⃣ Tenta buscar por nome, código ou marca de produto (com paginação)
        const foundProducts = findProducts(msg);
        if (foundProducts.length > 0) {
            showProductResultsPaginated(msg, 1);
            return;
        }

        // 2️⃣ Verifica intenções do usuário
        if (isContactRequest(msg)) {
            showContactMenu();
            return;
        }

        if (isCategoryRequest(msg)) {
            showCategories();
            return;
        }

        if (isBrandRequest(msg)) {
            showBrands();
            return;
        }

        if (isGreeting(msg)) {
            showMainMenu();
            return;
        }

        if (isHelpRequest(msg)) {
            showHelp();
            return;
        }

        // 3️⃣ Se nenhuma das anteriores, mostra uma resposta curta de não encontrado
        showNotFound(message);
    }

    // Normaliza texto (remove acentos e baixa caixa) para busca aproximada
    function normalizeText(str) {
        return (str || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    function getKnownBrands() {
        return [...new Set(products.map(p => p.brand).filter(Boolean))].map(normalizeText);
    }

    function getKnownCategories() {
        return [...new Set(products.map(p => p.category).filter(Boolean))].map(normalizeText);
    }

    function detectBrandFromMessage(msg) {
        const n = normalizeText(msg);
        const brands = getKnownBrands();
        return brands.find(b => n.includes(b)) || null;
    }

    function detectCategoryFromMessage(msg) {
        const n = normalizeText(msg);
        const cats = getKnownCategories();
        return cats.find(c => n.includes(c)) || null;
    }

    // Busca com ranking por relevância (sem limitar, lista completa)
    function findProducts(searchTerm) {
        const term = normalizeText(searchTerm);
        const words = term.split(/\s+/).filter(w => w.length > 1);
        const matched = products.filter(p => {
            const name = normalizeText(p.name);
            const code = normalizeText(p.code || '');
            const brand = normalizeText(p.brand || '');
            const category = normalizeText(p.category || '');

            const directMatch = (
                name.includes(term) ||
                code.includes(term) ||
                brand.includes(term) ||
                category.includes(term)
            );
            const wordMatch = words.length && words.some(w =>
                name.includes(w) || code.includes(w) || brand.includes(w) || category.includes(w)
            );
            return directMatch || wordMatch || similarity(name, term) >= 0.6;
        });
        return matched
            .map(p => ({ p, score: scoreProduct(p, term) }))
            .sort((a, b) => b.score - a.score)
            .map(x => x.p);
    }

    // Pontuação simples de relevância
    function scoreProduct(product, term) {
        const name = normalizeText(product.name);
        const code = normalizeText(product.code || '');
        const brand = normalizeText(product.brand || '');
        const category = normalizeText(product.category || '');
        let s = 0;
        if (code === term) s += 100;
        if (name.startsWith(term)) s += 60;
        if (name.includes(term)) s += 40;
        if (brand.includes(term)) s += 25;
        if (category.includes(term)) s += 20;
        s += Math.floor(similarity(name, term) * 20);
        return s;
    }

    // Similaridade baseada em Jaccard de n-grams simples
    function similarity(a, b) {
        a = normalizeText(a || '');
        b = normalizeText(b || '');
        if (!a || !b) return 0;
        const grams = (str) => {
            const res = new Set();
            for (let i = 0; i < str.length - 1; i++) {
                res.add(str.slice(i, i + 2));
            }
            return res;
        };
        const A = grams(a), B = grams(b);
        let inter = 0;
        A.forEach(g => { if (B.has(g)) inter++; });
        const union = A.size + B.size - inter;
        return union ? inter / union : 0;
    }

    // Exibição paginada de resultados com "Ver mais"
    function showProductResultsPaginated(term, page = 1) {
        const results = findProducts(term);
        const pageSize = 5;
        const start = (page - 1) * pageSize;
        const slice = results.slice(start, start + pageSize);

        // Guardar estado para carregar mais
        window.__lastSearch = { mode: 'all', term, results, page, pageSize };

        const total = results.length;
        const header = page > 1
            ? `<div style="background: #ecfeff; padding: 0.75rem; border-left: 4px solid #06b6d4; border-radius: 8px; margin-bottom: 0.75rem;"><p style="margin:0; color:#0e7490; font-weight:600;">⬇️ Mais resultados (${start + slice.length}/${total})</p></div>`
            : `<div style="background: linear-gradient(135deg, #f0fdf4, #dbeafe); padding: 1rem; border-radius: 8px; border-left: 4px solid #22c55e; margin-bottom: 1rem;"><p style="margin:0; font-weight:600; color:#15803d; font-size:0.95rem;">✅ Encontrei ${total} produto${total !== 1 ? 's' : ''}</p><p style="margin:0.25rem 0 0 0; font-size:0.8rem; color:#6b7280;">Dica: digite parte do nome (ex: "pistao", "freio", "corrente")</p></div>`;

        let html = header;
        slice.forEach((product, idx) => {
            const idxLabel = start + idx + 1;
            html += `
                <div class="product-card-chat" onclick="openProductModal('${product.code || product.id}')" style="cursor: pointer; transition: transform 0.2s ease;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                        <div style="flex: 1;">
                            <h4 style="margin: 0 0 0.5rem 0; color: #1f2937; font-size: 0.95rem;">${product.name}</h4>
                            <div style="display: flex; gap: 1rem; font-size: 0.85rem; color: #6b7280; flex-wrap: wrap;">
                                ${product.code ? `<span><strong>Código:</strong> ${product.code}</span>` : ''}
                                ${product.brand ? `<span><strong>Marca:</strong> ${product.brand}</span>` : ''}
                            </div>
                        </div>
                        <span style="background: #22c55e; color: white; padding: 0.35rem 0.65rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; white-space: nowrap; margin-left: 0.5rem;">
                            ${idxLabel}/${total}
                        </span>
                    </div>
                    ${product.category ? `<p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #6b7280;"><strong>📦 Categoria:</strong> ${product.category}</p>` : ''}
                    <p style="margin: 0.75rem 0 0 0; padding-top: 0.75rem; border-top: 1px solid #e5e7eb; font-size: 0.85rem; color: #16a34a; font-weight: 600;">
                        → Clique para ver no catálogo
                    </p>
                </div>
            `;
        });

        // Botão "Ver mais" se houver mais
        if (start + slice.length < total) {
            html += `
                <div style="display:flex; justify-content:center; margin-top:0.5rem;">
                    <button onclick="loadMoreResults()" style="background: #111827; color: white; border: none; padding: 0.6rem 0.9rem; border-radius: 6px; font-weight: 600; cursor: pointer;">Ver mais resultados</button>
                </div>
            `;
        }

        addBotMessage(html);
    }

    // Carregar próxima página de resultados
    window.loadMoreResults = function() {
        const st = window.__lastSearch;
        if (!st) return;
        const nextPage = st.page + 1;
        window.__lastSearch.page = nextPage;
        if (st.mode === 'brand' || st.mode === 'category') {
            showFilteredResults(st.mode, st.value, nextPage);
        } else {
            showProductResultsPaginated(st.term, nextPage);
        }
    };

    // Exibição paginada filtrando por marca/categoria
    function showFilteredResults(type, value, page = 1) {
        const nValue = normalizeText(value);
        const results = products.filter(p => {
            if (type === 'brand') return normalizeText(p.brand || '') === nValue;
            if (type === 'category') return normalizeText(p.category || '') === nValue;
            return false;
        });

        const pageSize = 5;
        const start = (page - 1) * pageSize;
        const slice = results.slice(start, start + pageSize);

        window.__lastSearch = { mode: type, value: nValue, results, page, pageSize };

        const total = results.length;
        const label = type === 'brand' ? 'Marca' : 'Categoria';
        const header = page > 1
            ? `<div style="background: #ecfeff; padding: 0.75rem; border-left: 4px solid #06b6d4; border-radius: 8px; margin-bottom: 0.75rem;"><p style="margin:0; color:#0e7490; font-weight:600;">⬇️ Mais resultados (${start + slice.length}/${total})</p></div>`
            : `<div style="background: linear-gradient(135deg, #f0fdf4, #dbeafe); padding: 1rem; border-radius: 8px; border-left: 4px solid #22c55e; margin-bottom: 1rem;"><p style="margin:0; font-weight:600; color:#15803d; font-size:0.95rem;">✅ ${label}: ${value.toUpperCase()} — ${total} produto${total !== 1 ? 's' : ''}</p></div>`;

        let html = header;
        slice.forEach((product, idx) => {
            const idxLabel = start + idx + 1;
            html += `
                <div class="product-card-chat" onclick="openProductModal('${product.code || product.id}')" style="cursor: pointer; transition: transform 0.2s ease;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                        <div style="flex: 1;">
                            <h4 style="margin: 0 0 0.5rem 0; color: #1f2937; font-size: 0.9rem;">${product.name}</h4>
                            <div style="display: flex; gap: 0.75rem; font-size: 0.8rem; color: #6b7280; flex-wrap: wrap;">
                                ${product.code ? `<span><strong>Código:</strong> ${product.code}</span>` : ''}
                                ${product.brand ? `<span><strong>Marca:</strong> ${product.brand}</span>` : ''}
                            </div>
                        </div>
                        <span style="background: #22c55e; color: white; padding: 0.3rem 0.6rem; border-radius: 12px; font-size: 0.7rem; font-weight: 600; white-space: nowrap; margin-left: 0.5rem;">
                            ${idxLabel}/${total}
                        </span>
                    </div>
                    ${product.category ? `<p style="margin: 0.4rem 0 0 0; font-size: 0.8rem; color: #6b7280;"><strong>📦 Categoria:</strong> ${product.category}</p>` : ''}
                    <p style="margin: 0.6rem 0 0 0; padding-top: 0.6rem; border-top: 1px solid #e5e7eb; font-size: 0.8rem; color: #16a34a; font-weight: 600;">
                        → Clique para ver no catálogo
                    </p>
                </div>
            `;
        });

        if (start + slice.length < total) {
            html += `
                <div style="display:flex; justify-content:center; margin-top:0.5rem;">
                    <button onclick="loadMoreResults()" style="background: #111827; color: white; border: none; padding: 0.6rem 0.9rem; border-radius: 6px; font-weight: 600; cursor: pointer;">Ver mais resultados</button>
                </div>
            `;
        }

        addBotMessage(html);
    }

    // Fallback profissional quando não encontra nada
    function showNotFound(term) {
        const suggestions = getSuggestions(term);
        let html = `
            <div style="background: #fef2f2; padding: 0.9rem; border-left: 4px solid #ef4444; border-radius: 8px; margin-bottom: 0.5rem;">
                <p style="margin:0; color:#7f1d1d; font-weight:600;">Não encontrei resultados para "${term}".</p>
                <p style="margin:0.25rem 0 0 0; color:#6b7280; font-size:0.85rem;">Tente digitar parte do nome (ex.: "pistao", "freio") ou código.</p>
            </div>
        `;
        if (suggestions.length) {
            html += `
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap:0.4rem;">
                    ${suggestions.map(s => `<button onclick="sendMessage('${s}')" style="background:white; border:1px solid #e5e7eb; color:#111827; padding:0.5rem; border-radius:6px; cursor:pointer; font-weight:600; font-size:0.8rem;">${s}</button>`).join('')}
                </div>
            `;
        }
        addBotMessage(html);
    }

    function getSuggestions(term) {
        const t = normalizeText(term);
        const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
        const cats = [...new Set(products.map(p => p.category).filter(Boolean))];
        const names = products.map(p => p.name);
        const pool = [...brands, ...cats, ...names];
        const ranked = pool
            .map(x => ({ x, sim: similarity(x, t) }))
            .filter(r => r.sim >= 0.4)
            .sort((a, b) => b.sim - a.sim)
            .slice(0, 6)
            .map(r => r.x);
        return ranked;
    }

    // Detectores de intenção
    function isContactRequest(msg) {
        return /vendedor|comprar|orçamento|pedido|whatsapp|ligar|falar|contato|atender/i.test(msg);
    }

    function isCategoryRequest(msg) {
        return /categoria|categorias|tipo|tipos|o que tem|qual tipo/i.test(msg);
    }

    function isBrandRequest(msg) {
        return /marca|marcas|qual marca|fabricante/i.test(msg);
    }

    function isGreeting(msg) {
        return /^(olá|oi|ola|bom dia|boa tarde|boa noite|hey|tudo bem|opa)$/.test(msg);
    }

    function isHelpRequest(msg) {
        return /ajuda|help|como usar|como funciona|dúvida|tutorial|guia/i.test(msg);
    }

    // Solicitação para listar peças/produtos sem termo específico
    function isListProductsRequest(msg) {
        return /ver\s*(peças|pecas)|listar\s*(peças|pecas)|ver\s*produtos|lista\s*de\s*(peças|pecas)|ver\s*todas\s*as\s*(peças|pecas)|ver\s*cat[áa]logo/i.test(msg);
    }

    // EXIBIÇÃO - Resultados de Produtos
    function showProductResults(productsList) {
        const count = productsList.length;
        let html = `
            <div style="background: linear-gradient(135deg, #f0fdf4, #dbeafe); padding: 1rem; border-radius: 8px; border-left: 4px solid #22c55e; margin-bottom: 1rem;">
                <p style="margin: 0; font-weight: 600; color: #15803d; font-size: 0.95rem;">
                    ✅ Encontrei ${count} produto${count !== 1 ? 's' : ''}
                </p>
            </div>
        `;

        productsList.forEach((product, idx) => {
            html += `
                <div class="product-card-chat" onclick="openProductModal('${product.code || product.id}')" style="cursor: pointer; transition: transform 0.2s ease;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                        <div style="flex: 1;">
                            <h4 style="margin: 0 0 0.5rem 0; color: #1f2937; font-size: 0.95rem;">${product.name}</h4>
                            <div style="display: flex; gap: 1rem; font-size: 0.85rem; color: #6b7280; flex-wrap: wrap;">
                                ${product.code ? `<span><strong>Código:</strong> ${product.code}</span>` : ''}
                                ${product.brand ? `<span><strong>Marca:</strong> ${product.brand}</span>` : ''}
                            </div>
                        </div>
                        <span style="background: #22c55e; color: white; padding: 0.35rem 0.65rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; white-space: nowrap; margin-left: 0.5rem;">
                            ${idx + 1}/${count}
                        </span>
                    </div>
                    ${product.category ? `<p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #6b7280;"><strong>📦 Categoria:</strong> ${product.category}</p>` : ''}
                    <p style="margin: 0.75rem 0 0 0; padding-top: 0.75rem; border-top: 1px solid #e5e7eb; font-size: 0.85rem; color: #16a34a; font-weight: 600;">
                        → Clique para ver todos os detalhes
                    </p>
                </div>
            `;
        });

        addBotMessage(html);
    }

    // EXIBIÇÃO - Menu de Contato
    function showContactMenu() {
        const html = `
            <div style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; color: white;">
                <h4 style="margin: 0 0 0.5rem 0; font-size: 1rem;">📞 Fale com Nosso Especialista</h4>
                <p style="margin: 0; font-size: 0.9rem; opacity: 0.95;">Resposta rápida e atendimento personalizado</p>
            </div>
            <div style="display: grid; gap: 0.75rem;">
                <a href="https://wa.me/5592993129970?text=Olá!%20Gostaria%20de%20um%20orçamento%20para%20peças%20de%20moto." 
                   target="_blank" 
                   style="display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem 1rem; background: linear-gradient(135deg, #22c55e, #16a34a); border: none; border-radius: 6px; color: white; text-decoration: none; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">
                    <i class="fab fa-whatsapp" style="font-size: 1.3rem;"></i>
                    <div style="text-align: left;">
                        <div>WhatsApp</div>
                        <div style="font-size: 0.8rem; font-weight: 400; opacity: 0.9;">(92) 99312-9970</div>
                    </div>
                </a>
                <a href="tel:5592993129970" 
                   style="display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem 1rem; background: white; border: 2px solid #22c55e; border-radius: 6px; color: #15803d; text-decoration: none; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">
                    <i class="fas fa-phone" style="font-size: 1.3rem;"></i>
                    <div style="text-align: left;">
                        <div>Ligar Agora</div>
                        <div style="font-size: 0.8rem; font-weight: 400; opacity: 0.8;">(92) 99312-9970</div>
                    </div>
                </a>
            </div>
            <p style="margin: 1rem 0 0 0; padding: 0.75rem; background: #fef3c7; border-radius: 6px; font-size: 0.8rem; color: #92400e; border-left: 3px solid #f59e0b;">
                <strong>Atendimento:</strong> Segunda a Sexta, 8h às 18h
            </p>
        `;
        addBotMessage(html);
    }

    // EXIBIÇÃO - Lista de Categorias
    function showCategories() {
        const categories = [...new Set(products.map(p => p.category).filter(Boolean))].sort();
        
        let html = `
            <div style="background: linear-gradient(135deg, #f0fdf4, #dbeafe); padding: 1rem; border-radius: 8px; border-left: 4px solid #22c55e; margin-bottom: 1rem;">
                <p style="margin: 0; font-weight: 600; color: #15803d; font-size: 0.95rem;">
                    📂 Categorias de Peças (${categories.length})
                </p>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.5rem;">
        `;

        categories.forEach(cat => {
            const count = products.filter(p => p.category === cat).length;
            html += `
                <button onclick="sendMessage('${cat}')" style="
                    background: white;
                    border: 2px solid #22c55e;
                    color: #15803d;
                    padding: 0.65rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.85rem;
                    transition: all 0.2s ease;
                ">
                    ${cat}
                    <br><span style="font-size: 0.75rem; opacity: 0.8;">${count} item${count > 1 ? 's' : ''}</span>
                </button>
            `;
        });

        html += `</div>`;
        addBotMessage(html);
    }

    // EXIBIÇÃO - Lista de Marcas
    function showBrands() {
        const brands = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();
        
        let html = `
            <div style="background: linear-gradient(135deg, #f0fdf4, #dbeafe); padding: 1rem; border-radius: 8px; border-left: 4px solid #22c55e; margin-bottom: 1rem;">
                <p style="margin: 0; font-weight: 600; color: #15803d; font-size: 0.95rem;">
                    🏷️ Marcas Disponíveis (${brands.length})
                </p>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 0.5rem;">
        `;

        brands.forEach(brand => {
            const count = products.filter(p => p.brand === brand).length;
            html += `
                <button onclick="sendMessage('${brand}')" style="
                    background: white;
                    border: 2px solid #22c55e;
                    color: #15803d;
                    padding: 0.65rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.85rem;
                    transition: all 0.2s ease;
                ">
                    ${brand}
                    <br><span style="font-size: 0.75rem; opacity: 0.8;">(${count})</span>
                </button>
            `;
        });

        html += `</div>`;
        addBotMessage(html);
    }

    // EXIBIÇÃO - Menu Principal
    function showMainMenu() {
        const html = `
            <div style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; color: white;">
                <h4 style="margin: 0 0 0.5rem 0; font-size: 1rem;">👋 Bem-vindo à Manaus Automotive</h4>
                <p style="margin: 0; font-size: 0.9rem; opacity: 0.95;">Especialistas em peças para motos há 19 anos</p>
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;">
                <button onclick="sendMessage('Ver categorias')" style="
                    background: white;
                    border: 2px solid #22c55e;
                    color: #15803d;
                    padding: 0.8rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.85rem;
                    transition: all 0.2s ease;
                ">📂 Categorias</button>
                <button onclick="sendMessage('Ver marcas')" style="
                    background: white;
                    border: 2px solid #22c55e;
                    color: #15803d;
                    padding: 0.8rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.85rem;
                    transition: all 0.2s ease;
                ">🏷️ Marcas</button>
                <button onclick="sendMessage('Falar com vendedor')" style="
                    background: linear-gradient(135deg, #22c55e, #16a34a);
                    border: none;
                    color: white;
                    padding: 0.8rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.85rem;
                    transition: all 0.2s ease;
                ">📞 Vendedor</button>
                <button onclick="sendMessage('Ajuda')" style="
                    background: white;
                    border: 2px solid #22c55e;
                    color: #15803d;
                    padding: 0.8rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.85rem;
                    transition: all 0.2s ease;
                ">❓ Ajuda</button>
            </div>
            <p style="margin: 1rem 0 0 0; padding: 0.75rem; background: #dbeafe; border-radius: 6px; font-size: 0.85rem; color: #0c4a6e; text-align: center;">
                Digite o nome de uma peça ou clique em uma opção acima
            </p>
        `;
        addBotMessage(html);
    }

    // EXIBIÇÃO - Ajuda
    function showHelp() {
        const html = `
            <div style="background: linear-gradient(135deg, #f0fdf4, #dbeafe); padding: 1rem; border-radius: 8px; border-left: 4px solid #22c55e; margin-bottom: 1rem;">
                <p style="margin: 0; font-weight: 600; color: #15803d; font-size: 0.95rem;">
                    ❓ Como Usar o Chat
                </p>
            </div>
            <div style="display: grid; gap: 0.5rem;">
                <div style="padding: 0.75rem; background: #f3f4f6; border-left: 3px solid #22c55e; border-radius: 4px;">
                    <p style="margin: 0 0 0.25rem 0; font-weight: 600; color: #15803d; font-size: 0.9rem;">🔍 Buscar Peça</p>
                    <p style="margin: 0; font-size: 0.8rem; color: #6b7280;">Digite o nome: "pistão", "freio", "corrente"</p>
                </div>
                <div style="padding: 0.75rem; background: #f3f4f6; border-left: 3px solid #22c55e; border-radius: 4px;">
                    <p style="margin: 0 0 0.25rem 0; font-weight: 600; color: #15803d; font-size: 0.9rem;">🔢 Buscar por Código</p>
                    <p style="margin: 0; font-size: 0.8rem; color: #6b7280;">Digite o código exato do produto</p>
                </div>
                <div style="padding: 0.75rem; background: #f3f4f6; border-left: 3px solid #22c55e; border-radius: 4px;">
                    <p style="margin: 0 0 0.25rem 0; font-weight: 600; color: #15803d; font-size: 0.9rem;">📂 Explorar Categorias</p>
                    <p style="margin: 0; font-size: 0.8rem; color: #6b7280;">Clique em "Categorias" para ver todas</p>
                </div>
                <div style="padding: 0.75rem; background: #f3f4f6; border-left: 3px solid #22c55e; border-radius: 4px;">
                    <p style="margin: 0 0 0.25rem 0; font-weight: 600; color: #15803d; font-size: 0.9rem;">📞 Falar com Vendedor</p>
                    <p style="margin: 0; font-size: 0.8rem; color: #6b7280;">Conecte via WhatsApp ou ligação</p>
                </div>
            </div>
        `;
        addBotMessage(html);
    }

    // Menu rápido que aparece em todas as respostas
    function showQuickMenu() {
        setTimeout(() => {
            const html = `
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.4rem; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #e5e7eb;">
                    <button onclick="sendMessage('Ver categorias')" style="background: white; border: 1px solid #22c55e; color: #15803d; padding: 0.5rem; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 0.75rem;">📂 Categorias</button>
                    <button onclick="sendMessage('Ver marcas')" style="background: white; border: 1px solid #22c55e; color: #15803d; padding: 0.5rem; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 0.75rem;">🏷️ Marcas</button>
                    <button onclick="sendMessage('Falar com vendedor')" style="background: #22c55e; border: none; color: white; padding: 0.5rem; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 0.75rem;">📞 Vendedor</button>
                    <button onclick="sendMessage('Ajuda')" style="background: white; border: 1px solid #22c55e; color: #15803d; padding: 0.5rem; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 0.75rem;">❓ Ajuda</button>
                </div>
            `;
            addBotMessage(html);
        }, 1000);
    }

    // Função global para abrir modal de produto do chat
    window.openProductModal = function(codeOrId) {
        const product = products.find(p => {
            return (p.code && p.code.toString() === codeOrId.toString()) || 
                   (p.id && p.id.toString() === codeOrId.toString());
        });
        if (!product) return;
        // Em vez de abrir modal, leva ao catálogo e destaca o produto
        focusProductInCatalog(product);
        // Pergunta se deseja falar com vendedor
        showVendorChoicePrompt(product);
    };

    function focusProductInCatalog(product) {
        // Ir para a seção de catálogo
        location.hash = 'catalog';
        // Garantir que o grid está renderizado
        const ensureRender = () => {
            if (typeof renderProductsPaginated === 'function') {
                try { renderProductsPaginated(); } catch (e) {}
            } else if (typeof renderProducts === 'function') {
                try { renderProducts(); } catch (e) {}
            }
        };
        ensureRender();
        setTimeout(() => {
            const grid = document.getElementById('productsGrid');
            if (!grid) return;
            // Encontrar o card pelo data-id
            const card = grid.querySelector(`.product-card[data-id="${product.id}"]`);
            if (card) {
                // Scroll suave ao produto
                try { card.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch(e) {}
                // Aplicar destaque temporário
                card.classList.add('catalog-highlight');
                setTimeout(() => card.classList.remove('catalog-highlight'), 2500);
            } else {
                // Se não encontrar, adicionar um card focado no topo
                const focused = document.createElement('div');
                focused.className = 'product-card catalog-highlight';
                focused.setAttribute('data-id', product.id);
                focused.innerHTML = `
                    <div class="product-image">
                        <div class="image-wrapper">
                            <img src="${(window.currentProductImages && window.currentProductImages[0]) || ''}" alt="${product.name}" loading="lazy" />
                        </div>
                    </div>
                    <div class="product-info">
                        <h4>${product.name}</h4>
                        ${product.code ? `<p class="muted">Código: ${product.code}</p>` : ''}
                        ${product.brand ? `<p class="muted">Marca: ${product.brand}</p>` : ''}
                    </div>
                `;
                grid.insertAdjacentElement('afterbegin', focused);
                try { focused.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch(e) {}
                setTimeout(() => focused.classList.remove('catalog-highlight'), 2500);
            }
        }, 150);
    }

    // Pergunta simples pós-seleção de produto
    function showVendorChoicePrompt(product) {
        const html = `
            <div style="background: #f0fdf4; padding: 1rem; border-left: 4px solid #22c55e; border-radius: 8px; margin-bottom: 0.75rem;">
                <p style="margin: 0; color: #15803d; font-weight: 600;">
                    Deseja falar com um vendedor sobre <strong>${product.name}</strong>?
                </p>
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <button onclick="confirmContactVendor('${product.id}')" style="background: #22c55e; color: white; border: none; padding: 0.6rem 0.9rem; border-radius: 6px; font-weight: 600; cursor: pointer;">Sim</button>
                <button onclick="declineContactVendor()" style="background: white; color: #15803d; border: 2px solid #22c55e; padding: 0.6rem 0.9rem; border-radius: 6px; font-weight: 600; cursor: pointer;">Não</button>
            </div>
        `;
        addBotMessage(html);
    }

    // Se o cliente optar por falar com vendedor, mostrar 4 opções
    window.confirmContactVendor = function(productId) {
        const product = products.find(p => p.id == productId);
        if (!product) return;
        showSellerOptions(product);
    };

    window.declineContactVendor = function() {
        addBotMessage(`<div style="background:#f3f4f6; padding:0.75rem; border-radius:6px; color:#374151;">Tudo bem! Se precisar de mais alguma informação, é só me dizer.</div>`);
    };

    function showSellerOptions(product) {
        const sellers = [
            { name: 'Carlos', wa: '5592993129970', tel: '5592993129970' },
            { name: 'Fernanda', wa: '5592993129970', tel: '5592993129970' },
            { name: 'Marcos', wa: '5592993129970', tel: '5592993129970' },
            { name: 'Julia', wa: '5592993129970', tel: '5592993129970' }
        ];

        const html = `
            <div style="background: linear-gradient(135deg, #f0fdf4, #dbeafe); padding: 1rem; border-radius: 8px; border-left: 4px solid #22c55e; margin-bottom: 0.75rem;">
                <p style="margin: 0; color: #15803d; font-weight: 600;">Escolha um vendedor para falar sobre <strong>${product.name}</strong>:</p>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.6rem;">
                ${sellers.map(s => `
                    <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 0.75rem; display: grid; gap: 0.5rem;">
                        <div style="font-weight: 700; color: #111827;">${s.name}</div>
                        <a href="https://wa.me/${s.wa}?text=${encodeURIComponent(`Olá ${s.name}! Quero falar sobre '${product.name}' (${product.code || 'sem código'})`) }" target="_blank" style="display:flex; align-items:center; gap:0.5rem; background: linear-gradient(135deg, #22c55e, #16a34a); color:white; padding:0.55rem 0.7rem; border-radius:6px; text-decoration:none; font-weight:600;">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </a>
                        <a href="tel:${s.tel}" style="display:flex; align-items:center; gap:0.5rem; background:white; color:#15803d; border:2px solid #22c55e; padding:0.55rem 0.7rem; border-radius:6px; text-decoration:none; font-weight:600;">
                            <i class="fas fa-phone"></i> Ligar
                        </a>
                    </div>
                `).join('')}
            </div>
        `;
        addBotMessage(html);
    }

    // Função global para enviar mensagem do chat
    window.sendMessage = function(text) {
        chatInput.value = text;
        sendChatMessage();
    };
}



// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;

// Preenche/limpa o resumo do produto no modal de contato
function fillContactProductSummary(product) {
    if (!contactProductSummary) return;

    if (!product) {
        contactProductSummary.classList.add('hidden-section');
        if (productInterestInput) {
            productInterestInput.value = 'Interesse geral em produtos';
        }
        return;
    }

    contactProductSummary.classList.remove('hidden-section');

    if (productInterestInput) {
        productInterestInput.value = `${product.name} (Código: ${product.code || 'N/D'})`;
    }

    if (contactProductTitle) {
        contactProductTitle.textContent = product.name || 'Produto selecionado';
    }

    if (contactProductMeta) {
        const parts = [];
        if (product.code) parts.push(`Código ${product.code}`);
        if (product.application) parts.push(product.application);
        if (product.year) parts.push(product.year);
        contactProductMeta.textContent = parts.join(' • ');
    }

    if (contactProductBadges) {
        const badges = [];
        if (product.category) badges.push(`<span class="badge">${getCategoryName(product.category)}</span>`);
        if (product.brand) badges.push(`<span class="badge badge-alt">${product.brand.toUpperCase()}</span>`);
        contactProductBadges.innerHTML = badges.join('');
    }

    const imageSrc = (product.image || (product.gallery && product.gallery[0])) || '';
    if (imageSrc && contactProductImage) {
        contactProductImage.src = imageSrc;
        contactProductImage.classList.remove('hidden-section');
        if (contactProductPlaceholder) {
            contactProductPlaceholder.classList.add('hidden-section');
        }
    } else {
        if (contactProductImage) {
            contactProductImage.src = '';
            contactProductImage.classList.add('hidden-section');
        }
        if (contactProductPlaceholder) {
            contactProductPlaceholder.classList.remove('hidden-section');
        }
    }
}

// Atualiza o breadcrumb quando os detalhes do produto são abertos
function updateBreadcrumbs(categoryLabel, brandLabel) {
    const breadcrumbSection = document.getElementById('breadcrumbsSection');
    const breadcrumbContent = document.getElementById('breadcrumbContent');
    if (!breadcrumbSection || !breadcrumbContent) return;

    const parts = [];
    if (categoryLabel) parts.push(`<span>Categoria: ${categoryLabel}</span>`);
    if (brandLabel) parts.push(`<span>Marca: ${brandLabel}</span>`);

    breadcrumbContent.innerHTML = parts.join('<li>');
    breadcrumbSection.classList.toggle('hidden-section', parts.length === 0);
}

// Show product details in modern modal
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Produto não encontrado:', productId);
        return;
    }

    selectedProduct = product;

    const modal = document.getElementById('productDetailsModal');
    const modalBody = document.getElementById('detailsModalBody');
    if (!modal || !modalBody) return;

    const brandLabel = product.brand ? product.brand.toUpperCase() : '';

    // Update breadcrumbs
    updateBreadcrumbs(getCategoryName(product.category), brandLabel);

    // Coletar todas as imagens
    const allImages = collectImages(product);
    inlineDetailsImages = allImages;
    window.currentProductImages = allImages;
    window.currentMainImageIndex = 0;

    // Imagem principal
    const mainImage = allImages.length
        ? `<img id="modalMainImage" src="${allImages[0]}" alt="${product.name}" onclick="openMainImageLightbox(event)" loading="eager" decoding="async" fetchpriority="high">`
        : `<div class="spotlight-placeholder"><i class="fas fa-image"></i></div>`;

    // Miniaturas (só mostrar se houver mais de uma imagem)
    const thumbs = allImages.length > 1
        ? `<div class="spotlight-thumbs">${allImages.map((img, index) => `
                <button class="spotlight-thumb ${index === 0 ? 'active' : ''}" onclick="setModalMainImage(${index})" aria-label="Imagem ${index + 1}">
                    <img src="${img}" alt="Miniatura ${index + 1}" loading="lazy" decoding="async">
                </button>
            `).join('')}</div>`
        : '';

    // Chips de meta (aplicação, ano, cor, OEM)
    const metaChips = [];
    if (product.application) {
        metaChips.push(`<span class="spotlight-chip"><i class="fas fa-motorcycle"></i>${product.application}</span>`);
    }
    if (product.year) {
        metaChips.push(`<span class="spotlight-chip"><i class="fas fa-calendar"></i>${product.year}</span>`);
    }
    if (product.color) {
        metaChips.push(`<span class="spotlight-chip"><i class="fas fa-palette"></i>${product.color}</span>`);
    }
    if (product.oem) {
        metaChips.push(`<span class="spotlight-chip"><i class="fas fa-barcode"></i>${product.oem}</span>`);
    }
    const metaChipsRow = metaChips.length
        ? `<div class="spotlight-chip-row">${metaChips.join('')}</div>`
        : '';

    // Grade de especificações
    const detailItems = [];
    if (brandLabel) {
        detailItems.push({ label: 'Marca', value: brandLabel, icon: 'fas fa-trademark' });
    }
    if (product.application) {
        detailItems.push({ label: 'Aplicação/Modelo', value: product.application, icon: 'fas fa-motorcycle' });
    }
    if (product.year) {
        detailItems.push({ label: 'Ano', value: product.year, icon: 'fas fa-calendar' });
    }
    if (product.material) {
        detailItems.push({ label: 'Material', value: product.material, icon: 'fas fa-layer-group' });
    }
    if (product.weight) {
        detailItems.push({ label: 'Medida', value: product.weight, icon: 'fas fa-ruler-combined' });
    }
    if (product.oem) {
        detailItems.push({ label: 'Código OEM/Original', value: product.oem, icon: 'fas fa-barcode' });
    }
    if (product.color) {
        detailItems.push({ label: 'Cor/Acabamento', value: product.color, icon: 'fas fa-palette' });
    }
    if (product.specifications) {
        detailItems.push({ label: 'Especificações Adicionais', value: product.specifications, icon: 'fas fa-clipboard-list' });
    }

    const detailGrid = detailItems.length
        ? `<div class="spotlight-card">
                <div class="spotlight-card-title"><i class="fas fa-clipboard-check"></i> Especificações</div>
                <div class="spotlight-detail-grid">${detailItems.map(item => `
                    <div class="spotlight-detail">
                        <span class="label"><i class="${item.icon}"></i>${item.label}</span>
                        <span class="value">${item.value}</span>
                    </div>
                `).join('')}</div>
           </div>`
        : '';

    // Descrição (com fallback)
    const descriptionText = product.description && product.description.trim()
        ? product.description
        : 'Descrição não informada.';
    // Remover card de Resumo a pedido do usuário
    const descriptionBlock = '';

    // Aplicações (combinar string única e lista)
    const appsList = collectApplications(product);
    const headerAppTags = appsList.length
        ? `${appsList.slice(0, 3).map(app => `<span class="spotlight-tag"><i class="fas fa-motorcycle"></i>${app}</span>`).join('')}${appsList.length > 3 ? `<span class="spotlight-tag"><i class="fas fa-plus"></i>${appsList.length - 3}</span>` : ''}`
        : '';
    const applicationsBlock = appsList.length
        ? `<div class="spotlight-card">
                <div class="spotlight-card-title"><i class="fas fa-check-circle"></i> Aplicações</div>
                <div class="spotlight-tags">${appsList.map(app => `<span class="spotlight-chip"><i class="fas fa-check"></i>${app}</span>`).join('')}</div>
           </div>`
        : `<div class="spotlight-card">
                <div class="spotlight-card-title"><i class="fas fa-check-circle"></i> Aplicações</div>
                <p class="spotlight-text">Nenhuma aplicação informada.</p>
           </div>`;

    modalBody.innerHTML = `
        <div class="spotlight-shell">
            <div class="spotlight-top">
                <div class="spotlight-heading">
                    <p class="spotlight-eyebrow">${getCategoryName(product.category) || 'Produto'}</p>
                    <h2 class="spotlight-title">${product.name}</h2>
                    <div class="spotlight-meta">
                        ${product.code ? `<span class="spotlight-tag"><i class="fas fa-hashtag"></i>${product.code}</span>` : ''}
                        ${brandLabel ? `<span class="spotlight-tag"><i class="fas fa-trademark"></i>${brandLabel}</span>` : ''}
                        ${headerAppTags}
                    </div>
                </div>
                <div class="spotlight-actions">
                    <button class="btn btn-primary" onclick="requestInfoFromDetails()">
                        <i class="fas fa-envelope"></i> Solicitar orçamento
                    </button>
                </div>
            </div>
            <div class="spotlight-grid">
                <div class="spotlight-media">
                    <div class="spotlight-frame">
                        ${mainImage}
                        ${allImages.length ? `<div class="spotlight-counter" id="modalImageCounter">1/${allImages.length}</div>` : ''}
                        ${allImages.length ? `<button class="spotlight-fullscreen" onclick="openMainImageLightbox(event)" aria-label="Abrir galeria"><i class="fas fa-expand"></i></button>` : ''}
                    </div>
                    ${thumbs}
                </div>
                <div class="spotlight-details">
                    ${metaChipsRow}
                    ${applicationsBlock}
                    ${detailGrid}
                    <div class="spotlight-cta">
                        <button class="btn btn-primary" onclick="requestInfoFromDetails()"><i class="fas fa-comments"></i> Falar com especialista</button>
                        ${allImages.length ? `<button class="btn btn-secondary" onclick="openMainImageLightbox(event)"><i class="fas fa-images"></i> Ver imagens</button>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Inicializar zoom apenas na imagem do modal
    if (typeof initModalImageZoom === 'function') {
        initModalImageZoom();
    }
}

function setModalMainImage(index) {
    if (!inlineDetailsImages || !inlineDetailsImages[index]) return;
    const mainImg = document.getElementById('modalMainImage');
    if (mainImg) {
        mainImg.src = inlineDetailsImages[index];
        window.currentMainImageIndex = index;
    }
    document.querySelectorAll('.spotlight-thumbs .spotlight-thumb').forEach((thumb, idx) => {
        thumb.classList.toggle('active', idx === index);
    });
    const counter = document.getElementById('modalImageCounter');
    if (counter) {
        counter.textContent = `${index + 1}/${inlineDetailsImages.length}`;
    }
    
    // Atualizar origem do zoom para nova imagem
    if (typeof refreshModalZoomSrc === 'function') {
        refreshModalZoomSrc();
    }
}

// Zoom apenas no modal de detalhes
function initModalImageZoom() {
    const img = document.getElementById('modalMainImage');
    const container = img ? img.closest('.spotlight-frame') : null;
    if (!img || !container) return;
    if (container.__lensBound) return;
    container.__lensBound = true;
    container.__zoomSrc = img.src;

    const ZOOM = 2.0;
    const LENS_SIZE = 180;
    let lens = null;

    const createLens = () => {
        lens = document.createElement('div');
        lens.className = 'zoom-lens';
        lens.style.width = `${LENS_SIZE}px`;
        lens.style.height = `${LENS_SIZE}px`;
        lens.style.backgroundImage = `url('${container.__zoomSrc}')`;
        container.appendChild(lens);
    };

    const onEnter = () => {
        if (!lens) createLens();
        const rect = container.getBoundingClientRect();
        lens.style.backgroundSize = `${rect.width * ZOOM}px ${rect.height * ZOOM}px`;
    };

    const onMove = (e) => {
        if (!lens) return;
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        lens.style.left = `${x - LENS_SIZE / 2}px`;
        lens.style.top = `${y - LENS_SIZE / 2}px`;
        const bgX = -(x * ZOOM - LENS_SIZE / 2);
        const bgY = -(y * ZOOM - LENS_SIZE / 2);
        lens.style.backgroundPosition = `${bgX}px ${bgY}px`;
    };

    const onLeave = () => {
        if (lens && lens.parentNode) lens.parentNode.removeChild(lens);
        lens = null;
    };

    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);
}

function refreshModalZoomSrc() {
    const img = document.getElementById('modalMainImage');
    const container = img ? img.closest('.spotlight-frame') : null;
    if (!img || !container) return;
    container.__zoomSrc = img.src;
}

function openMainImageLightbox(event) {
    if (event) event.stopPropagation();
    const startIndex = typeof window.currentMainImageIndex === 'number' ? window.currentMainImageIndex : 0;
    openImageLightbox(selectedProduct?.id || '', startIndex, event);
}

function openImageLightbox(productId, startIndex = 0, event) {
    if (event) event.stopPropagation();
    
    const images = window.currentProductImages || [];
    if (images.length === 0) return;
    
    // Criar lightbox overlay
    const lightboxHTML = `
        <div id="imageLightbox" class="image-lightbox" onclick="closeLightbox()">
            <button class="lightbox-close" onclick="closeLightbox()">
                <i class="fas fa-times"></i>
            </button>
            <button class="lightbox-nav prev" onclick="moveLightbox(-1, event)">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button class="lightbox-nav next" onclick="moveLightbox(1, event)">
                <i class="fas fa-chevron-right"></i>
            </button>
            <div class="lightbox-content" onclick="event.stopPropagation()">
                ${images.map((img, index) => `
                    <img src="${img}" class="lightbox-image ${index === startIndex ? 'active' : ''}" alt="Imagem ${index + 1}">
                `).join('')}
            </div>
            <div class="lightbox-counter">${startIndex + 1} / ${images.length}</div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    document.body.style.overflow = 'hidden';
    window.currentLightboxIndex = startIndex;
}

function closeLightbox() {
    const lightbox = document.getElementById('imageLightbox');
    if (lightbox) {
        lightbox.remove();
        document.body.style.overflow = '';
    }
}

function moveLightbox(direction, event) {
    if (event) event.stopPropagation();
    
    const images = document.querySelectorAll('.lightbox-image');
    if (images.length === 0) return;
    
    images[window.currentLightboxIndex].classList.remove('active');
    
    window.currentLightboxIndex += direction;
    if (window.currentLightboxIndex >= images.length) window.currentLightboxIndex = 0;
    if (window.currentLightboxIndex < 0) window.currentLightboxIndex = images.length - 1;
    
    images[window.currentLightboxIndex].classList.add('active');
    
    const counter = document.querySelector('.lightbox-counter');
    if (counter) {
        counter.textContent = `${window.currentLightboxIndex + 1} / ${images.length}`;
    }
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('imageLightbox');
    if (!lightbox) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') moveLightbox(-1);
    if (e.key === 'ArrowRight') moveLightbox(1);
});

// Close product details modal
function closeProductDetailsModal() {
    const modal = document.getElementById('productDetailsModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Request info from details modal
function requestInfoFromDetails() {
    if (selectedProduct) {
        fillContactProductSummary(selectedProduct);
        contactModal.classList.add('active');
    }
}

// Open product details (alias)
function openProductDetails(productId) {
    showProductDetails(productId);
    showToast('Carregando detalhes do produto...', 'info', 1500);
}

document.head.appendChild(style);

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM already loaded
    init();
}
