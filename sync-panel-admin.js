/**
 * PAINEL DE SINCRONIZAÇÃO - ADMIN
 * Interface para gerenciar sincronização de produtos IndexedDB
 */

function createSyncPanel() {
    const panelHTML = `
        <div id="syncPanel" style="
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #ffffff, #f8fafc);
            border: 2px solid #10b981;
            border-radius: 12px;
            padding: 16px;
            max-width: 320px;
            z-index: 1000;
            box-shadow: 0 10px 40px rgba(16, 185, 129, 0.2);
            font-family: 'Segoe UI', sans-serif;
            display: none;
        ">
            <div style="margin-bottom: 12px;">
                <h3 style="margin: 0 0 8px 0; color: #0f172a; font-size: 16px;">
                    📦 Sincronização de Produtos
                </h3>
                <p id="syncStatus" style="margin: 0; font-size: 13px; color: #475569;">
                    Aguardando ação...
                </p>
            </div>

            <div style="display: grid; gap: 8px; margin-bottom: 12px;">
                <button id="syncBtn" style="
                    background: linear-gradient(120deg, #10b981, #047857);
                    color: white;
                    border: none;
                    padding: 10px 12px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s;
                " onmouseover="this.style.filter='brightness(1.1)'" onmouseout="this.style.filter='brightness(1)'">
                    🔄 Sincronizar Agora
                </button>

                <button id="exportBtn" style="
                    background: #3b82f6;
                    color: white;
                    border: none;
                    padding: 10px 12px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s;
                " onmouseover="this.style.filter='brightness(1.1)'" onmouseout="this.style.filter='brightness(1)'">
                    📋 Copiar JSON
                </button>

                <button id="viewBtn" style="
                    background: #8b5cf6;
                    color: white;
                    border: none;
                    padding: 10px 12px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s;
                " onmouseover="this.style.filter='brightness(1.1)'" onmouseout="this.style.filter='brightness(1)'">
                    👁️ Visualizar
                </button>

                <button id="closeBtn" style="
                    background: #ef4444;
                    color: white;
                    border: none;
                    padding: 10px 12px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s;
                    font-size: 12px;
                " onmouseover="this.style.filter='brightness(1.1)'" onmouseout="this.style.filter='brightness(1)'">
                    ✕ Fechar
                </button>
            </div>

            <div style="
                padding: 8px;
                background: #f1f5f9;
                border-radius: 8px;
                font-size: 12px;
                color: #475569;
                line-height: 1.5;
            ">
                <strong>📝 Instruções:</strong><br>
                1. Clique em "Sincronizar" para carregar produtos<br>
                2. Use "Copiar JSON" para exportar dados<br>
                3. Cole o JSON no product-data.js
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', panelHTML);

    // Event listeners
    document.getElementById('syncBtn').addEventListener('click', () => {
        syncPanelAction('sync');
    });

    document.getElementById('exportBtn').addEventListener('click', () => {
        syncPanelAction('export');
    });

    document.getElementById('viewBtn').addEventListener('click', () => {
        syncPanelAction('view');
    });

    document.getElementById('closeBtn').addEventListener('click', () => {
        document.getElementById('syncPanel').style.display = 'none';
    });
}

/**
 * Executa ações do painel
 */
async function syncPanelAction(action) {
    const status = document.getElementById('syncStatus');

    try {
        switch (action) {
            case 'sync':
                status.textContent = '🔄 Sincronizando...';
                const result = await window.IndexDBSync.sync();
                if (result && result.length > 0) {
                    status.innerHTML = `✅ ${result.length} produtos sincronizados!`;
                    setTimeout(() => {
                        status.textContent = 'Sincronização concluída';
                    }, 2000);
                } else {
                    status.textContent = '⚠️ Nenhum produto encontrado';
                }
                break;

            case 'export':
                status.textContent = '📋 Copiando...';
                const copied = await window.IndexDBSync.copyProducts();
                if (copied) {
                    status.textContent = '✅ Copiado para área de transferência!';
                    setTimeout(() => {
                        status.textContent = 'Pronto para colar';
                    }, 2000);
                } else {
                    status.textContent = '❌ Erro ao copiar';
                }
                break;

            case 'view':
                status.textContent = '👁️ Carregando...';
                const products = await window.IndexDBSync.view();
                status.innerHTML = `✅ ${products.length} produtos<br><em>Ver console</em>`;
                break;
        }
    } catch (error) {
        status.innerHTML = `❌ Erro: ${error}`;
    }
}

/**
 * Toggle do painel de sincronização
 */
function toggleSyncPanel() {
    const panel = document.getElementById('syncPanel');
    if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
}

/**
 * Adiciona botão de atalho no header
 */
function addSyncToggleButton() {
    // Procurar por um local no header para adicionar o botão
    const headerActions = document.querySelector('.header-actions');
    
    if (headerActions) {
        const button = document.createElement('button');
        button.innerHTML = '📦';
        button.title = 'Painel de Sincronização';
        button.style.cssText = `
            background: linear-gradient(120deg, #10b981, #047857);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 10px;
            cursor: pointer;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            margin-left: 8px;
        `;

        button.addEventListener('mouseover', () => {
            button.style.filter = 'brightness(1.1)';
        });

        button.addEventListener('mouseout', () => {
            button.style.filter = 'brightness(1)';
        });

        button.addEventListener('click', toggleSyncPanel);

        headerActions.appendChild(button);
        console.log('✅ Botão de sincronização adicionado');
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        createSyncPanel();
        addSyncToggleButton();
        console.log('✅ Painel de sincronização carregado');
        console.log('💡 Clique no ícone 📦 no header para abrir');
    }, 500);
});

// Atalho teclado: Ctrl+Shift+P para abrir painel
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        toggleSyncPanel();
    }
});
