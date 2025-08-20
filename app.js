// EmbalaVerde - Aplicativo de Doces com Embalagens Sustentáveis
// Sistema de gerenciamento de estado e funcionalidades

// Estado global da aplicação
const AppState = {
    currentPage: 'home',
    currentProductId: null,
    currentOrderId: null,
    cart: [],
    products: [],
    materials: [],
    sizes: [],
    orders: [],
    filters: {
        tag: '',
        search: ''
    }
};

// Dados mockados - conforme especificação
const MockData = {
    doces: [
        {
            id: "1",
            nome: "Brigadeiro Gourmet",
            descricao: "Brigadeiro artesanal com chocolate belga",
            preco: 15.90,
            categoria: "chocolate",
            peso: 25,
            ingredientes: ["chocolate belga", "leite condensado", "manteiga", "cacau em pó"],
            emoji: "🍫"
        },
        {
            id: "2", 
            nome: "Beijinho de Coco",
            descricao: "Doce tradicional com coco fresco",
            preco: 12.50,
            categoria: "coco",
            peso: 20,
            ingredientes: ["leite condensado", "coco ralado", "manteiga", "cravo"],
            emoji: "🥥"
        },
        {
            id: "3",
            nome: "Trufa de Maracujá",
            descricao: "Trufa com polpa de maracujá natural",
            preco: 18.90,
            categoria: "frutas",
            peso: 30,
            ingredientes: ["chocolate branco", "polpa de maracujá", "creme de leite", "açúcar"],
            emoji: "🍇"
        },
        {
            id: "4",
            nome: "Cajuzinho Premium",
            descricao: "Doce de amendoim com cobertura de chocolate",
            preco: 14.90,
            categoria: "amendoim",
            peso: 22,
            ingredientes: ["amendoim", "leite condensado", "chocolate meio amargo"],
            emoji: "🥜"
        },
        {
            id: "5",
            nome: "Bem-casado Artesanal",
            descricao: "Biscoito recheado com doce de leite",
            preco: 16.90,
            categoria: "biscoito",
            peso: 35,
            ingredientes: ["farinha", "manteiga", "doce de leite", "açúcar"],
            emoji: "🍪"
        }
    ],
    materiais: [
        {
            id: "papel-semente",
            nome: "Papel Semente", 
            descricao: "Papel biodegradável com sementes de flores silvestres",
            tags: ["biodegradavel", "papel_semente"],
            impacto: {
                plastico_evitado: 15,
                agua_economizada: 200
            },
            custo_adicional: 0.50,
            descarte: "Plante em terra úmida e regue regularmente. As flores crescerão em 2-4 semanas.",
            pictograma: "🌱"
        },
        {
            id: "papel-compostavel",
            nome: "Papel Compostável",
            descricao: "Papel feito de bagaço de cana-de-açúcar",
            tags: ["biodegradavel", "compostavel"],
            impacto: {
                plastico_evitado: 12,
                agua_economizada: 150
            },
            custo_adicional: 0.30,
            descarte: "Coloque na composteira doméstica ou no lixo orgânico. Decomposição em 60-90 dias.",
            pictograma: "♻️"
        },
        {
            id: "filme-soluvel",
            nome: "Filme Solúvel em Água",
            descricao: "Filme transparente feito de amido de batata",
            tags: ["biodegradavel", "soluvel_em_agua"],
            impacto: {
                plastico_evitado: 20,
                agua_economizada: 300
            },
            custo_adicional: 0.80,
            descarte: "Dissolva em água morna ou coloque no lixo orgânico. Totalmente biodegradável.",
            pictograma: "💧"
        },
        {
            id: "cartucho-reciclado",
            nome: "Cartucho Reciclado",
            descricao: "Cartucho de papelão reciclado",
            tags: ["reciclavel"],
            impacto: {
                plastico_evitado: 8,
                agua_economizada: 100
            },
            custo_adicional: 0.20,
            descarte: "Coloque na coleta seletiva de papel. 100% reciclável.",
            pictograma: "📦"
        }
    ],
    tamanhos: [
        {
            id: "pequeno",
            nome: "Pequeno",
            dimensoes: "8x6x3 cm",
            capacidade: "1-2 unidades",
            multiplicador_preco: 1.0
        },
        {
            id: "medio", 
            nome: "Médio",
            dimensoes: "12x8x4 cm",
            capacidade: "3-5 unidades", 
            multiplicador_preco: 1.3
        },
        {
            id: "grande",
            nome: "Grande",
            dimensoes: "16x12x6 cm", 
            capacidade: "6-10 unidades",
            multiplicador_preco: 1.6
        }
    ],
    frete: {
        gratis_acima: 50.00,
        valor_padrao: 8.90,
        regioes: {
            "sudeste": 1.0,
            "sul": 1.2, 
            "nordeste": 1.5,
            "norte": 2.0,
            "centro-oeste": 1.3
        }
    }
};

// Tradução e i18n
const translations = {
    tags: {
        "biodegradavel": "Biodegradável",
        "compostavel": "Compostável", 
        "reciclavel": "Reciclável",
        "soluvel_em_agua": "Solúvel em Água",
        "papel_semente": "Papel Semente"
    }
};

