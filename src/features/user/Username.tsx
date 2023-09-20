import { useSelector } from "react-redux";
import { RootState } from "../../store";

const Username = () => {
  const username = useSelector((state: RootState) => state.user.username);

  if (!username) {
    return null;
  }

  return <p className="hidden md:block text-sm font-semibold">{username}</p>;
};

export default Username;
