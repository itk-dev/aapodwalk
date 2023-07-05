import { React } from "react";
import { Link } from "react-router-dom";

function Tag({ name, numberOfRoutes, id }) {
  if (numberOfRoutes === 0) return null;
  return (
    <div>
      <Link className="" to={`/tag/${id}`}>
        {name}
      </Link>
    </div>
  );
}

export default Tag;
