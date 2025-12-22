// ===== MELHORIAS DE MODALS =====

/**
 * Sistema de Gerenciamento de Modals
 * Provides enhanced functionality for modal windows
 */
class ModalManager {
    constructor() {
        this.openModals = [];
        this.init();
    }

    init() {
        // Fechar modal ao clicar no botão X
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.closeModal(modal);
            });
        });

        // Fechar modal ao clicar no overlay
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.openModals.length > 0) {
                const lastModal = this.openModals[this.openModals.length - 1];
                this.closeModal(lastModal);
            }
        });
    }

    /**
     * Abrir modal com animação
     */
    openModal(selector) {
        const modal = typeof selector === 'string' 
            ? document.querySelector(selector)
            : selector;

        if (!modal) return;

        // Remover classe hidden
        modal.classList.remove('hidden-section');
        modal.style.display = 'flex';

        // Adicionar à lista de modals abertos
        if (!this.openModals.includes(modal)) {
            this.openModals.push(modal);
        }

        // Prevenir scroll
        document.body.style.overflow = 'hidden';

        // Focus no primeiro input
        setTimeout(() => {
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) firstInput.focus();
        }, 300);

        NotificationSystem.info('Modal aberto');
    }

    /**
     * Fechar modal com animação
     */
    closeModal(selector) {
        const modal = typeof selector === 'string' 
            ? document.querySelector(selector)
            : selector;

        if (!modal) return;

        // Adicionar classe de fechamento
        modal.classList.add('closing');

        // Aguardar animação terminar
        setTimeout(() => {
            modal.classList.remove('closing');
            modal.classList.add('hidden-section');
            modal.style.display = 'none';

            // Remover da lista
            this.openModals = this.openModals.filter(m => m !== modal);

            // Restaurar scroll se nenhum modal aberto
            if (this.openModals.length === 0) {
                document.body.style.overflow = 'auto';
            }
        }, 300);
    }

    /**
     * Limpar conteúdo do modal
     */
    clearModal(selector) {
        const modal = typeof selector === 'string' 
            ? document.querySelector(selector)
            : selector;

        if (!modal) return;

        const form = modal.querySelector('form');
        if (form) form.reset();

        // Limpar previews de imagem
        const imagePreviews = modal.querySelectorAll('img[class*="preview"]');
        imagePreviews.forEach(img => {
            img.classList.add('hidden-section');
            img.src = '';
        });
    }

    /**
     * Mostrar loading no modal
     */
    showLoading(selector, message = 'Processando...') {
        const modal = typeof selector === 'string' 
            ? document.querySelector(selector)
            : selector;

        if (!modal) return;

        modal.classList.add('loading');

        // Desabilitar inputs
        modal.querySelectorAll('input, select, button').forEach(el => {
            el.disabled = true;
        });

        // Mostrar spinner
        const spinner = document.createElement('div');
        spinner.className = 'modal-spinner';
        spinner.id = 'modal-spinner';

        const messageEl = document.createElement('p');
        messageEl.textContent = message;
        messageEl.id = 'modal-loading-message';

        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.textAlign = 'center';
        container.style.zIndex = '9999';

        container.appendChild(spinner);
        container.appendChild(messageEl);
        container.id = 'modal-loading-container';

        modal.appendChild(container);
    }

    /**
     * Esconder loading no modal
     */
    hideLoading(selector) {
        const modal = typeof selector === 'string' 
            ? document.querySelector(selector)
            : selector;

        if (!modal) return;

        modal.classList.remove('loading');

        // Habilitar inputs
        modal.querySelectorAll('input, select, button').forEach(el => {
            el.disabled = false;
        });

        // Remover spinner
        const container = modal.querySelector('#modal-loading-container');
        if (container) container.remove();
    }

    /**
     * Validar form no modal
     */
    validateModal(modalSelector) {
        const modal = typeof modalSelector === 'string' 
            ? document.querySelector(modalSelector)
            : modalSelector;

        const form = modal.querySelector('form');
        if (!form) return true;

        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;

                // Mostrar mensagem
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Campo obrigatório';
                
                if (!field.parentElement.querySelector('.error-message')) {
                    field.parentElement.appendChild(errorMsg);
                }
            } else {
                field.classList.remove('error');
                const errorMsg = field.parentElement.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
            }
        });

        if (!isValid) {
            NotificationSystem.warning('Preencha os campos obrigatórios');
        }

        return isValid;
    }

    /**
     * Mostrar alerta no modal
     */
    showAlert(selector, message, type = 'info') {
        const modal = typeof selector === 'string' 
            ? document.querySelector(selector)
            : selector;

        if (!modal) return;

        const alert = document.createElement('div');
        alert.className = `modal-alert ${type}`;
        alert.innerHTML = `
            <i class="fas fa-${this.getAlertIcon(type)}"></i>
            <div>${message}</div>
        `;

        const modalBody = modal.querySelector('.modal-body');
        const existingAlert = modalBody.querySelector('.modal-alert');
        
        if (existingAlert) existingAlert.remove();
        
        modalBody.insertBefore(alert, modalBody.firstChild);
    }

    getAlertIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    /**
     * Adicionar listener para fechar ao clicar em botão
     */
    addCloseListener(buttonSelector, modalSelector) {
        const button = document.querySelector(buttonSelector);
        const modal = document.querySelector(modalSelector);

        if (button && modal) {
            button.addEventListener('click', () => {
                this.closeModal(modal);
            });
        }
    }
}

