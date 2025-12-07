import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs';

// Interfaz para un producto que se puede añadir al carrito
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  // ... otras propiedades del producto
}

// Interfaz para un ítem dentro del carrito
export interface CartItem {
  product: Product;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // BehaviorSubject para mantener el estado del carrito
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  
  // Observable público para que los componentes se suscriban a los cambios
  public items$ = this.itemsSubject.asObservable();

  // Observable que calcula el número total de artículos en el carrito
  public totalItems$: Observable<number> = this.items$.pipe(
    map((items) => items.reduce((total, item) => total + item.quantity, 0))
  );

  // Gestión de pestañas
  private activeTabSubject = new BehaviorSubject<string>('all');
  public activeTab$ = this.activeTabSubject.asObservable();

  // Gestión de búsqueda
  private searchSubject = new BehaviorSubject<string>('');
  public search$ = this.searchSubject.asObservable().pipe(
    debounceTime(300),
    distinctUntilChanged()
  );

  // Items filtrados por pestaña y búsqueda
  public filteredItems$: Observable<CartItem[]> = this.items$.pipe(
    map((items) => this.filterItemsByTab(items)),
    map((items) => this.filterItemsBySearch(items))
  );

  constructor() {
    // Cargar el carrito desde localStorage al iniciar, de forma segura.
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedItems = JSON.parse(savedCart);
        this.itemsSubject.next(parsedItems);
      }
    } catch (e) {
      console.error('Error al cargar el carrito desde localStorage', e);
      localStorage.removeItem('cart'); // Limpia el carrito corrupto
    }
  }

  /** Añade un producto al carrito o incrementa su cantidad si ya existe. */
  addItem(product: Product, quantity: number = 1): void {
    const currentItems = [...this.itemsSubject.getValue()]; // Clonamos para inmutabilidad
    const existingItemIndex = currentItems.findIndex(
      (item) => item.product.id === product.id
    );

    if (existingItemIndex > -1) {
      // Si el producto ya está, creamos un nuevo objeto para el item actualizado
      const updatedItem = {
        ...currentItems[existingItemIndex],
        quantity: currentItems[existingItemIndex].quantity + quantity,
      };
      currentItems[existingItemIndex] = updatedItem;
    } else {
      // Si es un producto nuevo, lo añadimos al array
      const newItem: CartItem = {
        product: product,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image,
      };
      currentItems.push(newItem); // Añadimos el nuevo item a la copia
    }

    this.updateCart(currentItems);
  }

  /** Elimina un producto del carrito por su ID. */
  removeItem(productId: string): void {
    const updatedItems = this.itemsSubject
      .getValue()
      .filter((item) => item.product.id !== productId);
    this.updateCart(updatedItems);
  }

  /** Vacía completamente el carrito. */
  clearCart(): void {
    this.updateCart([]);
  }

  /**
   * Método privado para actualizar el BehaviorSubject y el localStorage.
   * @param items El nuevo estado del carrito.
   */
  private updateCart(items: CartItem[]): void {
    this.itemsSubject.next(items);
    localStorage.setItem('cart', JSON.stringify(items));
  }

  /** Cambia la pestaña activa. */
  setActiveTab(tab: string): void {
    this.activeTabSubject.next(tab);
  }

  /** Obtiene la pestaña activa actual. */
  getActiveTab(): string {
    return this.activeTabSubject.getValue();
  }

  /** Actualiza el término de búsqueda. */
  setSearchTerm(term: string): void {
    this.searchSubject.next(term);
  }

  /** Obtiene el término de búsqueda actual. */
  getSearchTerm(): string {
    return this.searchSubject.getValue();
  }

  /**
   * Filtra items por pestaña activa.
   * @param items Items a filtrar.
   * @returns Items filtrados por pestaña.
   */
  private filterItemsByTab(items: CartItem[]): CartItem[] {
    const activeTab = this.activeTabSubject.getValue();
    
    switch (activeTab) {
      case 'active':
        // Mostrar solo items con cantidad > 0
        return items.filter(item => item.quantity > 0);
      case 'inactive':
        // Mostrar solo items con cantidad = 0
        return items.filter(item => item.quantity === 0);
      case 'all':
      default:
        // Mostrar todos los items
        return items;
    }
  }

  /**
   * Filtra items por término de búsqueda.
   * @param items Items a filtrar.
   * @returns Items que coinciden con la búsqueda.
   */
  private filterItemsBySearch(items: CartItem[]): CartItem[] {
    const searchTerm = this.searchSubject.getValue().toLowerCase();
    
    if (!searchTerm) {
      return items;
    }

    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.product.id.toLowerCase().includes(searchTerm)
    );
  }
}