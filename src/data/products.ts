import { Product, Flavor } from '../types';

export const pizzaFlavors: Flavor[] = [
  // Clássicas
  { 
    id: 101, 
    name: "Alho-Poró", 
    category: "Pizzas Clássicas",
    description: "Molho de tomate, muçarela, alho-poró, parmesão e orégano"
  },
  { 
    id: 102, 
    name: "Atum", 
    category: "Pizzas Clássicas",
    description: "Molho de tomate, muçarela, atum, cebola e orégano"
  },
  { 
    id: 103, 
    name: "Bacon", 
    category: "Pizzas Clássicas",
    description: "Molho de tomate, muçarela, bacon, ovo de codorna e orégano"
  },
  { 
    id: 104, 
    name: "Baiana", 
    category: "Pizzas Clássicas",
    description: "Molho de tomate, muçarela, calabresa, molho de pimenta, cebola e orégano"
  },
  { 
    id: 105, 
    name: "Brócolis com Bacon", 
    category: "Pizzas Clássicas",
    description: "Molho de tomate, muçarela, brócolis, alho, requeijão, bacon e orégano"
  },
  { 
    id: 106, 
    name: "Calabresa Premium", 
    category: "Pizzas Clássicas",
    description: "Molho de tomate, muçarela, calabresa, tomate seco, manjericão e orégano"
  },
  { 
    id: 107, 
    name: "Carne de Panela", 
    category: "Pizzas Clássicas",
    description: "Molho de tomate, muçarela, carne desfiada, parmesão, cebola e orégano"
  },
  { 
    id: 108, 
    name: "Coração", 
    category: "Pizzas Clássicas",
    description: "Molho de tomate, muçarela, coração fatiado, cebola, azeitona e orégano"
  },
  { 
    id: 109, 
    name: "Coração ao Alho", 
    category: "Pizzas Clássicas",
    description: "Molho de tomate, muçarela, coração fatiado, cebola, alho, requeijão e orégano"
  }
];

export const products: Product[] = [
  // Produto Principal de Pizza
  {
    id: 1000,
    name: "Pizza Clássica",
    description: "Saborosa, artesanal e com os melhores ingredientes.",
    price: 75.00,
    category: "Pizzas Clássicas",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop",
    isPizza: true,
    sizes: [
      { name: "Pequena (4 fatias - 25cm)", price: 75.00, maxFlavors: 1 },
      { name: "Média (6 fatias - 30cm)", price: 95.00, maxFlavors: 2 },
      { name: "Grande (8 fatias - 35cm)", price: 130.00, maxFlavors: 5 },
      { name: "Gigante (12 fatias - 40cm)", price: 160.00, maxFlavors: 4 },
    ]
  },

  // Lanches
  {
    id: 8,
    name: "X-Salada Casarão",
    description: "Pão, hambúrguer artesanal, queijo, alface, tomate e maionese.",
    price: 26.90,
    category: "Lanches",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop"
  },
  // ... rest of non-pizza products
  {
    id: 9,
    name: "Bolinho de Bacalhau",
    description: "10 unidades de bolinhos fritos crocantes.",
    price: 38.00,
    category: "Petiscos Diversos",
    image: "https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 10,
    name: "Fritas com Queijo e Bacon",
    description: "500g de batatas selecionadas, cheddar e bacon.",
    price: 34.00,
    category: "Porções",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 11,
    name: "Frango a Passarinho",
    description: "Coxinhas da asa fritas com alho crocante.",
    price: 45.00,
    category: "Petiscos",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 12,
    name: "Camarão à Milanesa",
    description: "Camarões de laguna empanados e fritos.",
    price: 89.00,
    category: "Petiscos do Mar",
    image: "https://images.unsplash.com/photo-1535400255456-984241443b29?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 13,
    name: "Filé Mignon ao Molho Madeira",
    description: "Acompanha arroz, fritas e salada.",
    price: 110.00,
    category: "À la Carte",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 14,
    name: "Lasanha à Bolonhesa",
    description: "Pasta artesanal com molho de carne e bastante queijo.",
    price: 58.00,
    category: "Massas",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 15,
    name: "Risoto de Camarão",
    description: "Arroz arbóreo, camarões frescos e parmesão.",
    price: 72.00,
    category: "Risotos",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 16,
    name: "Creme de Mandioca",
    description: "Creme quente com pedaços de carne seca.",
    price: 28.00,
    category: "Sopas e Cremes",
    image: "https://images.unsplash.com/photo-1547592110-803264627447?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 17,
    name: "Arroz Branco",
    description: "Porção individual de arroz soltinho.",
    price: 12.00,
    category: "Guarnições",
    image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 18,
    name: "Salada Mix",
    description: "Folhas verdes, tomate, cebola e palmito.",
    price: 22.00,
    category: "Saladas",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 19,
    name: "Petit Gateau",
    description: "Bolinho quente com sorvete de creme.",
    price: 24.00,
    category: "Sobremesas",
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 20,
    name: "Refrigerante Lata",
    description: "Coca-Cola, Guaraná ou Fanta 350ml.",
    price: 6.50,
    category: "Bebidas",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 21,
    name: "Caipirinha",
    description: "Limão, cachaça premium, açúcar e gelo.",
    price: 18.00,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 22,
    name: "Heineken 600ml",
    description: "Cerveja lager premium bem gelada.",
    price: 18.00,
    category: "Cervejas",
    image: "https://images.unsplash.com/photo-1618885472179-5e474019f2a9?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 23,
    name: "Whisky 12 Anos",
    description: "Dose de 50ml servida com gelo de coco.",
    price: 25.00,
    category: "Doses",
    image: "https://images.unsplash.com/photo-1527281473232-9cbd7cb6d1b4?q=80&w=800&auto=format&fit=crop"
  }
];
