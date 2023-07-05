import { useEffect } from "react";
import useFetch from "../../util/useFetch";

function PointOfInterest({ id, latLongCallBack }) {
  const { data } = useFetch(`point_of_interests/${id}`);

  useEffect(() => {
    if (data) {
      latLongCallBack(data.latitude, data.longitude, id, data.name);
    }
  }, [data]);
}

export default PointOfInterest;
