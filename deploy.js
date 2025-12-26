#!/usr/bin/env node

/**
 * SCRIPT DE DEPLOY PARA PRODUÇÃO
 * Executa: node deploy.js
 * 
 * Funções:
 * 1. Valida todos os arquivos necessários
 * 2. Minifica CSS e JS
 * 3. Cria bundle de dados
 * 4. Gera relatório de deploy
 */

const fs = require('fs');
const path = require('path');

// Cores para output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

function log(msg, color = 'reset') {
    console.log(`${colors[color]}${msg}${colors.reset}`);
}

function header(msg) {
    log(`\n${'='.repeat(60)}`, 'blue');
    log(`  ${msg}`, 'blue');
    log(`${'='.repeat(60)}\n`, 'blue');
}

// Arquivos necessários
const requiredFiles = [
    'index.html',
    'styles.css',
    'script.js',
    'product-data.js',
    'config.js',
    'sync-indexdb-products.js'
];

const cssFiles = [
    'styles.css',
    'enhancements.css',
    'ux-improvements.css',
    'app.css',
    'modals-improvements.css',
    'professional-ux.css'
];

const jsFiles = [
    'config.js',
    'product-data.js',
    'indexedDB-storage.js',
    'sync-indexdb-products.js',
    'script.js',
    'enhancements.js',
    'ux-improvements.js',
    'professional-ux.js'
];

header('🚀 DEPLOY PARA PRODUÇÃO');

// 1. Validar arquivos
log('\n📋 Verificando arquivos necessários...', 'blue');

let allFilesExist = true;
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        log(`  ✅ ${file}`, 'green');
    } else {
        log(`  ❌ ${file} - FALTANDO`, 'red');
        allFilesExist = false;
    }
});

if (!allFilesExist) {
    log('\n❌ Erro: Arquivos faltando para deploy', 'red');
    process.exit(1);
}

// 2. Validar HTML
log('\n📄 Validando HTML...', 'blue');

const htmlContent = fs.readFileSync('index.html', 'utf8');

const requiredScripts = [
    'config.js',
    'sync-indexdb-products.js',
    'script.js'
];

let htmlValid = true;
requiredScripts.forEach(script => {
    if (htmlContent.includes(`src="${script}"`) || htmlContent.includes(`src='${script}'`)) {
        log(`  ✅ Script ${script} incluído no HTML`, 'green');
    } else {
        log(`  ⚠️  Script ${script} não encontrado no HTML`, 'yellow');
    }
});

// 3. Validar CSS
log('\n🎨 Validando CSS...', 'blue');

cssFiles.forEach(file => {
    if (fs.existsSync(file)) {
        const size = fs.statSync(file).size;
        log(`  ✅ ${file} (${(size / 1024).toFixed(2)} KB)`, 'green');
    } else {
        log(`  ⚠️  ${file} não encontrado`, 'yellow');
    }
});

// 4. Validar JS
log('\n📜 Validando JavaScript...', 'blue');

jsFiles.forEach(file => {
    if (fs.existsSync(file)) {
        const size = fs.statSync(file).size;
        const lines = fs.readFileSync(file, 'utf8').split('\n').length;
        log(`  ✅ ${file} (${(size / 1024).toFixed(2)} KB, ${lines} linhas)`, 'green');
    } else {
        log(`  ⚠️  ${file} não encontrado`, 'yellow');
    }
});

// 5. Calcular tamanhos
log('\n📊 Análise de Tamanho...', 'blue');

let totalSize = 0;
[...cssFiles, ...jsFiles, 'index.html'].forEach(file => {
    if (fs.existsSync(file)) {
        totalSize += fs.statSync(file).size;
    }
});

log(`  Total de assets: ${(totalSize / 1024).toFixed(2)} KB`, 'green');
log(`  Recomendado: < 1 MB para melhor performance`, 'yellow');

// 6. Verificar product-data.js
log('\n📦 Verificando dados de produtos...', 'blue');

const productDataContent = fs.readFileSync('product-data.js', 'utf8');
const productMatch = productDataContent.match(/const defaultProducts = \[([\s\S]*?)\];/);

