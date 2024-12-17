import { React } from "react";

const OrderComponent = ({ order }) => {
  return (
    <div className="flex place-content-center rounded text-xl w-6 h-6 bg-black justify-center mb-2 items-center bg-white flex dark:bg-emerald-800">
      {order}
    </div>
  );
};

export default OrderComponent;
