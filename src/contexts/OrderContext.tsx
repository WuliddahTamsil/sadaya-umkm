import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { api } from "../config/api";
import { useAuth } from "./AuthContext";

export type OrderStatus = "preparing" | "ready" | "pickup" | "delivered" | "completed";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  umkmId: string;
  storeId?: string; // Legacy support
  storeName: string;
  storeAddress: string;
  items: OrderItem[];
  subtotal?: number;
  total: number;
  deliveryFee: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  deliveryAddress: string;
  paymentMethod?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed';
  driverName?: string;
  driverId?: string;
  pickupTime?: string;
  deliveredAt?: string;
  notes?: string;
  driverLocation?: {
    lat: number;
    lng: number;
    updatedAt: string;
  } | null;
}

export interface CreateOrderInput {
  userId: string;
  umkmId: string;
  storeId?: string; // Legacy support
  storeName: string;
  storeAddress: string;
  items: OrderItem[];
  total: number;
  deliveryFee?: number;
  userName: string;
  deliveryAddress: string;
  paymentMethod?: string;
  notes?: string;
}

type OrderAction =
  | { type: "LOAD"; payload: Order[] }
  | { type: "CREATE"; payload: Order }
  | { type: "UPDATE"; payload: { id: string; changes: Partial<Order> } }
  | { type: "CLEAR" };

interface OrderContextValue {
  orders: Order[];
  isLoading: boolean;
  createOrder: (input: CreateOrderInput) => Promise<Order>;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    changes?: Partial<Order>
  ) => Promise<void>;
  updateOrder: (orderId: string, changes: Partial<Order>) => Promise<void>;
  refreshOrders: () => Promise<void>;
  clearOrders: () => void;
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

const orderReducer = (state: Order[], action: OrderAction): Order[] => {
  switch (action.type) {
    case "LOAD":
      return action.payload;
    case "CREATE":
      return [action.payload, ...state];
    case "UPDATE":
      return state.map((order) =>
        order.id === action.payload.id
          ? { ...order, ...action.payload.changes }
          : order
      );
    case "CLEAR":
      return [];
    default:
      return state;
  }
};

interface OrderProviderProps {
  children: React.ReactNode;
}

