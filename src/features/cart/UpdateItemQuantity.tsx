import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { ICart } from "../../types";
import { decreaseItemQuantity, increaseItemQuantity } from "./cartSlice";

interface UpdateItemQuantityProps {
  pizzaId: ICart["pizzaId"];
  currentPizzaQuantity: ICart["quantity"];
}

const UpdateItemQuantity: React.FC<UpdateItemQuantityProps> = ({
  pizzaId,
  currentPizzaQuantity,
}) => {
  const dispatch = useDispatch();

  return (
    <div className="flex gap-2 items-center md:gap-3">
      <Button
        type="round"
        onClick={() => dispatch(decreaseItemQuantity(pizzaId))}
      >
        -
      </Button>
      <span className="text-sm font-bold">{currentPizzaQuantity}</span>
      <Button
        type="round"
        onClick={() => dispatch(increaseItemQuantity(pizzaId))}
      >
        +
      </Button>
    </div>
  );
};

export default UpdateItemQuantity;
