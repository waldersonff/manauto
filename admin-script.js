// Storage key
const STORAGE_KEY = 'motoparts_products';
const USE_INDEXEDDB = true; // Flag para usar IndexedDB

// Dados padrão (fallback)
function getDefaultProducts() {
    return [
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
        }
    ];
}

// Get products from storage (IndexedDB ou localStorage)
async function getProducts() {
    if (USE_INDEXEDDB) {
        try {
            const products = await loadAllProductsFromDB();
            if (products && products.length > 0) {
                return products;
            }
            // Se IndexedDB vazio, tentar migrar do localStorage
            const migrated = await migrateFromLocalStorage();
            if (migrated && migrated.length > 0) {
                return migrated;
            }
        } catch (e) {
            console.error('Erro ao carregar do IndexedDB, usando localStorage:', e);
        }
    }
    
    // Fallback para localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : getDefaultProducts();
}

// Helper to safely read a field value even if the element is missing
function safeValue(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
}

// Save products to storage (IndexedDB ou localStorage)
async function saveProducts(productsToSave) {
    try {
        if (USE_INDEXEDDB) {
            // Salvar no IndexedDB (suporta GB de dados)
            await saveAllProductsToDB(productsToSave);
            console.log(`✓ ${productsToSave.length} produtos salvos no IndexedDB`);
            
            // Mostrar info de armazenamento
            const info = await getStorageInfo();
            if (info) {
                console.log(`💾 Espaço usado: ${info.usedMB}MB de ${info.quotaMB}MB (${info.percentUsed}%)`);
            }
        } else {
            // Fallback localStorage (limite ~5-10MB)
            const dataStr = JSON.stringify(productsToSave);
            const sizeInMB = (new Blob([dataStr]).size / (1024 * 1024)).toFixed(2);
            console.log(`Salvando ${productsToSave.length} produtos no localStorage (${sizeInMB}MB)`);
            localStorage.setItem(STORAGE_KEY, dataStr);
        }
        
        products = productsToSave;
        filteredProducts = [...productsToSave];
        renderProducts();
        updateStats();
        return true;
    } catch (e) {
        if (e.name === 'QuotaExceededError' || e.code === 22) {
            console.error('Limite de armazenamento excedido!', e);
            alert(`❌ ERRO: Limite de armazenamento excedido!\n\n` +
                  `Você atingiu o limite de ${productsToSave.length} produtos.\n\n` +
                  `SOLUÇÃO: Recarregue a página para usar IndexedDB automático!`);
            return false;
        }
        console.error('Erro ao salvar produtos:', e);
        alert('Erro ao salvar produtos: ' + e.message);
        return false;
    }
}

// Get default products (initial data)
function getDefaultProducts() {
    return [
        { id: 1, name: 'Pastilha de Freio', subcategory: 'Pastilha Dianteira', category: 'freios', brand: 'honda', code: 'PF-001', description: 'Pastilha de freio de alta performance', icon: '🛞', application: 'CG 150', stock: 15, minStock: 2, status: 'active' },
        { id: 2, name: 'Vela de Ignição', subcategory: 'Vela de Ignição', category: 'motor', brand: 'universal', code: 'VI-002', description: 'Vela de ignição universal', icon: '⚡', application: 'Universal', stock: 30, minStock: 5, status: 'active' },
        { id: 3, name: 'Corrente de Transmissão', subcategory: 'Corrente', category: 'transmissao', brand: 'yamaha', code: 'CT-003', description: 'Corrente reforçada', icon: '⛓️', application: 'XTZ 250', stock: 8, minStock: 2, status: 'active' },
        { id: 4, name: 'Kit Relação', subcategory: 'Kit Relação', category: 'transmissao', brand: 'suzuki', code: 'KR-004', description: 'Kit completo com corrente e coroas', icon: '⚙️', application: 'V-Strom 650', stock: 6, minStock: 2, status: 'active' },
        { id: 5, name: 'Filtro de Óleo', subcategory: 'Filtro de Óleo', category: 'motor', brand: 'honda', code: 'FO-005', description: 'Filtro de óleo original', icon: '🔧', application: 'CB 500', stock: 20, minStock: 4, status: 'active' },
        { id: 6, name: 'Disco de Freio', subcategory: 'Disco Dianteiro', category: 'freios', brand: 'kawasaki', code: 'DF-006', description: 'Disco de freio ventilado', icon: '💿', application: 'Ninja 400', stock: 10, minStock: 2, status: 'active' },
        { id: 7, name: 'Amortecedor Dianteiro', subcategory: 'Amortecedor Dianteiro', category: 'suspensao', brand: 'yamaha', code: 'AD-007', description: 'Amortecedor regulável', icon: '🔩', application: 'MT-03', stock: 5, minStock: 1, status: 'active' },
        { id: 8, name: 'Bateria 12V', subcategory: 'Bateria', category: 'eletrica', brand: 'universal', code: 'BT-008', description: 'Bateria selada 12V', icon: '🔋', application: 'Universal', stock: 12, minStock: 3, status: 'active' }
    ];
}

let products = [];
let filteredProducts = [];
let editingProductId = null;
// Variável global para manter estado atual das subcategorias
let currentSubcategoriesData = null;

// Variáveis de paginação
let currentPage = 1;
const itemsPerPage = 20;

// Global initialization flag to prevent multiple inits
let isInitialized = false;

// Event handlers (declared once to prevent duplicates)
const eventHandlers = {
    addProduct: null,
    exportData: null,
    importData: null,
    closeModal: null,
    submitForm: null,
    confirmAction: null,
    delegateAddProduct: null
};

// DOM elements - initialized after DOM loads
let productsTableBody;
let productModal;
let confirmModal;
let importModal;
let productForm;
let addProductBtn;
let exportBtn;
let importBtn;
let closeModalBtns;
let searchInput;
let filterCategory;
let filterBrand;

// Initialize DOM references
function initializeDOMElements() {
    productsTableBody = document.getElementById('productsTableBody');
    productModal = document.getElementById('productModal');
    confirmModal = document.getElementById('confirmModal');
    importModal = document.getElementById('importModal');
    productForm = document.getElementById('productForm');
    addProductBtn = document.getElementById('addProductBtn');
    exportBtn = document.getElementById('exportBtn');
    importBtn = document.getElementById('importBtn');
    closeModalBtns = document.querySelectorAll('.close-modal');
    searchInput = document.getElementById('searchProducts');
    filterCategory = document.getElementById('filterCategory');
    filterBrand = document.getElementById('filterBrand');
}

// Initialize
async function init() {
    console.log('Init iniciado');
    
    // Inicializar IndexedDB primeiro
    if (USE_INDEXEDDB) {
        try {
            await initDB();
            console.log('✓ IndexedDB pronto para uso');
        } catch (e) {
            console.error('Erro ao inicializar IndexedDB, usando localStorage:', e);
        }
    }
    
    // Reload products from storage
    products = await getProducts();
    filteredProducts = [...products];
    
    // Initialize DOM elements FIRST
    initializeDOMElements();

    // Configurar toggle da sidebar
    setupSidebarToggle();
    
    // Carregar modificações de subcategorias ANTES de carregar categorias customizadas
    // Isso garante que as modificações sejam aplicadas primeiro
    console.log('Iniciando carregamento de dados...');
    loadSubcategoriesModifications();
    
    // Recarrega categorias customizadas salvas no localStorage
    hydrateCustomCategories();
    
    console.log('Estado final de currentSubcategoriesData:', currentSubcategoriesData);
    
    setupEventListeners();
    updateStats();
    populateFilters();
    populateSubcategories();
    populateYears();
    renderProducts();
}