export function OrderProvider({ children }: OrderProviderProps) {
  const { user } = useAuth();
  const [orders, dispatch] = useReducer(orderReducer, []);
  const [isLoading, setIsLoading] = useState(false);

  // Load orders from backend on mount and when user changes
  useEffect(() => {
    if (!user) {
      dispatch({ type: "LOAD", payload: [] });
      return;
    }

    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        let url = api.orders.getAll;
        
        // Filter berdasarkan role user
        if (user.role === 'user') {
          url += `?userId=${user.id}`;
        } else if (user.role === 'umkm') {
          url += `?umkmId=${user.id}`;
        } else if (user.role === 'driver') {
          url += `?driverId=${user.id}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Gagal mengambil data orders');
        }

        const result = await response.json();
        
        // Transform data dari backend ke format frontend
        const transformedOrders: Order[] = result.data.map((order: any) => ({
          id: order.id,
          userId: order.userId,
          userName: order.userName,
          userEmail: order.userEmail,
          umkmId: order.umkmId,
          storeId: order.umkmId, // Legacy support
          storeName: order.storeName,
          storeAddress: order.storeAddress,
          items: order.items,
          subtotal: order.subtotal,
          total: order.total,
          deliveryFee: order.deliveryFee,
          status: order.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          deliveryAddress: order.deliveryAddress,
          paymentMethod: order.paymentMethod,
          driverName: order.driverName,
          driverId: order.driverId,
          pickupTime: order.pickupTime,
          deliveredAt: order.deliveredAt,
          notes: order.notes,
          driverLocation: order.driverLocation || null,
        }));

        dispatch({ type: "LOAD", payload: transformedOrders });
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();

    // Refresh orders every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [user?.id, user?.role]);

  // Refresh orders function
  const refreshOrders = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      let url = api.orders.getAll;
      
      if (user.role === 'user') {
        url += `?userId=${user.id}`;
      } else if (user.role === 'umkm') {
        url += `?umkmId=${user.id}`;
      } else if (user.role === 'driver') {
        url += `?driverId=${user.id}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Gagal mengambil data orders');
      }

      const result = await response.json();
      const transformedOrders: Order[] = result.data.map((order: any) => ({
        id: order.id,
        userId: order.userId,
        userName: order.userName,
        userEmail: order.userEmail,
        umkmId: order.umkmId,
        storeId: order.umkmId,
        storeName: order.storeName,
        storeAddress: order.storeAddress,
        items: order.items,
        subtotal: order.subtotal,
        total: order.total,
        deliveryFee: order.deliveryFee,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        deliveryAddress: order.deliveryAddress,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus || 'pending',
        driverName: order.driverName,
        driverId: order.driverId,
        pickupTime: order.pickupTime,
        deliveredAt: order.deliveredAt,
        notes: order.notes,
        driverLocation: order.driverLocation || null,
      }));

      dispatch({ type: "LOAD", payload: transformedOrders });
    } catch (error) {
      console.error('Error refreshing orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async (input: CreateOrderInput): Promise<Order> => {
    if (!user) {
      throw new Error('User harus login terlebih dahulu');
    }

    const deliveryFee =
      input.deliveryFee ??
      Math.max(8000, Math.round((input.total * 0.12) / 1000) * 1000);

    try {
      const response = await fetch(api.orders.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: input.userId || user.id,
          umkmId: input.umkmId,
          storeName: input.storeName,
          storeAddress: input.storeAddress,
          items: input.items,
          total: input.total,
          deliveryFee,
          deliveryAddress: input.deliveryAddress,
          paymentMethod: input.paymentMethod || 'cash',
          notes: input.notes,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal membuat order');
      }

      const result = await response.json();
      const newOrder: Order = {
        ...result.data,
        storeId: result.data.umkmId, // Legacy support
      };

      dispatch({ type: "CREATE", payload: newOrder });
      return newOrder;
    } catch (error: any) {
      console.error('Create order error:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    status: OrderStatus,
    changes?: Partial<Order>
  ): Promise<void> => {
    try {
      const updateData: any = { status };
      if (changes?.driverId) updateData.driverId = changes.driverId;
      if (changes?.notes) updateData.notes = changes.notes;

      const response = await fetch(api.orders.updateStatus(orderId), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        let errorMessage = 'Gagal update status order';
        try {
          const error = await response.json();
          errorMessage = error.error || error.message || errorMessage;
        } catch (e) {
          // Jika response bukan JSON
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      dispatch({
        type: "UPDATE",
        payload: { id: orderId, changes: { ...result.data, ...changes } },
      });
    } catch (error: any) {
      console.error('Update order status error:', error);
      throw error;
    }
  };

  const updateOrder = async (orderId: string, changes: Partial<Order>): Promise<void> => {
    try {
      const response = await fetch(api.orders.updateStatus(orderId), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(changes),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal update order');
      }

      const result = await response.json();
      dispatch({
        type: "UPDATE",
        payload: { id: orderId, changes: result.data },
      });
    } catch (error: any) {
      console.error('Update order error:', error);
      throw error;
    }
  };

  const clearOrders = () => {
    dispatch({ type: "CLEAR" });
  };

  const value = useMemo<OrderContextValue>(
    () => ({
      orders,
      isLoading,
      createOrder,
      updateOrderStatus,
      updateOrder,
      refreshOrders,
      clearOrders,
    }),
    [orders, isLoading]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrderContext() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrderContext must be used within an OrderProvider");
  }
  return context;
}

export function useOrders() {
  return useOrderContext().orders;
}

export function useOrderById(orderId: string | null | undefined) {
  const { orders } = useOrderContext();
  if (!orderId) return undefined;
  return orders.find((order) => order.id === orderId);
}

