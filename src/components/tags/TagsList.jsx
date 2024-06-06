import { React, useEffect, useState } from "react";
import useFetch from "../../util/useFetch";
import Tag from "./Tag";
import Xmark from "../../icons/xmark-solid.svg";

function TagsList() {
  const [tags, setTags] = useState(null);
  const { data } = useFetch(`tags`);
  const [viewAbout, setViewAbout] = useState(false);

  useEffect(() => {
    if (data) {
      setTags(data["hydra:member"]);
    }
  }, [data]);

  if (!tags) return null;

  return (
    <div>
      <h1 className="mb-3 text-lg font-bold">Kategorier</h1>
      {tags.map(({ name, routes, id }) => (
        <Tag key={name} numberOfRoutes={routes.length} name={name} id={id} />
      ))}

      <div className="fixed left-3 bottom-3 right-3 bg-sky-400 dark:bg-sky-900 flex flex-col gap-3 rounded-lg p-3">
        {!viewAbout && (
          <div>
            <h2 className="mb-2 font-bold">Hvordan fungere podwalk?</h2>
            <button
              className="py-1 px-4 rounded text-zinc-800 bg-zinc-100 flex-auto"
              type="button"
              onClick={() => setViewAbout(!viewAbout)}
            >
              Se vejledning
            </button>
          </div>
        )}
        {viewAbout && (
          <div id="description">
            <button
              className="p-1 rounded text-zinc-800 bg-zinc-100 float-right ml-1 mb-1"
              type="button"
              onClick={() => setViewAbout(!viewAbout)}
            >
              <Xmark className="h-6 w-6 text-zinc-800" />
            </button>
            <div className="flex flex-col gap-2">
              <p>Vælg først en kategori på listen herover.</p>
              <p>Vælg derefter den ønskede rute.</p>
              <p>
                Gå hen til første del af ruten og der kan du starte
                afspilningen.
              </p>
              <p>
                Lyt til vejledningen eller brug navigations pilen i bunden af
                rute visningen til at komme til næste punkt. Husk at være
                opmærksom på dine opgivelser.
              </p>
              <p>God fornøjelse med din podwalk.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TagsList;