// Setup event listeners
function setupEventListeners() {
    // Guard clauses to avoid silent failures; tenta reinicializar DOM refs
    if (!addProductBtn || !productModal || !productForm) {
        initializeDOMElements();
    }
    if (!addProductBtn || !productModal || !productForm) {
        console.error('Elementos obrigatórios ausentes para setupEventListeners', {
            addProductBtn,
            productModal,
            productForm
        });
        return;
    }

    // Remove old listeners if they exist
    if (eventHandlers.addProduct) {
        addProductBtn.removeEventListener('click', eventHandlers.addProduct);
    }
    
    // Create new handler
    eventHandlers.addProduct = () => {
        console.log('Ação: novo produto - abrindo modal');
        // Reset state completely first
        editingProductId = null;

        // Garantir que o modal não fique escondido se algum close adicionou hidden-section
        productModal.classList.remove('hidden-section');
        productModal.style.display = '';
        
        // Reset gallery array FIRST
        if (typeof window !== 'undefined' && typeof galleryImages !== 'undefined') {
            galleryImages = [];
        }
        
        // Update modal title
        document.getElementById('modalTitle').textContent = 'Novo Produto';
        
        // Reset form
        productForm.reset();
        
        // Clear image data and preview
        const imageDataInput = document.getElementById('productImageData');
        if (imageDataInput) imageDataInput.value = '';
        const galleryDataInput = document.getElementById('productGalleryData');
        if (galleryDataInput) galleryDataInput.value = '';
        
        const imagePreview = document.getElementById('productImagePreview');
        if (imagePreview) {
            imagePreview.src = '';
            imagePreview.classList.add('hidden-section');
        }
        
        // Reset gallery DOM
        const galleryPreview = document.getElementById('galleryPreview');
        if (galleryPreview) galleryPreview.innerHTML = '';
        const galleryInput = document.getElementById('productGallery');
        if (galleryInput) galleryInput.value = '';
        
        // Reset gallery via function
        if (typeof resetGallery === 'function') {
            resetGallery();
        }
        
        // Repopulate ALL selects to ensure they have options
        populateFilters();
        populateSubcategories();
        populateYears();
        
        // Clear and reset selections
        clearSelectedApplications();
        clearSelectedModels();
        
        // Limpar campos específicos
        clearSubcategorySpecificFields();
        
        // Initialize models selector
        if (typeof initModelsSelector === 'function') {
            initModelsSelector();
        }
        
        // Open modal only after everything is ready
        setTimeout(() => {
            productModal.classList.add('active');
        }, 50);
    };
    
    // Add new listener
    addProductBtn.addEventListener('click', eventHandlers.addProduct);

    // Export button (optional)
    if (exportBtn) {
        if (eventHandlers.exportData) {
            exportBtn.removeEventListener('click', eventHandlers.exportData);
        }
        eventHandlers.exportData = exportProducts;
        exportBtn.addEventListener('click', eventHandlers.exportData);
    }

    // Import button (optional)
    if (importBtn && importModal) {
        if (eventHandlers.importData) {
            importBtn.removeEventListener('click', eventHandlers.importData);
        }
        eventHandlers.importData = () => {
            importModal.classList.add('active');
        };
        importBtn.addEventListener('click', eventHandlers.importData);
    }

    // Close modals - use once option to prevent duplicates
    if (eventHandlers.closeModal) {
        closeModalBtns.forEach(btn => {
            btn.removeEventListener('click', eventHandlers.closeModal);
        });
    }
    eventHandlers.closeModal = () => {
        productModal.classList.remove('active');
        confirmModal.classList.remove('active');
        importModal.classList.remove('active');
    };
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', eventHandlers.closeModal);
    });

    // Fallback: delegação para garantir abertura mesmo se listener principal falhar
    if (!eventHandlers.delegateAddProduct) {
        eventHandlers.delegateAddProduct = (e) => {
            const btn = e.target.closest('#addProductBtn');
            if (!btn) return;
            // Se handler não estiver registrado, reconfigura e executa
            if (!eventHandlers.addProduct) {
                console.warn('Fallback acionado: reconfigurando listeners do botão Novo Produto');
                setupEventListeners();
            }
            if (eventHandlers.addProduct) {
                e.preventDefault();
                eventHandlers.addProduct();
            }
        };
        document.addEventListener('click', eventHandlers.delegateAddProduct, { passive: false });
    }

    // Close modal on backdrop click
    [productModal, confirmModal, importModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        }, { once: false });
    });

    // Cancel button
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            productModal.classList.remove('active');
        }, { once: false });
    }

    // Intervalo de anos
    const applyYearRangeBtn = document.getElementById('applyYearRangeBtn');
    if (applyYearRangeBtn) {
        applyYearRangeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            applyYearRange();
        });
    }
    const clearYearSelectionBtn = document.getElementById('clearYearSelectionBtn');
    if (clearYearSelectionBtn) {
        clearYearSelectionBtn.addEventListener('click', (e) => {
            e.preventDefault();
            clearYearSelection();
        });
    }

    // Product form submit
    if (productForm) {
        if (eventHandlers.submitForm) {
            productForm.removeEventListener('submit', eventHandlers.submitForm);
        }
        eventHandlers.submitForm = handleFormSubmit;
        productForm.addEventListener('submit', eventHandlers.submitForm);
    }

    // Search and filters
    searchInput.addEventListener('input', filterProducts);
    filterCategory.addEventListener('change', filterProducts);
    filterBrand.addEventListener('change', filterProducts);

    // Import file
    document.getElementById('selectFileBtn').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });

    document.getElementById('fileInput').addEventListener('change', handleFileImport);

    // Confirm delete
    document.getElementById('confirmCancelBtn').addEventListener('click', () => {
        confirmModal.classList.remove('active');
    });

    // Product image upload preview
    const imageInput = document.getElementById('productImage');
    const imageDataInput = document.getElementById('productImageData');
    const imagePreview = document.getElementById('productImagePreview');
    if (imageInput) {
        imageInput.addEventListener('change', async (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            
            // Verificar tamanho
            if (file.size > 10 * 1024 * 1024) {
                alert('Imagem muito grande (máx 10MB). Por favor, escolha uma imagem menor.');
                e.target.value = '';
                return;
            }
            
            const reader = new FileReader();
            reader.onload = async (ev) => {
                const dataUrl = ev.target.result;
                
                // Comprimir imagem com ALTA QUALIDADE (IndexedDB suporta GB)
                const compressedDataUrl = await compressImageMain(dataUrl, 1920, 0.85);
                
                imageDataInput.value = compressedDataUrl;
                imagePreview.src = compressedDataUrl;
                imagePreview.classList.remove('hidden-section');
            };
            reader.readAsDataURL(file);
        });
    }
}

// Sidebar toggle
function setupSidebarToggle() {
    const toggleBtn = document.getElementById('toggleSidebarBtn');
    const adminContainer = document.querySelector('.admin-container');
    if (!toggleBtn || !adminContainer) return;

    // Aplicar estado salvo
    const saved = localStorage.getItem('admin_sidebar_collapsed');
    if (saved === '1') {
        adminContainer.classList.add('sidebar-collapsed');
    }

    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        adminContainer.classList.toggle('sidebar-collapsed');
        const isCollapsed = adminContainer.classList.contains('sidebar-collapsed');
        localStorage.setItem('admin_sidebar_collapsed', isCollapsed ? '1' : '0');
    });
}

// Função para comprimir imagem principal
function compressImageMain(dataUrl, maxWidth = 1200, quality = 0.8) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedDataUrl);
        };
        img.src = dataUrl;
    });
}

// Update statistics
function updateStats() {
    // Count total categories from current subcategories
    const totalCategories = Object.keys(getCurrentSubcategories()).length;
    
    // Count total unique brands from getAllBrands()
    const allBrands = getAllBrands();
    const totalBrands = allBrands.length;

    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalCategories').textContent = totalCategories;
    document.getElementById('totalBrands').textContent = totalBrands;
}

// Populate filters
function populateFilters() {
    // Clear existing options except the first one
    filterCategory.innerHTML = '<option value="all">Todas as Categorias</option>';
    filterBrand.innerHTML = '<option value="all">Todas as Marcas</option>';
    const productBrand = document.getElementById('productBrand');
    if (productBrand) {
        productBrand.innerHTML = '<option value="">Selecione...</option>';
    }
    
    // Populate categories from subcategoriesData
    const currentSubs = getCurrentSubcategories();
    Object.entries(currentSubs).forEach(([key, data]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = data.label;
        filterCategory.appendChild(option);
    });
    
    // Use getAllBrands() to get both standard and custom brands
    const allBrands = getAllBrands();
    
    allBrands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand.toUpperCase();
        filterBrand.appendChild(option);
        if (productBrand) {
            const opt2 = document.createElement('option');
            opt2.value = brand;
            opt2.textContent = brand.toUpperCase();
            productBrand.appendChild(opt2);
        }
    });
}

// Populate subcategories in product form
function populateSubcategories() {
    const subcategorySelect = document.getElementById('productSubcategory');
    const currentSubs = getCurrentSubcategories();
    if (!subcategorySelect || !currentSubs) return;
    
    subcategorySelect.innerHTML = '<option value="">Selecione...</option>';
    
    Object.entries(currentSubs).forEach(([categoryKey, categoryData]) => {
        if (categoryData.items && Array.isArray(categoryData.items)) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = categoryData.label;
            
            categoryData.items.forEach(subcategory => {
                const option = document.createElement('option');
                option.value = subcategory;
                option.textContent = subcategory;
                option.dataset.category = categoryKey;
                optgroup.appendChild(option);
            });
            
            subcategorySelect.appendChild(optgroup);
        }
    });
}

