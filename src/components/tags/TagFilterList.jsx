import { React } from "react";
import Tag from "./Tag";

function TagFilterList({ tags, error, loading }) {
  if (loading || error) return null;
  if (tags.length === 0) return <div>Der er desværre ikke nogle filtre</div>;

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <fieldset>
        <legend>Filtrér</legend>
        <div className="flex flex-wrap">
          <Tag key="close-to-tag" title="Tæt på denne placering" id={null} />
          {tags.map(({ title, id }) => (
            <Tag key={id} title={title} id={id} />
          ))}
        </div>
      </fieldset>
    </form>
  );
}

export default TagFilterList;
