import { useNavigate, useRouteError } from "react-router-dom";
import LinkButton from "./LinkButton";

const Error = () => {
  const error = useRouteError() as { message: string };

  return (
    <div>
      <h1>Something went wrong 😢</h1>
      <p>{error && error.message}</p>
      <LinkButton to="-1">&larr; Go back </LinkButton>
    </div>
  );
};

export default Error;
