import { React, useContext } from "react";
import { Link } from "react-router-dom";
import PermissionContext from "../context/permission-context";

function MapConsentBanner() {
  const { setOpenStreetMapConsent, openStreetMapConsent } = useContext(PermissionContext);

  function updateConsent(consent) {
    setOpenStreetMapConsent(consent);
  }

  // If the user already said yes or no, we will not display the consent banner
  if (openStreetMapConsent === false || openStreetMapConsent === true) return null;

  return (
    <div className="fixed left-3 bottom-3 right-3 dark:bg-zinc-600 flex flex-col gap-3 rounded-lg p-3 bg-zinc-300">
      <div>
        <h2 className="mb-1 font-bold text-xl">Samtykke</h2>
        <div className="mt-1 flex flex-col">
          <div className="flex flex-col gap-2">
            <p>
              Aarhus Kommune ønsker i forbindelse med Podwalk at indhente dit samtykke til, at vi behandler
              personoplysninger om dig. Podwalk anvender OpenStreetMap som kortløsning og ved brug af denne indsamles
              din ip-adresse for at kunne give dig en hurtig adgang til - og opdatering af kortet. Hvis du vælger ikke
              at give samtykke vil kortet ikke være tilgængelig i Podwalk.
            </p>
            <Link className="underline" to="/personal-information-policy">
              Læs mere om, hvordan vi behandler dine personoplysninger.
            </Link>
            <div>
              <div className="flex justify-between">
                <button
                  className="p-1 rounded bg-zinc-100 dark:bg-emerald-800 float-right mr-1 grow"
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
  );
}

export default MapConsentBanner;
