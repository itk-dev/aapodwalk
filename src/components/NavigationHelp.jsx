import { React } from "react";
import { Link } from "react-router-dom";

const NavigationHelp = () => {
  return (
    <>
      <h1 className="text-2xl font-extrabold">Tilladelse til lokation</h1>

      <p className="pt-5">
        Podwalk har brug for adgang til din lokation for at kunne vise dig, hvor du er, og hvilke punkter der er i
        nærheden. Tilladelsen styres af din <span className="font-extrabold">telefon</span> og ikke af den enkelte
        browser. Hvis du har sagt nej til adgangen tidligere, beder browseren ikke automatisk om den igen — du skal slå
        adgangen til i din telefons indstillinger.
      </p>
      <p className="pt-3">
        Når du har slået adgangen til, kan du gå tilbage til <span className="font-extrabold">Hjælp og vejledning</span>{" "}
        og bruge knappen <span className="font-extrabold">Bed om adgang til lokation igen</span> for at give Podwalk
        adgangen.
      </p>

      <h2 className="text-l font-extrabold pt-10">iPhone og iPad (iOS / iPadOS)</h2>
      <p className="pt-3">På iPhone og iPad styres lokationsadgangen ét sted: i telefonens indstillinger.</p>
      <ol className="pt-3 list-decimal pl-10">
        <li>
          Åbn <span className="font-extrabold">Indstillinger</span> på din telefon.
        </li>
        <li>
          Tryk på <span className="font-extrabold">Anonymitet og sikkerhed</span> (eller{" "}
          <span className="font-extrabold">Privatliv</span> på ældre versioner).
        </li>
        <li>
          Tryk på <span className="font-extrabold">Lokalitetstjenester</span> og slå dem til, hvis de er slået fra.
        </li>
        <li>
          Find den browser du bruger til Podwalk (typisk <span className="font-extrabold">Safari-websteder</span> eller{" "}
          <span className="font-extrabold">Chrome</span>) på listen og tryk på den.
        </li>
        <li>
          Vælg <span className="font-extrabold">Når app bruges</span> eller{" "}
          <span className="font-extrabold">Spørg næste gang</span>.
        </li>
        <li>Gå tilbage til Podwalk og genindlæs siden.</li>
      </ol>
      <p className="pt-3">
        Hvis du tidligere har sagt nej til Podwalk specifikt i Safari, husker browseren det. Du kan nulstille det ved at
        åbne <span className="font-extrabold">Indstillinger</span> → <span className="font-extrabold">Apps</span> →{" "}
        <span className="font-extrabold">Safari</span> → <span className="font-extrabold">Avanceret</span> →{" "}
        <span className="font-extrabold">Webstedsdata</span> og fjerne data for Podwalk, eller ved at gå til Safari →{" "}
        <span className="font-extrabold">Indstillinger for websteder</span> →{" "}
        <span className="font-extrabold">Lokation</span> og ændre indstillingen for Podwalk.
      </p>
      <p className="pt-3">
        <Link className="underline" to="https://support.apple.com/da-dk/102647">
          Læs Apples vejledning til lokalitetstjenester
        </Link>
      </p>

      <h2 className="text-l font-extrabold pt-10">Android</h2>
      <p className="pt-3">På Android er der to lag — telefonens lokation og browserens adgang til din lokation.</p>
      <ol className="pt-3 list-decimal pl-10">
        <li>
          Åbn <span className="font-extrabold">Indstillinger</span> på din telefon.
        </li>
        <li>
          Tryk på <span className="font-extrabold">Placering</span> (kan også hedde{" "}
          <span className="font-extrabold">Lokation</span>) og slå den til.
        </li>
        <li>
          Gå tilbage i Indstillinger og tryk på <span className="font-extrabold">Apps</span>.
        </li>
        <li>
          Find den browser du bruger til Podwalk (f.eks. <span className="font-extrabold">Chrome</span> eller{" "}
          <span className="font-extrabold">Samsung Internet</span>) og tryk på den.
        </li>
        <li>
          Tryk på <span className="font-extrabold">Tilladelser</span> →{" "}
          <span className="font-extrabold">Placering</span> og vælg{" "}
          <span className="font-extrabold">Tillad kun, mens appen bruges</span>.
        </li>
        <li>Gå tilbage til Podwalk og genindlæs siden.</li>
      </ol>
      <p className="pt-3">
        Har browseren stadig ikke adgang til Podwalk, har du sandsynligvis afvist adgangen i selve browseren. Åbn
        browserens menu (de tre prikker), gå til <span className="font-extrabold">Indstillinger</span> →{" "}
        <span className="font-extrabold">Indstillinger for websteder</span> →{" "}
        <span className="font-extrabold">Placering</span> og fjern Podwalk fra listen over blokerede sider — så bliver
        du spurgt igen næste gang.
      </p>
      <p className="pt-3">
        <Link
          className="underline"
          to="https://support.google.com/chrome/answer/142065?hl=da&co=GENIE.Platform%3DAndroid"
        >
          Læs Googles vejledning til lokation i Chrome
        </Link>
      </p>

      <h2 className="text-l font-extrabold pt-10">Computer (macOS / Windows)</h2>
      <p className="pt-3">
        Hvis du bruger Podwalk på en computer, styres adgangen både af operativsystemets privatlivsindstillinger og af
        den browser du bruger. Slå <span className="font-extrabold">Lokationstjenester</span> til under{" "}
        <span className="font-extrabold">Anonymitet og sikkerhed</span> (macOS) eller{" "}
        <span className="font-extrabold">Indstillinger</span> →{" "}
        <span className="font-extrabold">Anonymitet og sikkerhed</span> →{" "}
        <span className="font-extrabold">Placering</span> (Windows), og fjern derefter eventuelle blokeringer for
        Podwalk inde i din browsers indstillinger for websteder.
      </p>
    </>
  );
};

export default NavigationHelp;
