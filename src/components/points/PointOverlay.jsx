import { React } from "react";
import OrderComponent from "./OrderComponent";
import CloseButton from "../CloseButton";

const PointOverlay = ({ title, order, closeOverlay, description }) => {

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 bg-zinc-100 dark:bg-zinc-900 z-40 rounded m-2 p-4 flex justify-between flex-col">
      <div className="flex align-between">
        <CloseButton closeOverlay={closeOverlay} label="luk punktvisning" />
        <OrderComponent order={order} />
        <span className="ml-2">{title}</span>
      </div>
      <p className="ml-2">{description}</p>
    </div>
  );
};

export default PointOverlay;
