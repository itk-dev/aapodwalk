import { React, useContext, useEffect } from "react";
import SelectedTagContext from "../../context/SelectedTagContext";
import { useSearchParams } from "react-router-dom";

function Tag({ title, id }) {
  const { setSelectedTag, selectedTag } = useContext(SelectedTagContext);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      if (searchParams.get("tag") === "null" || !searchParams.get("tag")) {
        setSelectedTag(null);
      } else {
        setSelectedTag(Number(searchParams.get("tag")));
      }
    }
  }, []);

  function selectTag(id) {
    setSearchParams({ tag: id });
    setSelectedTag(id);
  }

  return (
    <button
      className={`block mr-1 rounded px-2 mt-1 h-6 font-bold bg-zinc-200 text-black ${
        selectedTag === id ? "bg-emerald-400 dark:bg-emerald-800 text-white" : ""
      }`}
      type="button"
      onClick={() => selectTag(id)}
    >
      <span className="sr-only">Filtrer listen af ruter efter ruter med tagget </span>
      {title}
    </button>
  );
}

export default Tag;
