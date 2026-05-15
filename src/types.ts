export interface ProductSize {
  name: string;
  price: number;
  maxFlavors?: number;
}

export interface Flavor {
  id: number;
  name: string;
  category: string;
  description?: string;
  priceModifier?: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  sizes?: ProductSize[];
  isPizza?: boolean;
}

export interface CartItem {
  id: number;
  name: string;
  price: number; // Base price or original price
  quantity: number;
  selectedSize?: string;
  selectedFlavors?: string[];
  itemPrice: number; // Price of the specific size
  image: string;
  category: string;
}

export type Category = 
  | 'Pizzas Clássicas' 
  | 'Pizzas Tradicionais' 
  | 'Pizzas Doces Tradicionais' 
  | 'Pizzas Doces Especiais' 
  | 'Bordas Recheadas'
  | 'Lanches' 
  | 'Petiscos Diversos' 
  | 'Porções' 
  | 'Petiscos' 
  | 'Petiscos do Mar' 
  | 'À la Carte' 
  | 'Massas' 
  | 'Risotos' 
  | 'Sopas e Cremes' 
  | 'Guarnições' 
  | 'Saladas' 
  | 'Sobremesas' 
  | 'Bebidas' 
  | 'Drinks' 
  | 'Cervejas' 
  | 'Doses';

export interface OrderData {
  name: string;
  address: string;
  paymentMethod: string;
  notes: string;
}
