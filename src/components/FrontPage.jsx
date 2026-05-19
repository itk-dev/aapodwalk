import { React, useState, useContext, useEffect, useMemo } from "react";
import SelectedTagContext from "../context/SelectedTagContext";
import RouteContext from "../context/RouteContext";
import MessageContext from "../context/MessageContext";
import useFetch from "../util/useFetch";
import LandingPage from "./LandingPage";
import LoadingOverlay from "./LoadingOverlay";
import MessageComponent from "./MessageComponent";
import TagFilterList from "./tags/TagFilterList";
import RouteList from "./routes/RouteList";

function FrontPage() {
  const [selectedTag, setSelectedTag] = useState(null);
  const { setSelectedRoute } = useContext(RouteContext);
  const { setError, setErrorText } = useContext(MessageContext);

  const { data: routesData, error: routesError, loading: routesLoading } = useFetch("routes");
  const { data: tagsData, error: tagsError, loading: tagsLoading } = useFetch("tags");

  useEffect(() => {
    setSelectedRoute(null);
  }, [setSelectedRoute]);

  useEffect(() => {
    if (routesError) {
      setError(true);
      setErrorText("Der skete en fejl da ruterne skulle hentes. Prøv at genindlæs siden.");
    }
  }, [routesError, setError, setErrorText]);

  useEffect(() => {
    if (tagsError) {
      setError(true);
      setErrorText("Der skete en fejl da kategorierne skulle hentes. Prøv at genindlæs siden.");
    }
  }, [tagsError, setError, setErrorText]);

  const isLoading = routesLoading || tagsLoading;
  const routes = routesData?.["hydra:member"] ?? [];
  const tags = tagsData?.["hydra:member"] ?? [];

  return (
    <>
      <LoadingOverlay loading={isLoading} />
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
          <TagFilterList tags={tags} error={Boolean(tagsError)} loading={tagsLoading} />
          <RouteList routes={routes} error={Boolean(routesError)} loading={routesLoading} />
        </SelectedTagContext.Provider>
      </div>
    </>
  );
}

export default FrontPage;