/**
 * Modal de Confirmação
 */
class ConfirmationModal {
    constructor() {
        this.modal = document.getElementById('confirmModal');
        this.messageEl = document.getElementById('confirmMessage');
        this.confirmBtn = document.getElementById('confirmDeleteBtn');
        this.cancelBtn = document.getElementById('confirmCancelBtn');
        this.callback = null;

        this.init();
    }

    init() {
        this.confirmBtn.addEventListener('click', () => {
            if (this.callback) this.callback();
            this.close();
        });

        this.cancelBtn.addEventListener('click', () => this.close());
    }

    show(message, callback) {
        this.messageEl.textContent = message;
        this.callback = callback;
        
        const modalManager = new ModalManager();
        modalManager.openModal(this.modal);
    }

    close() {
        const modalManager = new ModalManager();
        modalManager.closeModal(this.modal);
    }
}

/**
 * Gerenciador de Formulários de Produto
 */
class ProductFormModal {
    constructor() {
        this.modal = document.getElementById('productModal');
        this.form = document.getElementById('productForm');
        this.modalManager = new ModalManager();
        
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Validação em tempo real
        this.form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });

            field.addEventListener('input', () => {
                field.classList.remove('error');
            });
        });
    }

    validateField(field) {
        if (field.hasAttribute('required') && !field.value.trim()) {
            field.classList.add('error');
            return false;
        }

        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                field.classList.add('error');
                return false;
            }
        }

        field.classList.remove('error');
        return true;
    }

    handleSubmit() {
        if (!this.modalManager.validateModal(this.modal)) {
            return;
        }

        this.modalManager.showLoading(this.modal, 'Salvando produto...');

        // Simular requisição
        setTimeout(() => {
            this.modalManager.hideLoading(this.modal);
            NotificationSystem.success('Produto salvo com sucesso!');
            this.modalManager.closeModal(this.modal);
            this.modalManager.clearModal(this.modal);
        }, 1500);
    }

    open(productData = null) {
        if (productData) {
            // Preencher form com dados existentes
            Object.keys(productData).forEach(key => {
                const field = this.form.querySelector(`[name="${key}"], [id="${key}"]`);
                if (field) {
                    field.value = productData[key];
                }
            });
            document.getElementById('modalTitle').textContent = 'Editar Produto';
        } else {
            this.modalManager.clearModal(this.modal);
            document.getElementById('modalTitle').textContent = 'Novo Produto';
        }

        this.modalManager.openModal(this.modal);
    }

    close() {
        this.modalManager.closeModal(this.modal);
    }
}

/**
 * Gerenciador de Importação
 */
class ImportModal {
    constructor() {
        this.modal = document.getElementById('importModal');
        this.fileInput = document.getElementById('fileInput');
        this.selectFileBtn = document.getElementById('selectFileBtn');
        this.modalManager = new ModalManager();

        if (this.modal) {
            this.init();
        }
    }

