import { React, useState, useContext, useEffect, useMemo } from "react";
import SelectedTagContext from "../context/SelectedTagContext";
import RouteContext from "../context/RouteContext";
import MapConsentBanner from "./MapConsentBanner";
import LandingPage from "./LandingPage";
import MessageComponent from "./MessageComponent";
import TagFilterList from "./tags/TagFilterList";
import RouteList from "./routes/RouteList";

function FrontPage() {
  const [selectedTag, setSelectedTag] = useState(null);
  const { setSelectedRoute } = useContext(RouteContext);

  useEffect(() => {
    setSelectedRoute(null);
  }, [setSelectedRoute]);

  return (
    <div>
      <LandingPage />
      <MessageComponent />
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
    </div>
  );
}

export default FrontPage;
