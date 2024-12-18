import { React, useContext, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import SelectedTagContext from "../../context/SelectedTagContext";

function Tag({ title, id }) {
  const { setSelectedTag, selectedTag } = useContext(SelectedTagContext);
  const { search } = useLocation();
  const { replace } = useHistory();

  useEffect(() => {
    const query = new URLSearchParams(search);
    const tagId = query.get("tag");
    if (tagId && Number(tagId) === id) {
      setSelectedTag(id);
    }
  }, [id, search, setSelectedTag]);

  useEffect(() => {
    if (selectedTag === id) {
      const paramsString = `tag=${id}`;
      const searchParams = new URLSearchParams(paramsString);
      replace({ search: searchParams.toString() });
    }
  }, [selectedTag, id]);

  return (
    <button
      className={`${
        selectedTag === id
          ? "block mr-1 rounded px-2 mt-1 h-6 font-bold bg-emerald-400 dark:bg-emerald-800 text-black dark:text-white"
          : "block mr-1 rounded px-2 mt-1 h-6 font-bold bg-zinc-200 text-black"
      }`}
      type="submit"
      onClick={() => setSelectedTag(id)}
    >
      <span className="sr-only">Filtrer listen af ruter efter ruter med tagget </span>
      {title}
    </button>
  );
}

export default Tag;
