// Load products from localStorage or use defaults
function loadProductsData() {
    // Tentar IndexedDB primeiro (síncrono não funciona, será feito no intervalo)
    const stored = localStorage.getItem('motoparts_products');
    if (stored) {
        return JSON.parse(stored);
    }
    return defaultProducts;
}

// Default product data
const defaultProducts = [
    {
        id: 1,
        name: 'Pastilha de Freio',
        category: 'freios',
        brand: 'honda',
        code: 'PF-001',
        description: 'Pastilha de freio de alta performance',
        icon: '🛞'
    },
    {
        id: 2,
        name: 'Vela de Ignição',
        category: 'motor',
        brand: 'universal',
        code: 'VI-002',
        description: 'Vela de ignição universal',
        icon: '⚡'
    },
    {
        id: 3,
        name: 'Corrente de Transmissão',
        category: 'transmissao',
        brand: 'yamaha',
        code: 'CT-003',
        description: 'Corrente reforçada',
        icon: '⛓️'
    },
    {
        id: 4,
        name: 'Kit Relação',
        category: 'transmissao',
        brand: 'suzuki',
        code: 'KR-004',
        description: 'Kit completo com corrente e coroas',
        icon: '⚙️'
    },
    {
        id: 5,
        name: 'Filtro de Óleo',
        category: 'motor',
        brand: 'honda',
        code: 'FO-005',
        description: 'Filtro de óleo original',
        icon: '🔧'
    },
    {
        id: 6,
        name: 'Disco de Freio',
        category: 'freios',
        brand: 'kawasaki',
        code: 'DF-006',
        description: 'Disco de freio ventilado',
        icon: '💿'
    },
    {
        id: 7,
        name: 'Amortecedor Dianteiro',
        category: 'suspensao',
        brand: 'yamaha',
        code: 'AD-007',
        description: 'Amortecedor regulável',
        icon: '🔩'
    },
    {
        id: 8,
        name: 'Bateria 12V',
        category: 'eletrica',
        brand: 'universal',
        code: 'BT-008',
        description: 'Bateria selada 12V',
        icon: '🔋'
    },
    {
        id: 9,
        name: 'Farol LED',
        category: 'eletrica',
        brand: 'universal',
        code: 'FL-009',
        description: 'Farol LED de alto brilho',
        icon: '💡'
    },
    {
        id: 10,
        name: 'Escapamento Esportivo',
        category: 'motor',
        brand: 'honda',
        code: 'EE-010',
        description: 'Escapamento em aço inox',
        icon: '💨'
    },
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
const categoryFilter = document.getElementById('categoryFilter');
const brandFilter = document.getElementById('brandFilter');
const sortFilter = document.getElementById('sortFilter');
const contactForm = document.getElementById('contactForm');
const productInterestInput = document.getElementById('productInterest');

// Initialize
function init() {
    currentPage = 1;
    populateBrandFilter();
    filterProductsEnhanced();
    renderProductsPaginated();
    setupEventListeners();
}

// Render products
function renderProducts() {
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 3rem; color: #999;">Nenhum produto encontrado.</p>';
        return;
    }

    productsGrid.innerHTML = filteredProducts.map(product => {
        const description = (product.description || '').trim();
        
        // Criar carrossel se houver galeria de imagens
        let imageHTML = '';
        const allImages = [];
        
        // Adicionar imagem principal
        if (product.image) {
            allImages.push(product.image);
        }
        
        // Adicionar imagens da galeria
        if (product.gallery && Array.isArray(product.gallery)) {
            allImages.push(...product.gallery);
        }
        
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
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">${imageHTML}</div>
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <h4 class="product-name">${product.name}</h4>
                <div class="product-details-compact">
                    <div class="product-code"><i class="fas fa-barcode"></i> ${product.code}</div>
                    <div class="product-brand"><i class="fas fa-trademark"></i> ${product.brand.toUpperCase()}</div>
                    ${product.application ? `<div class="product-application"><i class="fas fa-motorcycle"></i> ${product.application}</div>` : ''}
                    ${product.year ? `<div class="product-year"><i class="fas fa-calendar"></i> ${product.year}</div>` : ''}
                </div>
                ${description ? `<p class="product-description">${description}</p>` : ''}
                <div class="product-actions">
                    <button class="view-details" onclick="showProductDetails(${product.id})">
                        <i class="fas fa-eye"></i> Ver Detalhes
                    </button>
                    <button class="request-info" onclick="requestInfo(${product.id})">
                        <i class="fas fa-envelope"></i> Informações
                    </button>
                </div>
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

// Populate brand filter dynamically from products
function populateBrandFilter() {
    if (!brandFilter) return;
    const current = brandFilter.value;
    const brands = Array.from(new Set((products || []).map(p => p.brand).filter(Boolean))).sort((a, b) => a.localeCompare(b));
    brandFilter.innerHTML = ['<option value="all">Todas as Marcas</option>', ...brands.map(b => `<option value="${b}">${(b || '').toUpperCase()}</option>`)].join('');
    if (current && current !== 'all' && brands.includes(current)) {
        brandFilter.value = current;
    } else {
        brandFilter.value = 'all';
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
    productInterestInput.value = `${product.name} (Código: ${product.code})`;
    contactModal.classList.add('active');
}

// Open contact modal
function openContactModal() {
    productInterestInput.value = 'Interesse geral em produtos';
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

    // Contact form
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Sua solicitação foi enviada! Entraremos em contato em breve.');
        contactForm.reset();
        contactModal.classList.remove('active');
    });

    // Search and filters
    searchInput.addEventListener('input', filterProductsEnhanced);
    categoryFilter.addEventListener('change', filterProductsEnhanced);
    brandFilter.addEventListener('change', filterProductsEnhanced);
    sortFilter.addEventListener('change', () => {
        sortProductsEnhanced();
        currentPage = 1;
        updatePagination();
        renderProductsPaginated();
    });

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

    // Coletar todas as imagens
    const allImages = [];
    if (product.image) allImages.push(product.image);
    if (product.gallery && Array.isArray(product.gallery)) {
        allImages.push(...product.gallery);
    }
    inlineDetailsImages = allImages;

    // Imagem principal
    const mainImage = allImages.length
        ? `<img id="modalMainImage" src="${allImages[0]}" alt="${product.name}">`
        : `<div class="modal-image-placeholder"><i class="fas fa-image"></i></div>`;

    // Miniaturas (só mostrar se houver mais de uma imagem)
    const thumbs = allImages.length > 1
        ? `<div class="modal-thumbs">${allImages.map((img, index) => `
                <button class="thumb ${index === 0 ? 'active' : ''}" onclick="setModalMainImage(${index})" aria-label="Imagem ${index + 1}">
                    <img src="${img}" alt="Miniatura ${index + 1}">
                </button>
            `).join('')}</div>`
        : '';

    // Descrição (só mostrar se existir)
    const descriptionBlock = product.description && product.description.trim()
        ? `<div class="modal-section">
                <h4><i class="fas fa-align-left"></i> Descrição</h4>
                <p>${product.description}</p>
           </div>`
        : '';

    // Construir grid de informações (só campos preenchidos)
    const detailsRows = [];
    if (product.brand) {
        detailsRows.push(`<div class="detail-row"><span class="label"><i class="fas fa-trademark"></i> Marca:</span><span class="value">${product.brand.toUpperCase()}</span></div>`);
    }
    if (product.application) {
        detailsRows.push(`<div class="detail-row"><span class="label"><i class="fas fa-motorcycle"></i> Aplicação/Modelo:</span><span class="value">${product.application}</span></div>`);
    }
    if (product.year) {
        detailsRows.push(`<div class="detail-row"><span class="label"><i class="fas fa-calendar"></i> Ano:</span><span class="value">${product.year}</span></div>`);
    }
    if (product.material) {
        detailsRows.push(`<div class="detail-row"><span class="label"><i class="fas fa-layer-group"></i> Material:</span><span class="value">${product.material}</span></div>`);
    }
    if (product.weight) {
        detailsRows.push(`<div class="detail-row"><span class="label"><i class="fas fa-ruler-combined"></i> Medida:</span><span class="value">${product.weight}</span></div>`);
    }
    if (product.oem) {
        detailsRows.push(`<div class="detail-row"><span class="label"><i class="fas fa-barcode"></i> Código OEM/Original:</span><span class="value">${product.oem}</span></div>`);
    }
    if (product.color) {
        detailsRows.push(`<div class="detail-row"><span class="label"><i class="fas fa-palette"></i> Cor/Acabamento:</span><span class="value">${product.color}</span></div>`);
    }
    if (product.specifications) {
        detailsRows.push(`<div class="detail-row"><span class="label"><i class="fas fa-clipboard-list"></i> Especificações Adicionais:</span><span class="value">${product.specifications}</span></div>`);
    }

    const detailsGrid = detailsRows.length > 0
        ? `<div class="modal-section">
                <h4><i class="fas fa-info-circle"></i> Especificações Técnicas</h4>
                <div class="modal-details-grid">${detailsRows.join('')}</div>
           </div>`
        : '';

    // Aplicações (só mostrar se existirem)
    const applications = Array.isArray(product.applications) && product.applications.length
        ? `<div class="modal-section">
                <h4><i class="fas fa-check-circle"></i> Aplicações Compatíveis</h4>
                <ul class="modal-list">${product.applications.map(app => `<li><i class="fas fa-chevron-right"></i> ${app}</li>`).join('')}</ul>
           </div>`
        : '';

    modalBody.innerHTML = `
        <div class="modal-details-card">
            <div class="modal-media">
                <div class="modal-image-frame">
                    ${mainImage}
                    ${allImages.length > 1 ? `<div class="modal-image-counter" id="modalImageCounter">1/${allImages.length}</div>` : ''}
                </div>
                ${thumbs}
            </div>
            <div class="modal-content-area">
                <div class="modal-header-section">
                    <div class="modal-heading-group">
                        <span class="modal-category-badge">${getCategoryName(product.category) || 'Produto'}</span>
                        <h2 class="modal-product-title">${product.name}</h2>
                        ${product.code ? `<p class="modal-product-code"><i class="fas fa-hashtag"></i> ${product.code}</p>` : ''}
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-primary" onclick="requestInfoFromDetails()">
                            <i class="fas fa-envelope"></i> Solicitar Informações
                        </button>
                    </div>
                </div>
                ${descriptionBlock}
                ${detailsGrid}
                ${applications}
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function setModalMainImage(index) {
    if (!inlineDetailsImages || !inlineDetailsImages[index]) return;
    const mainImg = document.getElementById('modalMainImage');
    if (mainImg) {
        mainImg.src = inlineDetailsImages[index];
    }
    document.querySelectorAll('.modal-thumbs .thumb').forEach((thumb, idx) => {
        thumb.classList.toggle('active', idx === index);
    });
    const counter = document.getElementById('modalImageCounter');
    if (counter) {
        counter.textContent = `${index + 1}/${inlineDetailsImages.length}`;
    }
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
        productInterestInput.value = `${selectedProduct.name} (Código: ${selectedProduct.code})`;
        openContactModal();
    }
}
document.head.appendChild(style);

// Initialize app
init();
