import { useEffect, useReducer, useRef, useContext } from "react";
import ApiEndpointContext from "../context/api-endpoint-context";

// Module-level cache shared across all useFetch consumers.
// Persists for the lifetime of the page so navigating between
// routes does not re-fetch endpoints that were already loaded.
const cache = new Map();

function useFetch(restUrl) {
  const { url: baseUrl, token } = useContext(ApiEndpointContext);
  // Used to prevent state update if the component is unmounted
  const cancelRequest = useRef(false);

  const cacheKey = baseUrl && restUrl ? `${baseUrl}${restUrl}` : null;

  // Keep state logic separated
  const fetchReducer = (state, action) => {
    switch (action.type) {
      case "loading":
        return { error: undefined, data: undefined, loading: true };
      case "fetched":
        return { error: undefined, data: action.payload, loading: false };
      case "error":
        return { error: action.payload, data: undefined, loading: false };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(fetchReducer, undefined, () => {
    if (cacheKey && cache.has(cacheKey)) {
      return { error: undefined, data: cache.get(cacheKey), loading: false };
    }
    return { error: undefined, data: undefined, loading: true };
  });

  useEffect(() => {
    // Do nothing if the url is not given
    if (!baseUrl || !restUrl) return undefined;

    // Cache hit — serve cached data synchronously, skip network call.
    if (cache.has(cacheKey)) {
      dispatch({ type: "fetched", payload: cache.get(cacheKey) });
      return undefined;
    }

    cancelRequest.current = false;
    const fetchData = async () => {
      dispatch({ type: "loading" });
      try {
        const response = await fetch(`${baseUrl}${restUrl}`, {
          headers: { authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = await response.json();

        if (cancelRequest.current) return;

        cache.set(cacheKey, data);
        dispatch({ type: "fetched", payload: data });
      } catch (error) {
        if (cancelRequest.current) return;

        dispatch({ type: "error", payload: error });
      }
    };

    fetchData();

    return () => {
      cancelRequest.current = true;
    };
  }, [baseUrl, restUrl, cacheKey, token]);

  return state;
}

export default useFetch;
