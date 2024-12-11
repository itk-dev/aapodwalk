import { React, useEffect, useState } from "react";

function TagList({ tags, classes = "" }) {
  const [displayTags, setDisplayTags] = useState("");

  useEffect(() => {
    setDisplayTags(tags.map(({ title }) => title).join(", "));
  }, []);

  return <span className={`text-emerald-400 dark:text-emerald-800 font-bold text-sm ${classes}`}>{displayTags}</span>;
}

export default TagList;