// Populate years in product form
function populateYears() {
    const yearSelect = document.getElementById('productYear');
    const yearStart = document.getElementById('productYearStart');
    const yearEnd = document.getElementById('productYearEnd');
    if (!yearSelect) return;
    
    yearSelect.innerHTML = '';
    if (yearStart) yearStart.innerHTML = '';
    if (yearEnd) yearEnd.innerHTML = '';
    
    const currentYear = new Date().getFullYear();
    const startYear = 1980;
    
    // Placeholder apenas para selects de intervalo
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Selecione...';
    placeholder.disabled = true;
    placeholder.selected = true;
    if (yearStart) yearStart.appendChild(placeholder.cloneNode(true));
    if (yearEnd) yearEnd.appendChild(placeholder.cloneNode(true));
    
    for (let year = currentYear; year >= startYear; year--) {
        const option = document.createElement('option');
        option.value = year.toString();
        option.textContent = year.toString();
        yearSelect.appendChild(option);
        if (yearStart) yearStart.appendChild(option.cloneNode(true));
        if (yearEnd) yearEnd.appendChild(option.cloneNode(true));
    }
}

// Obter anos selecionados (multiseleção)
function getSelectedYears() {
    const yearSelect = document.getElementById('productYear');
    if (!yearSelect) return [];
    return Array.from(yearSelect.selectedOptions)
        .map(opt => opt.value)
        .filter(Boolean)
        .sort((a, b) => Number(a) - Number(b));
}

function clearYearSelection() {
    const yearSelect = document.getElementById('productYear');
    if (!yearSelect) return;
    Array.from(yearSelect.options).forEach(opt => opt.selected = false);
    const start = document.getElementById('productYearStart');
    const end = document.getElementById('productYearEnd');
    if (start) start.value = '';
    if (end) end.value = '';
}

// Aplicar intervalo de anos selecionando no multiselect
function applyYearRange() {
    const yearSelect = document.getElementById('productYear');
    const start = document.getElementById('productYearStart')?.value;
    const end = document.getElementById('productYearEnd')?.value;
    if (!yearSelect || !start || !end) return;
    const startNum = Number(start);
    const endNum = Number(end);
    if (isNaN(startNum) || isNaN(endNum)) return;
    const [min, max] = startNum <= endNum ? [startNum, endNum] : [endNum, startNum];
    Array.from(yearSelect.options).forEach(opt => {
        const valNum = Number(opt.value);
        if (!isNaN(valNum)) {
            opt.selected = valNum >= min && valNum <= max;
        }
    });
}

// Get category name
function getCategoryName(category) {
    const categories = {
        'motor': 'Motor',
        'freios': 'Freios',
        'suspensao': 'Suspensão',
        'eletrica': 'Elétrica',
        'transmissao': 'Transmissão',
        'carroceria': 'Carroceria'
    };
    return categories[category] || category;
}

// Filter products
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = filterCategory.value;
    const selectedBrand = filterBrand.value;

    filteredProducts = products.filter(product => {
        const matchesSearch = 
            (product.name && product.name.toLowerCase().includes(searchTerm)) ||
            (product.code && product.code.toLowerCase().includes(searchTerm)) ||
            (product.description && product.description.toLowerCase().includes(searchTerm));
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;
        
        return matchesSearch && matchesCategory && matchesBrand;
    });

    currentPage = 1; // Resetar para primeira página ao filtrar
    renderProducts();
}

