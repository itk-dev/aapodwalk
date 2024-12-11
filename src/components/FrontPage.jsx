import { React, useState, useContext, useEffect } from "react";
import MapConsentBanner from "./MapConsentBanner";
import LandingPage from "./LandingPage";
import TagFilterList from "./tags/TagFilterList";
import SelectedTagContext from "../context/SelectedTagContext";
import RouteList from "./routes/RouteList";
import RouteContext from "../context/RouteContext";

function FrontPage() {
  const [selectedTag, setSelectedTag] = useState(null);
  const { setSelectedRoute } = useContext(RouteContext);

  useEffect(() => {
    setSelectedRoute(null);
  }, [setSelectedRoute]);

  return (
    <div>
      <LandingPage />
      <SelectedTagContext.Provider value={{ selectedTag, setSelectedTag }}>
        <TagFilterList />
        <RouteList />
      </SelectedTagContext.Provider>
      <MapConsentBanner />
    </div>
  );
}

export default FrontPage;
