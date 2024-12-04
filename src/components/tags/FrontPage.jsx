import { React, useEffect, useState } from "react";
import useFetch from "../../util/useFetch";
import Tag from "./Tag";
import MapConsentBanner from "../MapConsentBanner";

function FrontPage() {
  const [tags, setTags] = useState(null);
  const { data } = useFetch(`tags`);

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

      <MapConsentBanner></MapConsentBanner>
    </div>
  );
}

export default FrontPage;