    init() {
        this.selectFileBtn.addEventListener('click', () => {
            this.fileInput.click();
        });

        this.fileInput.addEventListener('change', (e) => {
            this.handleFileSelect(e);
        });

        // Drag and drop
        this.modal.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.modal.querySelector('.import-area').style.background = 'rgba(39, 174, 96, 0.2)';
        });

        this.modal.addEventListener('dragleave', () => {
            this.modal.querySelector('.import-area').style.background = '';
        });

        this.modal.addEventListener('drop', (e) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.handleFile(file);
        }
    }

    handleFile(file) {
        if (!file.name.endsWith('.json')) {
            NotificationSystem.error('Por favor, selecione um arquivo JSON');
            return;
        }

        this.modalManager.showLoading(this.modal, 'Importando produtos...');

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                // Validar estrutura
                if (!Array.isArray(data)) {
                    throw new Error('O arquivo deve conter um array de produtos');
                }

                this.modalManager.hideLoading(this.modal);
                NotificationSystem.success(`${data.length} produtos importados com sucesso!`);
                this.modalManager.closeModal(this.modal);

                // Disparar evento
                window.dispatchEvent(new CustomEvent('importComplete', { detail: data }));

            } catch (error) {
                this.modalManager.hideLoading(this.modal);
                NotificationSystem.error('Erro ao processar arquivo: ' + error.message);
            }
        };

        reader.readAsText(file);
    }

    open() {
        this.modalManager.openModal(this.modal);
    }

    close() {
        this.modalManager.closeModal(this.modal);
    }
}

/**
 * Gerenciador de Categorias Modal
 */
class CategoryModal {
    constructor() {
        this.editModal = document.getElementById('editCategoryModal');
        this.form = document.getElementById('editCategoryForm');
        this.modalManager = new ModalManager();

        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Validação
        this.form.querySelectorAll('input, select').forEach(field => {
            field.addEventListener('blur', () => FormValidator.validateField(field));
        });
    }

    handleSubmit() {
        if (!this.modalManager.validateModal(this.editModal)) {
            return;
        }

        this.modalManager.showLoading(this.editModal, 'Salvando categoria...');

        setTimeout(() => {
            this.modalManager.hideLoading(this.editModal);
            NotificationSystem.success('Categoria salva com sucesso!');
            this.modalManager.closeModal(this.editModal);
        }, 1000);
    }

    open(categoryData = null) {
        if (categoryData) {
            document.getElementById('editCategoryName').value = categoryData.name || '';
            document.getElementById('editCategoryKey').value = categoryData.key || '';
        }

        this.modalManager.openModal(this.editModal);
    }

    close() {
        this.modalManager.closeModal(this.editModal);
    }
}

/**
 * Gerenciador de Marca Modal
 */
class BrandModal {
    constructor() {
        this.editModal = document.getElementById('editBrandModal');
        this.form = document.getElementById('editBrandForm');
        this.modalManager = new ModalManager();

        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    handleSubmit() {
        if (!this.modalManager.validateModal(this.editModal)) {
            return;
        }

        this.modalManager.showLoading(this.editModal, 'Salvando marca...');

        setTimeout(() => {
            this.modalManager.hideLoading(this.editModal);
            NotificationSystem.success('Marca salva com sucesso!');
            this.modalManager.closeModal(this.editModal);
        }, 1000);
    }

    open(brandData = null) {
        if (brandData) {
            document.getElementById('editBrandName').value = brandData.name || '';
            document.getElementById('editBrandOldName').value = brandData.oldName || '';
        }

        this.modalManager.openModal(this.editModal);
    }

    close() {
        this.modalManager.closeModal(this.editModal);
    }
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeModals();
    });
} else {
    initializeModals();
}

function initializeModals() {
    let modalManager = new ModalManager();
    let productFormModal = new ProductFormModal();
    let importModal_internal = new ImportModal();
    let categoryModal = new CategoryModal();
    let brandModal = new BrandModal();
    let confirmationModal = new ConfirmationModal();
    
    // Exportar para uso global
    window.modalManager = modalManager;
    window.productFormModal = productFormModal;
    window.importModal_internal = importModal_internal;
    window.categoryModal = categoryModal;
    window.brandModal = brandModal;
    window.confirmationModal = confirmationModal;
}

// Exportar classes para uso global
window.ModalManager = ModalManager;
window.ProductFormModal = ProductFormModal;
window.ImportModal = ImportModal;
window.CategoryModal = CategoryModal;
window.BrandModal = BrandModal;
window.ConfirmationModal = ConfirmationModal;
