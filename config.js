/**
 * CONFIGURAÇÃO DE AMBIENTE
 * Define diferentes configurações para desenvolvimento e produção
 */

const config = {
    // Detectar ambiente automaticamente
    environment: typeof window !== 'undefined' 
        ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'development' : 'production')
        : 'development',

    development: {
        dbName: 'MotoPartsDB',
        storeName: 'products',
        enableDebug: true,
        enableSyncPanel: true,
        autoSyncInterval: 5000, // 5 segundos
        logLevel: 'verbose',
        cacheExpiry: 1000 * 60 * 5 // 5 minutos
    },

    production: {
        dbName: 'MotoPartsDB',
        storeName: 'products',
        enableDebug: false,
        enableSyncPanel: false,
        autoSyncInterval: 1000 * 60 * 30, // 30 minutos
        logLevel: 'error',
        cacheExpiry: 1000 * 60 * 60 // 1 hora
    },

    // URLs de API (se necessário)
    api: {
        development: 'http://localhost:3000/api',
        production: '/api' // Raiz relativa
    },

    // Configurações de armazenamento
    storage: {
        localStorage: true,
        indexedDB: true,
        sessionStorage: true
    },

    // Configurações de performance
    performance: {
        lazyLoadImages: true,
        enableCompression: true,
        cacheImages: true,
        minifyCSS: true
    }
};

// Obter configuração ativa
function getConfig() {
    return {
        ...config,
        ...config[config.environment],
        apiUrl: config.api[config.environment]
    };
}

// Logger configurável
class Logger {
    constructor(level = 'verbose') {
        this.level = level;
        this.levels = { error: 0, warn: 1, info: 2, verbose: 3 };
    }

    error(msg, data) {
        if (this.levels[this.level] >= this.levels.error) {
            console.error(`[${new Date().toISOString()}] ❌ ${msg}`, data || '');
        }
    }

    warn(msg, data) {
        if (this.levels[this.level] >= this.levels.warn) {
            console.warn(`[${new Date().toISOString()}] ⚠️ ${msg}`, data || '');
        }
    }

    info(msg, data) {
        if (this.levels[this.level] >= this.levels.info) {
            console.log(`[${new Date().toISOString()}] ℹ️ ${msg}`, data || '');
        }
    }

    verbose(msg, data) {
        if (this.levels[this.level] >= this.levels.verbose) {
            console.log(`[${new Date().toISOString()}] 📝 ${msg}`, data || '');
        }
    }
}

const cfg = getConfig();
const logger = new Logger(cfg.logLevel);

// Log do ambiente
console.log(`🌐 Ambiente: ${cfg.environment.toUpperCase()}`);

// Exportar globalmente
window.AppConfig = {
    getConfig,
    logger,
    cfg,
    isDevelopment: () => cfg.environment === 'development',
    isProduction: () => cfg.environment === 'production'
};

console.log('✅ Configuração de ambiente carregada');
