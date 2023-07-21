import { React, useContext } from "react";
import ApiEndpointContext from "../context/api-endpoint-context";

function Image({ src, className }) {
  const { fileUrl } = useContext(ApiEndpointContext);
  return <img className={className} src={`${fileUrl}${src}`} alt="" />;
}

export default Image;
