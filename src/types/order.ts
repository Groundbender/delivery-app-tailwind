export interface ICart {
  pizzaId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
export interface IOrder {
  id: string;
  customer: string;
  status: string;
  phone: string;
  address: string;
  priority: boolean;
  estimatedDelivery: string;
  cart: ICart[];
  position: string;
  orderPrice: number;
  priorityPrice: number;
}
