import { React, useEffect, useState } from "react";
import useFetch from "../../util/useFetch";
import Tag from "./Tag";

const TagList = () => {
  const [tags, setTags] = useState(null);
  const { data } = useFetch(`tags`);

  useEffect(() => {
    if (data) {
      setTags(data["hydra:member"]);
    }
  }, [data]);

  if (!tags) return null;

  return (
    <>
      <fieldset>
        <legend>Sorter efter:</legend>
        <div class="flex flex-wrap">
          <Tag key="close-to-tag" title="Tæt på denne placering" id={null}></Tag>
          {tags.map(({ title, id }) => (
            <Tag key={id} title={title} id={id} />
          ))}
        </div>
      </fieldset>
    </>
  );
};

export default TagList;
