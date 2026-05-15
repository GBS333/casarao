import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  Minus, 
  X, 
  ChevronRight, 
  MapPin, 
  User, 
  CreditCard, 
  MessageSquare,
  ArrowRight,
  UtensilsCrossed,
  CheckCircle2,
  Home,
  Clock,
  Instagram,
  Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { products, pizzaFlavors } from './data/products';
import { Product, CartItem, Category, OrderData, ProductSize } from './types';
import logo from '../Captura_de_tela_2026-05-08_132518-removebg-preview.png';

const RESTAURANT_NAME = "Casarão";
const WHATSAPP_NUMBER = "5548991634918";
const DELIVERY_FEE = 5.00;

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Todos'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [logoError, setLogoError] = useState(false);
  const [selectedProductForSize, setSelectedProductForSize] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [orderData, setOrderData] = useState<OrderData>({
    name: '',
    address: '',
    paymentMethod: 'Pix',
    notes: ''
  });

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1600&auto=format&fit=crop",
    },
    {
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop",
    },
    {
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1600&auto=format&fit=crop",
    },
    {
      image: "https://images.unsplash.com/photo-1535400255456-984241443b29?q=80&w=1600&auto=format&fit=crop",
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Persistência local do carrinho
  useEffect(() => {
    const savedCart = localStorage.getItem('casarao_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('casarao_cart', JSON.stringify(cart));
  }, [cart]);

  const categories: (Category | 'Todos')[] = [
    'Todos', 
    'Pizzas Clássicas', 
    'Bordas Recheadas',
    'Lanches', 
    'Petiscos Diversos', 
    'Porções', 
    'Petiscos', 
    'Petiscos do Mar', 
    'À la Carte', 
    'Massas', 
    'Risotos', 
    'Sopas e Cremes', 
    'Guarnições', 
    'Saladas', 
    'Sobremesas', 
    'Bebidas', 
    'Drinks', 
    'Cervejas', 
    'Doses'
  ];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product, size?: string, customPrice?: number, flavors?: string[]) => {
    const finalPrice = customPrice !== undefined ? customPrice : product.price;
    const finalSize = size || (product.sizes ? product.sizes[0].name : undefined);

    setCart(prev => {
      const existing = prev.find(item => 
        item.id === product.id && 
        item.selectedSize === finalSize &&
        JSON.stringify(item.selectedFlavors) === JSON.stringify(flavors)
      );
      
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.selectedSize === finalSize && JSON.stringify(item.selectedFlavors) === JSON.stringify(flavors))
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        selectedSize: finalSize,
        itemPrice: finalPrice,
        image: product.image,
        category: product.category,
        selectedFlavors: flavors
      };
      
      return [...prev, newItem];
    });
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
    resetPizzaForm();
  };

  const resetPizzaForm = () => {
    setSelectedProductForSize(null);
    setSelectedSize(null);
    setSelectedFlavors([]);
  };

  const handleAddToCartClick = (product: Product) => {
    if (product.sizes && product.sizes.length > 0) {
      setSelectedProductForSize(product);
    } else {
      addToCart(product);
    }
  };

  const removeFromCart = (id: number, size?: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedSize === size)));
  };

  const updateQuantity = (id: number, delta: number, size?: string) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.selectedSize === size) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const toggleFlavor = (flavorName: string) => {
    if (!selectedSize) return;
    
    if (selectedFlavors.includes(flavorName)) {
      setSelectedFlavors(prev => prev.filter(f => f !== flavorName));
    } else if (selectedFlavors.length < (selectedSize.maxFlavors || 1)) {
      setSelectedFlavors(prev => [...prev, flavorName]);
    }
  };

  const pizzaFlavorsByCategory = useMemo(() => {
    const groups: Record<string, string[]> = {};
    pizzaFlavors.forEach(f => {
      if (!groups[f.category]) groups[f.category] = [];
      groups[f.category].push(f.name);
    });
    return groups;
  }, []);

  const cartTotal = cart.reduce((acc, item) => acc + (item.itemPrice * item.quantity), 0);
  const grandTotal = cart.length > 0 ? cartTotal + DELIVERY_FEE : 0;
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const formatWhatsAppMessage = () => {
    const itemsText = cart.map(item => {
      const subtotal = (item.itemPrice * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const sizeText = item.selectedSize ? ` (${item.selectedSize})` : '';
      const flavorsText = item.selectedFlavors && item.selectedFlavors.length > 0 
        ? `\n      Sabores: ${item.selectedFlavors.join(', ')}` 
        : '';
      return `${item.quantity}x ${item.name}${sizeText}${flavorsText} - ${subtotal}`;
    }).join('\n');
    const deliveryFormatted = DELIVERY_FEE.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const totalFormatted = grandTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    const message = `🛒 *NOVO PEDIDO - ${RESTAURANT_NAME}*

👤 *Cliente:* 
${orderData.name}

📍 *Endereço:* 
${orderData.address}

🍔 *Pedido:*
${itemsText}

🛵 *Entrega:* ${deliveryFormatted}

💰 *Pagamento:* 
${orderData.paymentMethod}

📝 *Observação:* 
${orderData.notes || 'Nenhuma'}

💵 *TOTAL FINAL:* 
${totalFormatted}

---
_Gerado via Casarão Digital_`;

    // Normalizar caracteres como espaços inseparáveis (comum em toLocaleString) que podem quebrar no zap
    const cleanMessage = message.replace(/\u00A0/g, ' ');

    return encodeURIComponent(cleanMessage);
  };

  const handleFinalize = () => {
    if (!orderData.name || !orderData.address) {
      alert("Por favor, preencha nome e endereço!");
      return;
    }
    
    // Usar api.whatsapp.com/send para maior compatibilidade com caracteres especiais
    const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${formatWhatsAppMessage()}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-bg-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-auto flex items-center justify-center overflow-hidden">
              {!logoError ? (
                <img 
                  src={logo} 
                  alt="Casarão Logo" 
                  className="h-full w-auto object-contain brightness-200" 
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <Home className="text-white w-6 h-6" />
                </div>
              )}
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-tight leading-none">
                {RESTAURANT_NAME}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">Aberto • 30-45 min</p>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-sm mx-8 hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="O que você quer comer hoje?" 
                className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-primary/50 transition-all text-sm placeholder:text-white/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 glass rounded-2xl hover:bg-white/10 transition-all group"
            >
              <ShoppingCart className="w-6 h-6 group-hover:text-primary transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                  {cartCount}
                </span>
              )}
            </button>
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hidden sm:block overflow-hidden">
               <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" alt="User" />
            </div>
          </div>
        </div>
      </header>

      {/* HERO CAROUSEL */}
      <section className="relative h-64 sm:h-[450px] overflow-hidden flex items-center p-6 md:p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-bg-dark via-bg-dark/40 to-transparent z-10" />
            <img 
              src={slides[currentSlide].image} 
              alt="Banner" 
              className="absolute inset-0 w-full h-full object-cover scale-105"
            />
          </motion.div>
        </AnimatePresence>
        
        <div className="relative z-20 max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentSlide}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5 }}
              className="glass p-10 rounded-[32px] border-white/10 flex flex-col items-center sm:items-start text-center sm:text-left"
            >
              <div className="mb-8">
                {!logoError ? (
                  <img src={logo} className="h-28 sm:h-40 w-auto object-contain brightness-200" alt="Logo Casarão" />
                ) : (
                  <h2 className="text-3xl sm:text-5xl font-black mb-3 leading-tight tracking-tighter uppercase italic">
                    {RESTAURANT_NAME}
                  </h2>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6">
                <button 
                  onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-primary hover:bg-primary-dark text-white font-black px-10 py-4 rounded-2xl transition-all flex items-center gap-2 group shadow-xl shadow-primary/20"
                >
                  Ver Cardápio <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Pontos de navegação do carrossel */}
                <div className="flex items-center gap-2">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all ${currentSlide === idx ? 'w-8 bg-primary' : 'w-2 bg-white/20'}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CATEGORIAS */}
      <div className="sticky top-[73px] z-30 bg-bg-dark py-4 border-b border-white/5 overflow-x-auto no-scrollbar" id="menu">
        <div className="max-w-7xl mx-auto px-4 flex gap-2 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all border ${
                selectedCategory === cat 
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                : 'glass text-white/50 border-white/5 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUTOS */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode='popLayout'>
            {filteredProducts.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={product.id}
                className="group glass rounded-[32px] overflow-hidden border-white/5 hover:border-primary/50 transition-all flex flex-col p-4 gap-4"
              >
                <div className="relative w-full aspect-square overflow-hidden rounded-2xl group-hover:rotate-2 transition-transform">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 glass backdrop-blur-lg px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary">
                    {product.category}
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors leading-tight">{product.name}</h3>
                    <p className="text-white/40 text-[11px] line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-black text-primary">
                      {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                    <button 
                      onClick={() => handleAddToCartClick(product)}
                      className="w-10 h-10 bg-primary hover:bg-primary-dark text-white rounded-xl flex items-center justify-center transition-all active:scale-90 shadow-lg shadow-primary/20"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-white/20" />
            </div>
            <h3 className="text-xl font-bold text-white/40">Nenhum produto encontrado</h3>
            <p className="text-white/20">Tente buscar por outro termo ou categoria.</p>
          </div>
        )}
      </main>

      {/* CARRINHO LATERAL (DRAWER) */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-bg-dark/40 backdrop-blur-2xl border-l border-white/10 z-[60] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-none">Seu Pedido</h3>
                    <p className="text-[10px] text-white/40 mt-1 uppercase font-black">{cartCount} {cartCount === 1 ? 'item' : 'itens'}</p>
                  </div>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                      <ShoppingCart className="w-12 h-12" />
                    </div>
                    <p className="text-lg font-black uppercase tracking-widest">Vazio</p>
                    <p className="text-xs max-w-[200px] mx-auto mt-2">Navegue pelo cardápio e adicione seus favoritos!</p>
                  </div>
                ) : (
                  cart.map((item, index) => (
                    <div key={`${item.id}-${item.selectedSize}-${index}`} className="flex gap-4 items-center group">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden glass p-1">
                        <img src={item.image} className="w-full h-full object-cover rounded-xl" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">
                            {item.name}
                            {item.selectedSize && <span className="text-primary block text-[10px] mt-1 opacity-80 uppercase tracking-widest font-black">{item.selectedSize}</span>}
                            {item.selectedFlavors && item.selectedFlavors.length > 0 && (
                              <span className="text-white/40 block text-[10px] mt-1 leading-relaxed">
                                Sabores: {item.selectedFlavors.join(', ')}
                              </span>
                            )}
                          </h4>
                          <button onClick={() => removeFromCart(item.id, item.selectedSize)} className="text-white/20 hover:text-red-400 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/60 font-medium text-xs">
                            {item.itemPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                          <div className="flex items-center gap-3 bg-white/5 rounded-xl border border-white/5 p-1 px-2">
                            <button 
                              onClick={() => updateQuantity(item.id, -1, item.selectedSize)}
                              className="text-primary hover:scale-125 transition-transform"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1, item.selectedSize)}
                              className="text-primary hover:scale-125 transition-transform"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 border-t border-white/10 glass rounded-t-[40px]">
                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between text-xs font-bold text-white/40 uppercase tracking-widest">
                      <span>Subtotal</span>
                      <span>{cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-white/40 uppercase tracking-widest">
                      <span>Entrega</span>
                      <span>{DELIVERY_FEE.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-lg font-black">Total</span>
                      <span className="text-3xl font-black text-primary">
                        {grandTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-2xl shadow-primary/30"
                  >
                    Finalizar Pedido <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* CHECKOUT MODAL */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass rounded-[40px] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              <div className="p-10">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h3 className="text-3xl font-black tracking-tight">Finalizar</h3>
                    <p className="text-xs text-white/40 uppercase font-bold tracking-widest mt-1">Preencha os detalhes da entrega</p>
                  </div>
                  <button onClick={() => setIsCheckoutOpen(false)} className="p-3 hover:bg-white/5 rounded-full transition-colors border border-white/10">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 px-1">
                      Seu Nome
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input 
                        type="text" 
                        placeholder="Ex: João Silva"
                        className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 pr-5 outline-none focus:border-primary/50 transition-all text-sm placeholder:text-white/10"
                        value={orderData.name}
                        onChange={(e) => setOrderData({...orderData, name: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 px-1">
                      Endereço de Entrega
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input 
                        type="text" 
                        placeholder="Rua, Número, Bairro..."
                        className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 pr-5 outline-none focus:border-primary/50 transition-all text-sm placeholder:text-white/10"
                        value={orderData.address}
                        onChange={(e) => setOrderData({...orderData, address: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 px-1">
                        Pagamento
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <select 
                          className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 pr-5 outline-none focus:border-primary/50 transition-all text-sm appearance-none"
                          value={orderData.paymentMethod}
                          onChange={(e) => setOrderData({...orderData, paymentMethod: e.target.value})}
                        >
                          <option className="bg-bg-dark">Pix</option>
                          <option className="bg-bg-dark">Cartão Crédito</option>
                          <option className="bg-bg-dark">Cartão Débito</option>
                          <option className="bg-bg-dark">Dinheiro</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 px-1">
                        Observações
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input 
                          type="text" 
                          placeholder="Ex: Sem cebola..."
                          className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 pr-5 outline-none focus:border-primary/50 transition-all text-sm placeholder:text-white/10"
                          value={orderData.notes}
                          onChange={(e) => setOrderData({...orderData, notes: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-10 border-t border-white/10 flex flex-col gap-6">
                  <div className="flex flex-col gap-2 px-2">
                    <div className="flex justify-between items-center text-white/30 text-xs uppercase font-bold tracking-widest">
                      <span>Produtos</span>
                      <span>{cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                    <div className="flex justify-between items-center text-white/30 text-xs uppercase font-bold tracking-widest">
                      <span>Entrega</span>
                      <span>{DELIVERY_FEE.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs font-black uppercase tracking-widest text-white/30">Total Final</span>
                      <span className="text-3xl font-black text-primary">{grandTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleFinalize}
                    className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white font-black py-6 rounded-[24px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl shadow-orange-500/30"
                  >
                    Enviar Pedido WhatsApp <ArrowRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST SUCCESS */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-white text-bg-dark px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl font-bold"
          >
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Adicionado ao carrinho!
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOAT ACTION BUTTON MOBILE */}
      {cartCount > 0 && !isCartOpen && !isCheckoutOpen && (
        <motion.div 
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="lg:hidden fixed bottom-6 left-6 right-6 z-40"
        >
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full glass bg-primary/90 text-white font-black py-5 rounded-[24px] flex items-center justify-between px-8 shadow-[0_20px_50px_rgba(249,115,22,0.3)] active:scale-95 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/20 text-white w-8 h-8 rounded-lg flex items-center justify-center font-black">
                {cartCount}
              </div>
              <span className="uppercase tracking-widest text-xs">Ver Carrinho</span>
            </div>
            <span className="text-lg">
              {grandTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </button>
        </motion.div>
      )}

      {/* SIZE & FLAVOR SELECTION MODAL */}
      <AnimatePresence>
        {selectedProductForSize && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetPizzaForm}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass rounded-[40px] border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black">{selectedProductForSize.name}</h3>
                    <p className="text-white/40 text-sm mt-1">{selectedProductForSize.description}</p>
                  </div>
                  <button onClick={resetPizzaForm} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                {/* 1. Escolha o Tamanho */}
                <section>
                  <h4 className="text-sm uppercase tracking-widest font-black text-primary mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px]">1</span>
                    Escolha o Tamanho
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedProductForSize.sizes?.map((size) => (
                      <button
                        key={size.name}
                        onClick={() => {
                          setSelectedSize(size);
                          setSelectedFlavors([]);
                        }}
                        className={`flex flex-col p-5 rounded-3xl border transition-all text-left ${
                          selectedSize?.name === size.name 
                          ? 'bg-primary border-primary shadow-lg shadow-primary/20' 
                          : 'bg-white/5 border-white/5 hover:border-white/20'
                        }`}
                      >
                        <span className={`font-bold ${selectedSize?.name === size.name ? 'text-white' : 'text-white/90'}`}>{size.name}</span>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs ${selectedSize?.name === size.name ? 'text-white/70' : 'text-white/40'}`}>Até {size.maxFlavors} sabores</span>
                          <span className={`font-black ${selectedSize?.name === size.name ? 'text-white' : 'text-primary'}`}>
                            {size.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                {/* 2. Escolha os Sabores */}
                {selectedProductForSize.isPizza && selectedSize && (
                  <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm uppercase tracking-widest font-black text-primary flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px]">2</span>
                        Escolha os Sabores
                      </h4>
                      <span className="text-[10px] bg-white/10 px-3 py-1 rounded-full text-white/60">
                        {selectedFlavors.length} / {selectedSize.maxFlavors} selecionados
                      </span>
                    </div>

                    <div className="space-y-8">
                      {(Object.entries(pizzaFlavorsByCategory) as [string, string[]][]).map(([category, flavors]) => (
                        <div key={category}>
                          <h5 className="text-xs font-black text-white/30 uppercase tracking-widest mb-4 border-l-2 border-primary/30 pl-3">{category}</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {flavors.map((flavorName) => {
                              const flavorObj = pizzaFlavors.find(f => f.name === flavorName);
                              return (
                                <button
                                  key={flavorName}
                                  onClick={() => toggleFlavor(flavorName)}
                                  disabled={!selectedFlavors.includes(flavorName) && selectedFlavors.length >= (selectedSize.maxFlavors || 1)}
                                  className={`flex flex-col p-4 rounded-2xl border transition-all text-left ${
                                    selectedFlavors.includes(flavorName)
                                    ? 'bg-primary/20 border-primary shadow-sm'
                                    : 'bg-white/5 border-white/5 hover:border-white/10 disabled:opacity-30 disabled:cursor-not-allowed'
                                  }`}
                                >
                                  <div className="flex items-center justify-between w-full mb-1">
                                    <span className={`text-sm font-bold ${selectedFlavors.includes(flavorName) ? 'text-primary' : 'text-white/80'}`}>{flavorName}</span>
                                    {selectedFlavors.includes(flavorName) && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                  </div>
                                  {flavorObj?.description && (
                                    <p className={`text-[10px] leading-tight ${selectedFlavors.includes(flavorName) ? 'text-primary/60' : 'text-white/30'}`}>
                                      {flavorObj.description}
                                    </p>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}
              </div>

              <div className="p-8 border-t border-white/10 bg-white/5">
                <button
                  disabled={!selectedSize || (selectedProductForSize.isPizza && selectedFlavors.length === 0)}
                  onClick={() => addToCart(selectedProductForSize, selectedSize?.name, selectedSize?.price, selectedFlavors)}
                  className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-5 rounded-[24px] transition-all flex items-center justify-center gap-2 group shadow-xl shadow-primary/20"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  ADICIONAR AO PEDIDO • {selectedSize?.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="mt-20 py-12 bg-card-dark border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex flex-col items-center justify-center mb-6">
            {!logoError ? (
              <img 
                src={logo} 
                alt="Casarão Logo" 
                className="h-32 sm:h-48 w-auto object-contain brightness-200 opacity-90" 
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mb-4">
                <Home className="text-primary w-10 h-10" />
              </div>
            )}
          </div>
          <p className="text-sm text-white/30 max-w-xs mx-auto mb-8">
            Produtos de alta qualidade entregues direto na sua porta. Atendimento rápido e prático.
          </p>
          <div className="flex justify-center gap-4 mb-8">
             <div className="w-24 h-24 bg-white p-2 rounded-xl flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity cursor-help" title="QR Code fictício para o menu">
                <div className="w-full h-full bg-bg-dark rounded-sm flex items-center justify-center text-[10px] font-bold text-white text-center p-1">QR CODE MENU</div>
             </div>
          </div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-white/20">
            &copy; 2024 FoodZap Digital - Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}
