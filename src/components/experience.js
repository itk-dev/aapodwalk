import React, { useEffect, useState } from 'react';
import testdata from '../data/data.json';
import ExperienceList from './experience-list';
function Experience({ experienceId, setView, lat, long, storedData, setStoredData, changeAudio, geolocationAvailable }) {

    const [currentExperience, setCurrentExperience] = useState(null);

    useEffect(() => {
        if (testdata) {
            let data = testdata[experienceId];
            setCurrentExperience(data);
        }
    }, [testdata]);

    const returnToMainMenu = () => {
        setView("Hjem");
    }
    return (
        <div>
            <button className="bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-auto mt-5" onClick={returnToMainMenu}>← Tilbage</button>
            <div>
                <br />
            <h1 className="text-3xl text-white">{currentExperience && currentExperience.name}</h1>
            <p className="text-white px-2">Bevæg dig tæt nok på oplevelsens checkpoints for at låse op for en ny lydbid 🤠</p>
            <br />
            <ExperienceList experienceId={experienceId} steps={currentExperience && currentExperience.steps} lat={lat} long={long} storedData={storedData} setStoredData={setStoredData} changeAudio={changeAudio} geolocationAvailable={geolocationAvailable} />
            </div>
        </div>
    );
}
export default Experience;