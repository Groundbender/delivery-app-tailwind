// Test ID: IIDSAT
import { useEffect } from "react";
import { useFetcher, useLoaderData } from "react-router-dom";
import { getOrder } from "../../services/apiRestaurant";
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from "../../utils/helpers";
import { Args, IOrder, IPizza } from "../../types";
import OrderItem from "./OrderItem";
import UpdateOrder from "./UpdateOrder";

const Order = () => {
  const order = useLoaderData() as IOrder;

  const fetcher = useFetcher();

  useEffect(() => {
    if (!fetcher.data && fetcher.state === "idle") {
      fetcher.load("/menu");
    }
  }, [fetcher]);

  console.log(fetcher.data);

  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
  } = order as IOrder;

  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  return (
    <div className="px-4 py-6 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-semibold">Order #{id}</h2>

        <div className="space-x-2 ">
          {priority && (
            <span className="bg-red-500 rounded-full py-1 px-3 font-semibold uppercase tracking-wide text-red-50">
              Priority
            </span>
          )}
          <span className="bg-lime-500 rounded-full py-1 px-3 font-semibold uppercase tracking-wide text-lime-50">
            {status} order
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap bg-stone-200 px-6 py-5 rounded-md">
        <p className="font-medium">
          {deliveryIn >= 0
            ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
            : "Order should have arrived"}
        </p>
        <p className="text-xs text-stone-500">
          (Estimated delivery: {formatDate(estimatedDelivery)})
        </p>
      </div>

      <ul className="divide-y divide-stone-200 border-b border-t">
        {cart?.map((item) => (
          <OrderItem
            key={item.pizzaId}
            item={item}
            isLoadingIngredients={fetcher.state === "loading"}
            ingredients={
              fetcher.data?.find((el: IPizza) => el.id === item.pizzaId)
                .ingredients
            }
          />
        ))}
      </ul>

      <div className="space-y-2 bg-stone-200 px-6 py-5 rounded-md">
        <p className="text-sm font-medium text-stone-600">
          Price pizza: {formatCurrency(orderPrice)}
        </p>
        {priority && <p>Price priority: {formatCurrency(priorityPrice)}</p>}
        <p className="font-bold">
          To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}
        </p>
      </div>

      {!priority && <UpdateOrder order={order} />}
    </div>
  );
};

export const loader = async ({ params }: Args) => {
  if (params.orderId) {
    const order = await getOrder(params.orderId);
    return order;
  }
  return null;
};

export default Order;
