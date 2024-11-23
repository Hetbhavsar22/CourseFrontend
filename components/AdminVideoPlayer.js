// MpdPlayer.js
import React, { useEffect, useRef } from 'react';
import shaka from 'shaka-player';

const MpdPlayer = ({ manifestUrl, width = '100%', height = 'auto', autoplay = false }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            // Initialize Shaka Player
            const player = new shaka.Player(videoRef.current);

            // Add error handling
            player.addEventListener('error', onError);

            // Load the MPD content
            player.load(manifestUrl)
                .then(() => {
                    console.log('The video has been loaded successfully!');
                    if (autoplay) {
                        videoRef.current.play();
                    }
                })
                .catch(onError);

            // Cleanup the player on unmount
            return () => {
                player.destroy();
            };
        }
    }, [manifestUrl, autoplay]);

    const onError = (error) => {
        console.error('Error code', error.code, 'object', error);
    };

    return (
        <div>
            <video
                ref={videoRef}
                controls
                width={width}
                height={height}
                autoPlay={autoplay}
            />
        </div>
    );
};

export default MpdPlayer;
