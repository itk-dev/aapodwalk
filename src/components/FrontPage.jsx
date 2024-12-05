import { React, useEffect, useState } from "react";
import useFetch from "../util/useFetch";
import MapConsentBanner from "./MapConsentBanner";
import LandingPage from "./LandingPage";
import TagList from "./tags/TagList";
import SelectedTagContext from "../context/SelectedTagContext";
import RouteList from "./routes/RouteList";

function FrontPage() {
  const [selectedTag, setSelectedTag] = useState(null);

  const [tags, setTags] = useState(null);
  const { data } = useFetch(`tags`);

  function selectTag(id) {
    setSelectedTag(id);
  }

  useEffect(() => {
    if (data) {
      setTags(data["hydra:member"]);
    }
  }, [data]);

  return (
    <div>
      <LandingPage></LandingPage>
      <SelectedTagContext.Provider value={{ selectedTag, setSelectedTag }}>
        <TagList selectTag={selectTag} />
        <RouteList></RouteList>
      </SelectedTagContext.Provider>

      <MapConsentBanner></MapConsentBanner>
    </div>
  );
}

export default FrontPage;
