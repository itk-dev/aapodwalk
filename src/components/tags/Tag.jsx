import { React } from "react";
import { Link } from "react-router-dom";

function Tag({ name, numberOfRoutes, id }) {
  if (numberOfRoutes === 0) return null;
  return (
    <Link
      className="block bg-emerald-500 mb-3 rounded-md p-3"
      to={`/tag/${id}`}
    >
      <span className="block text-lg font-bold">{name}</span>
      <span className="text-s text-zinc-600">{numberOfRoutes} historier</span>
    </Link>
  );
}

export default Tag;
