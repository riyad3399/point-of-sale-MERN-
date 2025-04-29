import { Product, User } from '../types';

export const sampleCategories = [
  'Beverages',
  'Food',
  'Snacks',
  'Desserts',
  'Merchandise'
];


 


export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Cappuccino',
    description: 'Rich espresso with steamed milk and a deep layer of foam',
    price: 4.50,
    category: 'Beverages',
    image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg',
    sku: 'BEV-CAP-001',
    stock: 100,
    isActive: true
  },
  {
    id: '2',
    name: 'Latte',
    description: 'Espresso with steamed milk and a light layer of foam',
    price: 4.25,
    category: 'Beverages',
    image: 'https://images.pexels.com/photos/350478/pexels-photo-350478.jpeg',
    sku: 'BEV-LAT-002',
    stock: 100,
    isActive: true
  },
  {
    id: '3',
    name: 'Croissant',
    description: 'Flaky, buttery pastry',
    price: 3.25,
    category: 'Food',
    image: 'https://images.pexels.com/photos/3892469/pexels-photo-3892469.jpeg',
    sku: 'FOOD-CRO-001',
    stock: 25,
    isActive: true
  },
  {
    id: '4',
    name: 'Chocolate Chip Cookie',
    description: 'Fresh-baked cookie with chocolate chips',
    price: 2.50,
    category: 'Desserts',
    image: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg',
    sku: 'DES-COO-001',
    stock: 30,
    isActive: true
  },
  {
    id: '5',
    name: 'Avocado Toast',
    description: 'Toasted artisan bread with avocado, salt, and red pepper',
    price: 7.95,
    category: 'Food',
    image: 'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg',
    sku: 'FOOD-AVT-001',
    stock: 15,
    isActive: true
  },
  {
    id: '6',
    name: 'Iced Coffee',
    description: 'Cold brewed coffee served over ice',
    price: 3.75,
    category: 'Beverages',
    image: 'https://images.pexels.com/photos/2074122/pexels-photo-2074122.jpeg',
    sku: 'BEV-ICE-001',
    stock: 100,
    isActive: true
  },
  {
    id: '7',
    name: 'Blueberry Muffin',
    description: 'Freshly baked muffin with blueberries',
    price: 3.50,
    category: 'Desserts',
    image: 'https://images.pexels.com/photos/1634065/pexels-photo-1634065.jpeg',
    sku: 'DES-MUF-001',
    stock: 20,
    isActive: true
  },
  {
    id: '8',
    name: 'Branded Mug',
    description: 'Ceramic mug with our logo',
    price: 12.95,
    category: 'Merchandise',
    image: 'https://images.pexels.com/photos/1793035/pexels-photo-1793035.jpeg',
    sku: 'MERCH-MUG-001',
    stock: 40,
    isActive: true
  },
  {
    id: '9',
    name: 'Breakfast Sandwich',
    description: 'Egg, cheese, and bacon on a toasted brioche bun',
    price: 6.95,
    category: 'Food',
    image: 'https://images.pexels.com/photos/139746/pexels-photo-139746.jpeg',
    sku: 'FOOD-SAND-001',
    stock: 15,
    isActive: true
  },
  {
    id: '10',
    name: 'Potato Chips',
    description: 'Kettle-cooked potato chips, lightly salted',
    price: 1.95,
    category: 'Snacks',
    image: 'https://images.pexels.com/photos/5848742/pexels-photo-5848742.jpeg',
    sku: 'SNACK-CHIP-001',
    stock: 50,
    isActive: true
  },
  {
    id: '11',
    name: 'Fruit Cup',
    description: 'Fresh seasonal fruit mix',
    price: 4.50,
    category: 'Food',
    image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg',
    sku: 'FOOD-FRUT-001',
    stock: 10,
    isActive: true
  },
  {
    id: '12',
    name: 'Chocolate Brownie',
    description: 'Rich, fudgy chocolate brownie',
    price: 3.75,
    category: 'Desserts',
    image: 'https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg',
    sku: 'DES-BRWN-001',
    stock: 24,
    isActive: true
  }
];

export const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    isActive: true
  },
  {
    id: '2',
    name: 'Cashier User',
    email: 'cashier@example.com',
    password: 'cashier123',
    role: 'cashier',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    isActive: true
  },
  {
    id: '3',
    name: 'Manager User',
    email: 'manager@example.com',
    password: 'manager123',
    role: 'manager',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    isActive: true
  }
];