// Utilitários
const Utils = {
    formatCurrency: (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },
    
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    showMessage: (message, type = 'info') => {
        const statusEl = document.getElementById('status-messages');
        if (statusEl) {
            statusEl.textContent = message;
            setTimeout(() => {
                if (statusEl) statusEl.textContent = '';
            }, 3000);
        }
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
};

// Serviços para simular API
const ApiService = {
    async getProducts() {
        await new Promise(resolve => setTimeout(resolve, 50));
        return [...MockData.doces];
    },
    
    async getProduct(id) {
        await new Promise(resolve => setTimeout(resolve, 25));
        return MockData.doces.find(p => p.id === id);
    },
    
    async getMaterials() {
        await new Promise(resolve => setTimeout(resolve, 25));
        return [...MockData.materiais];
    },
    
    async getSizes() {
        await new Promise(resolve => setTimeout(resolve, 25));
        return [...MockData.tamanhos];
    },
    
    async createOrder(orderData) {
        await new Promise(resolve => setTimeout(resolve, 100));
        const order = {
            id: Utils.generateId(),
            ...orderData,
            createdAt: new Date().toISOString(),
            status: 'confirmado'
        };
        AppState.orders.push(order);
        return order;
    }
};

// Serviço de cálculo de impacto ambiental
const ImpactService = {
    calculateImpact(items) {
        let totalPlasticAvoided = 0;
        let totalWaterSaved = 0;
        
        items.forEach(item => {
            const material = MockData.materiais.find(m => m.id === item.material);
            const size = MockData.tamanhos.find(s => s.id === item.size);
            
            if (material && size) {
                const multiplier = size.multiplicador_preco;
                totalPlasticAvoided += material.impacto.plastico_evitado * item.quantity * multiplier;
                totalWaterSaved += material.impacto.agua_economizada * item.quantity * multiplier;
            }
        });
        
        return {
            plasticAvoided: Math.round(totalPlasticAvoided),
            waterSaved: Math.round(totalWaterSaved)
        };
    },
    
    estimateImpact(productId, materialId, sizeId, quantity = 1) {
        const material = MockData.materiais.find(m => m.id === materialId);
        const size = MockData.tamanhos.find(s => s.id === sizeId);
        
        if (!material || !size) {
            return { plasticAvoided: 0, waterSaved: 0 };
        }
        
        const multiplier = size.multiplicador_preco;
        return {
            plasticAvoided: Math.round(material.impacto.plastico_evitado * quantity * multiplier),
            waterSaved: Math.round(material.impacto.agua_economizada * quantity * multiplier)
        };
    }
};

// Gerador de Braille
const BrailleService = {
    brailleMap: {
        'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋', 'g': '⠛',
        'h': '⠓', 'i': '⠊', 'j': '⠚', 'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝',
        'o': '⠕', 'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞', 'u': '⠥',
        'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽', 'z': '⠵', ' ': '⠀',
        '1': '⠼⠁', '2': '⠼⠃', '3': '⠼⠉', '4': '⠼⠙', '5': '⠼⠑',
        '6': '⠼⠋', '7': '⠼⠛', '8': '⠼⠓', '9': '⠼⠊', '0': '⠼⠚',
        '.': '⠲', ',': '⠂', '!': '⠖', '?': '⠦', '-': '⠤'
    },
    
    toBraille(text) {
        return text.toLowerCase().split('').map(char => 
            this.brailleMap[char] || char
        ).join('');
    },
    
    generateBrailleSVG(text, cellSize = 20) {
        const braille = this.toBraille(text);
        const width = braille.length * cellSize + 20;
        const height = cellSize * 2 + 20;
        
        let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
        svg += `<rect width="100%" height="100%" fill="white" stroke="#ccc"/>`;
        
        braille.split('').forEach((char, index) => {
            const x = (index * cellSize) + 10;
            const y = 10;
            
            if (char !== '⠀') {
                svg += `<circle cx="${x + 5}" cy="${y + 5}" r="2" fill="#000"/>`;
                svg += `<circle cx="${x + 15}" cy="${y + 5}" r="2" fill="#000"/>`;
                svg += `<circle cx="${x + 5}" cy="${y + 15}" r="2" fill="#000"/>`;
            }
        });
        
        svg += '</svg>';
        return svg;
    }
};

// Serviço de QR Code (simulado)
const QRService = {
    generateQRCode(text, size = 200) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        // Background branco
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);
        
        // Simula padrão QR (muito simplificado)
        ctx.fillStyle = '#000000';
        const cellSize = size / 25;
        
        for (let i = 0; i < 25; i++) {
            for (let j = 0; j < 25; j++) {
                if ((i + j + text.length) % 3 === 0) {
                    ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
                }
            }
        }
        
        // Cantos de identificação (simplificado)
        ctx.fillRect(0, 0, cellSize * 7, cellSize * 7);
        ctx.fillRect(size - cellSize * 7, 0, cellSize * 7, cellSize * 7);
        ctx.fillRect(0, size - cellSize * 7, cellSize * 7, cellSize * 7);
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cellSize, cellSize, cellSize * 5, cellSize * 5);
        ctx.fillRect(size - cellSize * 6, cellSize, cellSize * 5, cellSize * 5);
        ctx.fillRect(cellSize, size - cellSize * 6, cellSize * 5, cellSize * 5);
        
        return canvas;
    }
};

// Serviço de Text-to-Speech
const TTSService = {
    speak(text, lang = 'pt-BR') {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.rate = 0.8;
            utterance.pitch = 1;
            speechSynthesis.speak(utterance);
        } else {
            Utils.showMessage('Seu navegador não suporta síntese de voz', 'warning');
        }
    },
    
    stop() {
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
        }
    }
};

