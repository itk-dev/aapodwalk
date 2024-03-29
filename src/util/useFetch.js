import { useEffect, useReducer, useRef, useContext } from "react";
import ApiEndpointContext from "../context/api-endpoint-context";
import CacheContext from "../context/cache-context";

function useFetch(restUrl) {
  const { cache, setCache } = useContext(CacheContext);
  const { url: baseUrl, token } = useContext(ApiEndpointContext);
  const options = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  // Used to prevent state update if the component is unmounted
  const cancelRequest = useRef(false);

  const initialState = {
    error: undefined,
    data: undefined,
  };

  // Keep state logic separated
  const fetchReducer = (state, action) => {
    switch (action.type) {
      case "loading":
        return { ...initialState };
      case "fetched":
        return { ...initialState, data: action.payload };
      case "error":
        return { ...initialState, error: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    // Do nothing if the url is not given
    if (!baseUrl || restUrl.indexOf("/null") > 0) return;

    cancelRequest.current = false;
    const fetchData = async () => {
      dispatch({ type: "loading" });
      // If a cache exists for this url, return it
      if (cache[`${restUrl}`]) {
        dispatch({
          type: "fetched",
          payload: cache[`${restUrl}`],
        });
        return;
      }
      try {
        const response = await fetch(`${baseUrl}${restUrl}`, options);
        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = await response.json();
        const cacheCopy = { ...cache };
        cacheCopy[`${restUrl}`] = data;
        setCache(cacheCopy);

        if (cancelRequest.current) return;

        dispatch({ type: "fetched", payload: data });
      } catch (error) {
        if (cancelRequest.current) return;

        dispatch({ type: "error", payload: error });
      }
    };

    fetchData();
  }, [baseUrl, restUrl]);

  return state;
}

export default useFetch;
