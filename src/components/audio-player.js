import React, { useEffect } from 'react';

function AudioPlayer({ source, audioRef}) {
    
    return (
        <div className="container mx-auto">
            <div className="container">
            <audio className="m-auto" ref={audioRef} controls>
                <source src={source} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
            </div>
        </div>
    );
}
export default AudioPlayer;