// Gerenciador de carrinho com localStorage
const CartService = {
    getCart() {
        try {
            const cart = localStorage.getItem('embala-verde-cart');
            return cart ? JSON.parse(cart) : [];
        } catch (error) {
            return [];
        }
    },
    
    saveCart(cart) {
        try {
            localStorage.setItem('embala-verde-cart', JSON.stringify(cart));
            AppState.cart = cart;
            this.updateCartUI();
        } catch (error) {
            console.error('Erro ao salvar carrinho:', error);
        }
    },
    
    addItem(item) {
        const cart = this.getCart();
        const existingIndex = cart.findIndex(i => 
            i.productId === item.productId && 
            i.material === item.material && 
            i.size === item.size
        );
        
        if (existingIndex >= 0) {
            cart[existingIndex].quantity += item.quantity;
        } else {
            cart.push({ ...item, id: Utils.generateId() });
        }
        
        this.saveCart(cart);
        Utils.showMessage('Item adicionado ao carrinho!', 'success');
    },
    
    removeItem(itemId) {
        const cart = this.getCart().filter(item => item.id !== itemId);
        this.saveCart(cart);
        Utils.showMessage('Item removido do carrinho', 'info');
    },
    
    updateQuantity(itemId, newQuantity) {
        const cart = this.getCart();
        const item = cart.find(i => i.id === itemId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(itemId);
            } else {
                item.quantity = newQuantity;
                this.saveCart(cart);
            }
        }
    },
    
    getTotal() {
        const cart = this.getCart();
        return cart.reduce((total, item) => {
            const product = MockData.doces.find(p => p.id === item.productId);
            const material = MockData.materiais.find(m => m.id === item.material);
            const size = MockData.tamanhos.find(s => s.id === item.size);
            
            if (product && material && size) {
                const basePrice = product.preco * size.multiplicador_preco;
                const packagingPrice = material.custo_adicional;
                return total + (basePrice + packagingPrice) * item.quantity;
            }
            return total;
        }, 0);
    },
    
    getShippingCost(region = 'sudeste') {
        const total = this.getTotal();
        if (total >= MockData.frete.gratis_acima) {
            return 0;
        }
        const multiplier = MockData.frete.regioes[region] || 1.0;
        return MockData.frete.valor_padrao * multiplier;
    },
    
    clearCart() {
        try {
            localStorage.removeItem('embala-verde-cart');
            AppState.cart = [];
            this.updateCartUI();
        } catch (error) {
            console.error('Erro ao limpar carrinho:', error);
        }
    },
    
    updateCartUI() {
        const cart = this.getCart();
        const countEl = document.getElementById('cart-count');
        if (countEl) {
            countEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    }
};