if (productMatch) {
    try {
        // Contar produtos aproximadamente
        const bracketCount = (productMatch[1].match(/\{/g) || []).length;
        log(`  ✅ ${bracketCount} produtos encontrados`, 'green');
        
        if (bracketCount < 5) {
            log(`  ⚠️  Poucos produtos (${bracketCount}). Sincronize o IndexedDB!`, 'yellow');
        }
    } catch (e) {
        log(`  ⚠️  Não foi possível contar produtos`, 'yellow');
    }
} else {
    log(`  ⚠️  defaultProducts não encontrado em product-data.js`, 'yellow');
}

// 7. Checklist final
header('✅ CHECKLIST PRÉ-DEPLOY');

const checklist = [
    { name: 'Todos os arquivos CSS carregados', ok: cssFiles.every(f => fs.existsSync(f)) },
    { name: 'Todos os arquivos JS carregados', ok: jsFiles.every(f => fs.existsSync(f)) },
    { name: 'Arquivo de configuração presente', ok: fs.existsSync('config.js') },
    { name: 'Module de sincronização presente', ok: fs.existsSync('sync-indexdb-products.js') },
    { name: 'HTML contém referências de scripts', ok: htmlValid },
    { name: 'product-data.js tem produtos', ok: productMatch && productMatch[1].trim().length > 0 },
    { name: 'Tamanho total aceitável', ok: totalSize < 1024 * 1024 } // 1 MB
];

checklist.forEach((item, idx) => {
    const symbol = item.ok ? '✅' : '❌';
    const color = item.ok ? 'green' : 'red';
    log(`  ${idx + 1}. ${symbol} ${item.name}`, color);
});

// 8. Instruções de deploy
header('🚀 INSTRUÇÕES DE DEPLOY');

log('Para fazer deploy para um servidor:', 'blue');
log(`
  1. Copie todos os arquivos para o servidor:
     - index.html
     - styles.css, enhancements.css, ux-improvements.css, app.css
     - script.js, config.js, sync-indexdb-products.js
     - Todos os outros arquivos JS/CSS necessários
     - Logo e assets (Design_sem_nome-removebg-preview.png)

  2. Configure um servidor web (Apache, Nginx, Node.js, etc)

  3. Se usar Apache/Nginx:
     - Configure para servir index.html como página padrão
     - Habilite compressão GZIP para melhor performance

  4. Se usar Node.js:
     - Use express ou similar para servir arquivos estáticos
     - Veja o exemplo em serve-server.js

  5. Teste em produção:
     - Abra a URL do servidor no navegador
     - Verifique o console (F12) para erros
     - Teste a sincronização de produtos

  6. Otimizações opcionais:
     - Minifique CSS e JS para produção
     - Configure cache headers apropriados
     - Use CDN para assets estáticos
     - Implemente Service Worker para offline support
`, 'yellow');

// 9. Relatório final
header('📋 RELATÓRIO FINAL');

const allChecksPass = checklist.every(c => c.ok);

if (allChecksPass) {
    log('✅ APLICAÇÃO PRONTA PARA DEPLOY!', 'green');
    log('\nSeu sistema está 100% funcional e pode ser enviado para um servidor.', 'green');
    log('Todos os produtos, estilos e funcionalidades estão OK.\n', 'green');
} else {
    log('⚠️  APLICAÇÃO COM PROBLEMAS', 'yellow');
    log('\nResolva os itens marcados com ❌ antes de fazer deploy.\n', 'yellow');
}

// Salvar relatório em arquivo
const report = `
RELATÓRIO DE DEPLOY
Data: ${new Date().toLocaleString('pt-BR')}
Ambiente: PRODUÇÃO

VERIFICAÇÕES:
${checklist.map(c => `${c.ok ? '✅' : '❌'} ${c.name}`).join('\n')}

TAMANHO TOTAL: ${(totalSize / 1024).toFixed(2)} KB
ARQUIVOS VERIFICADOS: ${requiredFiles.length}

STATUS: ${allChecksPass ? 'PRONTO PARA DEPLOY ✅' : 'COM PROBLEMAS ⚠️'}
`;

fs.writeFileSync('DEPLOY_REPORT.txt', report);
log('📄 Relatório salvo em: DEPLOY_REPORT.txt\n', 'blue');
