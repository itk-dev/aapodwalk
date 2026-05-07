import { React } from "react";
import { useParams, useHistory } from "react-router-dom";
import MapWrapper from "./map/MapWrapper";
import CloseButton from "./CloseButton";

function SeeOnMap() {
  const { latitude, longitude } = useParams();
  const history = useHistory();

  function close() {
    if (history.length > 1) {
      history.goBack();
    } else {
      history.replace("/");
    }
  }

  return (
    <>
      {latitude && longitude && (
        <>
          <CloseButton
            additionalClasses="dark:bg-emerald-800 dark:text-white bg-white z-50"
            closeOverlay={close}
            label="Luk kortvisning"
          />
          <MapWrapper
            focusable={false}
            withIndex={false}
            additionalClass="h-screen"
            mapData={[
              { latitude, longitude }, // Point
            ]}
          />
        </>
      )}
    </>
  );
}

export default SeeOnMap;