// Render products table
function renderProducts() {
    if (filteredProducts.length === 0) {
        productsTableBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 3rem; color: #999;">
                    Nenhum produto encontrado
                </td>
            </tr>
        `;
        renderPagination();
        return;
    }

    // Calcular produtos da página atual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    productsTableBody.innerHTML = paginatedProducts.map(product => {
        const stockClass = !product.stock ? 'stock-low' : 
                          product.stock <= (product.minStock || 0) ? 'stock-low' : 
                          product.stock <= (product.minStock || 0) * 2 ? 'stock-ok' : 'stock-high';
        
        const statusText = product.status === 'active' ? 'Ativo' : 
                          product.status === 'inactive' ? 'Inativo' : 'Descontinuado';
        const thumb = product.image 
            ? `<img src="${product.image}" alt="${product.name}" class="thumb">`
            : `<span class="thumb-fallback">${product.icon || '📦'}</span>`;

        // Nome exibido inclui até 2 aplicações/compatíveis, mesmo para produtos antigos
        const baseName = (product.name && typeof product.name === 'string' && product.name.trim())
            ? product.name.trim()
            : `${(product.subcategory || 'Produto')} ${(product.brand || '')}`.trim();
        const appsSnippet = (product.compatibleModels && Array.isArray(product.compatibleModels) && product.compatibleModels.length)
            ? `${product.compatibleModels.slice(0, 2).join(' / ')}${product.compatibleModels.length > 2 ? ` (+${product.compatibleModels.length - 2})` : ''}`
            : (product.applications && Array.isArray(product.applications) && product.applications.length)
                ? `${product.applications.slice(0, 2).join(' / ')}${product.applications.length > 2 ? ` (+${product.applications.length - 2})` : ''}`
                : '';
        const displayName = appsSnippet ? `${baseName} - ${appsSnippet}` : baseName;

        // Exibir modelos compatíveis ou aplicações
        let applicationDisplay = '-';
        if (product.compatibleModels && Array.isArray(product.compatibleModels) && product.compatibleModels.length > 0) {
            const count = product.compatibleModels.length;
            const firstModels = product.compatibleModels.slice(0, 2).join(', ');
            applicationDisplay = count > 2 ? `${firstModels} (+${count - 2})` : firstModels;
        } else if (product.applications && Array.isArray(product.applications) && product.applications.length > 0) {
            const count = product.applications.length;
            const firstApps = product.applications.slice(0, 2).join(', ');
            applicationDisplay = count > 2 ? `${firstApps} (+${count - 2})` : firstApps;
        } else if (product.application) {
            applicationDisplay = product.application;
        }

        const applicationTitle = product.compatibleModels?.join(', ') || product.applications?.join(', ') || product.application || 'Não especificado';

        return `
        <tr>
            <td class="thumb-cell">${thumb}</td>
            <td><strong>${product.code}</strong></td>
            <td class="name-cell">
                <span class="name-text">${displayName}</span>
            </td>
            <td><span class="badge badge-${product.category}">${getCategoryName(product.category)}</span></td>
            <td>${(product.brand || '').toUpperCase()}</td>
            <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${applicationTitle}">
                ${applicationDisplay}
            </td>
            <td><span class="${stockClass}">${product.stock || 0}</span></td>
            <td><span class="badge badge-status-${product.status || 'active'}">${statusText}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning btn-icon" onclick="editProduct(${product.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-icon" onclick="confirmDelete(${product.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
    }).join('');
    
    renderPagination();
}

// Renderizar controles de paginação
function renderPagination() {
    const paginationContainer = document.getElementById('paginationContainer');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '<div class="pagination">';
    
    // Botão anterior
    paginationHTML += `
        <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i> Anterior
        </button>
    `;
    
    // Números de página
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    if (startPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += '<span class="pagination-ellipsis">...</span>';
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += '<span class="pagination-ellipsis">...</span>';
        }
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${totalPages})">${totalPages}</button>`;
    }
    
    // Botão próximo
    paginationHTML += `
        <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">
            Próximo <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    paginationHTML += '</div>';
    paginationHTML += `<div class="pagination-info">Mostrando ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, filteredProducts.length)} de ${filteredProducts.length} produtos</div>`;
    
    paginationContainer.innerHTML = paginationHTML;
}

// Mudar página
function changePage(page) {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderProducts();
    // Scroll suave para o topo da tabela
    document.querySelector('.table-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Handle form submit
function handleFormSubmit(e) {
    e.preventDefault();

    const selectedYears = getSelectedYears();

    const formData = {
        id: editingProductId || Date.now(),
        name: safeValue('productName').trim(),
        subcategory: safeValue('productSubcategory'),
        code: safeValue('productCode').trim() || `AUTO-${Date.now()}`,
        category: getCategoryFromSubcategory(safeValue('productSubcategory')),
        brand: safeValue('productBrand'),
        description: safeValue('productDescription').trim(),
        icon: safeValue('productIcon').trim() || '📦',
        application: safeValue('productApplication'),
        applications: selectedApplicationsList.length > 0 ? [...selectedApplicationsList] : null,
        compatibleModels: selectedModelsList.length > 0 ? [...selectedModelsList] : null,
        years: selectedYears.length ? selectedYears : null,
        year: selectedYears.length ? selectedYears.join(', ') : safeValue('productYear'),
        color: safeValue('productColor'),
        material: safeValue('productMaterial'),
        weight: safeValue('productWeight').trim(),
        oem: safeValue('productOEM').trim(),
        specifications: safeValue('productSpecifications').trim(),
        image: safeValue('productImageData') || (editingProductId ? (products.find(p => p.id === editingProductId)?.image || '') : ''),
        gallery: galleryImages.length > 0 ? [...galleryImages] : null,
        stock: parseInt(safeValue('productStock')) || 0,
        minStock: parseInt(safeValue('productMinStock')) || 0,
        warranty: safeValue('productWarranty'),
        status: safeValue('productStatus'),
        specificFields: getSubcategorySpecificData() // Adicionar campos específicos
    };

    if (editingProductId) {
        const index = products.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
            products[index] = formData;
            showNotification('Produto atualizado com sucesso!', 'success');
        }
    } else {
        products.push(formData);
        showNotification('Produto cadastrado com sucesso!', 'success');
    }

    // Save to localStorage
    saveProducts(products);
    
    // Close modal immediately
    if (productModal) {
        productModal.classList.remove('active');
    }
    
    // Reset EVERYTHING immediately (não use setTimeout que causa problemas de sincronização)
    // Reset editing ID
    editingProductId = null;
    
    // Clear image data and gallery FIRST (CRÍTICO)
    const imageDataInput = document.getElementById('productImageData');
    if (imageDataInput) imageDataInput.value = '';
    const galleryDataInput = document.getElementById('productGalleryData');
    if (galleryDataInput) galleryDataInput.value = '';
    
    // Reset gallery array e preview
    if (typeof resetGallery === 'function') {
        resetGallery();
    } else {
        // Fallback se função não estiver disponível
        galleryImages = [];
        const galleryPreview = document.getElementById('galleryPreview');
        if (galleryPreview) galleryPreview.innerHTML = '';
    }
    
    // Reset image preview
    const imagePreview = document.getElementById('productImagePreview');
    if (imagePreview) {
        imagePreview.src = '';
        imagePreview.classList.add('hidden-section');
    }
    
    // Reset form fields
    if (productForm) {
        productForm.reset();
    }
    
    // Clear selected applications and models
    if (typeof clearSelectedApplications === 'function') {
        clearSelectedApplications();
    } else {
        selectedApplicationsList = [];
        const applicationsContainer = document.getElementById('selectedApplications');
        if (applicationsContainer) applicationsContainer.innerHTML = '';
    }
    
    if (typeof clearSelectedModels === 'function') {
        clearSelectedModels();
    } else {
        selectedModelsList = [];
        const selectedModels = document.getElementById('selectedModels');
        if (selectedModels) selectedModels.innerHTML = '';
    }
    
    // Reset model search
    const modelSearchInput = document.getElementById('modelSearchInput');
    if (modelSearchInput) modelSearchInput.value = '';
    
    // Limpar campos específicos da subcategoria
    clearSubcategorySpecificFields();
    
    // Repopulate selects
    if (typeof populateSubcategories === 'function') {
        populateSubcategories();
    }
    if (typeof populateYears === 'function') {
        populateYears();
    }
    
    // Initialize models selector
    if (typeof initModelsSelector === 'function') {
        initModelsSelector();
    }
}

// Função para obter categoria a partir da subcategoria
function getCategoryFromSubcategory(subcategory) {
    const currentSubs = getCurrentSubcategories();
    for (const [category, data] of Object.entries(currentSubs)) {
        if (data.items.includes(subcategory)) {
            return category;
        }
    }
    return '';
}

// Edit product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    editingProductId = id;
    // Garantir que o modal não esteja oculto por hidden-section/display:none
    productModal.classList.remove('hidden-section');
    productModal.style.display = '';
    document.getElementById('modalTitle').textContent = 'Editar Produto';
    
    // Populate selects first
    populateSubcategories();
    populateYears();
    
    // Then set values
    document.getElementById('productId').value = product.id;
    document.getElementById('productSubcategory').value = product.subcategory || '';
    document.getElementById('productCode').value = product.code || '';
    document.getElementById('productBrand').value = product.brand || '';
    const applicationInput = document.getElementById('productApplication');
    if (applicationInput) applicationInput.value = product.application || '';
    const yearSelect = document.getElementById('productYear');
    if (yearSelect) {
        // Suporta produtos antigos (string) e novos (array)
        const yearsArray = Array.isArray(product.years)
            ? product.years
            : (product.year ? product.year.toString().split(',').map(y => y.trim()).filter(Boolean) : []);
        Array.from(yearSelect.options).forEach(opt => {
            opt.selected = yearsArray.includes(opt.value);
        });
    }
    document.getElementById('productColor').value = product.color || '';
    document.getElementById('productName').value = product.name || '';
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productMaterial').value = product.material || '';
    document.getElementById('productWeight').value = product.weight || '';
    document.getElementById('productOEM').value = product.oem || '';
    document.getElementById('productSpecifications').value = product.specifications || '';
    document.getElementById('productStock').value = product.stock || 0;
    document.getElementById('productMinStock').value = product.minStock || 0;
    document.getElementById('productWarranty').value = product.warranty || '';
    document.getElementById('productStatus').value = product.status || 'active';
    document.getElementById('productIcon').value = product.icon || '';

    // Aplicações múltiplas
    if (product.applications && Array.isArray(product.applications)) {
        loadSelectedApplications(product.applications);
    } else {
        clearSelectedApplications();
    }

    // Modelos compatíveis
    if (product.compatibleModels && Array.isArray(product.compatibleModels)) {
        loadSelectedModels(product.compatibleModels);
    } else {
        clearSelectedModels();
    }

    // Image preview
    const imagePreview = document.getElementById('productImagePreview');
    const imageDataInput = document.getElementById('productImageData');
    const imageInput = document.getElementById('productImage');
    imageDataInput.value = product.image || '';
    if (product.image) {
        imagePreview.src = product.image;
        imagePreview.classList.remove('hidden-section');
    } else {
        imagePreview.src = '';
        imagePreview.classList.add('hidden-section');
    }
    if (imageInput) imageInput.value = '';

    // Galeria de imagens
    if (product.gallery && Array.isArray(product.gallery) && typeof loadGallery === 'function') {
        loadGallery(product.gallery);
    } else if (typeof resetGallery === 'function') {
        resetGallery();
    }

    // Inicializar seletor de modelos
    if (typeof initModelsSelector === 'function') {
        initModelsSelector();
    }

    // Atualizar campos específicos da subcategoria
    updateSubcategoryFields();
    
    // Carregar dados dos campos específicos
    if (product.specificFields) {
        loadSubcategorySpecificData(product.specificFields);
    }

    productModal.classList.add('active');
}

// Confirm delete
function confirmDelete(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    document.getElementById('confirmMessage').textContent = 
        `Tem certeza que deseja excluir o produto "${product.name}"?`;
    
    document.getElementById('confirmDeleteBtn').onclick = () => {
        deleteProduct(id);
        confirmModal.classList.remove('active');
    };

    confirmModal.classList.add('active');
}

// Delete product
function deleteProduct(id) {
    products = products.filter(p => p.id !== id);
    saveProducts(products);
    showNotification('Produto excluído com sucesso!', 'success');
}

// Export products
function exportProducts() {
    const dataStr = JSON.stringify(products, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `motoparts-produtos-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Produtos exportados com sucesso!', 'success');
}

// Handle file import
function handleFileImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const importedProducts = JSON.parse(event.target.result);
            if (!Array.isArray(importedProducts)) {
                throw new Error('Formato inválido');
            }

            products = importedProducts;
            saveProducts(products);
            importModal.classList.remove('active');
            showNotification('Produtos importados com sucesso!', 'success');
            populateFilters();
        } catch (error) {
            showNotification('Erro ao importar arquivo. Verifique o formato.', 'error');
        }
    };
    reader.readAsText(file);
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#27ae60' : '#e74c3c';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
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
    }, 3000);
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
document.head.appendChild(style);

// ===== APPLICATIONS MULTI-SELECT =====
let selectedApplicationsList = [];

function initApplicationsSelector() {
    const searchInput = document.getElementById('applicationsSearch');
    const applicationsList = document.getElementById('applicationsList');
    const selectedAppsContainer = document.getElementById('selectedApplications');
    
    // Load all applications from product-data.js
    if (typeof applicationsData !== 'undefined') {
        renderApplicationsList(applicationsData);
    }
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            if (typeof applicationsData !== 'undefined') {
                const filtered = applicationsData.filter(app => 
                    app.toLowerCase().includes(searchTerm)
                );
                renderApplicationsList(filtered);
            }
        });
    }
}

