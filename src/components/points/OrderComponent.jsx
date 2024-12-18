import { React, useContext } from "react";
import RouteContext from "../../context/RouteContext";

const OrderComponent = ({ order }) => {
  const { selectedRoute } = useContext(RouteContext);

  return (
    <div className="flex place-content-center rounded text-xl w-6 h-6 bg-black justify-center mb-2 items-center bg-white flex dark:bg-emerald-800">
      <span className="sr-only">Dette punkt er nummer </span>
      {order}
      <span className="sr-only"> på ruten: {selectedRoute.title}</span>
    </div>
  );
};

export default OrderComponent;
