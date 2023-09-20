import { ActionFunctionArgs, ParamParseKey, Params } from "react-router-dom";

export const PathNames = {
  orderDetail: "/order/:orderId",
} as const;

export interface Args extends ActionFunctionArgs {
  params: Params<ParamParseKey<typeof PathNames.orderDetail>>;
}
