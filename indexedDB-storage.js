// ===== INDEXEDDB STORAGE - Suporta milhares de produtos com imagens =====

const DB_NAME = 'MotoPartsDB';
const DB_VERSION = 1;
const STORE_NAME = 'products';

let db = null;

// Inicializar banco de dados
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => {
            console.error('Erro ao abrir IndexedDB:', request.error);
            reject(request.error);
        };
        
        request.onsuccess = () => {
            db = request.result;
            console.log('IndexedDB inicializado com sucesso');
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            db = event.target.result;
            
            // Criar object store se não existir
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: false });
                objectStore.createIndex('name', 'name', { unique: false });
                objectStore.createIndex('category', 'category', { unique: false });
                objectStore.createIndex('brand', 'brand', { unique: false });
                objectStore.createIndex('status', 'status', { unique: false });
                console.log('Object store criado');
            }
        };
    });
}

// Salvar todos os produtos (substitui todos)
function saveAllProductsToDB(products) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database não inicializado'));
            return;
        }
        
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        
        // Limpar store
        const clearRequest = objectStore.clear();
        
        clearRequest.onsuccess = () => {
            // Adicionar todos os produtos
            let completed = 0;
            const total = products.length;
            
            if (total === 0) {
                resolve([]);
                return;
            }
            
            products.forEach(product => {
                const addRequest = objectStore.add(product);
                
                addRequest.onsuccess = () => {
                    completed++;
                    if (completed === total) {
                        console.log(`✓ ${total} produtos salvos no IndexedDB`);
                        resolve(products);
                    }
                };
                
                addRequest.onerror = () => {
                    console.error('Erro ao adicionar produto:', product.id, addRequest.error);
                };
            });
        };
        
        clearRequest.onerror = () => {
            reject(clearRequest.error);
        };
        
        transaction.onerror = () => {
            reject(transaction.error);
        };
    });
}

// Carregar todos os produtos
function loadAllProductsFromDB() {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database não inicializado'));
            return;
        }
        
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.getAll();
        
        request.onsuccess = () => {
            const products = request.result || [];
            console.log(`✓ ${products.length} produtos carregados do IndexedDB`);
            resolve(products);
        };
        
        request.onerror = () => {
            console.error('Erro ao carregar produtos:', request.error);
            reject(request.error);
        };
    });
}

// Adicionar um produto
function addProductToDB(product) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database não inicializado'));
            return;
        }
        
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.add(product);
        
        request.onsuccess = () => {
            resolve(product);
        };
        
        request.onerror = () => {
            reject(request.error);
        };
    });
}

// Atualizar um produto
function updateProductInDB(product) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database não inicializado'));
            return;
        }
        
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.put(product);
        
        request.onsuccess = () => {
            resolve(product);
        };
        
        request.onerror = () => {
            reject(request.error);
        };
    });
}

// Deletar um produto
function deleteProductFromDB(productId) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database não inicializado'));
            return;
        }
        
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.delete(productId);
        
        request.onsuccess = () => {
            resolve(productId);
        };
        
        request.onerror = () => {
            reject(request.error);
        };
    });
}

// Migrar dados do localStorage para IndexedDB
async function migrateFromLocalStorage() {
    const STORAGE_KEY = 'motoparts_products';
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (stored) {
        try {
            const products = JSON.parse(stored);
            console.log(`Migrando ${products.length} produtos do localStorage para IndexedDB...`);
            await saveAllProductsToDB(products);
            console.log('✓ Migração concluída com sucesso!');
            // Manter localStorage como backup por enquanto
            return products;
        } catch (e) {
            console.error('Erro na migração:', e);
            return [];
        }
    }
    return null;
}

// Verificar uso de espaço
async function getStorageInfo() {
    if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        const usedMB = (estimate.usage / (1024 * 1024)).toFixed(2);
        const quotaMB = (estimate.quota / (1024 * 1024)).toFixed(2);
        const percentUsed = ((estimate.usage / estimate.quota) * 100).toFixed(1);
        
        console.log(`📊 Armazenamento: ${usedMB}MB / ${quotaMB}MB (${percentUsed}%)`);
        return { usedMB, quotaMB, percentUsed, usage: estimate.usage, quota: estimate.quota };
    }
    return null;
}

// Exportar funções
window.initDB = initDB;
window.saveAllProductsToDB = saveAllProductsToDB;
window.loadAllProductsFromDB = loadAllProductsFromDB;
window.addProductToDB = addProductToDB;
window.updateProductInDB = updateProductInDB;
window.deleteProductFromDB = deleteProductFromDB;
window.migrateFromLocalStorage = migrateFromLocalStorage;
window.getStorageInfo = getStorageInfo;
