import "./main.scss";

import React from 'react';
import {RefOrNull} from "shared/lib";
import {VideoJSView} from "shared/packages";
import videojs, {VideoJsPlayer} from "video.js";


export function MainPageView() {
    const playerRef = React.useRef<RefOrNull<VideoJsPlayer>>(null);

    const videoJsOptions = {
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
            src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            type: 'video/mp4'
        }]
    };

    const handlePlayerReady = (player: VideoJsPlayer) => {
        playerRef.current = player;
        var reqId: number;
        // You can handle player events here, for example:
        var startTracking = function () {
            // console.log(player.currentTime() * 1000);
            reqId = requestAnimationFrame(function play() {
                console.log(player.currentTime());
                reqId = requestAnimationFrame(play);
            });
        };

        var stopTracking = function () {
            if (reqId) {
                cancelAnimationFrame(reqId);
            }
        };
        player.on('play', startTracking)
        player.on('pause', stopTracking)
        // player.on('play', () => {
        //     videojs.log('player is playing');
        //     reqId = player.setInterval(function () {
        //         // videojs.log(player.currentTime());
        //         // queueMicrotask()
        //         videojs.log(Math.round(player.currentTime() * 1000));
        //     }, 5)
        // });

        // player.on('pause', () => {
        //     videojs.log('player is paused');
        //     if (reqId) {
        //         player.clearInterval(reqId);
        //     }
        // });

        // player.on('dispose', () => {
        //     videojs.log('player will dispose');
        // });

    };

    return (
        <div className="MainPage">
            <VideoJSView options={videoJsOptions} onReady={handlePlayerReady} />
        </div>
    );
}