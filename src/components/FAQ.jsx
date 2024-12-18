import { React } from "react";
import { Link } from "react-router-dom";

const FAQ = () => {
  return (
    <>
      <h1 className="text-2xl font-extrabold">Hjælp og vejledning</h1>
      <section className="bg-emerald-400 dark:bg-zinc-900 flex flex-row relative my-2 rounded font-bold p-5 flex flex-col mt-5">
        Oplysninger om Aarhus Kommune Kultur og Borgerservices behandling af dine personoplysninger ved anvendelse af
        Podwalk
        <Link
          to={"/personal-information-policy"}
          className="text-zinc-900 dark:text-emerald-600 font-bold underline mt-5"
        >
          Læs hele oplysningsteksten
        </Link>
      </section>
      <section className="bg-emerald-400 dark:bg-zinc-900 flex flex-row relative my-2 rounded font-bold p-5 flex flex-col mt-5">
        Sådan bruger du navigationen
        <Link to={"/navigation-help"} className="text-zinc-900 dark:text-emerald-600 font-bold underline mt-3">
          Vedledning til navigation
        </Link>
      </section>
      <section className="bg-emerald-400 dark:bg-zinc-900 flex flex-row relative my-2 rounded font-bold p-5 flex flex-col mt-5">
        Tilgængelighedserklæring
        <Link className="text-zinc-900 dark:text-emerald-600 font-bold underline mt-5">
          {/* todo add Tilgængelighedserklæring */}
          Tilgængelighed og en erklæring herom
        </Link>
      </section>
    </>
  );
};

export default FAQ;
