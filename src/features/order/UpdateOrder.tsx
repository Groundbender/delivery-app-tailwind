import {
  ActionFunction,
  ActionFunctionArgs,
  useFetcher,
} from "react-router-dom";
import Button from "../../ui/Button";
import { updateOrder } from "../../services/apiRestaurant";
import { IOrder } from "../../types";

const UpdateOrder: React.FC<{ order: IOrder }> = ({ order }) => {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="PATCH" className="text-right">
      <Button type="primary">Make priority</Button>
    </fetcher.Form>
  );
};

export default UpdateOrder;

export const action: ActionFunction = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  if (!params.orderId) {
    return null;
  }

  console.log(request);

  const data = { priority: true };

  await updateOrder(params.orderId, data);

  return null;
};
