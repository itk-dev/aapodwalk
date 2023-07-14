import { React, useContext } from "react";
import ApiEndpointContext from "../context/api-endpoint-context";

function Image({ src }) {
  const { fileUrl } = useContext(ApiEndpointContext);
  return <img width="300" src={`${fileUrl}${src}`} alt="" />;
}

export default Image;
