import { React } from "react";
import { Link } from "react-router-dom";
import GpsPermissionRequest from "./GpsPermissionRequest";

const FAQ = () => {
  return (
    <>
      <h1 className="text-2xl font-extrabold">Hjælp og vejledning</h1>
      <GpsPermissionRequest />
      <section className="bg-emerald-400 dark:bg-zinc-900 flex flex-col relative my-2 rounded font-bold p-5 mt-5">
        Oplysninger om Aarhus Kommune Kultur og Borgerservices behandling af dine personoplysninger ved anvendelse af
        Podwalk
        <Link
          to={"/personal-information-policy"}
          className="text-zinc-900 dark:text-emerald-600 font-bold underline mt-5"
        >
          Læs hele oplysningsteksten
        </Link>
      </section>
      <section className="bg-emerald-400 dark:bg-zinc-900 flex flex-col relative my-2 rounded font-bold p-5 mt-5">
        Sådan slår du adgang til lokation til på iPhone og Android
        <Link to={"/navigation-help"} className="text-zinc-900 dark:text-emerald-600 font-bold underline mt-3">
          Vejledning til lokationstilladelse
        </Link>
      </section>
      <section className="bg-emerald-400 dark:bg-zinc-900 flex flex-col relative my-2 rounded font-bold p-5 mt-5">
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
