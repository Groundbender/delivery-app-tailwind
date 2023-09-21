import { useState } from "react";
import {
  ActionFunction,
  ActionFunctionArgs,
  Form,
  redirect,
  useActionData,
  useNavigation,
} from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import { ICart, IOrder } from "../../types";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "../../store";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import { formatCurrency } from "../../utils/helpers";
import { fetchAddress } from "../user/userSlice";
import { AnyAction } from "@reduxjs/toolkit";
import { useAppDispatch } from "../../hooks/redux-hooks";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str: string) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

const fakeCart: ICart[] = [
  {
    pizzaId: 12,
    name: "Mediterranean",
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: "Vegetale",
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: "Spinach and Mushroom",
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

type FormErrors = {
  phone?: string;
};
const CreateOrder = () => {
  const [withPriority, setWithPriority] = useState<boolean>(false);
  const {
    username,
    status: addressStatus,
    address,
    position,
    error: addressError,
  } = useSelector((state: RootState) => state.user);

  const isLoadingPosition = addressStatus === "loading";

  const navigation = useNavigation();
  const formErrors = useActionData() as FormErrors;
  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const dispatch = useAppDispatch();

  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  if (!cart.length) {
    return <EmptyCart />;
  }

  const isSubmitting = navigation.state === "submitting";

  const getUserPosition = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(fetchAddress());
  };

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

      <Form method="POST" action="/order/new">
        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            type="text"
            name="customer"
            required
            className="input grow"
            defaultValue={username}
          />
        </div>

        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input type="tel" name="phone" required className="input w-full" />
            {formErrors?.phone && (
              <p className="text-red-700 text-xs mt-2 bg-red-100 p-2 rounded-lg">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center relative">
          <label className="sm:basis-40">Address</label>
          <div className="grow ">
            <input
              type="text"
              name="address"
              required
              className="input w-full"
              disabled={isLoadingPosition}
              defaultValue={address}
            />
            {addressStatus === "error" && (
              <p className="text-red-700 text-xs mt-2 bg-red-100 p-2 rounded-lg">
                {addressError}
              </p>
            )}
          </div>
          {!position.latitude && !position.longitude && (
            <span className="absolute top-[3px] right-[3px] z-50 md:top-[5px] md:right-[5px]">
              <Button
                disabled={isLoadingPosition}
                type="small"
                onClick={getUserPosition}
              >
                Get address
              </Button>
            </span>
          )}
        </div>

        <div className="my-12 flex gap-5 items-center">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            value={String(withPriority)}
            onChange={(e) => setWithPriority(e.target.checked)}
            className="h-6 w-6 accent-lime-500 focus:outline-none focus:ring focus:ring-lime-400 focus:ring-offset-2"
          />
          <label htmlFor="priority">Want to yo give your order priority?</label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position.longitude && position.latitude
                ? `${position.latitude}, ${position.longitude}`
                : ""
            }
          />
          <Button type="primary" disabled={isSubmitting || isLoadingPosition}>
            {isSubmitting
              ? "Placing order..."
              : ` Order now for ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart.toString()),
    priority: data.priority === "true",
  } as IOrder;
  console.log(order);

  const errors: FormErrors = {};

  if (!isValidPhone(order.phone)) {
    errors.phone =
      "Please give us your correct phone number. We might need it to contact you";
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }

  // все гуд
  const newOrder = await createOrder(order);

  console.log(newOrder);

  //**** importing store to clear Cart inside regular function
  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
};

export default CreateOrder;
