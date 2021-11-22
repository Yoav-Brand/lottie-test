import "@lottiefiles/lottie-player";
import lotiAnimation from '../animation.json';
// import { create } from '@lottiefiles/lottie-interactivity';

//********** Scroll Function ***********/
export function lottieScroll(config) {
  window.addEventListener("scroll", function() {
    for (const playerId in config) {
      // Get the lottie player element and lottie reference
      const player = document.getElementById(playerId);

      // Skip rest if the player element was not found
      if (!player) {
        console.log(
          `Invalid player element specified for ${playerId}. Skipping...`
        );
        continue;
      }

      // Get the configured container. Use player as fallback if unconfigured or invalid
      const container =
        config[playerId].container !== undefined
          ? document.getElementById(config[playerId].container)
          : player;

      // Skip rest if the container element was not found
      if (!container) {
        console.log(
          `Invalid container element specified for ${playerId}. Skipping...`
        );
        continue;
      }

      // Get the bounding box for the lottie player or container
      const { top, bottom, height } = container.getBoundingClientRect();

      // Calculate current view percentage
      const current = window.innerHeight - top;
      const max = window.innerHeight + height;
      const currentPercent = current / max;

      // // Skip if out of viewport
      if (currentPercent < 0 || currentPercent > 1) {
        continue;
      }

      // Find the first action that satisfies the current position conditions
      const action = config[playerId].actions.find(
        ({ start, end }) => currentPercent >= start && currentPercent <= end
      );

      // Skip if no matching action was found!
      if (!action) {
        continue;
      }

      // Get lottie instance
      const lottie = player.getLottie();
      lottie.loop = true;

      // Process action types:
      if (action.type === "seek") {
        // Seek: Go to a frame based on player scroll position action
        lottie.playSegments(action.frames, true);
        lottie.goToAndStop(
          Math.ceil(
            ((currentPercent - action.start) / (action.end - action.start)) *
              lottie.totalFrames
          ),
          true
        );
      } else if (action.type === "loop") {
        // Loop: Loop a given frames
        if (lottie.isPaused === true) {
          lottie.playSegments(action.frames, true);
        }
      } else if (action.type === "play") {
        // Play: Reset segments and continue playing full animation from current position
        if (lottie.isPaused === true) {
          lottie.resetSegments();
        }
        lottie.play();
      } else if (action.type === "stop") {
        // Stop: Stop playback
        lottie.goToAndStop(action.frames[0]);
        lottie.stop();
      } else if (action.type === "hover") {
        container.addEventListener("mouseenter", function() {
          if (lottie.isPaused === true) {
            lottie.playSegments(action.frames, true);
          }
        });
        container.addEventListener("mouseleave", function() {
          if (lottie.isPaused === false) {
            lottie.pause();
          }
        });
      }
    }
  });
}
//********** Lottie Scroll ***********/

const createPlayer = () => {
    const lottiePlayer = document.createElement('div');
    // const blobUrl = new Blob([JSON.stringify(lotiAnimation)], {type: 'application/json'});
    // const url = URL.createObjectURL(blobUrl);
    const url = new URL('https://raw.githubusercontent.com/Yoav-Brand/lottie-test/main/animation.json');
    debugger;
    lottiePlayer.innerHTML = `
    <lottie-player id="firstLottie" src="${url}" ></lottie-player>
    `;
    

    // lottiePlayer.addEventListener('load', function (e) {
    //     console.log('Im Here')
    //     create({
    //         mode: 'scroll',
    //         player: '#firstLottie',
    //         actions: [{
    //             visibility: [0, 1],
    //             type: 'seek',
    //             frames: [0, 100],
    //         }, ],
    //     });
    // })
    return lottiePlayer;
};
//<lottie-player id="firstLottie" src="https://assets5.lottiefiles.com/packages/lf20_FISfBK.json" style="width:400px; height: 400px;"></lottie-player>

const animationProps = () => {
    const animActions = {
        firstLottie: {
            actions: [{
                start: 0,
                end: 1,
                type: "seek",
                frames: [0, 300],
            }, ],
        }
    };
    lottieScroll(animActions);
};

class scrollingLottie extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.appendChild(createPlayer());
        this.appendChild(animationProps());

    }
}

customElements.define('wix-lottie', scrollingLottie);
