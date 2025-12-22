// ===== FUNCIONALIDADES AVANÇADAS - CARROSSEL, PAGINAÇÃO, GALERIA =====

// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 800);
    }
    
    // Atualizar ano no footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});

// ===== HERO SLIDER =====
let currentSlide = 0;
let slideInterval;

function changeSlide(direction) {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
    
    resetSlideInterval();
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
    
    resetSlideInterval();
}

function autoSlide() {
    changeSlide(1);
}

function resetSlideInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(autoSlide, 5000);
}

// Iniciar autoplay
document.addEventListener('DOMContentLoaded', () => {
    slideInterval = setInterval(autoSlide, 5000);
});

// ===== PAGINAÇÃO =====
let currentPage = 1;
let itemsPerPage = 20;
let paginatedProducts = [];

function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    
    paginatedProducts = filteredProducts.slice(start, end);
    
    // Atualizar contador
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = `${filteredProducts.length} produto${filteredProducts.length !== 1 ? 's' : ''} encontrado${filteredProducts.length !== 1 ? 's' : ''}`;
    }
    
    // Atualizar controles de paginação
    const paginationControls = document.getElementById('paginationControls');
    if (totalPages > 1) {
        paginationControls.classList.remove('hidden-section');
        updatePaginationButtons(totalPages);
    } else {
        paginationControls.classList.add('hidden-section');
    }
}

function updatePaginationButtons(totalPages) {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const numbersContainer = document.getElementById('paginationNumbers');
    
    // Atualizar botões prev/next
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    // Gerar números de página
    numbersContainer.innerHTML = '';
    
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('div');
        btn.className = 'page-number' + (i === currentPage ? ' active' : '');
        btn.textContent = i;
        btn.onclick = () => goToPage(i);
        numbersContainer.appendChild(btn);
    }
}

function changePage(direction) {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        updatePagination();
        renderProductsPaginated();
        
        // Scroll to catalog
        document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
    }
}

function goToPage(page) {
    currentPage = page;
    updatePagination();
    renderProductsPaginated();
    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
}

function renderProductsPaginated() {
    if (paginatedProducts.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 3rem; color: #999;">Nenhum produto encontrado.</p>';
        return;
    }

    productsGrid.innerHTML = paginatedProducts.map((product, index) => {
        const description = (product.description || '').trim();

        return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">${product.image ? `<img src="${product.image}" alt="${product.name}">` : (product.icon || '📦')}</div>
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
                    <button class="view-details" onclick="event.stopPropagation(); showProductDetails(${product.id})">
                        <i class="fas fa-eye"></i> Ver Detalhes
                    </button>
                    <button class="request-info" onclick="event.stopPropagation(); requestInfo(${product.id})">
                        <i class="fas fa-envelope"></i> Informações
                    </button>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

// ===== FILTRO POR CATEGORIA DO GRID =====
function filterByCategory(category) {
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.value = category;
        filterProductsEnhanced();
        updateBreadcrumb();
    }
}

// ===== BREADCRUMBS =====
function updateBreadcrumb() {
    const breadcrumbSection = document.getElementById('breadcrumbsSection');
    const breadcrumbContent = document.getElementById('breadcrumbContent');
    const categoryFilter = document.getElementById('categoryFilter');
    const brandFilter = document.getElementById('brandFilter');
    const searchInput = document.getElementById('searchInput');
    
    const parts = [];
    
    if (categoryFilter.value !== 'all') {
        parts.push(`<span>Categoria: ${getCategoryName(categoryFilter.value)}</span>`);
    }
    
    if (brandFilter.value !== 'all') {
        parts.push(`<span>Marca: ${brandFilter.value.toUpperCase()}</span>`);
    }
    
    if (searchInput.value.trim()) {
        parts.push(`<span>Busca: "${searchInput.value}"</span>`);
    }
    
    if (parts.length > 0) {
        breadcrumbContent.innerHTML = parts.join('<li>');
        breadcrumbSection.classList.remove('hidden-section');
    } else {
        breadcrumbSection.classList.add('hidden-section');
    }
}

function clearFilters() {
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('brandFilter').value = 'all';
    document.getElementById('searchInput').value = '';
    document.getElementById('sortFilter').value = 'name';
    filterProductsEnhanced();
    updateBreadcrumb();
}

// ===== BUSCA APRIMORADA (COM OEM) =====
function filterProductsEnhanced() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const selectedBrand = brandFilter.value;

    filteredProducts = products.filter(product => {
        // Buscar em todos os campos possíveis
        const matchesSearch = 
            product.name.toLowerCase().includes(searchTerm) ||
            product.code.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.subcategory.toLowerCase().includes(searchTerm) ||
            (product.oem && product.oem.toLowerCase().includes(searchTerm)) ||
            (product.material && product.material.toLowerCase().includes(searchTerm)) ||
            (product.specifications && product.specifications.toLowerCase().includes(searchTerm)) ||
            (product.weight && product.weight.toLowerCase().includes(searchTerm)) ||
            // Buscar em applications (array)
            (product.applications && Array.isArray(product.applications) && 
             product.applications.some(app => app.toLowerCase().includes(searchTerm))) ||
            // Buscar em compatibleModels (array)
            (product.compatibleModels && Array.isArray(product.compatibleModels) && 
             product.compatibleModels.some(model => model.toLowerCase().includes(searchTerm))) ||
            // Buscar em campos específicos da subcategoria
            (product.specificFields && typeof product.specificFields === 'object' &&
             Object.values(product.specificFields).some(val => 
                val && val.toString().toLowerCase().includes(searchTerm)
             ));
        
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;
        
        return matchesSearch && matchesCategory && matchesBrand;
    });

    sortProductsEnhanced();
    currentPage = 1;
    updatePagination();
    renderProductsPaginated();
    updateBreadcrumb();
}

// ===== ORDENAÇÃO EXPANDIDA =====
function sortProductsEnhanced() {
    const sortValue = sortFilter.value;

    switch (sortValue) {
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'code':
            filteredProducts.sort((a, b) => (a.code || '').localeCompare(b.code || ''));
            break;
        case 'code-desc':
            filteredProducts.sort((a, b) => (b.code || '').localeCompare(a.code || ''));
            break;
        case 'newest':
            filteredProducts.sort((a, b) => (b.id || 0) - (a.id || 0));
            break;
        case 'stock-desc':
            filteredProducts.sort((a, b) => (b.stock || 0) - (a.stock || 0));
            break;
        case 'stock-asc':
            filteredProducts.sort((a, b) => (a.stock || 0) - (b.stock || 0));
            break;
    }
}

// Expor funções globalmente
window.changeSlide = changeSlide;
window.goToSlide = goToSlide;
window.changePage = changePage;
window.goToPage = goToPage;
window.filterByCategory = filterByCategory;
window.clearFilters = clearFilters;

// ===== GALERIA DE IMAGENS =====
function showGalleryLightbox(imageSrc) {
    let lightbox = document.getElementById('galleryLightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'galleryLightbox';
        lightbox.className = 'gallery-lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="" alt="Imagem ampliada">
                <div class="lightbox-close" onclick="closeGalleryLightbox()">&times;</div>
            </div>
        `;
        document.body.appendChild(lightbox);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeGalleryLightbox();
            }
        });
    }
    
    lightbox.querySelector('img').src = imageSrc;
    lightbox.classList.add('active');
}

function closeGalleryLightbox() {
    const lightbox = document.getElementById('galleryLightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
    }
}

window.showGalleryLightbox = showGalleryLightbox;
window.closeGalleryLightbox = closeGalleryLightbox;

