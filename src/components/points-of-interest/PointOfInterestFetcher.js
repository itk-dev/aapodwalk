import { useEffect, useState, useCallback } from "react";
import useFetch from "../../util/useFetch";

function PointOfInterest({ id, latLongCallBack }) {
  const { data } = useFetch(`point_of_interests/${id}`);
  const [pointOfInterestData, setPointOfInterestData] = useState(null);

  const callBack = useCallback(() => {
    if (pointOfInterestData) {
      const { longitude, latitude, name } = pointOfInterestData;

      latLongCallBack(latitude, longitude, id, name);
    }
  }, [pointOfInterestData, id]);

  useEffect(() => {
    if (data) {
      setPointOfInterestData(data);
    }
  }, [data]);

  useEffect(() => {
    if (pointOfInterestData) {
      callBack();
    }
  }, [pointOfInterestData]);
}

export default PointOfInterest;