function renderApplicationsList(apps) {
    const applicationsList = document.getElementById('applicationsList');
    if (!applicationsList) return;
    
    applicationsList.innerHTML = apps.map((app, index) => {
        const isSelected = selectedApplicationsList.includes(app);
        return `
            <div class="application-item" data-app="${app}">
                <input type="checkbox" 
                       class="application-checkbox" 
                       id="app-${index}" 
                       ${isSelected ? 'checked' : ''}
                       onchange="toggleApplication('${app.replace(/'/g, "\\'")}')">
                <label for="app-${index}" style="cursor: pointer; flex: 1;">${app}</label>
            </div>
        `;
    }).join('');
}

function toggleApplication(app) {
    const index = selectedApplicationsList.indexOf(app);
    if (index > -1) {
        selectedApplicationsList.splice(index, 1);
    } else {
        selectedApplicationsList.push(app);
    }
    renderSelectedApplications();
}

function renderSelectedApplications() {
    const container = document.getElementById('selectedApplications');
    if (!container) return;
    
    if (selectedApplicationsList.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = selectedApplicationsList.map(app => `
        <div class="selected-app-tag">
            <span>${app}</span>
            <button type="button" class="remove-app" onclick="removeApplication('${app.replace(/'/g, "\\'")}')">×</button>
        </div>
    `).join('');
}

function removeApplication(app) {
    const index = selectedApplicationsList.indexOf(app);
    if (index > -1) {
        selectedApplicationsList.splice(index, 1);
    }
    renderSelectedApplications();
    
    // Update checkboxes
    const searchInput = document.getElementById('applicationsSearch');
    if (searchInput && typeof applicationsData !== 'undefined') {
        const searchTerm = searchInput.value.toLowerCase();
        const filtered = applicationsData.filter(a => 
            a.toLowerCase().includes(searchTerm)
        );
        renderApplicationsList(filtered);
    }
}

function loadSelectedApplications(applications) {
    selectedApplicationsList = Array.isArray(applications) ? [...applications] : [];
    renderSelectedApplications();
    if (typeof applicationsData !== 'undefined') {
        renderApplicationsList(applicationsData);
    }
}

function clearSelectedApplications() {
    selectedApplicationsList = [];
    renderSelectedApplications();
    if (typeof applicationsData !== 'undefined') {
        renderApplicationsList(applicationsData);
    }
}

// ===== MODELS MULTI-SELECT =====
let selectedModelsList = [];

function initModelsSelector() {
    const modelSearchInput = document.getElementById('modelSearchInput');
    const modelsList = document.getElementById('modelsList');
    
    // Carregar todos os modelos da aplicações
    if (typeof applicationsData !== 'undefined') {
        renderModelsList(applicationsData);
    }
    
    // Funcionalidade de busca
    if (modelSearchInput) {
        modelSearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            if (typeof applicationsData !== 'undefined') {
                const filtered = applicationsData.filter(model => 
                    model.toLowerCase().includes(searchTerm)
                );
                renderModelsList(filtered);
            }
        });
    }
}

function renderModelsList(models) {
    const modelsList = document.getElementById('modelsList');
    if (!modelsList) return;
    
    modelsList.innerHTML = models.map((model, index) => {
        const isSelected = selectedModelsList.includes(model);
        return `
            <div class="model-item ${isSelected ? 'selected' : ''}" data-model="${model}">
                <input type="checkbox" 
                       class="model-checkbox" 
                       id="model-${index}" 
                       ${isSelected ? 'checked' : ''}
                       onchange="toggleModel('${model.replace(/'/g, "\\'")}')">
                <label for="model-${index}" style="cursor: pointer; flex: 1;">${model}</label>
            </div>
        `;
    }).join('');
}

function toggleModel(model) {
    const index = selectedModelsList.indexOf(model);
    if (index > -1) {
        selectedModelsList.splice(index, 1);
    } else {
        selectedModelsList.push(model);
    }
    renderSelectedModels();
    // Atualizar visualmente os itens
    if (typeof applicationsData !== 'undefined') {
        const searchTerm = document.getElementById('modelSearchInput')?.value.toLowerCase() || '';
        const filtered = applicationsData.filter(m => 
            m.toLowerCase().includes(searchTerm)
        );
        renderModelsList(filtered);
    }
}

function renderSelectedModels() {
    const container = document.getElementById('selectedModels');
    if (!container) return;
    
    if (selectedModelsList.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = selectedModelsList.map(model => `
        <div class="selected-model-tag">
            <span>${model}</span>
            <button type="button" class="remove-model" onclick="removeModel('${model.replace(/'/g, "\\'")}')">×</button>
        </div>
    `).join('');
}

function removeModel(model) {
    const index = selectedModelsList.indexOf(model);
    if (index > -1) {
        selectedModelsList.splice(index, 1);
    }
    renderSelectedModels();
    
    // Atualizar checkboxes
    if (typeof applicationsData !== 'undefined') {
        const searchTerm = document.getElementById('modelSearchInput')?.value.toLowerCase() || '';
        const filtered = applicationsData.filter(m => 
            m.toLowerCase().includes(searchTerm)
        );
        renderModelsList(filtered);
    }
}

function loadSelectedModels(models) {
    selectedModelsList = Array.isArray(models) ? [...models] : [];
    renderSelectedModels();
    if (typeof applicationsData !== 'undefined') {
        renderModelsList(applicationsData);
    }
}

function clearSelectedModels() {
    selectedModelsList = [];
    renderSelectedModels();
    if (typeof applicationsData !== 'undefined') {
        renderModelsList(applicationsData);
    }
}

function updateCompatibleModels() {
    // Função chamada quando ano é alterado (opcional para filtros futuros)
    initModelsSelector();
}

// ===== SECTION NAVIGATION =====
function setupSectionNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-section]');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetSection = item.dataset.section;
            if (!targetSection) return;
            
            // Remove active class from all nav items
            document.querySelectorAll('.nav-item').forEach(ni => ni.classList.remove('active'));
            item.classList.add('active');
            
            // Hide all sections
            const header = document.querySelector('.admin-header');
            const statsGrid = document.querySelector('.stats-grid');
            const filterBar = document.querySelector('.filter-bar');
            const productsContainer = document.querySelector('.products-container');
            const categoriesSection = document.getElementById('categories-section');
            const brandsSection = document.getElementById('brands-section');
            
            // Show the selected section
            if (targetSection === 'products') {
                header.classList.remove('hidden-section');
                statsGrid.classList.remove('hidden-section');
                filterBar.classList.remove('hidden-section');
                productsContainer.classList.remove('hidden-section');
                categoriesSection.classList.add('hidden-section');
                brandsSection.classList.add('hidden-section');
            } else if (targetSection === 'categories') {
                header.classList.add('hidden-section');
                statsGrid.classList.add('hidden-section');
                filterBar.classList.add('hidden-section');
                productsContainer.classList.add('hidden-section');
                categoriesSection.classList.remove('hidden-section');
                brandsSection.classList.add('hidden-section');
                if (typeof renderCategoriesView === 'function') {
                    renderCategoriesView();
                }
            } else if (targetSection === 'brands') {
                header.classList.add('hidden-section');
                statsGrid.classList.add('hidden-section');
                filterBar.classList.add('hidden-section');
                productsContainer.classList.add('hidden-section');
                categoriesSection.classList.add('hidden-section');
                brandsSection.classList.remove('hidden-section');
                if (typeof renderBrandsList === 'function') {
                    renderBrandsList();
                }
            }
        });
    });
}

// ===== CATEGORIES MANAGEMENT =====
const CUSTOM_CATEGORIES_KEY = 'motoparts_custom_categories';
const SUBCATEGORIES_MODIFICATIONS_KEY = 'motoparts_subcategories_modifications';

// Salvar modificações de subcategorias (para todas as categorias)
function saveSubcategoriesModifications() {
    const source = getCurrentSubcategories();
    const modifications = {};
    Object.entries(source).forEach(([key, data]) => {
        modifications[key] = {
            label: data.label,
            items: [...data.items] // Criar cópia do array
        };
    });
    console.log('Salvando modificações de subcategorias:', modifications);
    localStorage.setItem(SUBCATEGORIES_MODIFICATIONS_KEY, JSON.stringify(modifications));
    console.log('Modificações salvas com sucesso');
}

