import { useEffect, useRef } from "react";

const GLYPHS: Record<string, string[]> = {
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["010", "110", "010", "010", "010", "010", "111"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "10000", "11110", "00001", "00001", "11110"],
  "6": ["01110", "10000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00001", "01110"],
  ".": ["0", "0", "0", "0", "0", "0", "1"],
  "I": ["111", "010", "010", "010", "010", "010", "111"],
  "a": ["00000", "00000", "01110", "00001", "01111", "10001", "01111"],
  "e": ["00000", "00000", "01110", "10001", "11111", "10000", "01110"],
  "g": ["00000", "00000", "01111", "10001", "01111", "00001", "01110"],
  "i": ["1", "0", "1", "1", "1", "1", "1"],
  "l": ["10", "10", "10", "10", "10", "10", "01"],
  "n": ["00000", "00000", "11110", "10001", "10001", "10001", "10001"],
  "t": ["010", "010", "111", "010", "010", "010", "001"],
  "r": ["00000", "00000", "10110", "11001", "10000", "10000", "10000"],
};

function renderDotSVG(str: string, isDotWord: boolean, isContextMetric: boolean) {
  const pitchX = isDotWord ? 4 : 5;
  const pitchY = 4;
  const dotRadius = isDotWord ? 1.8 : isContextMetric ? 2.32 : 1.55;

  let currentX = 0;
  let circlesHTML = "";

  for (let charIdx = 0; charIdx < str.length; charIdx++) {
    const char = str[charIdx];
    const matrix = GLYPHS[char];

    if (matrix) {
      const cols = matrix[0].length;

      for (let r = 0; r < 7; r++) {
        const rowStr = matrix[r];
        for (let c = 0; c < cols; c++) {
          if (rowStr[c] === "1") {
            const cx = currentX + c * pitchX + dotRadius;
            const cy = r * pitchY + dotRadius;
            circlesHTML += `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${dotRadius}" fill-opacity="1" />`;
          }
        }
      }
      currentX += cols * pitchX + (isDotWord ? 2 : 4);
    } else {
      currentX += pitchX * 2;
    }
  }

  const totalWidth = Math.max(currentX - 2, 1);
  return (
    <svg
      className="dot-svg"
      viewBox={`0 0 ${totalWidth} 28`}
      fill="currentColor"
      dangerouslySetInnerHTML={{ __html: circlesHTML }}
    />
  );
}