// Sistema de navegação SIMPLIFICADO E CORRIGIDO
const Router = {
    navigate(path) {
        console.log('Navegando para:', path);
        
        // Mostra loading
        this.showLoading();
        
        // Oculta todas as páginas
        document.querySelectorAll('.page').forEach(page => {
            page.classList.add('hidden');
        });
        
        // Processa o path
        const [basePath, ...pathParams] = path.split('/').filter(p => p);
        const pageName = basePath || 'home';
        
        // Usa setTimeout para permitir que o loading seja mostrado
        setTimeout(() => {
            try {
                this.showPage(pageName, pathParams);
                AppState.currentPage = pageName;
                // Atualiza a navegação ativa (verifica se função existe para evitar erros)
                try {
                    if (typeof updateNavActive === 'function') {
                        updateNavActive(pageName);
                    }
                } catch (err) {
                    console.warn('Falha ao atualizar navegação ativa:', err);
                }
            } catch (error) {
                console.error('Erro na navegação:', error);
                this.showPage('home', []);
                Utils.showMessage('Erro ao carregar página', 'error');
            } finally {
                this.hideLoading();
            }
        }, 100);
    },
    
    showPage(pageName, pathParams) {
        switch (pageName) {
            case 'home':
                this.showHome();
                break;
            case 'catalog':
                this.showCatalog();
                break;
            case 'configurator':
                const productId = pathParams[0];
                this.showConfigurator(productId);
                break;
            case 'cart':
                this.showCart();
                break;
            case 'checkout':
                this.showCheckout();
                break;
            case 'orders':
                const orderId = pathParams[0];
                this.showOrder(orderId);
                break;
            case 'admin':
                this.showAdmin();
                break;
            case 'about':
                this.showAbout();
                break;
            default:
                this.showHome();
        }
    },
    
    showLoading() {
        const loadingEl = document.getElementById('loading');
        if (loadingEl) {
            // Use .show class to control visibility. Remove any hidden state.
            loadingEl.classList.add('show');
            loadingEl.setAttribute('aria-hidden', 'false');
        }
    },

    hideLoading() {
        const loadingEl = document.getElementById('loading');
        if (loadingEl) {
            // Remove .show class to hide the loader
            loadingEl.classList.remove('show');
            loadingEl.setAttribute('aria-hidden', 'true');
        }
    },
    
    showHome() {
        const homeEl = document.getElementById('home');
        if (homeEl) {
            homeEl.classList.remove('hidden');
        }
    },

    /**
     * Exibe a página "Sobre" com informações sobre o projeto.
     */
    showAbout() {
        const aboutEl = document.getElementById('about');
        if (aboutEl) {
            aboutEl.classList.remove('hidden');
        }
    },
    
    async showCatalog() {
        try {
            // Carrega dados se necessário
            if (AppState.products.length === 0) {
                AppState.products = await ApiService.getProducts();
            }
            
            this.renderProducts(AppState.products);
            
            const catalogEl = document.getElementById('catalog');
            if (catalogEl) {
                catalogEl.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Erro ao carregar catálogo:', error);
            Utils.showMessage('Erro ao carregar produtos', 'error');
        }
    },
    
    async showConfigurator(productId) {
        if (!productId) {
            this.navigate('/catalog');
            return;
        }
        
        try {
            // Carrega dados necessários
            const product = await ApiService.getProduct(productId);
            if (!product) {
                this.navigate('/catalog');
                return;
            }
            
            if (AppState.materials.length === 0) {
                AppState.materials = await ApiService.getMaterials();
            }
            if (AppState.sizes.length === 0) {
                AppState.sizes = await ApiService.getSizes();
            }
            
            AppState.currentProductId = productId;
            
            this.renderConfigurator(product, AppState.materials, AppState.sizes);
            
            const configuratorEl = document.getElementById('configurator');
            if (configuratorEl) {
                configuratorEl.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Erro ao carregar configurador:', error);
            Utils.showMessage('Erro ao carregar configurador', 'error');
        }
    },
    
    showCart() {
        this.renderCart();
        const cartEl = document.getElementById('cart');
        if (cartEl) {
            cartEl.classList.remove('hidden');
        }
    },
    
    showCheckout() {
        this.renderCheckout();
        const checkoutEl = document.getElementById('checkout');
        if (checkoutEl) {
            checkoutEl.classList.remove('hidden');
        }
    },
    
    showOrder(orderId) {
        AppState.currentOrderId = orderId;
        this.renderOrder(orderId);
        const orderEl = document.getElementById('order');
        if (orderEl) {
            orderEl.classList.remove('hidden');
        }
    },
    
    async showAdmin() {
        try {
            if (AppState.products.length === 0) {
                AppState.products = await ApiService.getProducts();
            }
            if (AppState.materials.length === 0) {
                AppState.materials = await ApiService.getMaterials();
            }
            
            this.renderAdmin();
            const adminEl = document.getElementById('admin');
            if (adminEl) {
                adminEl.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Erro ao carregar admin:', error);
            Utils.showMessage('Erro ao carregar admin', 'error');
        }
    },
    
    renderProducts(products) {
        const container = document.getElementById('products-grid');
        if (!container) return;
        
        if (products.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <h2>Nenhum produto encontrado</h2>
                    <p>Tente ajustar os filtros de busca</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = products.map(product => `
            <article class="product-card" onclick="navigate('/configurator/${product.id}')" 
                     role="button" tabindex="0" 
                     aria-label="Configurar ${product.nome}"
                     onkeydown="handleProductCardKeydown(event, '${product.id}')">
                <div class="product-card__image" aria-hidden="true">
                    ${product.emoji || '🍭'}
                </div>
                <div class="product-card__content">
                    <h3 class="product-card__title">${product.nome}</h3>
                    <p class="product-card__description">${product.descricao}</p>
                    <div class="product-card__price">
                        ${Utils.formatCurrency(product.preco)}
                    </div>
                    <div class="product-card__tags">
                        ${this.renderAvailableTags(product)}
                    </div>
                    <div class="product-card__actions">
                        <button class="btn btn--primary btn--sm" 
                                onclick="event.stopPropagation(); navigate('/configurator/${product.id}')"
                                aria-label="Configurar embalagem para ${product.nome}">
                            Configurar
                        </button>
                    </div>
                </div>
            </article>
        `).join('');
    },
    
    renderAvailableTags(product) {
        const availableTags = ['biodegradavel', 'compostavel', 'reciclavel'];
        return availableTags.map(tag => `
            <span class="tag">
                ${this.getTagIcon(tag)} ${translations.tags[tag]}
            </span>
        `).join('');
    },
    
    getTagIcon(tag) {
        const icons = {
            'biodegradavel': '🌱',
            'compostavel': '♻️',
            'reciclavel': '📦',
            'soluvel_em_agua': '💧',
            'papel_semente': '🌱'
        };
        return icons[tag] || '📦';
    },
    
    renderConfigurator(product, materials, sizes) {
        const productInfoEl = document.getElementById('product-info');
        if (productInfoEl) {
            productInfoEl.innerHTML = `
                <div class="product-card__image">${product.emoji || '🍭'}</div>
                <div class="product-card__content">
                    <h3 class="product-card__title">${product.nome}</h3>
                    <p class="product-card__description">${product.descricao}</p>
                    <div class="product-card__price">${Utils.formatCurrency(product.preco)}</div>
                    <div class="product-details">
                        <p><strong>Peso:</strong> ${product.peso}g</p>
                        <p><strong>Ingredientes:</strong> ${product.ingredientes.join(', ')}</p>
                    </div>
                </div>
            `;
        }
        
        const materialSelect = document.getElementById('material-select');
        if (materialSelect) {
            materialSelect.innerHTML = `
                <option value="">Selecione um material...</option>
                ${materials.map(material => `
                    <option value="${material.id}">
                        ${material.pictograma} ${material.nome} (+${Utils.formatCurrency(material.custo_adicional)})
                    </option>
                `).join('')}
            `;
        }
        
        const sizeSelect = document.getElementById('size-select');
        if (sizeSelect) {
            sizeSelect.innerHTML = `
                <option value="">Selecione um tamanho...</option>
                ${sizes.map(size => `
                    <option value="${size.id}">
                        ${size.nome} - ${size.dimensoes} (${size.capacidade})
                    </option>
                `).join('')}
            `;
        }
        
        // Reset formulário
        const quantityEl = document.getElementById('quantity');
        if (quantityEl) quantityEl.value = 1;
        
        const generateInclusiveEl = document.getElementById('generate-inclusive');
        if (generateInclusiveEl) generateInclusiveEl.checked = false;
        
        const inclusiveOptionsEl = document.getElementById('inclusive-options');
        if (inclusiveOptionsEl) inclusiveOptionsEl.classList.add('hidden');
        
        updateConfiguration();
    },
    
    renderCart() {
        const cart = CartService.getCart();
        const cartItems = document.getElementById('cart-items');
        const emptyCart = document.getElementById('empty-cart');
        const cartContent = document.getElementById('cart-content');
        
        if (!cartItems || !emptyCart || !cartContent) return;
        
        if (cart.length === 0) {
            cartContent.classList.add('hidden');
            emptyCart.classList.remove('hidden');
            return;
        }
        
        cartContent.classList.remove('hidden');
        emptyCart.classList.add('hidden');
        
        cartItems.innerHTML = cart.map(item => {
            const product = MockData.doces.find(p => p.id === item.productId);
            const material = MockData.materiais.find(m => m.id === item.material);
            const size = MockData.tamanhos.find(s => s.id === item.size);
            
            if (!product || !material || !size) return '';
            
            const basePrice = product.preco * size.multiplicador_preco;
            const packagingPrice = material.custo_adicional;
            const itemTotal = (basePrice + packagingPrice) * item.quantity;
            
            return `
                <div class="cart-item" role="group" aria-labelledby="item-${item.id}-title">
                    <div class="cart-item__image">${product.emoji || '🍭'}</div>
                    <div class="cart-item__info">
                        <h3 class="cart-item__title" id="item-${item.id}-title">${product.nome}</h3>
                        <div class="cart-item__details">
                            Material: ${material.pictograma} ${material.nome}<br>
                            Tamanho: ${size.nome} (${size.dimensoes})
                        </div>
                        <div class="cart-item__controls">
                            <button onclick="CartService.updateQuantity('${item.id}', ${item.quantity - 1})" 
                                    aria-label="Diminuir quantidade" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                            <input type="number" value="${item.quantity}" min="1" max="50" 
                                   onchange="CartService.updateQuantity('${item.id}', parseInt(this.value))"
                                   aria-label="Quantidade de ${product.nome}">
                            <button onclick="CartService.updateQuantity('${item.id}', ${item.quantity + 1})"
                                    aria-label="Aumentar quantidade">+</button>
                            <button onclick="CartService.removeItem('${item.id}')" 
                                    class="btn btn--outline btn--sm"
                                    aria-label="Remover ${product.nome} do carrinho">🗑️</button>
                        </div>
                    </div>
                    <div class="cart-item__price">${Utils.formatCurrency(itemTotal)}</div>
                </div>
            `;
        }).join('');
        
        // Atualiza resumo
        const subtotal = CartService.getTotal();
        const shipping = CartService.getShippingCost();
        const total = subtotal + shipping;
        
        const subtotalEl = document.getElementById('cart-subtotal');
        const shippingEl = document.getElementById('shipping-cost');
        const totalEl = document.getElementById('cart-total');
        
        if (subtotalEl) subtotalEl.textContent = Utils.formatCurrency(subtotal);
        if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Grátis' : Utils.formatCurrency(shipping);
        if (totalEl) totalEl.textContent = Utils.formatCurrency(total);
    },
    
    renderCheckout() {
        const cart = CartService.getCart();
        if (cart.length === 0) {
            this.navigate('/cart');
            return;
        }
        
        const form = document.getElementById('checkout-form');
        if (form) {
            form.onsubmit = handleCheckoutSubmit;
        }
    },
    
    renderOrder(orderId) {
        const order = AppState.orders.find(o => o.id === orderId) || {
            id: orderId || Utils.generateId(),
            items: CartService.getCart(),
            customer: {
                name: 'Cliente Exemplo',
                email: 'cliente@exemplo.com',
                address: 'Endereço de exemplo'
            },
            total: CartService.getTotal() + CartService.getShippingCost(),
            createdAt: new Date().toISOString()
        };
        
        const orderDetailsEl = document.getElementById('order-details');
        if (orderDetailsEl) {
            orderDetailsEl.innerHTML = `
                <h2>Pedido #${order.id}</h2>
                <p><strong>Data:</strong> ${new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
                <p><strong>Status:</strong> <span class="status status--success">Confirmado</span></p>
                <p><strong>Total:</strong> ${Utils.formatCurrency(order.total)}</p>
                <div class="order-impact">
                    <h3>Seu Impacto Positivo:</h3>
                    ${this.renderOrderImpact(order.items || [])}
                </div>
            `;
        }
    },
    
    renderOrderImpact(items) {
        const impact = ImpactService.calculateImpact(items);
        return `
            <div class="impact-metrics">
                <div class="metric">
                    <span class="metric__icon">🚫</span>
                    <span class="metric__value">${impact.plasticAvoided}g</span>
                    <span class="metric__label">Plástico evitado</span>
                </div>
                <div class="metric">
                    <span class="metric__icon">💧</span>
                    <span class="metric__value">${impact.waterSaved}ml</span>
                    <span class="metric__label">Água economizada</span>
                </div>
            </div>
        `;
    },
    
    renderAdmin() {
        this.renderAdminProducts();
        this.renderAdminMaterials();
    },
    
    renderAdminProducts() {
        const container = document.getElementById('admin-products-list');
        if (!container) return;
        
        container.innerHTML = AppState.products.map(product => `
            <div class="admin-item">
                <div class="admin-item__info">
                    <div class="admin-item__title">${product.nome}</div>
                    <div class="admin-item__details">
                        ${Utils.formatCurrency(product.preco)} | ${product.categoria} | ${product.peso}g
                    </div>
                </div>
                <div class="admin-item__actions">
                    <button class="btn btn--outline btn--sm" onclick="editProduct('${product.id}')">
                        Editar
                    </button>
                    <button class="btn btn--outline btn--sm" onclick="deleteProduct('${product.id}')">
                        Excluir
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    renderAdminMaterials() {
        const container = document.getElementById('admin-materials-list');
        if (!container) return;
        
        container.innerHTML = AppState.materials.map(material => `
            <div class="admin-item">
                <div class="admin-item__info">
                    <div class="admin-item__title">${material.pictograma} ${material.nome}</div>
                    <div class="admin-item__details">
                        +${Utils.formatCurrency(material.custo_adicional)} | 
                        Plástico: ${material.impacto.plastico_evitado}g | 
                        Água: ${material.impacto.agua_economizada}ml
                    </div>
                </div>
                <div class="admin-item__actions">
                    <button class="btn btn--outline btn--sm" onclick="editMaterial('${material.id}')">
                        Editar
                    </button>
                    <button class="btn btn--outline btn--sm" onclick="deleteMaterial('${material.id}')">
                        Excluir
                    </button>
                </div>
            </div>
        `).join('');
    }
};

// Funções globais para eventos - SIMPLIFICADAS
function navigate(path) {
    Router.navigate(path);
}

function handleProductCardKeydown(event, productId) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        navigate(`/configurator/${productId}`);
    }
}

function performSearch() {
    const searchEl = document.getElementById('global-search');
    if (searchEl) {
        const query = searchEl.value.toLowerCase().trim();
        AppState.filters.search = query;
        filterProducts();
    }
}

function filterProducts() {
    const tagFilterEl = document.getElementById('tag-filter');
    const tagFilter = tagFilterEl ? tagFilterEl.value : '';
    const searchQuery = AppState.filters.search.toLowerCase();
    
    let filtered = [...AppState.products];
    
    if (tagFilter) {
        filtered = filtered.filter(product => {
            return MockData.materiais.some(material => 
                material.tags.includes(tagFilter)
            );
        });
    }
    
    if (searchQuery) {
        filtered = filtered.filter(product => 
            product.nome.toLowerCase().includes(searchQuery) ||
            product.descricao.toLowerCase().includes(searchQuery) ||
            product.categoria.toLowerCase().includes(searchQuery)
        );
    }
    
    Router.renderProducts(filtered);
}

function clearFilters() {
    const tagFilterEl = document.getElementById('tag-filter');
    const searchEl = document.getElementById('global-search');
    
    if (tagFilterEl) tagFilterEl.value = '';
    if (searchEl) searchEl.value = '';
    
    AppState.filters = { tag: '', search: '' };
    Router.renderProducts(AppState.products);
}

function updateConfiguration() {
    const productId = AppState.currentProductId;
    const materialSelect = document.getElementById('material-select');
    const sizeSelect = document.getElementById('size-select');
    const quantityEl = document.getElementById('quantity');
    
    if (!materialSelect || !sizeSelect || !quantityEl) return;
    
    const materialId = materialSelect.value;
    const sizeId = sizeSelect.value;
    const quantity = parseInt(quantityEl.value) || 1;
    
    // Reset displays
    const plasticEl = document.getElementById('plastic-avoided');
    const waterEl = document.getElementById('water-saved');
    const basePriceEl = document.getElementById('base-price');
    const packagingPriceEl = document.getElementById('packaging-price');
    const totalPriceEl = document.getElementById('total-price');
    const disposalContentEl = document.getElementById('disposal-content');
    
    if (!productId || !materialId || !sizeId) {
        if (plasticEl) plasticEl.textContent = '0g';
        if (waterEl) waterEl.textContent = '0ml';
        if (basePriceEl) basePriceEl.textContent = 'R$ 0,00';
        if (packagingPriceEl) packagingPriceEl.textContent = 'R$ 0,00';
        if (totalPriceEl) totalPriceEl.textContent = 'R$ 0,00';
        if (disposalContentEl) disposalContentEl.innerHTML = '';
        return;
    }
    
    const product = MockData.doces.find(p => p.id === productId);
    const material = MockData.materiais.find(m => m.id === materialId);
    const size = MockData.tamanhos.find(s => s.id === sizeId);
    
    if (!product || !material || !size) return;
    
    // Atualiza impacto
    const impact = ImpactService.estimateImpact(productId, materialId, sizeId, quantity);
    if (plasticEl) plasticEl.textContent = `${impact.plasticAvoided}g`;
    if (waterEl) waterEl.textContent = `${impact.waterSaved}ml`;
    
    // Atualiza preços
    const basePrice = product.preco * size.multiplicador_preco * quantity;
    const packagingPrice = material.custo_adicional * quantity;
    const totalPrice = basePrice + packagingPrice;
    
    if (basePriceEl) basePriceEl.textContent = Utils.formatCurrency(basePrice);
    if (packagingPriceEl) packagingPriceEl.textContent = Utils.formatCurrency(packagingPrice);
    if (totalPriceEl) totalPriceEl.textContent = Utils.formatCurrency(totalPrice);
    
    // Atualiza instruções de descarte
    if (disposalContentEl) {
        disposalContentEl.innerHTML = `
            <div class="disposal-content">
                <span class="pictogram">${material.pictograma}</span>
                <div>
                    <strong>${material.nome}:</strong><br>
                    ${material.descarte}
                </div>
            </div>
        `;
    }
}

/**
 * Destaca o item de menu ativo de acordo com a página atual. Procura por botões
 * de navegação com o atributo data-page e adiciona a classe
 * `.nav__item--active` ao botão cujo valor corresponde à página informada.
 * Remove a classe dos demais itens.
 * @param {string} pageName Nome curto da página (home, catalog, cart, etc.)
 */
function updateNavActive(pageName) {
    const items = document.querySelectorAll('.nav__item[data-page]');
    items.forEach(btn => {
        if (btn.getAttribute('data-page') === pageName) {
            btn.classList.add('nav__item--active');
        } else {
            btn.classList.remove('nav__item--active');
        }
    });
}

function addToCart() {
    const productId = AppState.currentProductId;
    const materialSelect = document.getElementById('material-select');
    const sizeSelect = document.getElementById('size-select');
    const quantityEl = document.getElementById('quantity');
    const generateInclusiveEl = document.getElementById('generate-inclusive');
    const brailleTextEl = document.getElementById('braille-text');
    
    if (!materialSelect || !sizeSelect || !quantityEl) return;
    
    const materialId = materialSelect.value;
    const sizeId = sizeSelect.value;
    const quantity = parseInt(quantityEl.value) || 1;
    const includeInclusive = generateInclusiveEl ? generateInclusiveEl.checked : false;
    
    if (!productId || !materialId || !sizeId) {
        Utils.showMessage('Por favor, selecione todas as opções', 'warning');
        return;
    }
    
    const item = {
        productId,
        material: materialId,
        size: sizeId,
        quantity,
        includeInclusive,
        brailleText: includeInclusive && brailleTextEl ? brailleTextEl.value : null
    };
    
    CartService.addItem(item);
}

function toggleInclusiveLabel() {
    const checkbox = document.getElementById('generate-inclusive');
    const options = document.getElementById('inclusive-options');
    
    if (!checkbox || !options) return;
    
    if (checkbox.checked) {
        options.classList.remove('hidden');
        
        const product = MockData.doces.find(p => p.id === AppState.currentProductId);
        const brailleTextEl = document.getElementById('braille-text');
        if (product && brailleTextEl) {
            brailleTextEl.value = product.nome;
            generateBraille();
        }
    } else {
        options.classList.add('hidden');
    }
}

function generateBraille() {
    const brailleTextEl = document.getElementById('braille-text');
    const braillePreviewEl = document.getElementById('braille-preview');
    
    if (!brailleTextEl || !braillePreviewEl) return;
    
    const text = brailleTextEl.value;
    if (!text) {
        braillePreviewEl.innerHTML = '';
        return;
    }
    
    const brailleText = BrailleService.toBraille(text);
    const brailleSVG = BrailleService.generateBrailleSVG(text);
    
    braillePreviewEl.innerHTML = `
        <div style="margin-bottom: 10px;">
            <strong>Texto em Braille:</strong><br>
            <span style="font-size: 1.2em; letter-spacing: 2px;">${brailleText}</span>
        </div>
        <div class="braille-svg">
            <strong>Visualização tátil:</strong><br>
            ${brailleSVG}
        </div>
    `;
}

function generateQRCode() {
    const brailleTextEl = document.getElementById('braille-text');
    const qrPreviewEl = document.getElementById('qr-preview');
    
    if (!brailleTextEl || !qrPreviewEl) return;
    
    const text = brailleTextEl.value;
    if (!text) {
        Utils.showMessage('Digite um texto para gerar o QR Code', 'warning');
        return;
    }
    
    const product = MockData.doces.find(p => p.id === AppState.currentProductId);
    const qrData = `${product.nome}: ${product.descricao}. ${text}`;
    
    const canvas = QRService.generateQRCode(qrData);
    
    qrPreviewEl.innerHTML = `
        <h4>QR Code Gerado</h4>
        <p>Escaneie para ouvir a descrição do produto</p>
        ${canvas.outerHTML}
        <br>
        <button class="btn btn--outline btn--sm" onclick="downloadQRCode()">
            Baixar QR Code
        </button>
    `;
}

function downloadQRCode() {
    const canvas = document.querySelector('#qr-preview canvas');
    if (canvas) {
        const link = document.createElement('a');
        link.download = 'qr-code-produto.png';
        link.href = canvas.toDataURL();
        link.click();
    }
}

function playAudioDescription() {
    const brailleTextEl = document.getElementById('braille-text');
    if (!brailleTextEl) return;
    
    const text = brailleTextEl.value;
    const product = MockData.doces.find(p => p.id === AppState.currentProductId);
    
    if (!text || !product) {
        Utils.showMessage('Digite um texto primeiro', 'warning');
        return;
    }
    
    const description = `${product.nome}. ${product.descricao}. Ingredientes: ${product.ingredientes.join(', ')}. ${text}`;
    TTSService.speak(description);
}

function updateShipping() {
    const regionEl = document.getElementById('customer-region');
    if (!regionEl) return;
    
    const region = regionEl.value;
    const cart = CartService.getCart();
    
    if (cart.length > 0) {
        const shipping = CartService.getShippingCost(region);
        const subtotal = CartService.getTotal();
        const total = subtotal + shipping;
        
        const shippingEl = document.getElementById('shipping-cost');
        const totalEl = document.getElementById('cart-total');
        
        if (shippingEl) {
            shippingEl.textContent = shipping === 0 ? 'Grátis' : Utils.formatCurrency(shipping);
        }
        if (totalEl) {
            totalEl.textContent = Utils.formatCurrency(total);
        }
    }
}

async function handleCheckoutSubmit(event) {
    event.preventDefault();
    
    const customerName = document.getElementById('customer-name');
    const customerEmail = document.getElementById('customer-email');
    const customerAddress = document.getElementById('customer-address');
    const customerRegion = document.getElementById('customer-region');
    
    if (!customerName || !customerEmail || !customerAddress || !customerRegion) return;
    
    const orderData = {
        items: CartService.getCart(),
        customer: {
            name: customerName.value,
            email: customerEmail.value,
            address: customerAddress.value,
            region: customerRegion.value
        },
        shipping: CartService.getShippingCost(customerRegion.value),
        total: CartService.getTotal() + CartService.getShippingCost(customerRegion.value)
    };
    
    try {
        Router.showLoading();
        const order = await ApiService.createOrder(orderData);
        
        CartService.clearCart();
        navigate(`/orders/${order.id}`);
        
        Utils.showMessage('Pedido confirmado com sucesso!', 'success');
    } catch (error) {
        Utils.showMessage('Erro ao processar pedido', 'error');
    } finally {
        Router.hideLoading();
    }
}

function downloadOrderPDF() {
    const orderId = AppState.currentOrderId || 'exemplo';
    const order = AppState.orders.find(o => o.id === orderId) || {
        id: orderId,
        items: [],
        total: 0,
        createdAt: new Date().toISOString()
    };
    
    const pdfContent = `
EmbalaVerde - Comprovante de Pedido

Pedido: #${order.id}
Data: ${new Date(order.createdAt).toLocaleDateString('pt-BR')}
Total: ${Utils.formatCurrency(order.total)}

Obrigado por escolher embalagens sustentáveis!
    `;
    
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pedido-${order.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    
    Utils.showMessage('Comprovante baixado!', 'success');
}

function showAdminTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
    });
    
    document.querySelectorAll('.admin-panel').forEach(panel => {
        panel.classList.add('hidden');
    });
    
    if (event && event.target) {
        event.target.classList.add('active');
        event.target.setAttribute('aria-selected', 'true');
    }
    
    const panel = document.getElementById(`admin-${tabName}`);
    if (panel) {
        panel.classList.remove('hidden');
    }
}

// Funções de modal e admin (simplificadas)
function openProductModal() {
    Utils.showMessage('Função de modal não implementada neste demo', 'info');
}

function openMaterialModal() {
    Utils.showMessage('Função de modal não implementada neste demo', 'info');
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
    }
}

function editProduct(id) {
    Utils.showMessage('Função de edição não implementada neste demo', 'info');
}

function deleteProduct(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        AppState.products = AppState.products.filter(p => p.id !== id);
        MockData.doces = MockData.doces.filter(p => p.id !== id);
        Router.renderAdminProducts();
        Utils.showMessage('Produto excluído!', 'success');
    }
}

function editMaterial(id) {
    Utils.showMessage('Função de edição não implementada neste demo', 'info');
}

function deleteMaterial(id) {
    if (confirm('Tem certeza que deseja excluir este material?')) {
        AppState.materials = AppState.materials.filter(m => m.id !== id);
        MockData.materiais = MockData.materiais.filter(m => m.id !== id);
        Router.renderAdminMaterials();
        Utils.showMessage('Material excluído!', 'success');
    }
}

// Atalhos de teclado para acessibilidade
document.addEventListener('keydown', function(event) {
    // / - Abrir busca
    if (event.key === '/' && !event.ctrlKey && !event.altKey && !event.target.matches('input, textarea')) {
        event.preventDefault();
        const searchInput = document.getElementById('global-search');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
    
    // Alt+S - Pular para conteúdo
    if (event.altKey && event.key === 's') {
        event.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.focus();
            mainContent.scrollIntoView();
        }
    }
    
    // g c - Ir ao carrinho
    if (event.key === 'g' && !event.target.matches('input, textarea')) {
        document.addEventListener('keydown', function nextKeyHandler(nextEvent) {
            if (nextEvent.key === 'c') {
                event.preventDefault();
                nextEvent.preventDefault();
                navigate('/cart');
            }
            document.removeEventListener('keydown', nextKeyHandler);
        }, { once: true });
    }
    
    // Esc - Fechar modal
    if (event.key === 'Escape') {
        const modal = document.getElementById('modal');
        if (modal && !modal.classList.contains('hidden')) {
            closeModal();
        }
        TTSService.stop();
    }
});

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    console.log('EmbalaVerde iniciando...');
    
    try {
        // Carrega carrinho do localStorage
        AppState.cart = CartService.getCart();
        CartService.updateCartUI();
        
        // Configura busca com debounce
        const searchEl = document.getElementById('global-search');
        if (searchEl) {
            const debouncedSearch = Utils.debounce(performSearch, 300);
            searchEl.addEventListener('input', debouncedSearch);
        }
        
        // Inicia na página inicial
        Router.navigate('/');
        
        // PWA support
        if ('serviceWorker' in navigator) {
            console.log('Service Worker support detected');
        }

        // Aplica tema salvo ou sistema padrão, e configura botão de alternância
        try {
            const root = document.documentElement;
            const savedTheme = localStorage.getItem('embala-verde-theme');
            if (savedTheme === 'dark' || savedTheme === 'light') {
                root.setAttribute('data-color-scheme', savedTheme);
                updateThemeToggleIcon(savedTheme);
            } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                root.setAttribute('data-color-scheme', 'dark');
                updateThemeToggleIcon('dark');
            } else {
                updateThemeToggleIcon('light');
            }

            const themeToggleBtn = document.getElementById('theme-toggle');
            if (themeToggleBtn) {
                themeToggleBtn.addEventListener('click', toggleTheme);
            }
        } catch (err) {
            console.warn('Erro ao inicializar tema:', err);
        }
        
        Utils.showMessage('EmbalaVerde carregado com sucesso!', 'success');
    } catch (error) {
        console.error('Erro na inicialização:', error);
        Utils.showMessage('Erro ao inicializar aplicativo', 'error');
    }
});

// Detecta quando a página perde/ganha foco (para PWA)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        CartService.saveCart(AppState.cart);
    } else {
        CartService.updateCartUI();
    }
});

// Exporta funções para uso global
window.navigate = navigate;
window.performSearch = performSearch;
window.filterProducts = filterProducts;
window.clearFilters = clearFilters;
window.updateConfiguration = updateConfiguration;
window.addToCart = addToCart;
window.toggleInclusiveLabel = toggleInclusiveLabel;
window.generateBraille = generateBraille;
window.generateQRCode = generateQRCode;
window.downloadQRCode = downloadQRCode;
window.playAudioDescription = playAudioDescription;
window.updateShipping = updateShipping;
window.downloadOrderPDF = downloadOrderPDF;
window.showAdminTab = showAdminTab;
window.openProductModal = openProductModal;
window.openMaterialModal = openMaterialModal;
window.closeModal = closeModal;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.editMaterial = editMaterial;
window.deleteMaterial = deleteMaterial;
window.handleProductCardKeydown = handleProductCardKeydown;

// ==========================
// Tema Claro/Escuro
// ==========================

/**
 * Alterna entre os temas claro e escuro. Atualiza o atributo
 * `data-color-scheme` no elemento root (`<html>`), armazena a
 * preferência no localStorage e atualiza o ícone do botão.
 */
function toggleTheme() {
    const root = document.documentElement;
    const current = root.getAttribute('data-color-scheme') || 'light';
    const newTheme = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-color-scheme', newTheme);
    try {
        localStorage.setItem('embala-verde-theme', newTheme);
    } catch (err) {
        console.warn('Não foi possível salvar preferência de tema:', err);
    }
    updateThemeToggleIcon(newTheme);
}

/**
 * Atualiza o conteúdo do botão de alternância de tema para refletir
 * o estado atual. Usa um ícone de sol para o tema escuro (indicando
 * que clicar voltará ao claro) e um ícone de lua para o tema claro.
 * @param {string} theme Tema atual ('light' ou 'dark')
 */
function updateThemeToggleIcon(theme) {
    const toggleButton = document.getElementById('theme-toggle');
    if (!toggleButton) return;
    if (theme === 'dark') {
        toggleButton.textContent = '☀️';
        toggleButton.setAttribute('aria-label', 'Alternar para o modo claro');
    } else {
        toggleButton.textContent = '🌙';
        toggleButton.setAttribute('aria-label', 'Alternar para o modo escuro');
    }
}

// Exporta funções de tema para escopo global (principalmente para testes)
window.toggleTheme = toggleTheme;
window.CartService = CartService;