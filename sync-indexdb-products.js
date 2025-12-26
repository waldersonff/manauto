/**
 * MÓDULO DE SINCRONIZAÇÃO - INDEXDB PARA PRODUTO-DATA.JS
 * Carrega produtos do IndexedDB e os sincroniza com o sistema principal
 * Deve ser incluído no index.html antes de script.js
 */

class IndexDBProductSync {
    constructor() {
        this.dbName = 'MotoPartsDB';
        this.storeName = 'products';
        this.db = null;
    }

    /**
     * Abre a conexão com o IndexedDB
     */
    openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onerror = () => {
                console.warn('⚠️ IndexedDB não disponível, usando dados padrão');
                reject('IndexedDB indisponível');
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('✅ Conexão com IndexedDB estabelecida');
                resolve(this.db);
            };
        });
    }

    /**
     * Recupera todos os produtos do IndexedDB
     */
    getAllProducts() {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject('IndexedDB não inicializado');
                return;
            }

            const transaction = this.db.transaction([this.storeName], 'readonly');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.getAll();

            request.onerror = () => {
                console.warn('⚠️ Erro ao recuperar produtos do IndexedDB');
                reject('Erro ao recuperar produtos');
            };

            request.onsuccess = () => {
                const products = request.result;
                console.log(`📦 ${products.length} produtos recuperados do IndexedDB`);
                resolve(products);
            };
        });
    }

    /**
     * Salva um novo produto no IndexedDB
     */
    saveProduct(product) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject('IndexedDB não inicializado');
                return;
            }

            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.add(product);

            request.onerror = () => reject('Erro ao salvar produto');
            request.onsuccess = () => {
                console.log(`✅ Produto salvo: ${product.name}`);
                resolve(request.result);
            };
        });
    }

    /**
     * Atualiza um produto existente
     */
    updateProduct(product) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject('IndexedDB não inicializado');
                return;
            }

            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.put(product);

            request.onerror = () => reject('Erro ao atualizar produto');
            request.onsuccess = () => {
                console.log(`✅ Produto atualizado: ${product.name}`);
                resolve(request.result);
            };
        });
    }

    /**
     * Sincroniza produtos do IndexedDB com o array global
     */
    async syncProductsToGlobal() {
        try {
            await this.openDB();
            const dbProducts = await this.getAllProducts();

            if (dbProducts.length > 0) {
                // Atualizar array global de produtos
                if (typeof products !== 'undefined') {
                    products = dbProducts;
                    filteredProducts = [...products];
                    console.log(`🔄 ${dbProducts.length} produtos sincronizados ao sistema`);
                    
                    // Re-renderizar se a função existir
                    if (typeof renderProducts === 'function') {
                        renderProducts();
                    }
                    
                    return dbProducts;
                }
            }

            return [];
        } catch (error) {
            console.warn('⚠️ Não foi possível sincronizar IndexedDB, usando dados padrão');
            return [];
        }
    }

    /**
     * Exporta todos os produtos em formato JSON
     */
    async exportAsJSON() {
        try {
            const products = await this.getAllProducts();
            return JSON.stringify(products, null, 2);
        } catch (error) {
            console.error('❌ Erro ao exportar produtos:', error);
            return null;
        }
    }

    /**
     * Copia os produtos para a área de transferência
     */
    async copyToClipboard() {
        try {
            const json = await this.exportAsJSON();
            if (json) {
                await navigator.clipboard.writeText(json);
                console.log('✅ Produtos copiados para área de transferência');
                return true;
            }
        } catch (error) {
            console.error('❌ Erro ao copiar:', error);
            return false;
        }
    }

    /**
     * Sincroniza produtos salvos no localStorage com o sistema
     */
    syncLocalStorage() {
        const storedProducts = localStorage.getItem('motoparts_products');
        if (storedProducts) {
            try {
                const products = JSON.parse(storedProducts);
                console.log(`📦 ${products.length} produtos carregados do localStorage`);
                return products;
            } catch (error) {
                console.error('❌ Erro ao parsear localStorage:', error);
                return null;
            }
        }
        return null;
    }

    /**
     * Sincroniza dados de ambas as fontes (localStorage + IndexedDB)
     */
    async syncAllSources() {
        try {
            // Tentar carregar do IndexedDB primeiro
            await this.openDB();
            const dbProducts = await this.getAllProducts();

            if (dbProducts.length > 0) {
                console.log(`✅ Usando ${dbProducts.length} produtos do IndexedDB`);
                return dbProducts;
            }

            // Fallback para localStorage
            const lsProducts = this.syncLocalStorage();
            if (lsProducts) {
                console.log(`✅ Usando ${lsProducts.length} produtos do localStorage`);
                return lsProducts;
            }

            console.log('⚠️ Nenhum produto persistido encontrado');
            return [];
        } catch (error) {
            console.warn('⚠️ Erro ao sincronizar fontes:', error);
            return [];
        }
    }
}

// Instância global
const indexDBSync = new IndexDBProductSync();

// Auto-sincronização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔄 Iniciando sincronização de produtos...');
    
    const syncedProducts = await indexDBSync.syncAllSources();
    
    if (syncedProducts.length > 0 && typeof products !== 'undefined') {
        // Usar produtos sincronizados
        products = syncedProducts;
        filteredProducts = [...products];
        
        if (typeof renderProducts === 'function') {
            renderProducts();
            console.log('✅ Produtos sincronizados e renderizados com sucesso!');
        }
    }
});

// Expor funções globais para debug e administração
window.IndexDBSync = {
    // Método para sincronizar manualmente
    sync: async () => await indexDBSync.syncAllSources(),

    // Exportar dados
    export: async () => await indexDBSync.exportAsJSON(),

    // Copiar para área de transferência
    copyProducts: async () => await indexDBSync.copyToClipboard(),

    // Ver produtos em IndexedDB
    view: async () => {
        const products = await indexDBSync.getAllProducts();
        console.table(products);
        return products;
    },

    // Limpar IndexedDB
    clear: async () => {
        try {
            if (!indexDBSync.db) {
                await indexDBSync.openDB();
            }

            const transaction = indexDBSync.db.transaction([indexDBSync.storeName], 'readwrite');
            const objectStore = transaction.objectStore(indexDBSync.storeName);
            const clearRequest = objectStore.clear();

            clearRequest.onsuccess = () => {
                console.log('🗑️ IndexedDB limpo com sucesso');
            };

            clearRequest.onerror = () => {
                console.error('❌ Erro ao limpar IndexedDB');
            };
        } catch (error) {
            console.error('❌ Erro:', error);
        }
    },

    // Importar produtos JSON
    import: async (jsonString) => {
        try {
            const products = JSON.parse(jsonString);
            
            if (!Array.isArray(products)) {
                console.error('❌ JSON inválido. Esperado um array de produtos');
                return false;
            }

            // Limpar e recarregar
            await IndexDBSync.clear();

            // Salvar cada produto
            for (const product of products) {
                await indexDBSync.saveProduct(product);
            }

            console.log(`✅ ${products.length} produtos importados com sucesso!`);
            return true;
        } catch (error) {
            console.error('❌ Erro ao importar:', error);
            return false;
        }
    }
};

console.log('✅ Módulo de Sincronização IndexedDB carregado');
console.log('📝 Use "window.IndexDBSync.view()" para visualizar produtos');
console.log('📋 Use "window.IndexDBSync.export()" para exportar em JSON');
console.log('📥 Use "window.IndexDBSync.import(jsonString)" para importar');
