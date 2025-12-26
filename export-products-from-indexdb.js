/**
 * SCRIPT DE EXPORTAÇÃO DE PRODUTOS DO INDEXEDDB
 * Execute este script no console do navegador para exportar todos os produtos
 * Cole o resultado no arquivo product-data.js
 */

function exportProductsFromIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('MotoPartsDB', 1);
        
        request.onerror = () => {
            console.error('❌ Erro ao abrir IndexedDB');
            reject('Não foi possível abrir o IndexedDB');
        };
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            
            // Verificar se a store de produtos existe
            if (!db.objectStoreNames.contains('products')) {
                console.warn('⚠️ Store "products" não encontrada');
                resolve([]);
                return;
            }
            
            const transaction = db.transaction(['products'], 'readonly');
            const objectStore = transaction.objectStore('products');
            const getAllRequest = objectStore.getAll();
            
            getAllRequest.onerror = () => {
                console.error('❌ Erro ao recuperar produtos');
                reject('Erro ao recuperar produtos do IndexedDB');
            };
            
            getAllRequest.onsuccess = () => {
                const products = getAllRequest.result;
                console.log(`✅ ${products.length} produtos recuperados do IndexedDB`);
                
                // Exibir no console para cópia manual
                console.log('\n=== PRODUTOS EXPORTADOS ===\n');
                console.log(JSON.stringify(products, null, 2));
                console.log('\n=== FIM DA EXPORTAÇÃO ===\n');
                
                resolve(products);
            };
        };
    });
}

// Executar exportação
console.log('🔄 Iniciando exportação de produtos do IndexedDB...\n');
exportProductsFromIndexedDB().then(products => {
    if (products.length > 0) {
        console.log(`\n✅ Exportação concluída! ${products.length} produtos prontos para cópia.\n`);
        console.log('📋 INSTRUÇÕES:');
        console.log('1. Copie o JSON acima (entre os === PRODUTOS EXPORTADOS ===)');
        console.log('2. Abra o arquivo product-data.js');
        console.log('3. Substitua a array "defaultProducts" pelo JSON copiado');
        console.log('4. Salve o arquivo\n');
        
        // Também retornar os produtos para facilitar a cópia
        return products;
    } else {
        console.log('⚠️ Nenhum produto encontrado no IndexedDB');
    }
}).catch(error => {
    console.error('❌ Erro na exportação:', error);
});
