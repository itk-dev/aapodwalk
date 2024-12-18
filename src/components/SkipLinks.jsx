import { React } from "react";

const SkipLinks = () => {
  return (
    <section>
      <a className="sr-only focus:not-sr-only" href="#main-content">
        Gå til hovedindhold
      </a>
    </section>
  );
};

export default SkipLinks;
