/**
 * SERVIDOR DE TESTE PARA PRODUÇÃO
 * Execute: node serve-server.js
 * 
 * Simula o ambiente de produção localmente
 * Acesse: http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC_DIR = __dirname;

// MIME types comuns
const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

// Criar servidor
const server = http.createServer((req, res) => {
    // Remover query params
    let filePath = path.join(PUBLIC_DIR, decodeURI(req.url.split('?')[0]));
    
    // Se for raiz ou diretório, servir index.html
    if (req.url === '/' || filePath.endsWith('/')) {
        filePath = path.join(PUBLIC_DIR, 'index.html');
    }

    // Resolver o caminho real
    const realPath = path.resolve(filePath);

    // Segurança: evitar acesso fora do diretório público
    if (!realPath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Acesso negado');
        return;
    }

    // Tentar ler arquivo
    fs.readFile(realPath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Arquivo não encontrado - servir 404
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>404 - Não Encontrado</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 50px; background: #f5f5f5; }
                            h1 { color: #333; }
                        </style>
                    </head>
                    <body>
                        <h1>404 - Arquivo Não Encontrado</h1>
                        <p>O arquivo "${req.url}" não existe.</p>
                        <p><a href="/">Voltar ao início</a></p>
                    </body>
                    </html>
                `);
            } else {
                // Erro do servidor
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`Erro do servidor: ${err.message}`);
            }
            return;
        }

        // Determinar tipo MIME
        const ext = path.extname(realPath);
        const contentType = mimeTypes[ext] || 'application/octet-stream';

        // Configurar headers
        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=3600',
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'SAMEORIGIN',
            'X-XSS-Protection': '1; mode=block'
        });

        res.end(data);
    });
});

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║  🚀 SERVIDOR DE PRODUÇÃO - TESTE LOCAL                   ║
║                                                            ║
║  URL: http://localhost:${PORT}                           ║
║                                                            ║
║  📝 INSTRUÇÕES:                                           ║
║  1. Abra http://localhost:3000 no navegador              ║
║  2. Pressione F12 para abrir console                      ║
║  3. Teste todas as funcionalidades                        ║
║  4. Verifique se produtos carregam corretamente          ║
║  5. Teste a sincronização com painel 📦                   ║
║                                                            ║
║  Para parar: Pressione Ctrl+C                            ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Erro: Porta ${PORT} já está em uso`);
        console.error('Tente usar outra porta: node serve-server.js --port 3001\n');
    } else {
        console.error(`❌ Erro do servidor: ${err.message}\n`);
    }
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n⏹️  Servidor interrompido');
    server.close();
    process.exit(0);
});
