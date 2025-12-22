// Configuração de campos específicos por subcategoria
const subcategorySpecificFields = {
    // PNEUS
    'Pneu': {
        fields: [
            { name: 'tire_width', label: 'Largura', type: 'text', placeholder: 'Ex: 110, 120, 130', unit: 'mm' },
            { name: 'tire_aspect', label: 'Perfil/Aspecto', type: 'text', placeholder: 'Ex: 70, 80, 90' },
            { name: 'tire_rim', label: 'Aro', type: 'text', placeholder: 'Ex: 17, 18, 19' },
            { name: 'tire_load', label: 'Índice de Carga', type: 'text', placeholder: 'Ex: 54, 58, 62' },
            { name: 'tire_speed', label: 'Índice de Velocidade', type: 'select', options: ['H (210km/h)', 'V (240km/h)', 'W (270km/h)', 'Y (300km/h)', 'Z (+240km/h)'] },
            { name: 'tire_position', label: 'Posição', type: 'select', options: ['Dianteiro', 'Traseiro', 'Universal'] },
            { name: 'tire_type', label: 'Tipo', type: 'select', options: ['Tubeless', 'Com Câmara', 'Radial', 'Diagonal'] }
        ]
    },
    'Câmara de Ar': {
        fields: [
            { name: 'tube_size', label: 'Tamanho', type: 'text', placeholder: 'Ex: 2.75-18, 3.00-18' },
            { name: 'tube_valve', label: 'Tipo de Válvula', type: 'select', options: ['TR4', 'TR6', 'TR87', 'TR13'] }
        ]
    },
    
    // BATERIA
    'Bateria': {
        fields: [
            { name: 'battery_voltage', label: 'Voltagem', type: 'select', options: ['6V', '12V'] },
            { name: 'battery_capacity', label: 'Capacidade (Ah)', type: 'text', placeholder: 'Ex: 5, 7, 9' },
            { name: 'battery_cca', label: 'CCA (Corrente de Partida)', type: 'text', placeholder: 'Ex: 70, 100, 120' },
            { name: 'battery_type', label: 'Tipo', type: 'select', options: ['Selada', 'Convencional', 'Gel', 'Lítio', 'AGM'] },
            { name: 'battery_dimensions', label: 'Dimensões (CxLxA)', type: 'text', placeholder: 'Ex: 120x70x130 mm' }
        ]
    },
    
    // PASTILHAS DE FREIO
    'Pastilha Dianteira': {
        fields: [
            { name: 'pad_compound', label: 'Material/Composto', type: 'select', options: ['Orgânico', 'Semi-metálico', 'Cerâmico', 'Sinterizado'] },
            { name: 'pad_thickness', label: 'Espessura', type: 'text', placeholder: 'Ex: 7mm', unit: 'mm' },
            { name: 'pad_width', label: 'Largura', type: 'text', placeholder: 'Ex: 45mm', unit: 'mm' },
            { name: 'pad_height', label: 'Altura', type: 'text', placeholder: 'Ex: 50mm', unit: 'mm' }
        ]
    },
    'Pastilha Traseira': {
        fields: [
            { name: 'pad_compound', label: 'Material/Composto', type: 'select', options: ['Orgânico', 'Semi-metálico', 'Cerâmico', 'Sinterizado'] },
            { name: 'pad_thickness', label: 'Espessura', type: 'text', placeholder: 'Ex: 7mm', unit: 'mm' },
            { name: 'pad_width', label: 'Largura', type: 'text', placeholder: 'Ex: 45mm', unit: 'mm' },
            { name: 'pad_height', label: 'Altura', type: 'text', placeholder: 'Ex: 50mm', unit: 'mm' }
        ]
    },
    
    // DISCOS DE FREIO
    'Disco Dianteiro': {
        fields: [
            { name: 'disc_diameter', label: 'Diâmetro Externo', type: 'text', placeholder: 'Ex: 260, 280, 300', unit: 'mm' },
            { name: 'disc_thickness', label: 'Espessura', type: 'text', placeholder: 'Ex: 4.0, 4.5, 5.0', unit: 'mm' },
            { name: 'disc_holes', label: 'Quantidade de Furos', type: 'text', placeholder: 'Ex: 4, 5, 6' },
            { name: 'disc_type', label: 'Tipo', type: 'select', options: ['Sólido', 'Ventilado', 'Ondulado', 'Semi-flutuante', 'Flutuante'] }
        ]
    },
    'Disco Traseiro': {
        fields: [
            { name: 'disc_diameter', label: 'Diâmetro Externo', type: 'text', placeholder: 'Ex: 220, 240, 260', unit: 'mm' },
            { name: 'disc_thickness', label: 'Espessura', type: 'text', placeholder: 'Ex: 3.5, 4.0, 4.5', unit: 'mm' },
            { name: 'disc_holes', label: 'Quantidade de Furos', type: 'text', placeholder: 'Ex: 3, 4, 5' },
            { name: 'disc_type', label: 'Tipo', type: 'select', options: ['Sólido', 'Ventilado', 'Ondulado', 'Semi-flutuante', 'Flutuante'] }
        ]
    },
    
    // VELAS DE IGNIÇÃO
    'Vela de Ignição': {
        fields: [
            { name: 'spark_thread', label: 'Rosca', type: 'text', placeholder: 'Ex: M10, M12, M14' },
            { name: 'spark_reach', label: 'Alcance', type: 'text', placeholder: 'Ex: 12.7mm, 19mm', unit: 'mm' },
            { name: 'spark_gap', label: 'Abertura (Gap)', type: 'text', placeholder: 'Ex: 0.7, 0.8, 0.9', unit: 'mm' },
            { name: 'spark_heat', label: 'Grau Térmico', type: 'text', placeholder: 'Ex: 6, 7, 8' },
            { name: 'spark_electrode', label: 'Tipo de Eletrodo', type: 'select', options: ['Cobre', 'Platina', 'Irídio', 'Duplo Irídio'] }
        ]
    },
    
    // CORRENTES
    'Corrente': {
        fields: [
            { name: 'chain_pitch', label: 'Passo', type: 'select', options: ['420', '428', '520', '525', '530', '630'] },
            { name: 'chain_links', label: 'Número de Elos', type: 'text', placeholder: 'Ex: 100, 110, 120' },
            { name: 'chain_type', label: 'Tipo', type: 'select', options: ['Standard', 'O-Ring', 'X-Ring', 'Z-Ring'] },
            { name: 'chain_color', label: 'Cor', type: 'select', options: ['Natural', 'Dourada', 'Preta', 'Cromada'] }
        ]
    },
    'Kit Relação': {
        fields: [
            { name: 'chain_pitch', label: 'Passo da Corrente', type: 'select', options: ['420', '428', '520', '525', '530', '630'] },
            { name: 'chain_links', label: 'Elos da Corrente', type: 'text', placeholder: 'Ex: 100, 110, 120' },
            { name: 'sprocket_front', label: 'Dentes Pinhão (Dianteiro)', type: 'text', placeholder: 'Ex: 14, 15, 16' },
            { name: 'sprocket_rear', label: 'Dentes Coroa (Traseira)', type: 'text', placeholder: 'Ex: 38, 40, 42' }
        ]
    },
    
    // FILTROS
    'Filtro de Óleo': {
        fields: [
            { name: 'filter_diameter', label: 'Diâmetro', type: 'text', placeholder: 'Ex: 68mm', unit: 'mm' },
            { name: 'filter_height', label: 'Altura', type: 'text', placeholder: 'Ex: 85mm', unit: 'mm' },
            { name: 'filter_thread', label: 'Rosca', type: 'text', placeholder: 'Ex: M20x1.5' },
            { name: 'filter_type', label: 'Tipo', type: 'select', options: ['Cartucho', 'Elemento Interno', 'Spin-on'] }
        ]
    },
    'Filtro de Ar': {
        fields: [
            { name: 'filter_type', label: 'Tipo', type: 'select', options: ['Papel', 'Espuma', 'Algodão (Performance)', 'Híbrido'] },
            { name: 'filter_shape', label: 'Formato', type: 'select', options: ['Retangular', 'Circular', 'Oval', 'Irregular'] }
        ]
    },
    
    // AMORTECEDORES
    'Amortecedor Dianteiro': {
        fields: [
            { name: 'shock_travel', label: 'Curso', type: 'text', placeholder: 'Ex: 120mm, 130mm', unit: 'mm' },
            { name: 'shock_diameter', label: 'Diâmetro da Haste', type: 'text', placeholder: 'Ex: 41mm, 43mm', unit: 'mm' },
            { name: 'shock_type', label: 'Tipo', type: 'select', options: ['Hidráulico', 'Gás', 'Ajustável', 'Invertido'] },
            { name: 'shock_adjustments', label: 'Ajustes Disponíveis', type: 'text', placeholder: 'Ex: Compressão, Retorno, Pré-carga' }
        ]
    },
    'Amortecedor Traseiro': {
        fields: [
            { name: 'shock_length', label: 'Comprimento Olho a Olho', type: 'text', placeholder: 'Ex: 320mm, 350mm', unit: 'mm' },
            { name: 'shock_travel', label: 'Curso', type: 'text', placeholder: 'Ex: 50mm, 60mm', unit: 'mm' },
            { name: 'shock_type', label: 'Tipo', type: 'select', options: ['Mono', 'Twin', 'Gás', 'Hidráulico', 'Ajustável'] },
            { name: 'shock_spring', label: 'Mola Incluída', type: 'select', options: ['Sim', 'Não', 'Separada'] }
        ]
    },
    
    // ESCAPAMENTO
    'Escapamento': {
        fields: [
            { name: 'exhaust_material', label: 'Material', type: 'select', options: ['Aço Inox', 'Aço Carbono', 'Titânio', 'Alumínio'] },
            { name: 'exhaust_type', label: 'Tipo', type: 'select', options: ['Esportivo', 'Original', 'Slip-on', 'Full System'] },
            { name: 'exhaust_diameter', label: 'Diâmetro de Saída', type: 'text', placeholder: 'Ex: 50mm, 60mm', unit: 'mm' },
            { name: 'exhaust_finish', label: 'Acabamento', type: 'select', options: ['Polido', 'Escovado', 'Pintado', 'Carbon Look'] }
        ]
    },
    
    // ÓLEOS
    'Óleo de Motor': {
        fields: [
            { name: 'oil_viscosity', label: 'Viscosidade', type: 'select', options: ['10W-30', '10W-40', '15W-40', '20W-50', '5W-30', '5W-40'] },
            { name: 'oil_type', label: 'Tipo', type: 'select', options: ['Mineral', 'Semi-sintético', 'Sintético', '100% Sintético'] },
            { name: 'oil_standard', label: 'Especificação', type: 'text', placeholder: 'Ex: API SL, JASO MA2' },
            { name: 'oil_volume', label: 'Volume', type: 'select', options: ['1L', '4L', '5L', '20L'] }
        ]
    },
    'Óleo de Suspensão': {
        fields: [
            { name: 'oil_weight', label: 'Peso', type: 'select', options: ['5W', '7.5W', '10W', '15W', '20W'] },
            { name: 'oil_volume', label: 'Volume', type: 'select', options: ['250ml', '500ml', '1L'] }
        ]
    },
    
    // GUIDÃO E ACESSÓRIOS
    'Guidão': {
        fields: [
            { name: 'handlebar_diameter', label: 'Diâmetro da Fixação', type: 'select', options: ['22mm (7/8")', '25.4mm (1")', '28.6mm (1-1/8")'] },
            { name: 'handlebar_width', label: 'Largura Total', type: 'text', placeholder: 'Ex: 700mm, 780mm', unit: 'mm' },
            { name: 'handlebar_rise', label: 'Elevação', type: 'text', placeholder: 'Ex: 50mm, 80mm', unit: 'mm' },
            { name: 'handlebar_type', label: 'Estilo', type: 'select', options: ['Street', 'Sport', 'Off-road', 'Touring', 'Drag'] }
        ]
    },
    'Retrovisor': {
        fields: [
            { name: 'mirror_thread', label: 'Rosca', type: 'select', options: ['M10 Direita', 'M10 Esquerda', 'M8 Direita', 'M8 Esquerda', 'Universal'] },
            { name: 'mirror_position', label: 'Posição', type: 'select', options: ['Esquerdo', 'Direito', 'Par'] },
            { name: 'mirror_type', label: 'Tipo', type: 'select', options: ['Original', 'Esportivo', 'Dobrável', 'Universal'] }
        ]
    },
    
    // FARÓIS
    'Farol': {
        fields: [
            { name: 'light_type', label: 'Tipo de Lâmpada', type: 'select', options: ['LED', 'Halogênio', 'Xenon', 'Bi-LED'] },
            { name: 'light_power', label: 'Potência', type: 'text', placeholder: 'Ex: 35W, 55W', unit: 'W' },
            { name: 'light_voltage', label: 'Voltagem', type: 'select', options: ['12V', '6V'] },
            { name: 'light_position', label: 'Posição', type: 'select', options: ['Principal', 'Auxiliar', 'De Milha'] }
        ]
    },
    'Lanterna': {
        fields: [
            { name: 'light_type', label: 'Tipo', type: 'select', options: ['LED', 'Convencional'] },
            { name: 'light_functions', label: 'Funções', type: 'text', placeholder: 'Ex: Freio, Pisca, Placa' }
        ]
    },
    
    // CILINDROS
    'Cilindro Mestre': {
        fields: [
            { name: 'cylinder_diameter', label: 'Diâmetro Interno', type: 'text', placeholder: 'Ex: 12.7mm, 14mm', unit: 'mm' },
            { name: 'cylinder_position', label: 'Posição', type: 'select', options: ['Dianteiro', 'Traseiro'] },
            { name: 'cylinder_lever', label: 'Tipo de Alavanca', type: 'select', options: ['Curta', 'Longa', 'Ajustável'] }
        ]
    },
    
    // PISTÕES
    'Pistão': {
        fields: [
            { name: 'piston_diameter', label: 'Diâmetro', type: 'text', placeholder: 'Ex: 52mm, 54mm', unit: 'mm' },
            { name: 'piston_oversize', label: 'Oversized', type: 'select', options: ['STD (Standard)', '0.25mm', '0.50mm', '0.75mm', '1.00mm'] },
            { name: 'piston_rings', label: 'Anéis Inclusos', type: 'select', options: ['Sim', 'Não', 'Separado'] }
        ]
    }
};
