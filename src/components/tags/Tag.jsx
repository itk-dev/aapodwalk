import { React, useContext } from "react";
import SelectedTagContext from "../../context/SelectedTagContext";

function Tag({ title, id }) {
  const { setSelectedTag, selectedTag } = useContext(SelectedTagContext);

  return (
    <button
      className={`block  mr-1 rounded px-2 mt-1 h-6 font-bold bg-zinc-200 text-black ${
        selectedTag === id ? "bg-emerald-400 dark:bg-emerald-800 text-white" : ""
      }`}
      onClick={() => setSelectedTag(id)}
    >
      <span className="sr-only">Filtrer listen af ruter efter ruter med tagget </span>
      {title}
    </button>
  );
}

export default Tag;
