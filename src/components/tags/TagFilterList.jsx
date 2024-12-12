import { React, useEffect, useState, useContext } from "react";
import useFetch from "../../util/useFetch";
import Tag from "./Tag";
import TagsLoading from "./TagsLoading";
import ErrorContext from "../../context/ErrorContext";

function TagFilterList() {
  const { setErrorText, setError } = useContext(ErrorContext);
  const [tags, setTags] = useState([]);
  const { data, error, loading } = useFetch("tags");

  useEffect(() => {
    if (data) {
      setTags(data["hydra:member"]);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      setError(true);
      setErrorText("Der skete en fejl da kategorierne skulle hentes. Prøv at genindlæs siden.");
    }
  }, [error]);

  if (loading) return <TagsLoading />;
  if (error) return null;
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
}

export default TagFilterList;
