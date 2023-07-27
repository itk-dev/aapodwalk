import { React } from "react";
import { Link } from "react-router-dom";

function Tag({ name, numberOfRoutes, id }) {
  if (numberOfRoutes === 0) return null;
  return (
    <Link
      className="block bg-emerald-400 dark:bg-emerald-800 mb-3 rounded-md p-3"
      to={`/tag/${id}`}
    >
      <div className="flex flex-row">
        <div className="flex w-10">
          <img alt="kitten" src={`http://placekitten.com/30/30?image=${id}`} />
        </div>
        <div className="flex flex-col flex-auto pl-3">
          <span className="block text-lg font-bold">{name}</span>
          <span className="text-s text-zinc-600 dark:text-zinc-300">
            {numberOfRoutes} historier
          </span>
        </div>
      </div>
    </Link>
  );
}

export default Tag;
