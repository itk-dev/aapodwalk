import { React, useState, useContext, useEffect, useMemo } from "react";
import MapConsentBanner from "./MapConsentBanner";
import LandingPage from "./LandingPage";
import ErrorComponent from "./ErrorComponent";
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
      <ErrorComponent />
      <SelectedTagContext.Provider
        value={useMemo(
          () => ({
            selectedTag,
            setSelectedTag,
          }),
          [selectedTag],
        )}
      >
        <TagFilterList />
        <RouteList />
      </SelectedTagContext.Provider>
      <MapConsentBanner />
    </div>
  );
}

export default FrontPage;
