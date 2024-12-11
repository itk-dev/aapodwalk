import { React, useEffect, useState } from "react";
import useFetch from "../../util/useFetch";
import Tag from "./Tag";
import TagsLoading from "./TagsLoading";

const TagFilterList = () => {
  const [tags, setTags] = useState([]);
  const { data, error, loading } = useFetch("tags");
  useEffect(() => {
    if (data) {
      setTags(data["hydra:member"]);
    }
  }, [data]);

  if (loading) return <TagsLoading />;
  if (error) return <div>Der skete desværre en fejl da filtrene skulle hentes</div>;
  if (tags.length === 0) return <div>Der er desværre ikke nogle filtre</div>;

  return (
    <fieldset>
      <legend>Filtrér</legend>
      <div className="flex flex-wrap">
        <Tag key="close-to-tag" title="Tæt på denne placering" id={null} />
        {tags.map(({ title, id }) => (
          <Tag key={id} title={title} id={id} />
        ))}
      </div>
    </fieldset>
  );
};

export default TagFilterList;
