import { React, useState, useContext } from "react";
import PermissionContext from "../context/permission-context";
import { Link } from "react-router-dom";

const MapConsentBanner = () => {
  const { setOpenStreetMapConsent, openStreetMapConsent } = useContext(PermissionContext);

  function updateConsent(consent) {
    localStorage.setItem("data-consent", consent);
    setOpenStreetMapConsent(consent);
  }

  // If the user already said yes or no, we will not display the consent banner
  if (openStreetMapConsent === false || openStreetMapConsent === true) return;

  return (
    <>
      <div className="fixed left-3 bottom-3 right-3 dark:bg-zinc-600 flex flex-col gap-3 rounded-lg p-3">
        <div>
          <h2 className="mb-1 font-bold">Samtykke</h2>
          <div className="mt-1 flex flex-col">
            <div className="flex flex-col gap-2">
              <p>
                Aarhus Kommune ønsker i forbindelse med Podwalk at indhente dit samtykke til, at vi behandler
                personoplysninger om dig. Podwalk anvender OpenStreetMap som kortløsning og ved brug af denne indsamles
                brugrens ip. Hvis du vælger ikke at samtykke vil kortet ikke være tilgængelig i Podwalk. Det samtykke,
                du har givet til behandlingen, kan til enhver tid trækkes tilbage, dog uden at ændrer på lovligheden af
                den behandling, der allerede måtte være foretaget. Du kan tilbagetrække et afgivet samtykke ved at
                henvende dig, mundtligt eller skriftligt, til Aarhus Kommune, Kultur- og Borgerservice
                <a href="mailto:itkdev@mkb.aarhus.dk"> itkdev@mkb.aarhus.dk</a> itkdev@mkb.aarhus.dk og bede om at få
                samtykket trukket tilbage. Læs mere om, hvordan vi behandler dine personoplysninger.
              </p>
              <Link className="underline" to={`/personal-information-policy`}>
                Læs mere om, hvordan vi behandler dine personoplysninger.
              </Link>
              <div>
                <div className="flex justify-between">
                  <button
                    className="p-1 rounded text-zinc-800 bg-zinc-100 float-right mr-1 grow"
                    type="button"
                    onClick={() => updateConsent(true)}
                  >
                    Ja
                  </button>
                  <button
                    className="p-1 rounded text-zinc-800 bg-zinc-100 float-right ml-1 grow"
                    type="button"
                    onClick={() => updateConsent(false)}
                  >
                    Nej
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MapConsentBanner;
