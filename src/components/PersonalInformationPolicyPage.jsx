import { React } from "react";

function PersonalInformationPolicyPage() {
  return (
    <>
      <h1 className="text-2xl font-extrabold">
        Oplysninger om Kultur og Borgerservices behandling af dine personoplysninger ved brug af appen
        Podwalk
      </h1>
      <p>
        På denne side kan du læse mere om vores dataansvar og behandling af personoplysninger og rettigheder efter
        reglerne om databeskyttelse. Oplysningerne er alene til orientering. Du behøver derfor ikke foretage dig noget,
        og du mister ingen rettigheder ved ikke at læse oplysningerne. Vi behandler kun de nødvendige personoplysninger
        som du giver os eller som vi indsamler, i overensstemmelse med gældende regler.
      </p>
      <h2 className="font-extrabold mt-5">Hvad er formålet med og reglerne for behandlingen af personoplysningerne?</h2>
      <p>Vi behandler personoplysningerne til følgende formål:</p>
      <ol>
        <li>Procesoptimere din interaktion med OpenStreetMaps kortløsning.</li>
      </ol>
      <p>
        Reglerne for vores behandling af personoplysningerne følger af nedenstående lovgivning, bekendtgørelser og
        vejledninger til disse:
      </p>
      <ol>
        <li>Persondataforordningens artikel 6, stk. 1 litra e</li>
      </ol>
      <h2 className="font-extrabold mt-5">Hvilke kategorier af personoplysninger behandler vi?</h2>
      <p>Vi behandler følgende kategorier af personoplysninger:</p>
      <ul>
        <li>Almindelige personoplysninger: ip-adresse og din interaktion ift. brug af kortløsningen</li>
      </ul>
      <h2 className="font-extrabold mt-5">Hvor stammer personoplysningerne fra?</h2>
      <p>Oplysningerne bliver hentet automatisk når du tilgår kortløsningen.</p>
      <h2 className="font-extrabold mt-5">Hvordan opbevarer vi personoplysningerne?</h2>
      <p>Ip-adresse og tilhørende historik slettes automatisk efter 180 dage.</p>
      <h2 className="font-extrabold mt-5">Dine rettigheder</h2>
      <p>
        Du har efter databeskyttelsesforordningen en række rettigheder i forhold til vores behandling af
        personoplysningerne.
      </p>
      <p>
        Det samtykke, du har giv, kan til enhver tid trækkes tilbage, dog uden at ændrer på lovligheden af den
        behandling, der allerede måtte være foretaget.
      </p>
      <p>
        Du har ret til at anmode om indsigt i oplysningerne vi har om dig. Du har også ret til at anmode om berigtigelse
        eller sletning af oplysninger, og du kan også bede om en begrænsning af behandlingen af oplysningerne. Du skal
        dog være opmærksom på, at kommunen typisk er forpligtet til at gemme de oplysninger vi har noteret om dig,
        indtil den ovennævnte slettefrist indtræder.
      </p>
      <p>Du har ret til at gøre indsigelse mod behandlingen.</p>
      <p>Hvis du vil gøre brug af dine rettigheder eller har spørgsmål skal du kontakte:</p>
      <p>Kultur og Borgerservice, Aarhus Kommune</p>
      <p>CVR-nr.: 55133018</p>
      <p> Email: itkdev@mkb.aarhus.dk</p>
      <p>
        Datatilsynet har udgivet en vejledning om de registreredes rettigheder, som du finder på www.datatilsynet.dk.
      </p>
      <h3 className="font-extrabold mt-3">Kontaktoplysninger på databeskyttelsesrådgiveren</h3>
      <p>
        Hvis du har spørgsmål til Aarhus Kommunes beskyttelse af personoplysninger, kan du også kontakte Aarhus Kommunes
        databeskyttelsesrådgiver:
      </p>
      <p>
        E-mail:{" "}
        <a className="underline" href="mailto:databeskyttelsesraadgiver@aarhus.dk">
          databeskyttelsesraadgiver@aarhus.dk
        </a>
        (
        <a
          className="underline"
          href="https://post.borger.dk/send/2ea2e7ff-bad5-471d-a5c0-a63cbbd076d6/2988716d-6af4-47e2-874a-d0ed8c76f831/"
        >
          Her er linket til sikker mail her for databeskyttelsesrådgiveren
        </a>
        )
      </p>
      <p>Telefon: 89 40 22 20</p>
      <h3 className="font-extrabold mt-3">Klage til Datatilsynet</h3>
      <p>
        Du kan klage til Datatilsynet, hvis du er utilfreds med den måde, vi behandler personoplysninger på. Du finder
        Datatilsynets kontaktoplysninger på{" "}
        <a className="underline" href="www.datatilsynet.dk">
          www.datatilsynet.dk
        </a>
      </p>
    </>
  );
}

export default PersonalInformationPolicyPage;
