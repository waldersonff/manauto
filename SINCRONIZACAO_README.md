# 📦 Sincronização de Produtos IndexedDB

Sistema automatizado para sincronizar produtos armazenados no IndexedDB com o código-fonte da aplicação.

## 🎯 Objetivo

Transferir todos os produtos salvos no IndexedDB do navegador para o arquivo `product-data.js` de forma permanente, permitindo que ao rodar o servidor, todos os produtos apareçam automaticamente.

## 🚀 Como Usar

### Opção 1: Interface Gráfica (Recomendado)

1. **Abra a página da aplicação** no navegador
2. **Procure pelo botão 📦** no header (lado direito)
3. **Clique no botão** para abrir o painel de sincronização
4. **Escolha uma ação:**
   - **🔄 Sincronizar Agora**: Carrega os produtos do IndexedDB para a memória
   - **📋 Copiar JSON**: Copia os dados em formato JSON para a área de transferência
   - **👁️ Visualizar**: Exibe os produtos no console do navegador

### Opção 2: Console do Navegador

1. **Abra o console** do navegador (F12 ou Ctrl+Shift+I)
2. **Execute os comandos:**

```javascript
// Visualizar todos os produtos
window.IndexDBSync.view()

// Exportar como JSON
await window.IndexDBSync.export()

// Copiar para área de transferência
await window.IndexDBSync.copyProducts()

// Sincronizar com o sistema
await window.IndexDBSync.sync()

// Limpar IndexedDB
await window.IndexDBSync.clear()

// Importar novos produtos
await window.IndexDBSync.import(jsonString)
```

### Opção 3: Script de Exportação Direto

1. **Abra o console** do navegador
2. **Execute:**

```javascript
// Importar o script de exportação
const script = document.createElement('script');
script.src = 'export-products-from-indexdb.js';
document.body.appendChild(script);
```

## 📋 Transferindo Dados para product-data.js

### Passo 1: Exportar Dados
- Use uma das opções acima para obter o JSON dos produtos
- Copie os dados para a área de transferência

### Passo 2: Atualizar Arquivo
1. **Abra** `product-data.js`
2. **Procure** pela seção de produtos padrão (busque por `defaultProducts`)
3. **Substitua** o array `defaultProducts` pelo JSON copiado
4. **Salve** o arquivo

### Exemplo:

**Antes:**
```javascript
const defaultProducts = [
    { id: 1, name: 'Produto 1', ... },
    { id: 2, name: 'Produto 2', ... }
];
```

**Depois:**
```javascript
const defaultProducts = [
    // Todos os produtos do IndexedDB aqui
    { id: 1, name: 'Produto 1', ... },
    { id: 2, name: 'Produto 2', ... },
    // ... muito mais produtos
];
```

## 🔌 Integração Automática

O sistema é carregado automaticamente:

1. **Sincronização ao carregar a página**: Os produtos são carregados do IndexedDB
2. **Fallback para localStorage**: Se IndexedDB não tiver dados, tenta localStorage
3. **Fallback para padrão**: Se nenhuma fonte tiver dados, usa `defaultProducts`

### Ordem de Prioridade:
1. IndexedDB (melhor performance)
2. localStorage (compatibilidade)
3. `product-data.js` (padrão)

## 🔑 Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Ctrl+Shift+P` | Abre/Fecha painel de sincronização |
| `Ctrl+K` | Foca no campo de busca |

## 📁 Arquivos Relacionados

| Arquivo | Descrição |
|---------|-----------|
| `sync-indexdb-products.js` | Módulo principal de sincronização |
| `sync-panel-admin.js` | Painel de interface gráfica |
| `export-products-from-indexdb.js` | Script simples de exportação |
| `product-data.js` | Dados permanentes de produtos |
| `indexedDB-storage.js` | Gerenciador do IndexedDB |

## 🐛 Troubleshooting

### "IndexedDB não disponível"
- Verifique se o navegador suporta IndexedDB
- Certifique-se de que o modo privado/incógnito está desativado

### "Nenhum produto encontrado"
- Confirme se os produtos foram realmente salvos no IndexedDB
- Execute `window.IndexDBSync.view()` para verificar

### "Erro ao copiar"
- Verifique permissões de clipboard do navegador
- Use uma conexão segura (HTTPS) para melhor compatibilidade

## 💾 Salvando Permanentemente

Para garantir que os produtos sejam salvos permanentemente:

1. **Opção A (Recomendado):**
   - Copie o JSON dos produtos
   - Cole em `product-data.js`
   - Commit no Git

2. **Opção B (Automático):**
   - O sistema salva automaticamente em localStorage
   - Implemente sincronização periódica com banco de dados

3. **Opção C (Servidor):**
   - Configure API REST para sincronizar com servidor
   - Implemente banco de dados no backend

## 🔒 Segurança

- ✅ Dados salvos localmente (seguro)
- ✅ Sem envio de dados sensíveis
- ✅ Funciona offline
- ⚠️ Dados apagados ao limpar cache do navegador

## 📞 Suporte

Para problemas:
1. Verifique o console do navegador (F12)
2. Visualize os logs de sincronização
3. Teste com `window.IndexDBSync.view()`

---

**Versão:** 1.0  
**Última atualização:** 26 de dezembro de 2025
