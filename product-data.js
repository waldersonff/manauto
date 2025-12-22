// Dados de subcategorias por categoria - Estrutura similar ao catálogo CPL
const subcategoriesData = {
    freios: {
        label: 'Freios',
        items: ['Pastilha Dianteira', 'Pastilha Traseira', 'Disco Dianteiro', 'Disco Traseiro', 'Cilindro Mestre', 'Cilindro Escravo', 'Óleo de Freio', 'Alavanca de Freio', 'Tambor', 'Sapata de Freio']
    },
    motor: {
        label: 'Motor',
        items: ['Vela de Ignição', 'Filtro de Óleo', 'Filtro de Ar', 'Correia de Distribuição', 'Corrente de Comando', 'Pistão', 'Junta', 'Rolamento', 'Escapamento', 'Válvula', 'Comando de Válvulas', 'Corrente Primária']
    },
    transmissao: {
        label: 'Transmissão',
        items: ['Corrente', 'Kit Relação', 'Coroa', 'Pinhão', 'Embreagem', 'Cabo de Embreagem', 'Disco de Embreagem', 'Óleo de Câmbio', 'Clutch', 'Eixo Secundário']
    },
    suspensao: {
        label: 'Suspensão',
        items: ['Amortecedor Dianteiro', 'Amortecedor Traseiro', 'Mola', 'Braço de Suspensão', 'Batente', 'Óleo de Suspensão', 'Garfo Dianteiro', 'Bieleta', 'Elo de Corrente']
    },
    eletrica: {
        label: 'Elétrica',
        items: ['Bateria', 'Alternador', 'Starter', 'Farol', 'Lanterna', 'Vela de Ignição', 'CDI', 'Bobina', 'Sensor', 'Rele', 'Chicote Elétrico', 'Regulador de Voltagem']
    },
    carroceria: {
        label: 'Carroceria',
        items: ['Guidão', 'Retrovisor', 'Carenagem', 'Pneu', 'Câmara de Ar', 'Alavanca', 'Banco', 'Grip', 'Maçaneta', 'Trava', 'Protetor Motor', 'Sabot']
    },
    acessorios: {
        label: 'Acessórios',
        items: ['Corrente Decorativa', 'Protetores', 'Malas', 'Bolsas', 'Suporte de Mala', 'Bagageiro', 'Fairing', 'Defensor']
    },
    cabos: {
        label: 'Cabos',
        items: ['Cabo de Acelerador', 'Cabo de Velocímetro', 'Cabo de Clutch', 'Cabo de Freio', 'Cabo de Tanquete', 'Mangueira de Freio', 'Mangueira Combustível']
    },
    carburador_injecao: {
        label: 'Carburador / Injeção',
        items: ['Carburador', 'Injector', 'Corpo de Borboleta', 'Válvula Injetora', 'Sensor de Oxigênio', 'Tubo Admissão']
    },
    chassis: {
        label: 'Chassi',
        items: ['Quadro', 'Polia', 'Suportes', 'Fixadores', 'Amortecedor de Vibração', 'Eixo da Roda']
    },
    ferramentas: {
        label: 'Ferramentas / Equipamentos',
        items: ['Chave de Roda', 'Chave de Fenda', 'Jogo de Ferramentas', 'Compressor', 'Macaco', 'Elástico de Carga']
    },
    fixacao: {
        label: 'Fixação',
        items: ['Parafuso', 'Arruela', 'Porca', 'Rebite', 'Presilha', 'Abraçadeira', 'Corrente de Carga']
    },
    roda: {
        label: 'Roda',
        items: ['Roda Dianteira', 'Roda Traseira', 'Aros', 'Cubos', 'Raios', 'Travamento de Roda']
    }
};

