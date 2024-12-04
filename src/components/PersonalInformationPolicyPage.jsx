import { React } from "react";

const PersonalInformationPolicyPage = ({}) => {
  return (
    <>
      <h1 className="text-2xl font-extrabold">
        Oplysninger om Aarhus Kommune Kultur og Borgerservices behandling af dine personoplysninger ved anvendelse af
        Podwalk
      </h1>
      <h2 className="font-extrabold mt-5">Hvad er formålet med og reglerne for behandlingen af personoplysningerne?</h2>
      <p>
        Vi behandler personoplysningerne til følgende formål: Podwalk anvender OpenStreetMap som kortløsning og ved brug
        af denne indsamles brugerens ip.
      </p>
      <h2 className="font-extrabold mt-5">Hvilke kategorier af personoplysninger behandler vi?</h2>
      <p>Aarhus Kommune Kultur og Borgerservice behandler følgende kategorier af personoplysninger:</p>
      <ul>
        <li>Almindelige personoplysninger: brugerens ip</li>
      </ul>
      <h2 className="font-extrabold mt-5">Hvem modtager personoplysningerne? </h2>
      <p>Ved brug af Podwalk overlader personoplysningerne til følgende modtagere: </p>
      <p>
        Kultur og Borgerservices databehandler Open Street Map, der behandler personoplysninger sikkert på vegne af på
        baggrund af instruks i en lovpligt databehandleraftale. Hvis Kultur og Borgerservice efter en konkret vurdering
        videregiver oplysninger til en anden selvstændig dataansvarlig, har denne ansvaret for, at du får besked om, at
        der er indsamlet personoplysninger ved Kultur og Borgerservice. En sådan videregivelse vil kun finde sted i
        overensstemmelse med lovgivningen, og vil altid kun omfatte nødvendige relevante data. For videregivelser til
        forskere gælder altid at en eventuel offentliggørelse af undersøgelsens resultat ikke må ske på en sådan måde,
        at det er muligt at identificere enkeltpersoner.
      </p>
      <h2 className="font-extrabold mt-5">Hvordan opbevarer vi personoplysningerne?</h2>
      Kultur og Borgerservice opbevarer personoplysningerne så længe det er nødvendigt og sagligt for at opfylde de
      faglige formål, der er angivet under afsnittet om formål. Derudover er Kultur og Borgerservice pålagt at opbevare
      personoplysningerne, indtil overlevering til arkiv efter arkivlovens regler. Vi kan på nuværende tidspunkt ikke
      sige, hvor For udvalgte oplysninger gælder dog at oplysningerne gemmes længere end det faglige formål kræver.
      Oplysninger gemmes i denne længere opbevaring kun til statistiske formål som beskrevet i første afsnit.
      <h2 className="font-extrabold mt-5">Dine rettigheder</h2>
      <p>
        Du har efter databeskyttelsesforordningen en række rettigheder i forhold til vores behandling af
        personoplysningerne. Du har normalt efter databeskyttelsesforordningen en række rettigheder så som indsigt,
        indsigelse og berigtigelse. Da denne behandling er en statistisk behandling hjemlet i
        databeskyttelsesforordningens artikel 6.1.e bortfalder disse rettigheder jf. databeskyttelseslovens §22, stk. 5
        om begrænsninger i rettigheder ved videnskabelige og statistiske behandlinger. Datatilsynet har udgivet en
        vejledning om de registreredes rettigheder, som du finder på www.datatilsynet.dk. Hvis du har spørgsmål til
        Kultur og Borgerservices behandling af dine personoplysninger kan du kontakte Aarhus Kommune, Kultur og
        Borgerservice,
        <a href="mailto:itkdev@mkb.aarhus.dk">ITK itkdev@mkb.aarhus.dk</a>
      </p>
    </>
  );
};

export default PersonalInformationPolicyPage;
