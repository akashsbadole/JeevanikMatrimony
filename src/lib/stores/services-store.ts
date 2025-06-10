import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Service {
  id: string;
  name: string;
  description: string;
  category:
    | "photography"
    | "verification"
    | "astrology"
    | "counseling"
    | "profile_writing"
    | "invitation"
    | "catering"
    | "event_management"
    | "transportation"
    | "decoration"
    | "music"
    | "venue";
  price: number;
  currency: string;
  duration?: string;
  features: string[];
  vendorId: string;
  vendorName: string;
  vendorRating: number;
  vendorReviews: number;
  isActive: boolean;
  images: string[];
  location?: string;
  availability?: {
    days: string[];
    timeSlots: string[];
  };
  metadata?: Record<string, any>;
}

export interface CartItem {
  serviceId: string;
  service: Service;
  quantity: number;
  selectedDate?: Date;
  selectedTimeSlot?: string;
  customRequirements?: string;
  addedAt: Date;
}

export interface ServiceOrder {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  currency: string;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentId?: string;
  orderDate: Date;
  scheduledDate?: Date;
  completedDate?: Date;
  notes?: string;
  vendorAssignments: Array<{
    vendorId: string;
    serviceIds: string[];
    status: "assigned" | "accepted" | "in_progress" | "completed";
    notes?: string;
  }>;
}

export interface ServiceReview {
  id: string;
  serviceId: string;
  vendorId: string;
  userId: string;
  orderId: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: Date;
  isVerified: boolean;
}

interface ServicesState {
  // Services
  services: Service[];
  categories: string[];
  isLoadingServices: boolean;

  // Cart
  cartItems: CartItem[];
  cartTotal: number;

  // Orders
  orders: ServiceOrder[];
  isLoadingOrders: boolean;

  // Reviews
  reviews: ServiceReview[];

  // Filters
  selectedCategory: string | null;
  priceRange: [number, number];
  locationFilter: string | null;
  ratingFilter: number | null;

  // Actions - Services
  setServices: (services: Service[]) => void;
  setLoadingServices: (loading: boolean) => void;
  filterServicesByCategory: (category: string | null) => void;
  filterServicesByPrice: (range: [number, number]) => void;
  filterServicesByLocation: (location: string | null) => void;
  filterServicesByRating: (rating: number | null) => void;
  searchServices: (query: string) => void;

  // Actions - Cart
  addToCart: (service: Service, options?: Partial<CartItem>) => void;
  removeFromCart: (serviceId: string) => void;
  updateCartItem: (serviceId: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;

  // Actions - Orders
  createOrder: (cartItems: CartItem[]) => Promise<ServiceOrder>;
  setOrders: (orders: ServiceOrder[]) => void;
  updateOrderStatus: (orderId: string, status: ServiceOrder["status"]) => void;
  setLoadingOrders: (loading: boolean) => void;

  // Actions - Reviews
  addReview: (review: ServiceReview) => void;
  setReviews: (reviews: ServiceReview[]) => void;

  // Utility
  getServicesByCategory: (category: string) => Service[];
  getCartItemCount: () => number;
  getVendorServices: (vendorId: string) => Service[];
}

export const useServicesStore = create<ServicesState>()(
  persist(
    (set, get) => ({
      // Initial state
      services: [],
      categories: [
        "photography",
        "verification",
        "astrology",
        "counseling",
        "profile_writing",
        "invitation",
        "catering",
        "event_management",
        "transportation",
        "decoration",
        "music",
        "venue",
      ],
      isLoadingServices: false,

      cartItems: [],
      cartTotal: 0,

      orders: [],
      isLoadingOrders: false,

      reviews: [],

      selectedCategory: null,
      priceRange: [0, 100000],
      locationFilter: null,
      ratingFilter: null,

      // Service actions
      setServices: (services) => set({ services }),

      setLoadingServices: (loading) => set({ isLoadingServices: loading }),

      filterServicesByCategory: (category) =>
        set({ selectedCategory: category }),

      filterServicesByPrice: (range) => set({ priceRange: range }),

      filterServicesByLocation: (location) => set({ locationFilter: location }),

      filterServicesByRating: (rating) => set({ ratingFilter: rating }),

      searchServices: (query) => {
        const services = get().services;
        const filtered = services.filter(
          (service) =>
            service.name.toLowerCase().includes(query.toLowerCase()) ||
            service.description.toLowerCase().includes(query.toLowerCase()) ||
            service.vendorName.toLowerCase().includes(query.toLowerCase())
        );
        set({ services: filtered });
      },

      // Cart actions
      addToCart: (service, options = {}) => {
        const cartItems = get().cartItems;
        const existingItem = cartItems.find(
          (item) => item.serviceId === service.id
        );

        if (existingItem) {
          // Update quantity if item already exists
          const updatedItems = cartItems.map((item) =>
            item.serviceId === service.id
              ? { ...item, quantity: item.quantity + (options.quantity || 1) }
              : item
          );
          set({ cartItems: updatedItems });
        } else {
          // Add new item
          const newItem: CartItem = {
            serviceId: service.id,
            service,
            quantity: options.quantity || 1,
            selectedDate: options.selectedDate,
            selectedTimeSlot: options.selectedTimeSlot,
            customRequirements: options.customRequirements,
            addedAt: new Date(),
          };
          set({ cartItems: [...cartItems, newItem] });
        }

        // Update cart total
        const state = get();
        const total = state.cartItems.reduce(
          (sum, item) => sum + item.service.price * item.quantity,
          0
        );
        set({ cartTotal: total });
      },

      removeFromCart: (serviceId) => {
        const cartItems = get().cartItems;
        const updatedItems = cartItems.filter(
          (item) => item.serviceId !== serviceId
        );
        const total = updatedItems.reduce(
          (sum, item) => sum + item.service.price * item.quantity,
          0
        );
        set({ cartItems: updatedItems, cartTotal: total });
      },

      updateCartItem: (serviceId, updates) => {
        const cartItems = get().cartItems;
        const updatedItems = cartItems.map((item) =>
          item.serviceId === serviceId ? { ...item, ...updates } : item
        );
        const total = updatedItems.reduce(
          (sum, item) => sum + item.service.price * item.quantity,
          0
        );
        set({ cartItems: updatedItems, cartTotal: total });
      },

      clearCart: () => {
        set({ cartItems: [], cartTotal: 0 });
      },

      updateCartTotal: () => {
        const cartItems = get().cartItems;
        const total = cartItems.reduce(
          (sum, item) => sum + item.service.price * item.quantity,
          0
        );
        set({ cartTotal: total });
      },

      // Order actions
      createOrder: async (cartItems) => {
        const order: ServiceOrder = {
          id: Date.now().toString(),
          userId: "current-user-id", // Would come from auth
          items: cartItems,
          totalAmount: cartItems.reduce(
            (sum, item) => sum + item.service.price * item.quantity,
            0
          ),
          currency: "INR",
          status: "pending",
          paymentStatus: "pending",
          orderDate: new Date(),
          vendorAssignments: [],
        };

        // Group items by vendor
        const vendorGroups = cartItems.reduce((groups, item) => {
          const vendorId = item.service.vendorId;
          if (!groups[vendorId]) {
            groups[vendorId] = [];
          }
          groups[vendorId].push(item.serviceId);
          return groups;
        }, {} as Record<string, string[]>);

        // Create vendor assignments
        order.vendorAssignments = Object.entries(vendorGroups).map(
          ([vendorId, serviceIds]) => ({
            vendorId,
            serviceIds,
            status: "assigned",
          })
        );

        const orders = get().orders;
        set({ orders: [order, ...orders] });

        return order;
      },

      setOrders: (orders) => set({ orders }),

      updateOrderStatus: (orderId, status) => {
        const orders = get().orders;
        const updatedOrders = orders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        );
        set({ orders: updatedOrders });
      },

      setLoadingOrders: (loading) => set({ isLoadingOrders: loading }),

      // Review actions
      addReview: (review) => {
        const reviews = get().reviews;
        set({ reviews: [review, ...reviews] });
      },

      setReviews: (reviews) => set({ reviews }),

      // Utility functions
      getServicesByCategory: (category) => {
        const services = get().services;
        return services.filter((service) => service.category === category);
      },

      getCartItemCount: () => {
        const cartItems = get().cartItems;
        return cartItems.reduce((count, item) => count + item.quantity, 0);
      },

      getVendorServices: (vendorId) => {
        const services = get().services;
        return services.filter((service) => service.vendorId === vendorId);
      },
    }),
    {
      name: "services-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cartItems: state.cartItems,
        cartTotal: state.cartTotal,
        orders: state.orders,
        selectedCategory: state.selectedCategory,
        priceRange: state.priceRange,
        locationFilter: state.locationFilter,
        ratingFilter: state.ratingFilter,
      }),
    }
  )
);

