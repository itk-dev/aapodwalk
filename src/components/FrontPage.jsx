import { React, useState } from "react";
import MapConsentBanner from "./MapConsentBanner";
import LandingPage from "./LandingPage";
import TagList from "./tags/TagList";
import SelectedTagContext from "../context/SelectedTagContext";
import RouteList from "./routes/RouteList";

function FrontPage() {
  const [selectedTag, setSelectedTag] = useState(null);

  return (
    <div>
      <LandingPage></LandingPage>
      <SelectedTagContext.Provider value={{ selectedTag, setSelectedTag }}>
        <TagList/>
        <RouteList></RouteList>
      </SelectedTagContext.Provider>

      <MapConsentBanner></MapConsentBanner>
    </div>
  );
}

export default FrontPage;
