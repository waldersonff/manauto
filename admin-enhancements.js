// ===== ADMIN - GALERIA E APLICAÇÕES MÚLTIPLAS =====

// Variável global para armazenar imagens da galeria
let galleryImages = [];

// Event listener para galeria de imagens
document.addEventListener('DOMContentLoaded', () => {
    const galleryInput = document.getElementById('productGallery');
    if (galleryInput) {
        galleryInput.addEventListener('change', handleGalleryUpload);
    }
});

// Função para comprimir imagem
function compressImage(dataUrl, maxWidth = 1600, quality = 0.85) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            // Redimensionar se necessário
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Converter para JPEG com alta qualidade
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedDataUrl);
        };
        img.src = dataUrl;
    });
}

function handleGalleryUpload(e) {
    const files = Array.from(e.target.files);
    const galleryPreview = document.getElementById('galleryPreview');
    const galleryDataInput = document.getElementById('productGalleryData');
    
    // Limite de 10 imagens (restaurado - IndexedDB suporta GB)
    if (galleryImages.length + files.length > 10) {
        alert('Máximo de 10 imagens na galeria. Por favor, remova algumas imagens antes de adicionar novas.');
        e.target.value = '';
        return;
    }
    
    files.forEach(file => {
        // Limitar tamanho do arquivo a 10MB
        if (file.size > 10 * 1024 * 1024) {
            alert(`Imagem "${file.name}" muito grande (máx 10MB). Por favor, escolha uma imagem menor.`);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = async (ev) => {
            const dataUrl = ev.target.result;
            
            // Comprimir imagem com ALTA QUALIDADE (IndexedDB suporta GB)
            const compressedDataUrl = await compressImage(dataUrl, 1600, 0.85);
            galleryImages.push(compressedDataUrl);
            
            // Adicionar preview
            const previewItem = document.createElement('div');
            previewItem.className = 'gallery-preview-item';
            previewItem.innerHTML = `
                <img src="${compressedDataUrl}" alt="Preview">
                <button type="button" class="gallery-preview-remove" onclick="removeGalleryImage(${galleryImages.length - 1})">&times;</button>
            `;
            galleryPreview.appendChild(previewItem);
            
            // Salvar no input hidden
            galleryDataInput.value = JSON.stringify(galleryImages);
        };
        reader.readAsDataURL(file);
    });
    
    // Limpar input para permitir selecionar as mesmas imagens novamente
    e.target.value = '';
}

function removeGalleryImage(index) {
    galleryImages.splice(index, 1);
    updateGalleryPreview();
    document.getElementById('productGalleryData').value = JSON.stringify(galleryImages);
}

function updateGalleryPreview() {
    const galleryPreview = document.getElementById('galleryPreview');
    galleryPreview.innerHTML = '';
    
    galleryImages.forEach((dataUrl, index) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'gallery-preview-item';
        previewItem.innerHTML = `
            <img src="${dataUrl}" alt="Preview">
            <button type="button" class="gallery-preview-remove" onclick="removeGalleryImage(${index})">&times;</button>
        `;
        galleryPreview.appendChild(previewItem);
    });
}

// Função auxiliar para limpar galeria ao resetar form
function resetGallery() {
    galleryImages = [];
    document.getElementById('galleryPreview').innerHTML = '';
    document.getElementById('productGalleryData').value = '';
    document.getElementById('productGallery').value = '';
}

// Função auxiliar para carregar galeria ao editar produto
function loadGallery(images) {
    if (!images || !Array.isArray(images)) return;
    galleryImages = [...images];
    updateGalleryPreview();
    document.getElementById('productGalleryData').value = JSON.stringify(galleryImages);
}

// Expor funções globalmente
window.removeGalleryImage = removeGalleryImage;
window.resetGallery = resetGallery;
window.loadGallery = loadGallery;