// Dados de aplicações - Lista universal de modelos populares de motos
const applicationsData = [
    // Honda
    'CG 125', 'CG 150', 'CG 160', 'CG Titan', 'CG Start',
    'Titan 125', 'Titan 150', 'Titan 160', 'Titan 99', 'Titan 2000',
    'Fan 125', 'Fan 150', 'Fan 160',
    'Biz 100', 'Biz 110i', 'Biz 125',
    'Pop 100', 'Pop 110i','CB 250',
    'CB 300', 'CB 500', 'CB 600', 'CB 650', 'CB 1000',
    'CBR 600', 'CBR 1000',
    'Bros 125', 'Bros 150', 'Bros 160',
    'XRE 190', 'XRE 300',
    'NX 150', 'NX 200', 'NX 400',
    'NC 700', 'NC 750',
    'PCX 150',
    'Shadow 600', 'Shadow 750',
    
    // Yamaha
    'YBR 125', 'YBR 150', 'YBR Factor',
    'Factor 125', 'Factor 150',
    'XTZ 125', 'XTZ 150', 'XTZ 250', 'XTZ Crosser', 'XTZ Lander',
    'Fazer 150', 'Fazer 250', 'Fazer 600',
    'MT-03', 'MT-07', 'MT-09', 'MT-10',
    'YZ 125', 'YZ 250', 'YZ 450',
    'TTR 125', 'TTR 230', 'TTR 250',
    'Crypton 100', 'Crypton 115',
    'FZ 150', 'FZ 250',
    'R1', 'R3', 'R6',
    'Tenere 250', 'Tenere 660', 'Tenere 700',
    'Drag Star 650',
    'Neo 125', 'Nmax 160',
    
    // Suzuki
    'Intruder 125', 'Intruder 150', 'Intruder 250',
    'GSX-R 150', 'GSX-R 750', 'GSX-R 1000',
    'GSX-S 150', 'GSX-S 750', 'GSX-S 1000',
    'Bandit 650', 'Bandit 1200', 'Bandit 1250',
    'V-Strom 650', 'V-Strom 1000',
    'Yes 125',
    'Hayabusa',
    'Boulevard',
    'Burgman 125', 'Burgman 400',
    'DR 350', 'DR 650', 'DR 800',
    'Gixxer 150', 'Gixxer 250',
    'Address 110',
    
    // Kawasaki
    'Ninja 250', 'Ninja 300', 'Ninja 400', 'Ninja 650', 'Ninja 1000', 'Ninja ZX-6R', 'Ninja ZX-10R',
    'Z300', 'Z400', 'Z650', 'Z750', 'Z900', 'Z1000',
    'Versys 300', 'Versys 650', 'Versys 1000',
    'ER-6N', 'ER-6F',
    'Vulcan 500', 'Vulcan 650', 'Vulcan 900',
    'KLX 150', 'KLX 250', 'KLX 450',
    'KX 125', 'KX 250', 'KX 450',
    'KLR 650',
    
    // Yamaha (continuação)
    'Ténéré 250', 'XT 225', 'XT 600', 'XT 660',
    
    // Outras marcas populares
    'Brava Altino 150',
    'Dafra Apache 150', 'Dafra Next 250', 'Dafra Citycom 300', 'Dafra Maxsym 400', 'Dafra Roadwin 250',
    'Shineray XY 50', 'Shineray XY 125', 'Shineray XY 150', 'Shineray XY 200', 'Shineray XY 250',
    'Traxx JH 150', 'Traxx JL 125', 'Traxx Sky 125', 'Traxx Star 50',
    'Sundown Max 125', 'Sundown STX 200', 'Sundown Future 125', 'Sundown Web 100',
    'Kasinski Comet 150', 'Kasinski Mirage 150', 'Kasinski Soft 50',
    'Dafra Speed 150',
    //BMW
    'G 310 R', 'G 310 GS', 'R 1200 GS', 'R 1250 GS', 'GS 650','GS 1200','GS 800',
    //Triumph
    'Street Triple', 'Tiger 800', 'Bonneville T100', 'Bonneville Speedmaster',
    //Harley-Davidson
    'Iron 883', 'Forty-Eight', 'Street 750', 'Roadster', 'Fat Boy',
    // Universal
    'Universal', 'Todas as Marcas', 'Compatível Múltiplas Marcas'
];

// Dados de anos - de 1970 até o ano atual
const yearsData = [];
(function() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1970; i--) {
        yearsData.push(`${i}`);
    }
})();

// Função para carregar subcategorias
function loadSubcategories() {
    const subcategorySelects = document.querySelectorAll('select#productSubcategory');
    subcategorySelects.forEach(select => {
        select.innerHTML = '<option value="">Selecione...</option>';
        Object.entries(subcategoriesData).forEach(([key, data]) => {
            const group = document.createElement('optgroup');
            group.label = data.label;
            data.items.forEach(item => {
                const opt = document.createElement('option');
                opt.value = item;
                opt.textContent = item;
                group.appendChild(opt);
            });
            select.appendChild(group);
        });
    });
}

// Função para carregar aplicações
function loadApplications() {
    const appSelects = document.querySelectorAll('select#productApplication');
    appSelects.forEach(select => {
        select.innerHTML = '<option value="">Selecione ou deixe em branco</option>';
        applicationsData.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item;
            opt.textContent = item;
            select.appendChild(opt);
        });
    });
}

// Função para carregar anos
function loadYears() {
    const yearSelects = document.querySelectorAll('select#productYear');
    yearSelects.forEach(select => {
        select.innerHTML = '<option value="">Selecione ou deixe em branco</option>';
        yearsData.forEach(year => {
            const opt = document.createElement('option');
            opt.value = year;
            opt.textContent = year;
            select.appendChild(opt);
        });
    });
}

// Função para gerar nome do produto automaticamente
function generateProductName() {
    const subcategory = document.getElementById('productSubcategory')?.value || '';
    const brand = document.getElementById('productBrand')?.value || '';
    const application = document.getElementById('productApplication')?.value || '';
    const color = document.getElementById('productColor')?.value || '';

    // Captura múltiplas aplicações (selecionadas no multi-select) e múltiplos anos
    const applicationsList = Array.isArray(window.selectedApplicationsList)
        ? window.selectedApplicationsList
        : [];
    const yearSelectEl = document.getElementById('productYear');
    const selectedYears = Array.from(yearSelectEl?.selectedOptions || [])
        .map(opt => opt.value)
        .filter(Boolean);

    // Requer pelo menos subcategoria e marca
    if (subcategory && brand) {
        const toTitle = (str) => (str || '')
            .split(' ')
            .filter(Boolean)
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
        
        const brandText = toTitle(brand);
        const appsText = applicationsList.length
            ? ` ${applicationsList.slice(0, 2).join(' / ')}${applicationsList.length > 2 ? ` (+${applicationsList.length - 2})` : ''}`
            : (application ? ` ${application}` : '');
        const yearText = selectedYears.length
            ? ` ${selectedYears.slice(0, 2).join(' / ')}${selectedYears.length > 2 ? ` (+${selectedYears.length - 2})` : ''}`
            : '';
        const colorText = color ? ` ${toTitle(color)}` : '';
        
        const productName = `${subcategory} ${brandText}${appsText}${yearText}${colorText}`;
        document.getElementById('productName').value = productName.trim();
    }
}

// Exportar funções para uso global
window.generateProductName = generateProductName;
window.loadSubcategories = loadSubcategories;
window.loadApplications = loadApplications;
window.loadYears = loadYears;
