import { React } from "react";
import { Link } from "react-router-dom";

const NavigationHelp = () => {
  return (
    <>
      <h1 className="text-2xl font-extrabold">Navigation</h1>

      <p className="pt-5">
        For alle browsere gælder det, at du kan ændre dine enhedens{" "}
        <span className="font-extrabold">lokationstjenesteindstillinger</span> på systemniveau, hvilket vil påvirke
        browserens adfærd. Du kan finde disse indstillinger i din enheds{" "}
        <span className="font-extrabold">Privatlivsindstillinger</span> på både macOS, iOS og Windows.
      </p>
      <p className="pt-2">
        Herunder er der skrevet korte vejledninger om lokationstilladelse i{" "}
        <span className="font-extrabold">Google Chrome</span> og <span className="font-extrabold">Safari</span>
      </p>
      <h2 className="text-l font-extrabold pt-10">Google Chrome</h2>
      <ol className="pt-5 list-decimal pl-10">
        <li>
          <span className="font-extrabold">Åbn Google Chrome</span>: Start browseren på din enhed
        </li>
        <li>
          <span className="font-extrabold">Gå til Indstillinger</span>
          <ul className="list-disc pl-10">
            <li>Klik på de tre prikker øverst til højre i browseren (menuen)</li>
            <li>
              Vælg <span className="font-extrabold">Indstillinger/settings</span> fra menuen.
            </li>
          </ul>
        </li>
        <li>
          <span className="font-extrabold">Find Lokationsindstillinger</span>
          <ul className="list-disc pl-10">
            <li>
              I venstre side af indstillingerne, klik på{" "}
              <span className="font-extrabold">Privatliv og sikkerhed/privacy and security</span>
            </li>
            <li>
              Vælg <span className="font-extrabold">webstedstilladelser/site settings</span>
            </li>
            <li>
              Klik på <span className="font-extrabold">Lokation</span>
            </li>
            <li>
              <span className="font-extrabold">Slå Lokationsdeling til/fra</span>
              <ul className="list-disc pl-10">
                <li>
                  Hvis du har sagt nej til at et websted har adgang til din lokation kan det ændres herinde. Hvis du
                  fjerner det fra listen over websteder der ikke har adgang til din lokation, vil du blive spurgt til
                  tilladelse af deling af din lokation igen når du genbesøger siden.
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ol>
      <p>
        <Link className="underline" to="https://support.google.com/chrome/answer/114662">
          Du kan læse mere om tilladelser og lokation i Google Chrome her
        </Link>
      </p>

      <h2 className="text-l font-extrabold pt-10">Safari (iOS/iPadOS)</h2>
      <ol className="pt-5 list-decimal pl-10">
        <li>
          <span className="font-extrabold">Åbn indstillinger</span>: Gå til{" "}
          <span className="font-extrabold">indstillinger-appen</span> på din iPhone eller iPad
        </li>
        <li>
          <span className="font-extrabold">Find Safari Indstillinger</span>
          <ul className="list-disc pl-10">
            <li>
              Scroll ned og vælg <span className="font-extrabold">Lokationstjenester</span>
            </li>
            <li>
              Tryk på <span className="font-extrabold">Webstedstilladelser</span>
            </li>
          </ul>
        </li>
        <li>
          <span className="font-extrabold">Slå Lokationsdeling til/fra</span>
          <ul className="list-disc pl-10">
            <li>
              Her kan du ændre indstillingerne for hvert websted, der har anmodet om adgang til din lokation
              <span className="font-extrabold">Privatliv og sikkerhed/privacy and security</span>
            </li>
          </ul>
        </li>
      </ol>
      <p>
        <Link className="underline" to="https://support.apple.com/da-dk/102647">
          Du kan læse mere om tilladelser og lokation i Safari til IPhone her
        </Link>
      </p>
    </>
  );
};

export default NavigationHelp;
