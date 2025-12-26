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
    if (!productsGrid) {
        productsGrid = document.getElementById('productsGrid');
    }
    
    if (paginatedProducts.length === 0) {
        if (productsGrid) {
            productsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 3rem; color: #999;">Nenhum produto encontrado.</p>';
        }
        return;
    }

    if (!productsGrid) {
        console.error('❌ productsGrid não encontrado!');
        return;
    }

    productsGrid.innerHTML = paginatedProducts.map((product, index) => {
        const description = (product.description || '').trim();

        return `
        <div class="product-card" data-id="${product.id}" onclick="showProductDetails(${product.id})" role="button" tabindex="0" onkeydown="if(event.key==='Enter'){showProductDetails(${product.id})}">
            <div class="product-image">${(() => { const imgs = collectImages(product); return imgs.length ? `<img src="${imgs[0]}" alt="${product.name}" loading="lazy" decoding="async">` : (product.icon || '📦'); })()}</div>
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

// ===== VISUALIZAÇÃO DE SUBCATEGORIAS AO CLICAR NA CATEGORIA =====
function filterByCategory(category) {
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.value = category;
    }

    renderCategorySublist(category);
}

function renderCategorySublist(category) {
    const grid = document.getElementById('productsGrid');
    const pagination = document.getElementById('paginationControls');
    const catalogEl = document.getElementById('catalog');
    const searchEl = document.getElementById('searchInput');

    if (!grid) return;

    const data = (typeof subcategoriesData !== 'undefined') ? subcategoriesData[category] : null;
    const items = data && Array.isArray(data.items) ? data.items : [];
    const label = data?.label || getCategoryName(category) || 'Categoria';

    if (pagination) pagination.classList.add('hidden-section');
    if (searchEl) searchEl.value = '';

    // Monta visualização de subcategorias com CTA para ver produtos
    grid.innerHTML = `
        <div class="subcategory-panel">
            <div class="subcategory-header">
                <p class="eyebrow">Categoria</p>
                <h3>${label}</h3>
                <p class="subcategory-subtitle">Escolha uma subcategoria ou veja todos os produtos desta categoria.</p>
            </div>
            <div class="subcategory-badges">
                ${items.map(item => `
                    <button class="subcategory-pill" data-sub="${item}">
                        <i class="fas fa-tag"></i> ${item}
                    </button>
                `).join('') || '<p class="empty-subcategories">Nenhuma subcategoria cadastrada.</p>'}
            </div>
            <div class="subcategory-actions">
                <button class="btn btn-primary" id="showCategoryProducts">Ver produtos dessa categoria</button>
            </div>
        </div>
    `;

    // Scroll suave para o catálogo
    if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Clique em subcategoria → aplica busca pelo nome da subcategoria e filtra
    grid.querySelectorAll('.subcategory-pill').forEach(btn => {
        btn.addEventListener('click', () => {
            if (searchEl) searchEl.value = btn.dataset.sub;
            if (pagination) pagination.classList.remove('hidden-section');
            filterProductsEnhanced();
            updateBreadcrumb();
        });
    });

    // Botão para ver todos os produtos da categoria
    const showBtn = document.getElementById('showCategoryProducts');
    if (showBtn) {
        showBtn.addEventListener('click', () => {
            if (searchEl) searchEl.value = '';
            if (pagination) pagination.classList.remove('hidden-section');
            filterProductsEnhanced();
            updateBreadcrumb();
        });
    }
}

// ===== FILTRO POR MARCA (PARCEIROS) =====
function filterByBrand(brand) {
    const brandFilter = document.getElementById('brandFilter');
    if (brandFilter) {
        // Garantir que o option existe; se não, adicionar dinamicamente
        const hasOption = Array.from(brandFilter.options).some(opt => (opt.value || '').toLowerCase() === (brand || '').toLowerCase());
        if (!hasOption) {
            const opt = document.createElement('option');
            opt.value = brand;
            opt.textContent = (brand || '').toUpperCase();
            brandFilter.appendChild(opt);
        }
        brandFilter.value = brand;
    }
    // Limpa outros filtros para focar na marca
    const categoryFilterEl = document.getElementById('categoryFilter');
    if (categoryFilterEl) categoryFilterEl.value = 'all';
    const appEl = document.getElementById('applicationFilter');
    if (appEl) appEl.value = 'all';
    const searchInputEl = document.getElementById('searchInput');
    if (searchInputEl) searchInputEl.value = '';

    filterProductsEnhanced();
    updateBreadcrumb();
    // Scroll suave até o catálogo
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== BREADCRUMBS =====
function updateBreadcrumb() {
    const breadcrumbSection = document.getElementById('breadcrumbsSection');
    const breadcrumbContent = document.getElementById('breadcrumbContent');
    const categoryFilter = document.getElementById('categoryFilter');
    const brandFilter = document.getElementById('brandFilter');
    const applicationFilter = document.getElementById('applicationFilter');
    const searchInput = document.getElementById('searchInput');
    
    const parts = [];
    
    if (categoryFilter.value !== 'all') {
        parts.push(`<span>Categoria: ${getCategoryName(categoryFilter.value)}</span>`);
    }
    
    if (brandFilter.value !== 'all') {
        parts.push(`<span>Marca: ${brandFilter.value.toUpperCase()}</span>`);
    }
    if (applicationFilter && applicationFilter.value !== 'all') {
        parts.push(`<span>Aplicação: ${applicationFilter.value}</span>`);
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
    const appEl = document.getElementById('applicationFilter');
    if (appEl) appEl.value = 'all';
    document.getElementById('searchInput').value = '';
    document.getElementById('sortFilter').value = 'name';
    filterProductsEnhanced();
    updateBreadcrumb();
}

// ===== BUSCA APRIMORADA (COM OEM) =====
function filterProductsEnhanced() {
    // Garantir que os elementos existem
    if (!searchInput) searchInput = document.getElementById('searchInput');
    if (!categoryFilter) categoryFilter = document.getElementById('categoryFilter');
    if (!brandFilter) brandFilter = document.getElementById('brandFilter');
    if (!sortFilter) sortFilter = document.getElementById('sortFilter');
    const applicationFilterEl = document.getElementById('applicationFilter');
    
    const searchTerm = (searchInput && searchInput.value) ? searchInput.value.toLowerCase() : '';
    const selectedCategory = (categoryFilter && categoryFilter.value) ? categoryFilter.value : 'all';
    const selectedBrand = (brandFilter && brandFilter.value) ? brandFilter.value : 'all';
    const selectedApplication = (applicationFilterEl && applicationFilterEl.value) ? applicationFilterEl.value : 'all';

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
        const matchesBrand = selectedBrand === 'all' || (
            selectedBrand && (
                (product.brand && product.brand.toLowerCase() === selectedBrand.toLowerCase()) ||
                (product.manufacturer && product.manufacturer.toLowerCase() === selectedBrand.toLowerCase()) ||
                (product.supplierBrand && product.supplierBrand.toLowerCase() === selectedBrand.toLowerCase()) ||
                (product.vendorBrand && product.vendorBrand.toLowerCase() === selectedBrand.toLowerCase())
            )
        );
        const apps = collectApplications(product);
        const matchesApplication = selectedApplication === 'all' ||
            apps.some(app => app.toLowerCase().includes(selectedApplication.toLowerCase()));

        return matchesSearch && matchesCategory && matchesBrand && matchesApplication;
    });

    sortProductsEnhanced();
    currentPage = 1;
    updatePagination();
    renderProductsPaginated();
    updateBreadcrumb();
    updateCatalogInsights();
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
    }
}

// Atualiza indicadores do painel público com base nos produtos filtrados
function updateCatalogInsights() {
    const totalEl = document.getElementById('insightTotalProducts');
    const catEl = document.getElementById('insightCategories');
    const brandEl = document.getElementById('insightBrands');
    const mediaEl = document.getElementById('insightWithMedia');

    if (!totalEl || !catEl || !brandEl || !mediaEl) return;

    const source = Array.isArray(filteredProducts) && filteredProducts.length ? filteredProducts : products;
    const categories = new Set();
    const brands = new Set();
    let withMedia = 0;

    source.forEach(product => {
        if (product.category) categories.add(product.category);
        if (product.brand) brands.add(product.brand);
        if (product.image || (product.gallery && product.gallery.length)) {
            withMedia += 1;
        }
    });

    totalEl.textContent = source.length;
    catEl.textContent = categories.size;
    brandEl.textContent = brands.size;
    mediaEl.textContent = withMedia;
}

// Expor funções globalmente
window.changeSlide = changeSlide;
window.goToSlide = goToSlide;
window.changePage = changePage;
window.goToPage = goToPage;
window.filterByCategory = filterByCategory;
window.filterByBrand = filterByBrand;
window.clearFilters = clearFilters;
window.collectApplications = collectApplications;
window.collectImages = collectImages;

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

