// SCRIPT DE MIGRAÇÃO - Carrega produtos do localStorage/IndexedDB
(function() {
    console.log('🔄 Iniciando carregamento de produtos salvos...');
    
    // Tentar carregar do localStorage primeiro
    const storedProducts = localStorage.getItem('motoparts_products');
    
    if (storedProducts) {
        try {
            const parsedProducts = JSON.parse(storedProducts);
            console.log(`✅ Encontrados ${parsedProducts.length} produtos no localStorage`);
            
            // Atualizar a variável global products
            if (typeof products !== 'undefined') {
                products = parsedProducts;
                filteredProducts = [...products];
                console.log('✅ Produtos carregados com sucesso!');
            }
        } catch (e) {
            console.error('❌ Erro ao parsear produtos:', e);
        }
    } else {
        console.log('⚠️ Nenhum produto encontrado no localStorage');
    }
    
    // Tentar carregar do IndexedDB
    if (typeof indexedDB !== 'undefined') {
        const request = indexedDB.open('MotoPartsDB', 1);
        
        request.onsuccess = function(event) {
            const db = event.target.result;
            
            if (db.objectStoreNames.contains('products')) {
                const transaction = db.transaction(['products'], 'readonly');
                const objectStore = transaction.objectStore('products');
                const getAllRequest = objectStore.getAll();
                
                getAllRequest.onsuccess = function() {
                    const dbProducts = getAllRequest.result;
                    if (dbProducts && dbProducts.length > 0) {
                        console.log(`✅ Encontrados ${dbProducts.length} produtos no IndexedDB`);
                        
                        if (typeof products !== 'undefined') {
                            products = dbProducts;
                            filteredProducts = [...products];
                            
                            // Re-renderizar os produtos
                            if (typeof filterProductsEnhanced === 'function') {
                                filterProductsEnhanced();
                            }
                            
                            console.log('✅ Produtos do IndexedDB carregados!');
                        }
                    } else {
                        console.log('⚠️ IndexedDB vazio');
                    }
                };
                
                getAllRequest.onerror = function() {
                    console.error('❌ Erro ao carregar produtos do IndexedDB');
                };
            }
        };
        
        request.onerror = function() {
            console.log('⚠️ Não foi possível abrir o IndexedDB');
        };
    }
})();