// Função para obter subcategorias com modificações aplicadas
function getSubcategoriesData() {
    // Começa com os dados padrões
    const merged = { ...subcategoriesData };
    
    // Aplicar modificações salvas (se existirem)
    const stored = localStorage.getItem(SUBCATEGORIES_MODIFICATIONS_KEY);
    if (stored) {
        try {
            const modifications = JSON.parse(stored);
            Object.entries(modifications).forEach(([key, data]) => {
                if (merged[key]) {
                    merged[key] = {
                        label: data.label,
                        items: [...data.items]
                    };
                }
            });
        } catch (e) {
            console.error('Erro ao obter modificações de subcategorias:', e);
        }
    }
    
    // Adicionar categorias customizadas
    const customCategories = getCustomCategories();
    if (customCategories && typeof customCategories === 'object') {
        Object.entries(customCategories).forEach(([key, data]) => {
            merged[key] = data;
        });
    }
    
    return merged;
}

// Helper para acessar o estado atual das subcategorias
function getCurrentSubcategories() {
    if (!currentSubcategoriesData) {
        currentSubcategoriesData = getSubcategoriesData();
    }
    return currentSubcategoriesData;
}

// Carregar modificações salvas de subcategorias
function loadSubcategoriesModifications() {
    // Atualizar variável global com dados atualizados
    currentSubcategoriesData = getSubcategoriesData();
    console.log('Subcategorias carregadas:', currentSubcategoriesData);
}

// Mescla categorias customizadas armazenadas no localStorage ao iniciar
function hydrateCustomCategories() {
    const stored = getCustomCategories();
    if (!stored || typeof stored !== 'object') return;

    currentSubcategoriesData = {
        ...getCurrentSubcategories(),
        ...stored
    };
}

function getCustomCategories() {
    const stored = localStorage.getItem(CUSTOM_CATEGORIES_KEY);
    return stored ? JSON.parse(stored) : {};
}

function saveCustomCategories(categories) {
    localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(categories));
}

function isCustomCategory(key) {
    return Object.keys(getCustomCategories()).includes(key);
}

function deleteCategory(key) {
    // Verificar se há produtos nesta categoria
    const productsCount = products.filter(p => p.category === key).length;
    if (productsCount > 0) {
        alert(`Não é possível deletar esta categoria. Existem ${productsCount} produtos cadastrados.`);
        return;
    }
    
    // Se for categoria customizada, remover do localStorage
    if (isCustomCategory(key)) {
        const customCategories = getCustomCategories();
        delete customCategories[key];
        saveCustomCategories(customCategories);
    }
    
    // Sempre remover do estado atual de subcategorias
    const currentSubs = getCurrentSubcategories();
    delete currentSubs[key];
    currentSubcategoriesData = currentSubs;
    saveSubcategoriesModifications();
    
    renderCategoriesView();
    populateFilters();
}

// Variável temporária para rastrear subcategorias sendo adicionadas
let pendingSubcategories = [];

function addPendingSubcategory() {
    const input = document.getElementById('newSubcategoryInput');
    if (!input) return;
    
    const subcategoryName = input.value.trim();
    if (!subcategoryName) {
        alert('Digite o nome da subcategoria');
        return;
    }
    
    if (pendingSubcategories.includes(subcategoryName)) {
        alert('Esta subcategoria já foi adicionada');
        return;
    }
    
    pendingSubcategories.push(subcategoryName);
    input.value = '';
    renderPendingSubcategories();
    input.focus();
}

function renderPendingSubcategories() {
    const container = document.getElementById('subcategoryList');
    if (!container) return;
    
    if (pendingSubcategories.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = '<div style="margin-top: 10px;"><strong>Subcategorias:</strong></div>' +
        '<div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">' +
        pendingSubcategories.map((sub, idx) => `
            <span style="background: #e8f5e9; padding: 6px 12px; border-radius: 4px; display: flex; align-items: center; gap: 8px;">
                ${sub}
                <button type="button" class="btn-remove-sub" data-index="${idx}" style="background: none; border: none; color: #d32f2f; cursor: pointer; padding: 0; font-size: 16px;">×</button>
            </span>
        `).join('') + '</div>';
    
    // Configurar remocão
    document.querySelectorAll('.btn-remove-sub').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            const idx = parseInt(btn.dataset.index);
            pendingSubcategories.splice(idx, 1);
            renderPendingSubcategories();
        };
    });
}

function addNewCategory(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('newCategoryInput');
    if (!input) return;
    
    const categoryName = input.value.trim();
    const categoryKey = categoryName.toLowerCase().replace(/\s+/g, '_');
    
    if (!categoryName) {
        alert('Digite o nome da categoria');
        return;
    }
    
    const currentSubs = getCurrentSubcategories();
    if (currentSubs[categoryKey]) {
        alert('Esta categoria já existe');
        input.value = '';
        return;
    }
    
    // Usar subcategorias adicionadas ou Genérico como padrão
    const subcategories = pendingSubcategories.length > 0 ? pendingSubcategories : ['Genérico'];
    
    // Adicionar categoria customizada
    const customCategories = getCustomCategories();
    customCategories[categoryKey] = {
        label: categoryName,
        items: subcategories
    };
    
    currentSubs[categoryKey] = customCategories[categoryKey];
    currentSubcategoriesData = currentSubs;
    saveCustomCategories(customCategories);
    saveSubcategoriesModifications();
    
    input.value = '';
    pendingSubcategories = [];
    renderPendingSubcategories();
    renderCategoriesView();
    populateFilters();
    showNotification('Categoria cadastrada com sucesso!', 'success');
}

let categoryFormSetup = false;

function setupCategoryForm() {
    if (categoryFormSetup) return;
    
    const form = document.getElementById('categoryForm');
    const clearBtn = document.getElementById('clearCategoryFormBtn');
    const refreshBtn = document.getElementById('refreshCategoriesBtn');
    const addSubcategoryBtn = document.getElementById('addSubcategoryBtn');
    const newSubcategoryInput = document.getElementById('newSubcategoryInput');

    if (form) {
        form.addEventListener('submit', addNewCategory);
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            form?.reset();
            pendingSubcategories = [];
            renderPendingSubcategories();
            const input = document.getElementById('newCategoryInput');
            if (input) input.focus();
        });
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            renderCategoriesView();
        });
    }

    if (addSubcategoryBtn) {
        addSubcategoryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addPendingSubcategory();
        });
    }

    if (newSubcategoryInput) {
        newSubcategoryInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addPendingSubcategory();
            }
        });
    }
    
    // Marcar como configurado
    categoryFormSetup = true;
}