export default function IntelligentPerformanceStage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.add("entrance-active");
    const failsafe = setTimeout(() => {
      document.documentElement.classList.remove("entrance-active");
    }, 3200);

    return () => {
      clearTimeout(failsafe);
      document.documentElement.classList.remove("entrance-active");
    };
  }, []);

  return (
    <div ref={containerRef} className="intelligent-stage-wrapper rounded-3xl overflow-hidden shadow-2xl relative">
      <style>{`
        .intelligent-stage-wrapper {
          --paper: #ececeb;
          --ink: #222222;
          --copy: #4a4a4a;
          --glass-line: rgba(255,255,255,.36);
          --card-ref-w: 429;
          --card-ref-h: 554;
          --card-count: 3;
          --gap: clamp(8px, 1.5vw, 23px);
          --gutter: clamp(14px, 3.6vw, 54px);
          --content-max: calc(var(--card-count) * var(--card-ref-w) * 1px + (var(--card-count) - 1) * var(--gap));
          --pad-top: clamp(20px, 6vh, 60px);
          --pad-bottom: clamp(16px, 3vh, 40px);
          --masthead-gap: clamp(16px, 3vw, 40px);
          --cards-offset: clamp(14px, 4vh, 48px);
          background: var(--paper);
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: var(--ink);
        }

        .stage-inner {
          position: relative;
          isolation: isolate;
          display: flex;
          flex-direction: column;
          min-height: 820px;
          overflow: hidden;
          padding: var(--pad-top) var(--gutter) var(--pad-bottom);
          background: var(--paper);
        }

        .stage-motion {
          position: absolute;
          inset: 0;
          z-index: -2;
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
        }
        .stage-motion--wide { display: block; }
        .stage-motion--narrow { display: none; }

        @media (max-width: 767px) {
          .stage-motion--wide { display: none; }
          .stage-motion--narrow { display: block; }
          .stage-inner {
            background:
              linear-gradient(rgba(236,236,234,.08), rgba(236,236,234,.08)),
              url("https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/0f4926a4-e660-4df2-9195-2bfb3e341bdd.webp") center top / 100% 100% no-repeat,
              #e8e8e8;
          }
        }

        .masthead, .cards-row {
          width: min(100%, var(--content-max));
          margin-inline: auto;
        }

        .masthead {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, clamp(260px, 32vw, 483px));
          gap: var(--masthead-gap);
          align-items: start;
          z-index: 2;
          flex: 0 0 auto;
        }

        .headline {
          margin: 0;
          max-width: 100%;
          color: #202020;
          font-size: clamp(24px, min(3.1vw, 5.9vh), 47px);
          font-weight: 400;
          letter-spacing: .015em;
          line-height: 1.223;
        }

        .headline__line {
          display: flex;
          white-space: nowrap;
          align-items: center;
        }

        .dot-word {
          display: inline-block;
          flex: 0 0 auto;
          width: 4.851em;
          height: .766em;
          margin-left: .319em;
          color: #f97316;
          transform: translateY(.085em);
        }

        .dot-svg {
          display: block;
          overflow: visible;
          color: inherit;
          width: 100%;
          height: 100%;
        }

        .intro {
          container-type: inline-size;
          width: 100%;
          margin: .34em 0 0;
          color: var(--copy);
          font-size: clamp(13px, min(1.36vw, 2.6vh), 20.6px);
          font-weight: 400;
          letter-spacing: -.017em;
          line-height: 1.62;
        }

        .desktop-break { display: none; }
        @container (min-width: 26.5em) {
          .desktop-break { display: inline; }
        }

        .cards-row {
          flex: 1 1 auto;
          container-type: size;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--gap);
          min-height: 0;
          margin-top: var(--cards-offset);
          --card-w: min(
            (100cqw - (var(--card-count) - 1) * var(--gap)) / var(--card-count),
            100cqh * var(--card-ref-w) / var(--card-ref-h),
            var(--card-ref-w) * 1px
          );
        }

        .card {
          container-type: inline-size;
          position: relative;
          flex: 0 0 auto;
          overflow: hidden;
          width: var(--card-w);
          aspect-ratio: 429 / 554;
          border: 1px solid var(--glass-line);
          border-radius: calc(var(--card-w) * 17 / 429);
          background-origin: border-box;
          color: #fff;
          --u: calc(100cqw / 429);
          box-shadow: 0 2px 4px rgba(50,28,39,.30), inset 0 1px 0 rgba(255,255,255,.24);
        }

        .card::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          mix-blend-mode: screen;
          pointer-events: none;
          background:
            linear-gradient(102deg, rgba(255,255,255,.10), transparent 28%, rgba(255,255,255,.08) 62%, transparent 88%),
            radial-gradient(ellipse 85% 34% at 54% 7%, rgba(255,255,255,.24), transparent 72%);
        }

        .card__media {
          position: absolute;
          inset: 0;
          z-index: 0;
          width: 100%;
          height: 100%;
          object-fit: fill;
          pointer-events: none;
        }

        .card__grain {
          position: absolute;
          z-index: 2;
          inset: -8%;
          width: 116%;
          height: 116%;
          opacity: .46;
          mix-blend-mode: soft-light;
          pointer-events: none;
        }

        .card__title {
          position: absolute;
          z-index: 4;
          top: 6.1%;
          left: 5%;
          width: 90%;
          margin: 0;
          color: rgba(255,255,255,.96);
          font-size: calc(22.95 * var(--u));
          font-weight: 600;
          letter-spacing: 0;
          line-height: 1.48;
          text-align: center;
          text-shadow: 0 1px 1px rgba(72,28,48,.14);
        }

        .metric {
          position: absolute;
          z-index: 5;
          left: 0;
          width: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          color: rgba(255,255,255,.97);
          filter: drop-shadow(0 1px 1px rgba(104,27,54,.08));
        }

        .metric__unit {
          margin-left: 1.3%;
          font-size: calc(30.46 * var(--u));
          font-weight: 400;
          line-height: 1;
          letter-spacing: calc(-.8 * var(--u));
        }

        .caption {
          position: absolute;
          z-index: 5;
          top: 65.1%;
          left: 10%;
          width: 80%;
          color: rgba(255,255,255,.87);
          font-size: calc(19.95 * var(--u));
          font-weight: 400;
          letter-spacing: calc(-.36 * var(--u));
          line-height: 1.45;
          text-align: center;
          text-shadow: 0 1px 2px rgba(60,21,35,.16);
        }

        .learn-more {
          position: absolute;
          z-index: 6;
          top: 83.75%;
          left: 50%;
          width: calc(111 * var(--u));
          height: calc(45 * var(--u));
          transform: translateX(-50%);
          border: 0;
          border-radius: 999px;
          color: #2d2d2d;
          background: rgba(255,255,255,.97);
          box-shadow: 0 1px 0 rgba(255,255,255,.50) inset, 0 1px 3px rgba(58,25,39,.08);
          font-size: calc(14 * var(--u));
          font-weight: 400;
          letter-spacing: calc(-.25 * var(--u));
          cursor: pointer;
          transition: transform .18s ease, box-shadow .18s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .learn-more:hover {
          transform: translateX(-50%) translateY(calc(-2 * var(--u)));
          box-shadow: 0 8px 20px rgba(58,25,39,.16);
        }

        /* CARD 1 - SPEED */
        .card--speed {
          background:
            radial-gradient(ellipse 34% 24% at 50% 2%, rgba(255,220,211,.10) 0%, transparent 76%),
            radial-gradient(ellipse 44% 34% at 106% 20%, rgba(255,222,211,.10) 0%, transparent 74%),
            radial-gradient(ellipse 40% 27% at 50% 82%, rgba(255,214,208,.08) 0%, transparent 74%),
            radial-gradient(ellipse 43% 31% at -7% 61%, rgba(127,31,53,.06) 0%, transparent 74%),
            radial-gradient(ellipse 47% 34% at 107% 82%, rgba(119,29,49,.07) 0%, transparent 74%),
            linear-gradient(180deg, rgba(255,246,241,.43) 0%, rgba(255,237,235,.19) 9%, transparent 22%),
            radial-gradient(ellipse 44% 34% at 50% 111%, rgba(55,0,20,.16) 0%, transparent 74%),
            radial-gradient(ellipse 105% 32% at 50% 80%, rgba(255,218,204,.20) 0%, rgba(255,205,196,.10) 48%, transparent 78%),
            radial-gradient(ellipse 55% 22% at -5% 39%, rgba(240,250,200,.15) 0%, transparent 76%),
            radial-gradient(ellipse 64% 49% at -8% 106%, rgba(255,222,199,.48) 0%, rgba(255,204,192,.25) 49%, transparent 78%),
            radial-gradient(ellipse 64% 49% at 108% 106%, rgba(255,222,199,.43) 0%, rgba(255,204,192,.22) 49%, transparent 78%),
            radial-gradient(ellipse 52% 54% at -8% 44%, rgba(255,216,207,.20) 0%, transparent 77%),
            radial-gradient(ellipse 68% 45% at -4% -3%, rgba(255,235,232,.73) 0%, rgba(255,226,226,.41) 46%, transparent 77%),
            radial-gradient(ellipse 70% 45% at 104% -4%, rgba(255,238,233,.78) 0%, rgba(255,226,226,.42) 48%, transparent 78%),
            radial-gradient(ellipse 93% 47% at 106% 58%, rgba(245,247,241,.73) 0%, rgba(246,231,229,.42) 48%, transparent 76%),
            radial-gradient(ellipse 74% 40% at -8% 73%, rgba(255,210,190,.48) 0%, rgba(255,194,181,.25) 48%, transparent 77%),
            radial-gradient(ellipse 77% 36% at 57% 58%, rgba(255,226,218,.30) 0%, rgba(255,206,207,.15) 50%, transparent 78%),
            radial-gradient(ellipse 54% 30% at 50% 17%, rgba(106,8,51,.22) 0%, transparent 78%),
            linear-gradient(180deg, #bd4468 0%, #ad355b 38%, #a63b50 72%, #8c1320 100%);
          background-origin: border-box;
        }

        .card--speed::before {
          background:
            linear-gradient(103deg, rgba(255,255,255,.08), transparent 31%, rgba(255,255,255,.055) 63%, transparent 88%),
            radial-gradient(ellipse 92% 19% at 51% 0%, rgba(255,255,255,.08), transparent 78%);
        }

        .card--speed .card__title {
          top: 6.3%;
          color: #fff;
          font-size: calc(22.7 * var(--u));
        }

        .gauge {
          position: absolute;
          z-index: 2;
          top: 27.63%;
          left: 10.5%;
          width: 79%;
          height: 59%;
          overflow: visible;
        }

        .metric--speed {
          top: 48.6%;
        }

        .metric--speed .dot-number {
          width: 31.2%;
        }

        .metric--speed .dot-svg {
          transform: translate(calc(4 * var(--u)), calc(2 * var(--u))) scale(.925, 1.018);
          transform-origin: left top;
        }

        .metric--speed .metric__unit {
          margin-left: 1%;
          font-size: calc(30.6 * var(--u));
          transform: translateY(calc(5 * var(--u)));
        }

        .card--speed .caption {
          top: 64.75%;
          font-size: calc(20.33 * var(--u));
        }

        .card--speed .learn-more {
          top: 83.9%;
          width: calc(111 * var(--u));
          height: calc(44 * var(--u));
        }

        /* CARD 2 - CONTEXT */
        .card--context {
          background:
            radial-gradient(ellipse 118% 66% at 48% -8%, rgba(221,232,255,.065), transparent 74%),
            radial-gradient(ellipse 106% 52% at 48% 112%, rgba(255,155,139,.075), transparent 73%),
            radial-gradient(ellipse 82% 15% at 50% 29%, rgba(240,204,244,.24), transparent 81%),
            radial-gradient(ellipse 64% 18% at 50% 61%, rgba(239,177,208,.17), transparent 81%),
            radial-gradient(ellipse 43% 42% at -5% 30%, rgba(228,220,255,.53), transparent 78%),
            radial-gradient(ellipse 43% 42% at 105% 30%, rgba(245,200,210,.54), transparent 78%),
            radial-gradient(ellipse 70% 48% at 70% 110%, rgba(238,204,201,.62), transparent 77%),
            radial-gradient(ellipse 70% 23% at 78% 1%, rgba(251,208,226,.56), transparent 78%),
            radial-gradient(ellipse 78% 25% at 15% 8%, rgba(218,211,255,.54), transparent 79%),
            radial-gradient(ellipse 38% 31% at 80% 90%, rgba(230,190,191,.38), transparent 74%),
            radial-gradient(ellipse 45% 26% at 47% 78%, rgba(236,184,183,.45), transparent 73%),
            linear-gradient(164deg, #c9b5e1 0%, #ad80ca 29%, #9d4f72 64%, #793246 100%);
          background-origin: border-box;
        }

        .card--context .card__title {
          font-size: calc(23 * var(--u));
          line-height: 1.48;
        }

        .card--context::before {
          mix-blend-mode: multiply;
          opacity: .54;
          background:
            radial-gradient(ellipse 18% 23% at 20% 32%, rgba(103,41,148,.24), transparent 76%),
            radial-gradient(ellipse 20% 24% at 81% 30%, rgba(121,34,113,.22), transparent 76%),
            radial-gradient(ellipse 66% 9% at 50% 30%, rgba(103,33,125,.26), transparent 82%),
            radial-gradient(ellipse 68% 8% at 50% 69%, rgba(86,27,64,.23), transparent 83%),
            linear-gradient(103deg, rgba(255,255,255,.08), transparent 31%, rgba(255,255,255,.05) 63%, transparent 88%);
        }

        .context-backdrop {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          mask: linear-gradient(180deg, #000 0%, #000 54%, rgba(0,0,0,.72) 58%, rgba(0,0,0,.18) 62%, transparent 65%);
        }

        .context-window {
          position: absolute;
          z-index: 3;
          top: 32.4%;
          left: 20.4%;
          width: 59%;
          height: 30.1%;
          overflow: hidden;
          border: none;
          border-radius: calc(10 * var(--u));
          background:
            linear-gradient(0deg, rgba(255,255,255,.30) 0%, rgba(255,255,255,.15) 45%, rgba(255,255,255,0) 80%),
            linear-gradient(270deg, rgba(213,62,152,.62) 0px, rgba(213,62,152,0) calc(5 * var(--u))),
            radial-gradient(ellipse 118% 70% at 60% 8%, rgba(255,203,252,.34), transparent 74%),
            linear-gradient(105deg, rgba(250,232,250,.72) 0%, rgba(238,120,214,.68) 51%, rgba(222,86,177,.82) 100%);
          box-shadow: 0 calc(13 * var(--u)) calc(25 * var(--u)) rgba(70,17,69,.31), inset 0 1px 0 rgba(255,255,255,.12);
          backdrop-filter: blur(calc(9 * var(--u))) saturate(1.08);
        }

        .window-lines {
          position: absolute;
          top: 9%;
          left: 6.7%;
          width: 87%;
          height: 24%;
          display: flex;
          flex-direction: column;
        }

        .window-span-1 {
          height: calc(6 * var(--u));
          border-radius: calc(2.5 * var(--u));
          background: rgba(255,255,255,.72);
          width: 29%;
          margin-bottom: calc(3 * var(--u));
        }

        .window-span-2 {
          width: 100%;
          height: calc(22 * var(--u));
          border-radius: calc(6 * var(--u));
          background: linear-gradient(90deg, rgba(255,240,253,.72), rgba(255,170,242,.75) 42%, rgba(255,108,235,.78));
        }

        .window-span-3 {
          width: 86%;
          margin-top: calc(3 * var(--u));
          opacity: .64;
          height: calc(6 * var(--u));
          border-radius: calc(2.5 * var(--u));
          background: rgba(255,255,255,.72);
        }

        .metric--context {
          top: 48.0%;
          transform: translateX(2.1cqw);
        }

        .metric--context .dot-number {
          width: 30.5%;
        }

        .metric--context .dot-svg {
          transform: translate(calc(-1 * var(--u)), calc(-.5 * var(--u))) scale(.96, 1.02);
          transform-origin: center;
        }

        .card--context .caption {
          top: 65.72%;
          color: rgba(255,255,255,.84);
          font-size: calc(19.1 * var(--u));
          letter-spacing: calc(-.28 * var(--u));
          line-height: 1.38;
        }

        .card--context .learn-more {
          top: 83.9%;
          height: calc(44 * var(--u));
        }

        /* CARD 3 - CONNECTIONS */
        .card--connections {
          background:
            radial-gradient(ellipse 54% 14% at 56% 0%, rgba(255,206,190,.16), transparent 76%),
            radial-gradient(ellipse 38% 24% at 102% 8%, rgba(255,190,164,.24), transparent 75%),
            radial-gradient(ellipse 28% 24% at -5% 66%, rgba(255,192,174,.30), transparent 74%),
            radial-gradient(ellipse 46% 30% at 104% 32%, rgba(255,146,52,.42), transparent 74%),
            radial-gradient(ellipse 80% 36% at 62% 57%, rgba(255,141,36,.62), transparent 72%),
            radial-gradient(ellipse 58% 30% at 6% 103%, rgba(199,49,45,.38), transparent 76%),
            radial-gradient(ellipse 60% 32% at 97% 101%, rgba(190,40,44,.42), transparent 76%),
            linear-gradient(177deg, #d84736 0%, #dd523c 24%, #e8703d 52%, #de5641 78%, #d34239 100%);
          background-origin: border-box;
        }

        .card--connections::before {
          background:
            linear-gradient(102deg, rgba(255,255,255,.07), transparent 30%, rgba(255,255,255,.05) 62%, transparent 88%),
            radial-gradient(ellipse 84% 26% at 54% 4%, rgba(255,255,255,.11), transparent 74%);
        }

        .connections-map {
          position: absolute;
          z-index: 2;
          top: 21.7%;
          left: 0;
          width: 100%;
          height: 43%;
          opacity: .78;
          mask: linear-gradient(180deg, #000 0%, #000 50%, rgba(0,0,0,.46) 67%, rgba(0,0,0,.15) 83%, transparent 96%);
        }

        .connections-map svg {
          width: 100%;
          height: 100%;
        }

        .metric--connections {
          top: 48.5%;
          transform: translateX(2.1cqw);
        }

        .metric--connections .dot-number {
          width: 23%;
        }
      `}</style>

      {/* SVG Filters & Noises */}
      <svg className="hidden" aria-hidden="true">
        <defs>
          <filter id="cardNoise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency=".54" numOctaves="3" seed="27" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncR type="linear" slope="1.8" intercept="-.25" />
              <feFuncG type="linear" slope="1.8" intercept="-.25" />
              <feFuncB type="linear" slope="1.8" intercept="-.25" />
              <feFuncA type="table" tableValues="0 .52" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      <div className="stage-inner">
        {/* Background Videos */}
        <video
          className="stage-motion stage-motion--wide"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
          <source src="/videos/hero-bg.webm" type="video/webm" />
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_064411_9e9d7f84-9277-41f4-ab10-59172d89e6be.mp4" type="video/mp4" />
        </video>
        <video
          className="stage-motion stage-motion--narrow"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/0f4926a4-e660-4df2-9195-2bfb3e341bdd.webp"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_125242_daae1570-386d-4bd5-8896-80499e2371e0.mp4"
        />

        {/* MASTHEAD */}
        <header className="masthead">
          <h1 className="headline">
            <span className="headline__line">
              Built for{" "}
              <span className="dot-word" aria-label="Intelligent">
                {renderDotSVG("Intelligent", true, false)}
              </span>
            </span>
            <span className="headline__line">Performance</span>
          </h1>

          <p className="intro">
            Every capability is engineered for speed, scale and
            <br className="desktop-break" /> contextual understanding, giving your AI the foundation
            <br className="desktop-break" /> to reason, adapt and perform in production.
          </p>
        </header>

        {/* THREE GLASS METRIC CARDS */}
        <section className="cards-row" aria-label="Performance capabilities">
          {/* CARD 1 - SPEED */}
          <article className="card card--speed">
            <video
              className="card__media"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
              poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/167977c6-8539-46b1-9a15-8dba566f50b8.png"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_130045_1a612b69-4854-4b34-8043-ccb91f2c60af.mp4"
            />
            <svg className="card__grain" viewBox="0 0 429 554">
              <rect width="429" height="554" filter="url(#cardNoise)" />
            </svg>

            <h2 className="card__title">
              Inference Speed
              <br />
              AI Response Latency
            </h2>

            {/* Gauge SVG */}
            <svg className="gauge" viewBox="0 0 326 326">
              <defs>
                <linearGradient id="gaugeArc" x1="7" y1="136" x2="312" y2="109" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#ff9ab7" stopOpacity=".06" />
                  <stop offset=".08" stopColor="#ff8caf" stopOpacity=".44" />
                  <stop offset=".34" stopColor="#ff6796" stopOpacity=".94" />
                  <stop offset=".58" stopColor="#ff6796" stopOpacity="1" />
                  <stop offset=".82" stopColor="#ffe7ed" stopOpacity=".74" />
                  <stop offset=".94" stopColor="#fff8fa" stopOpacity=".28" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="gaugeShadow" x1="11" y1="136" x2="308" y2="110" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#6e1639" stopOpacity=".04" />
                  <stop offset=".09" stopColor="#6e1639" stopOpacity=".17" />
                  <stop offset=".52" stopColor="#72163d" stopOpacity=".18" />
                  <stop offset=".78" stopColor="#7b1a43" stopOpacity=".1" />
                  <stop offset="1" stopColor="#7b1a43" stopOpacity="0" />
                </linearGradient>
              </defs>

              <path
                d="M11.34 136.26A154 154 0 0 1 307.71 110.33"
                fill="none"
                strokeWidth="3.2"
                strokeLinecap="round"
                stroke="url(#gaugeShadow)"
              />
              <path
                d="M6.91 135.48A158.5 158.5 0 0 1 311.94 108.79"
                fill="none"
                strokeWidth="2.2"
                strokeLinecap="round"
                stroke="url(#gaugeArc)"
              />
              <path
                d="M19.22 137.65A146 146 0 0 1 236 36.56"
                fill="none"
                strokeWidth="1.15"
                stroke="rgba(255,166,194,.31)"
              />
            </svg>

            <div className="metric metric--speed">
              <span className="dot-number">{renderDotSVG("118", false, false)}</span>
              <span className="metric__unit">ms</span>
            </div>

            <p className="caption">
              Average global
              <br />
              response
            </p>

            <button type="button" className="learn-more">
              Learn More
            </button>
          </article>

          {/* CARD 2 - CONTEXT */}
          <article className="card card--context">
            <video
              className="card__media"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
              poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/0446d1d5-e65e-4db5-8090-3e30d09afc43.png"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_130054_dd005674-d693-4d81-80a5-357f7f10b3a3.mp4"
            />
            <svg className="card__grain" viewBox="0 0 429 554">
              <rect width="429" height="554" filter="url(#cardNoise)" />
            </svg>

            <h2 className="card__title">
              Context Window
              <br />
              Long-form Understanding
            </h2>

            <div className="context-window">
              <div className="window-lines">
                <span className="window-span-1" />
                <span className="window-span-2" />
                <span className="window-span-3" />
              </div>
            </div>

            <div className="metric metric--context">
              <span className="dot-number">{renderDotSVG("2.4", false, true)}</span>
              <span className="metric__unit">M</span>
            </div>

            <p className="caption">
              Tokens processed
              <br />
              simultaneously
            </p>

            <button type="button" className="learn-more">
              Learn More
            </button>
          </article>

          {/* CARD 3 - CONNECTIONS */}
          <article className="card card--connections">
            <video
              className="card__media"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
              poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/da8d0242-4dee-4f6d-813f-a5887e86ad77.png"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_130103_7550f407-f14b-40a6-9616-7a26d7a8bd9f.mp4"
            />
            <svg className="card__grain" viewBox="0 0 429 554">
              <rect width="429" height="554" filter="url(#cardNoise)" />
            </svg>

            <h2 className="card__title">
              Intelligent Connections
              <br />
              Cross-Source Context
            </h2>

            <div className="connections-map">
              <svg viewBox="0 0 429 238" preserveAspectRatio="none">
                <path
                  opacity=".20"
                  d="M0 5H128c27 0 36 7 39 26 2 16 9 22 24 22h106c16 0 23-8 25-25 2-16 10-23 31-23h76"
                  stroke="#fff"
                  strokeWidth="1"
                  fill="none"
                />
                <path
                  opacity=".30"
                  d="M0 117h46c15 0 22 8 26 25 5 23 12 31 31 31h174c18 0 25-8 30-31 4-17 11-25 26-25h96"
                  stroke="#fff"
                  strokeWidth="1"
                  fill="none"
                />
                <path
                  opacity=".34"
                  d="M0 173h87c15 0 22 7 27 25 4 15 11 22 28 22h140c17 0 25-7 29-22 5-18 12-25 28-25h90"
                  stroke="#fff"
                  strokeWidth="1"
                  fill="none"
                />
                <path
                  opacity=".52"
                  d="M0 61h95c14 0 22-6 27-20 4-13 12-20 27-20h115c15 0 23 6 27 20 5 14 13 20 28 20h110"
                  stroke="#fff8dd"
                  strokeWidth="1.15"
                  fill="none"
                />
                <circle cx="45" cy="117" r="6.5" fill="#fff" />
                <circle cx="133" cy="61" r="6.5" fill="#fff4a7" />
                <circle cx="189" cy="61" r="6.5" fill="#fff1a4" />
                <circle cx="319" cy="61" r="6.5" fill="#fff4a6" />
                <circle cx="319" cy="117" r="6.5" fill="#fff2a0" />
              </svg>
            </div>

            <div className="metric metric--connections">
              <span className="dot-number">{renderDotSVG("16", false, false)}</span>
              <span className="metric__unit">K</span>
            </div>

            <p className="caption">
              Connected data
              <br />
              sources
            </p>

            <button type="button" className="learn-more">
              Learn More
            </button>
          </article>
        </section>
      </div>
    </div>
  );
}