// Selectors
export const useServices = () => useServicesStore((state) => state.services);
export const useCartItems = () => useServicesStore((state) => state.cartItems);
export const useCartTotal = () => useServicesStore((state) => state.cartTotal);
export const useCartItemCount = () =>
  useServicesStore((state) => state.getCartItemCount());
export const useOrders = () => useServicesStore((state) => state.orders);
export const useServiceCategories = () =>
  useServicesStore((state) => state.categories);
export const useSelectedCategory = () =>
  useServicesStore((state) => state.selectedCategory);
export const useIsLoadingServices = () =>
  useServicesStore((state) => state.isLoadingServices);
export const useIsLoadingOrders = () =>
  useServicesStore((state) => state.isLoadingOrders);

// Computed selectors
export const useFilteredServices = () =>
  useServicesStore((state) => {
    let filtered = state.services;

    if (state.selectedCategory) {
      filtered = filtered.filter(
        (service) => service.category === state.selectedCategory
      );
    }

    if (state.priceRange) {
      filtered = filtered.filter(
        (service) =>
          service.price >= state.priceRange[0] &&
          service.price <= state.priceRange[1]
      );
    }

    if (state.locationFilter) {
      filtered = filtered.filter((service) =>
        service.location
          ?.toLowerCase()
          .includes(state.locationFilter!.toLowerCase())
      );
    }

    if (state.ratingFilter) {
      filtered = filtered.filter(
        (service) => service.vendorRating >= state.ratingFilter!
      );
    }

    return filtered;
  });

export const useServicesByCategory = (category: string) =>
  useServicesStore((state) => state.getServicesByCategory(category));

export const useVendorServices = (vendorId: string) =>
  useServicesStore((state) => state.getVendorServices(vendorId));

// Action selectors
export const useServicesActions = () =>
  useServicesStore((state) => ({
    setServices: state.setServices,
    setLoadingServices: state.setLoadingServices,
    filterServicesByCategory: state.filterServicesByCategory,
    filterServicesByPrice: state.filterServicesByPrice,
    filterServicesByLocation: state.filterServicesByLocation,
    filterServicesByRating: state.filterServicesByRating,
    searchServices: state.searchServices,
    addToCart: state.addToCart,
    removeFromCart: state.removeFromCart,
    updateCartItem: state.updateCartItem,
    clearCart: state.clearCart,
    createOrder: state.createOrder,
    setOrders: state.setOrders,
    updateOrderStatus: state.updateOrderStatus,
    setLoadingOrders: state.setLoadingOrders,
    addReview: state.addReview,
    setReviews: state.setReviews,
  }));