function renderCategoriesView() {
    const container = document.getElementById('categoriesContainer');
    const currentSubs = getCurrentSubcategories();
    if (!container || !currentSubs) return;
    
    let totalCategories = 0;
    
    container.innerHTML = Object.entries(currentSubs).map(([key, data]) => {
        const itemCount = data.items ? data.items.length : 0;
        const productsCount = products.filter(p => p.category === key).length;
        totalCategories++;
        
        return `
            <tr data-category-key="${key}">
                <td class="category-name"><i class="fas fa-folder"></i> ${data.label}</td>
                <td><span class="count-badge">${itemCount}</span></td>
                <td><span class="count-badge">${productsCount}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit btn-edit-cat" title="Editar" type="button">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="action-btn delete btn-delete-cat" title="Deletar" ${productsCount > 0 ? 'disabled' : ''} type="button">
                            <i class="fas fa-trash"></i> Deletar
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    // Atualizar contador
    const totalDisplay = document.getElementById('totalCatsDisplay');
    if (totalDisplay) totalDisplay.textContent = totalCategories;
    
    setupCategoryButtons();
}

function setupCategoryButtons() {
    // Usa handlers diretos para evitar listeners duplicados
    document.querySelectorAll('.btn-edit-cat').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            const row = btn.closest('tr');
            const key = row?.dataset.categoryKey;
            const currentSubs = getCurrentSubcategories();
            if (!key || !currentSubs[key]) return alert('Categoria não encontrada');
            openEditCategoryModal(key, currentSubs[key].label);
        };
    });
    document.querySelectorAll('.btn-delete-cat').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            const row = btn.closest('tr');
            const key = row?.dataset.categoryKey;
            const currentSubs = getCurrentSubcategories();
            if (!key || !currentSubs[key]) return alert('Categoria não encontrada');
            confirmDeleteCategory(key);
        };
    });
}

// Variável temporária para rastrear subcategorias de edição
let editingSubcategories = [];

function openEditCategoryModal(key, currentLabel) {
    const modal = document.getElementById('editCategoryModal');
    const input = document.getElementById('editCategoryName');
    const hiddenKey = document.getElementById('editCategoryKey');
    
    if (!modal || !input) return;
    
    input.value = currentLabel;
    hiddenKey.value = key;
    
    // Carregar subcategorias existentes
    const currentSubs = getCurrentSubcategories();
    editingSubcategories = [...(currentSubs[key]?.items || ['Genérico'])];
    renderEditingSubcategories();
    
    modal.classList.remove('hidden-section');
    modal.style.display = 'flex';
    input.focus();
    input.select();
}

function renderEditingSubcategories() {
    const container = document.getElementById('editSubcategoryList');
    if (!container) return;
    
    if (editingSubcategories.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = '<div style="margin-top: 10px;"><strong>Subcategorias:</strong></div>' +
        '<div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">' +
        editingSubcategories.map((sub, idx) => `
            <span style="background: #e8f5e9; padding: 6px 12px; border-radius: 4px; display: flex; align-items: center; gap: 8px;">
                ${sub}
                <button type="button" class="btn-remove-edit-sub" data-index="${idx}" style="background: none; border: none; color: #d32f2f; cursor: pointer; padding: 0; font-size: 16px;">×</button>
            </span>
        `).join('') + '</div>';
    
    // Configurar remocão
    document.querySelectorAll('.btn-remove-edit-sub').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            const idx = parseInt(btn.dataset.index);
            editingSubcategories.splice(idx, 1);
            renderEditingSubcategories();
        };
    });
}

function addEditPendingSubcategory() {
    const input = document.getElementById('editSubcategoryInput');
    if (!input) return;
    
    const subcategoryName = input.value.trim();
    if (!subcategoryName) {
        alert('Digite o nome da subcategoria');
        return;
    }
    
    if (editingSubcategories.includes(subcategoryName)) {
        alert('Esta subcategoria já foi adicionada');
        return;
    }
    
    editingSubcategories.push(subcategoryName);
    input.value = '';
    renderEditingSubcategories();
    input.focus();
}

// Variável para rastrear se o form já foi configurado
let editCategoryFormSetup = false;

function setupEditCategoryForm() {
    // Só configurar uma vez para evitar listeners duplicados
    if (editCategoryFormSetup) return;
    
    const form = document.getElementById('editCategoryForm');
    if (!form) return;
    
    const addSubcategoryBtn = document.getElementById('editAddSubcategoryBtn');
    const editSubcategoryInput = document.getElementById('editSubcategoryInput');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const key = document.getElementById('editCategoryKey').value;
        const newLabel = document.getElementById('editCategoryName').value.trim();
        const modal = document.getElementById('editCategoryModal');
        
        if (!newLabel) {
            alert('Digite um nome válido');
            return;
        }
        
        // Verificar se há subcategorias válidas
        if (editingSubcategories.length === 0) {
            alert('Adicione pelo menos uma subcategoria');
            return;
        }
        
        // Verificar se já existe categoria com este nome
        const currentSubs = getCurrentSubcategories();
        const exists = Object.values(currentSubs).some(cat => 
            cat.label.toLowerCase() === newLabel.toLowerCase() && 
            cat.label !== currentSubs[key].label
        );
        
        if (exists) {
            alert('Uma categoria com este nome já existe');
            return;
        }
        
        if (currentSubs[key]) {
            currentSubs[key].label = newLabel;
            currentSubs[key].items = editingSubcategories;
            currentSubcategoriesData = currentSubs;
            
            if (isCustomCategory(key)) {
                const customCategories = getCustomCategories();
                if (customCategories[key]) {
                    customCategories[key].label = newLabel;
                    customCategories[key].items = editingSubcategories;
                    saveCustomCategories(customCategories);
                }
            }
            
            // Salvar todas as modificações de subcategorias
            saveSubcategoriesModifications();
        }
        
        saveProducts(products);
        renderCategoriesView();
        populateFilters();
        modal.classList.add('hidden-section');
        modal.style.display = 'none';
        editingSubcategories = [];
        showNotification('Categoria atualizada com sucesso!', 'success');
    });
    
    if (addSubcategoryBtn) {
        addSubcategoryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addEditPendingSubcategory();
        });
    }

    if (editSubcategoryInput) {
        editSubcategoryInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addEditPendingSubcategory();
            }
        });
    }
    
    // Marcar como configurado
    editCategoryFormSetup = true;
}

function confirmDeleteCategory(key) {
    const categoryData = getCurrentSubcategories()[key];
    if (!categoryData) {
        alert('Categoria não encontrada');
        return;
    }
    
    const productsCount = products.filter(p => p.category === key).length;
    
    if (productsCount > 0) {
        alert(`Não é possível deletar "${categoryData.label}". Existem ${productsCount} produtos cadastrados nesta categoria.`);
        return;
    }
    
    if (confirm(`Tem certeza que deseja deletar a categoria "${categoryData.label}"?`)) {
        deleteCategory(key);
    }
}

// Initialize app
// ===== BRANDS MANAGEMENT =====
const BRANDS_STORAGE_KEY = 'motoparts_custom_brands';
const REMOVED_BRANDS_KEY = 'motoparts_removed_brands';

function getCustomBrands() {
    const stored = localStorage.getItem(BRANDS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveCustomBrands(brands) {
    localStorage.setItem(BRANDS_STORAGE_KEY, JSON.stringify(brands));
}

function getRemovedBrands() {
    const stored = localStorage.getItem(REMOVED_BRANDS_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveRemovedBrands(list) {
    localStorage.setItem(REMOVED_BRANDS_KEY, JSON.stringify(list));
}

function getAllBrands() {
    // Combinação de marcas padrão (do product-data.js) + marcas customizadas
    const standardBrands = [
        'cpl', 'cobreq', 'ngk', 'bosch', 'brembo', 'fram', 'michelin', 'pirelli', 
        'continental', 'bridgestone', 'goodyear', 'dunlop', 'radiator', 'yuasa', 
        'ac delco', 'iridium', 'motorcraft', 'magnum', 'carburador', 'óleo', 
        'graxa', 'grease', 'filter', 'spark plug', 'oil filter', 'air filter'
    ];
    const customBrands = getCustomBrands();
    const removed = getRemovedBrands();
    const allBrands = [...new Set([...standardBrands, ...customBrands])]
        .filter(b => !removed.includes(b));
    return allBrands.sort();
}

function renderBrandsList() {
    const container = document.getElementById('brandsList');
    if (!container) return;
    
    const allBrands = getAllBrands();
    
    container.innerHTML = allBrands.map(brand => {
        const productsCount = products.filter(p => p.brand.toLowerCase() === brand.toLowerCase()).length;
        
        return `
            <tr data-brand-name="${brand}">
                <td class="brand-name"><i class="fas fa-tag"></i> ${brand}</td>
                <td><span class="count-badge">${productsCount}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit btn-edit-brand" title="Editar" type="button">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="action-btn delete btn-delete-brand" title="Deletar" ${productsCount > 0 ? 'disabled' : ''} type="button">
                            <i class="fas fa-trash"></i> Deletar
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    // Atualizar contador
    const totalDisplay = document.getElementById('totalBrandsDisplay');
    if (totalDisplay) totalDisplay.textContent = allBrands.length;
    
    setupBrandSearch();
    setupBrandButtons();
}

function setupBrandButtons() {
    document.querySelectorAll('.btn-edit-brand').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            const row = btn.closest('tr');
            const brand = row?.dataset.brandName;
            if (!brand) return alert('Marca não encontrada');
            openEditBrandModal(brand);
        };
    });
    document.querySelectorAll('.btn-delete-brand').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            const row = btn.closest('tr');
            const brand = row?.dataset.brandName;
            if (!brand) return alert('Marca não encontrada');
            confirmDeleteBrand(brand);
        };
    });
}

function openEditBrandModal(brand) {
    const modal = document.getElementById('editBrandModal');
    const input = document.getElementById('editBrandName');
    const hiddenBrand = document.getElementById('editBrandOldName');
    if (!modal || !input || !hiddenBrand) return;
    input.value = brand;
    hiddenBrand.value = brand;
    modal.style.display = 'flex';
    input.focus();
    input.select();
}

function addNewBrand() {
    const input = document.getElementById('newBrandInput');
    if (!input) return;
    
    const brandName = input.value.trim().toLowerCase();
    
    if (!brandName) {
        alert('Digite o nome da marca');
        return;
    }
    
    if (getAllBrands().includes(brandName)) {
        alert('Esta marca já existe');
        input.value = '';
        return;
    }
    
    const customBrands = getCustomBrands();
    customBrands.push(brandName);
    saveCustomBrands(customBrands);
    
    input.value = '';
    renderBrandsList();
    
    // Atualizar dropdown de marcas no formulário
    populateFilters();
}

let editBrandFormSetup = false;

function setupEditBrandForm() {
    if (editBrandFormSetup) return;
    
    const form = document.getElementById('editBrandForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const oldBrand = document.getElementById('editBrandOldName').value;
        const newBrand = document.getElementById('editBrandName').value.trim().toLowerCase();
        const modal = document.getElementById('editBrandModal');
        
        if (!newBrand) {
            alert('Digite um nome válido');
            return;
        }
        
        if (newBrand === oldBrand.toLowerCase()) {
            modal.style.display = 'none';
            return;
        }
        
        if (getAllBrands().includes(newBrand) && newBrand !== oldBrand.toLowerCase()) {
            alert('Esta marca já existe');
            return;
        }
        
        // Atualizar marca nos produtos
        products.forEach(p => {
            if (p.brand.toLowerCase() === oldBrand.toLowerCase()) {
                p.brand = newBrand;
            }
        });
        
        // Atualizar na lista customizada
        const customBrands = getCustomBrands();
        const index = customBrands.indexOf(oldBrand);
        if (index > -1) {
            customBrands[index] = newBrand;
            saveCustomBrands(customBrands);
        }
        
        saveProducts(products);
        renderBrandsList();
        populateFilters();
        modal.style.display = 'none';
        alert('Marca atualizada com sucesso!');
    });
    
    editBrandFormSetup = true;
}

function editBrand(brand) {
    const newBrand = prompt(`Editar marca:\nNome atual: ${brand}\n\nNovo nome:`, brand);
    if (!newBrand || newBrand === brand) return;
    
    const newBrandLower = newBrand.trim().toLowerCase();
    
    if (!newBrandLower) {
        alert('Digite um nome válido');
        return;
    }
    
    if (getAllBrands().includes(newBrandLower) && newBrandLower !== brand.toLowerCase()) {
        alert('Esta marca já existe');
        return;
    }
    
    // Atualizar marca nos produtos
    products.forEach(p => {
        if (p.brand.toLowerCase() === brand.toLowerCase()) {
            p.brand = newBrandLower;
        }
    });
    
    // Atualizar na lista customizada (se for customizada)
    const customBrands = getCustomBrands();
    const index = customBrands.indexOf(brand);
    if (index > -1) {
        customBrands[index] = newBrandLower;
        saveCustomBrands(customBrands);
    }
    
    saveProducts(products);
    renderBrandsList();
    populateFilters();
}

function removeBrand(brand) {
    // Se for customizada, remove do custom; senão, adiciona à lista de removidas
    const customBrands = getCustomBrands();
    const idx = customBrands.indexOf(brand);
    if (idx > -1) {
        customBrands.splice(idx, 1);
        saveCustomBrands(customBrands);
    } else {
        const removed = getRemovedBrands();
        if (!removed.includes(brand)) {
            removed.push(brand);
            saveRemovedBrands(removed);
        }
    }

    renderBrandsList();
    populateFilters();
}

function confirmDeleteBrand(brand) {
    const productsCount = products.filter(p => p.brand.toLowerCase() === brand.toLowerCase()).length;
    
    if (productsCount > 0) {
        alert(`Não é possível remover "${brand}". Existem ${productsCount} produtos cadastrados com esta marca.`);
        return;
    }
    
    if (confirm(`Tem certeza que deseja deletar a marca "${brand}"?`)) {
        removeBrand(brand);
    }
}

function setupBrandSearch() {
    const searchInput = document.getElementById('brandSearchInput');
    const brandsList = document.getElementById('brandsList');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('keyup', function() {
        const searchTerm = this.value.toLowerCase().trim();
        const rows = brandsList.querySelectorAll('tr');
        
        rows.forEach(row => {
            const brandName = row.querySelector('.brand-name');
            if (brandName) {
                const text = brandName.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            }
        });
    });
}

// ==================== SUBCATEGORY SPECIFIC FIELDS ====================

// Função para atualizar campos específicos da subcategoria
function updateSubcategoryFields() {
    const subcategorySelect = document.getElementById('productSubcategory');
    const container = document.getElementById('subcategorySpecificFields');
    
    if (!subcategorySelect || !container) return;
    
    const selectedSubcategory = subcategorySelect.value;
    
    // Limpar container
    container.innerHTML = '';
    
    // Se não houver subcategoria selecionada, não mostrar nada
    if (!selectedSubcategory) {
        container.style.display = 'none';
        return;
    }
    
    // Verificar se existe configuração para essa subcategoria
    // Se subcategorySpecificFields não está definido, significa que o arquivo não foi carregado
    if (typeof subcategorySpecificFields === 'undefined' || !subcategorySpecificFields[selectedSubcategory]) {
        container.style.display = 'none';
        return;
    }
    
    const config = subcategorySpecificFields[selectedSubcategory];
    container.style.display = 'block';
    
    // Criar título
    const title = document.createElement('h4');
    title.innerHTML = '<i class="fas fa-cog"></i> Especificações Técnicas - ' + selectedSubcategory;
    container.appendChild(title);
    
    // Criar grid de campos
    const grid = document.createElement('div');
    grid.className = 'subcategory-fields-grid';
    
    config.fields.forEach(field => {
        const fieldGroup = document.createElement('div');
        fieldGroup.className = 'specific-field-group';
        
        const label = document.createElement('label');
        label.textContent = field.label;
        label.setAttribute('for', 'specific_' + field.name);
        fieldGroup.appendChild(label);
        
        const wrapper = document.createElement('div');
        wrapper.className = 'specific-field-wrapper';
        
        let input;
        if (field.type === 'select') {
            input = document.createElement('select');
            input.id = 'specific_' + field.name;
            input.name = field.name;
            input.className = 'specific-field';
            
            // Adicionar opção vazia
            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.textContent = 'Selecione...';
            input.appendChild(emptyOption);
            
            // Adicionar opções
            field.options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt;
                option.textContent = opt;
                input.appendChild(option);
            });
        } else {
            input = document.createElement('input');
            input.type = 'text';
            input.id = 'specific_' + field.name;
            input.name = field.name;
            input.className = 'specific-field';
            input.placeholder = field.placeholder || '';
        }
        
        wrapper.appendChild(input);
        
        // Adicionar unidade se houver
        if (field.unit) {
            const unit = document.createElement('span');
            unit.className = 'specific-field-unit';
            unit.textContent = field.unit;
            wrapper.appendChild(unit);
        }
        
        fieldGroup.appendChild(wrapper);
        grid.appendChild(fieldGroup);
    });
    
    container.appendChild(grid);
}

// Função para coletar dados dos campos específicos
function getSubcategorySpecificData() {
    const subcategorySelect = document.getElementById('productSubcategory');
    if (!subcategorySelect) return null;
    
    const selectedSubcategory = subcategorySelect.value;
    if (!selectedSubcategory) return null;
    
    // Se subcategorySpecificFields não está definido, retornar null
    if (typeof subcategorySpecificFields === 'undefined' || !subcategorySpecificFields[selectedSubcategory]) {
        return null;
    }
    
    const specificData = {};
    const config = subcategorySpecificFields[selectedSubcategory];
    
    config.fields.forEach(field => {
        const input = document.getElementById('specific_' + field.name);
        if (input && input.value) {
            specificData[field.name] = input.value;
        }
    });
    
    return Object.keys(specificData).length > 0 ? specificData : null;
}

// Função para preencher campos específicos ao editar
function loadSubcategorySpecificData(specificData) {
    if (!specificData) return;
    
    Object.keys(specificData).forEach(fieldName => {
        const input = document.getElementById('specific_' + fieldName);
        if (input) {
            input.value = specificData[fieldName];
        }
    });
}

// Função para limpar campos específicos
function clearSubcategorySpecificFields() {
    const container = document.getElementById('subcategorySpecificFields');
    if (container) {
        container.innerHTML = '';
        container.style.display = 'none';
    }
}

// ==================== END SUBCATEGORY SPECIFIC FIELDS ====================

// Initialize app on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!isInitialized) {
            init().then(() => {
                setupSectionNavigation();
                setupCategoryForm();
                renderBrandsList();
                setupEditCategoryForm();
                setupEditBrandForm();
                isInitialized = true;
            });
        }
    });
} else {
    if (!isInitialized) {
        init().then(() => {
            setupSectionNavigation();
            setupCategoryForm();
            renderBrandsList();
            setupEditCategoryForm();
            setupEditBrandForm();
            isInitialized = true;
        });
    }
}
 
