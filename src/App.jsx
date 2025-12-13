import "./App.css";
import { useEffect, useState } from "react";

export default function App() {
  const [nom, setNom] = useState("");
  const [expediteur, setExpediteur] = useState("");
  const [typeMessage, setTypeMessage] = useState("noel");
  const [resultat, setResultat] = useState(null);
  const [webviewMessage, setWebviewMessage] = useState("");

  // 🟢 Fonction autoplay garantie
  function forceAutoplay(audio) {
    if (!audio) return;
    audio.muted = false;
    audio.volume = 1;
    audio.play().catch(() => {
      setTimeout(() => audio.play().catch(() => {}), 200);
    });
  }

  // 🟢 Autoplay à l'ouverture du lien
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    const msgType = params.get("msg");

    if (from) {
      setExpediteur(from);
      setTypeMessage(msgType || "noel");

      setResultat(
        msgType === "annee" ? (
          <>
            🎉 Bonne Année de la part de{" "}
            <span className="nom-dore">{renderNomAnime(from)}</span> !
          </>
        ) : (
          <>
            🎄 Joyeux Noël de la part de{" "}
            <span className="nom-dore">{renderNomAnime(from)}</span> !
          </>
        )
      );

      setTimeout(() => {
        forceAutoplay(
          msgType === "annee"
            ? document.getElementById("musiqueAnnee")
            : document.getElementById("musiqueNoel")
        );
      }, 400);
    }
  }, []);

  // ❄️ Neige
  useEffect(() => {
    const interval = setInterval(createSnow, 200);
    return () => clearInterval(interval);
  }, []);

  function createSnow() {
    const snow = document.createElement("div");
    snow.className = "snowflake";
    snow.innerHTML = "❄";
    snow.style.left = Math.random() * window.innerWidth + "px";
    snow.style.fontSize = 12 + Math.random() * 40 + "px";
    snow.style.animationDuration = 3 + Math.random() * 5 + "s";
    document.body.appendChild(snow);
    setTimeout(() => snow.remove(), 4000);
  }

  // ✨ Animation lettres dorées
  function renderNomAnime(nomTexte) {
    const positions = [
      { x: "-120vw", y: "-120vh" },
      { x: "120vw", y: "-120vh" },
      { x: "-120vw", y: "120vh" },
      { x: "120vw", y: "120vh" },
    ];

    return nomTexte.split("").map((lettre, index) => {
      const pos = positions[index % 4];
      return (
        <span
          key={index}
          className="lettre-doree"
          style={{
            "--from-x": pos.x,
            "--from-y": pos.y,
            animationDelay: `${index * 0.12}s`,
          }}
        >
          {lettre === " " ? "\u00A0" : lettre}
        </span>
      );
    });
  }

  // 🎁 Générer message
  function genererMessage() {
    const audioNoel = document.getElementById("musiqueNoel");
    const audioAnnee = document.getElementById("musiqueAnnee");
    audioNoel.pause();
    audioAnnee.pause();

    const nomAffiche = nom || expediteur;
    if (!nomAffiche) return;

    setResultat(
      typeMessage === "annee" ? (
        <>
          🎉 Bonne Année de la part de{" "}
          <span className="nom-dore">{renderNomAnime(nomAffiche)}</span> !
        </>
      ) : (
        <>
          🎄 Joyeux Noël de la part de{" "}
          <span className="nom-dore">{renderNomAnime(nomAffiche)}</span> !
        </>
      )
    );

    forceAutoplay(typeMessage === "annee" ? audioAnnee : audioNoel);

    window.history.pushState(
      {},
      "",
      `${window.location.origin}?from=${encodeURIComponent(
        nomAffiche
      )}&msg=${typeMessage}`
    );
  }

  // 📱 Partage
  async function partagerMessage() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: "Carte de fête 🎁",
        text: "Carte personnalisée 🎄🎉",
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Lien copié !");
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white p-4 text-center bg-cover bg-center bg-no-repeat bg-fixed relative"
      style={{
        backgroundImage: `
          linear-gradient(to bottom, rgba(13,27,42,0.9), rgba(27,38,59,0.9)),
          url('/bg1.jpg'),
          url('/bg2.jpg'),
          url('/bg3.jpg'),
          url('/bg4.jpg')
        `,
      }}
    >
      {/* Icônes flottantes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
            }}
            dangerouslySetInnerHTML={{
              __html: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="gold" strokeWidth="2">
                <polygon points="12 2 15 8 22 9 17 14 18 21 12 18 6 21 7 14 2 9 9 8 12 2"/>
              </svg>`,
            }}
          />
        ))}
      </div>

      {/* Carte */}
      <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl max-w-md shadow-xl relative border-4 border-transparent animate-glow">
        <h2 className="text-2xl font-bold text-pink-200">
          🎄 Joyeux Noël & 🎉 Bonne Année
        </h2>

        <select
          className="champ"
          value={typeMessage}
          onChange={(e) => setTypeMessage(e.target.value)}
        >
          <option value="noel">Joyeux Noël</option>
          <option value="annee">Bonne Année</option>
        </select>

        <input
          className="champ"
          placeholder="Votre nom (expéditeur)"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />

        <button
          onClick={genererMessage}
          className="w-32 p-3 mt-4 bg-red-600 hover:bg-red-500 rounded-lg"
        >
          Écouter ici
        </button>

        <div className="mt-5 text-lg font-bold min-h-[40px]">{resultat}</div>

        {resultat && (
          <button
            onClick={partagerMessage}
            className="p-3 mt-2 bg-blue-900 hover:bg-blue-700 rounded-lg"
          >
            Partager 🎁
          </button>
        )}

        <audio id="musiqueNoel" src="/noel.mp3"></audio>
        <audio id="musiqueAnnee" src="/bonne_annee.mp3"></audio>
      </div>

      {/* 🔒 CSS ORIGINAL + AJOUT DORÉ */}
      <style>{`
        .snowflake {
          position: fixed;
          top: -10px;
          color: white;
          animation: fall linear infinite;
          z-index: 9999;
        }
        @keyframes fall {
          0% { transform: translateY(0); }
          100% { transform: translateY(110vh); }
        }
        .champ {
          width: 100%;
          margin-top: 10px;
          padding: 12px;
          border-radius: 10px;
          color: black;
        }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }
        @keyframes glow {
          0%,100% { box-shadow: 0 0 20px 5px rgba(255,200,0,.6); }
          50% { box-shadow: 0 0 30px 15px rgba(255,255,255,.9); }
        }
        .animate-glow {
          animation: glow 2s infinite alternate;
        }

        /* ✨ NOUVEAU : NOM DORÉ */
        .nom-dore {
          background: linear-gradient(90deg,#ffd700,#fff4b0,#ffcc00,#ffd700);
          background-size: 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 3s linear infinite;
        }
        .lettre-doree {
          display: inline-block;
          font-size: 1.4em;
          transform: translate(var(--from-x), var(--from-y)) scale(0);
          animation: flyIn .9s ease-out forwards;
        }
        @keyframes flyIn {
          to { transform: translate(0,0) scale(1); }
        }
        @keyframes shine {
          from { background-position: 0%; }
          to { background-position: 300%; }
        }
      `}</style>
    </div>
  );
}


// import "./App.css";
// import { useEffect, useState } from "react";

// export default function App() {
//   const [nom, setNom] = useState("");
//   const [expediteur, setExpediteur] = useState("");
//   const [typeMessage, setTypeMessage] = useState("noel");
//   const [resultat, setResultat] = useState("");
//   const [webviewMessage, setWebviewMessage] = useState("");

//   // 🟢 Fonction autoplay garantie
//   function forceAutoplay(audio) {
//     audio.muted = false;
//     audio.volume = 1;
//     audio.play().catch(() => {
//       setTimeout(() => {
//         audio.play().catch(() => {});
//       }, 200);
//     });
//   }

//   // 🟢 Autoplay lorsque quelqu’un ouvre le lien
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     if (params.get("from")) {
//       const exp = params.get("from");
//       const msgType = params.get("msg");

//       setExpediteur(exp);
//       setTypeMessage(msgType || "noel");

//       setResultat(
//         msgType === "annee"
//           ? `🎉 Bonne Année de la part de ${exp} !`
//           : `🎄 Joyeux Noël de la part de ${exp} !`
//       );

//       setTimeout(() => {
//         const audioNoel = document.getElementById("musiqueNoel");
//         const audioAnnee = document.getElementById("musiqueAnnee");
//         if (msgType === "annee") forceAutoplay(audioAnnee);
//         else forceAutoplay(audioNoel);
//       }, 400);
//     }
//   }, []);

//   // ❄️ Neige
//   useEffect(() => {
//     const interval = setInterval(createSnow, 200);
//     return () => clearInterval(interval);
//   }, []);

//   function createSnow() {
//     const snow = document.createElement("div");
//     snow.className = "snowflake";
//     snow.innerHTML = "❄";
//     snow.style.left = Math.random() * window.innerWidth + "px";
//     snow.style.fontSize = 12 + Math.random() * 40 + "px";
//     snow.style.animationDuration = 3 + Math.random() * 5 + "s";
//     document.body.appendChild(snow);
//     setTimeout(() => snow.remove(), 4000);
//   }

//   // 🎁 Générer message
//   function genererMessage() {
//     const audioNoel = document.getElementById("musiqueNoel");
//     const audioAnnee = document.getElementById("musiqueAnnee");
//     audioNoel.pause();
//     audioAnnee.pause();

//     const nomAffiche = nom || expediteur;

//     if (typeMessage === "noel") {
//       setResultat(`🎄 Joyeux Noël de la part de ${nomAffiche} !`);
//       forceAutoplay(audioNoel);
//     } else {
//       setResultat(`🎉 Bonne Année de la part de ${nomAffiche} !`);
//       forceAutoplay(audioAnnee);
//     }

//     const newURL = `${window.location.origin}?from=${encodeURIComponent(
//       nomAffiche
//     )}&msg=${typeMessage}`;
//     window.history.pushState({}, "", newURL);
//   }

//   // 📱 Partager
//   async function partagerMessage() {
//     const url = window.location.href;
//     await fetch("/api/share", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         from: nom || expediteur,
//         typeMessage,
//         app: "native_share",
//       }),
//     });
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: "Carte de fête 🎁",
//           text: "Voici une carte personnalisée 🎄🎉",
//           url,
//         });
//       } catch (err) {}
//     } else {
//       navigator.clipboard.writeText(url);
//       alert("Lien copié !");
//     }
//   }

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center text-white p-4 text-center bg-cover bg-center bg-no-repeat bg-fixed relative"
//       style={{
//         backgroundImage: `
//           linear-gradient(to bottom, rgba(13,27,42,0.9), rgba(27,38,59,0.9)),
//           url('/bg1.jpg'),
//           url('/bg2.jpg'),
//           url('/bg3.jpg'),
//           url('/bg4.jpg')
//         `,
//       }}
//     >
//       {/* Icônes SVG flottantes */}
//       <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
//         {[...Array(10)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
//               transform: `rotate(${Math.random() * 360}deg)`,
//             }}
//             dangerouslySetInnerHTML={{
//               __html: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="gold" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <polygon points="12 2 15 8 22 9 17 14 18 21 12 18 6 21 7 14 2 9 9 8 12 2"></polygon>
//               </svg>`,
//             }}
//           />
//         ))}
//       </div>

//       {/* Carte principale */}
//       <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl max-w-md shadow-xl relative border-4 border-transparent animate-glow">
//         <h2 className="text-2xl font-bold text-pink-200">
//           🎄 Joyeux Noël & 🎉 Bonne Année
//         </h2>
//         <p className="mt-2">Partagez votre carte personnalisée :</p>

//         <select
//           className="champ"
//           value={typeMessage}
//           onChange={(e) => setTypeMessage(e.target.value)}
//         >
//           <option value="noel">Joyeux Noël</option>
//           <option value="annee">Bonne Année</option>
//         </select>

//         <input
//           type="text"
//           className="champ"
//           placeholder="Votre nom (expéditeur)"
//           value={nom}
//           onChange={(e) => setNom(e.target.value)}
//         />

//         <button
//           onClick={genererMessage}
//           className="w-32 p-3 mt-4 bg-red-600 hover:bg-red-500 rounded-lg"
//         >
//           Ecouter ici
//         </button>

//         <div className="mt-5 text-lg font-bold min-h-[40px]">{resultat}</div>

//         {resultat && (
//           <button
//             onClick={partagerMessage}
//             className="p-3 mt-2 bg-blue-900 hover:bg-blue-700 rounded-lg"
//           >
//             Partager 🎁
//           </button>
//         )}

//         {/* Bloc don sécurisé */}
//         <div className="mt-4 p-3 bg-green-700 text-white rounded-lg text-sm text-center">
//           ❤️ Don ❤️ les familles vulnérables :
//           <a
//             href="tel:+243898688469"
//             className="underline font-bold hover:text-yellow-300"
//           >
//             ❤️+243 898688469
//           </a>
//         </div>

//         {webviewMessage && (
//           <div className="mt-3 p-3 bg-yellow-600 text-black rounded-lg text-sm">
//             {webviewMessage}
//           </div>
//         )}

//         <audio id="musiqueNoel" src="/noel.mp3"></audio>
//         <audio id="musiqueAnnee" src="/bonne_annee.mp3"></audio>
//       </div>

//       {/* Styles supplémentaires — IDENTIQUES */}
//       <style>{`
//         .snowflake {
//           position: fixed;
//           top: -10px;
//           color: white;
//           animation: fall linear infinite;
//           z-index: 9999;
//         }
//         @keyframes fall {
//           0% { transform: translateY(0); }
//           100% { transform: translateY(110vh); }
//         }
//         .champ {
//           width: 100%;
//           margin-top: 10px;
//           padding: 12px;
//           border-radius: 10px;
//           color: black;
//         }
//         @keyframes float {
//           0%, 100% { transform: translateY(0px) rotate(0deg); }
//           50% { transform: translateY(-30px) rotate(180deg); }
//         }
//         @keyframes glow {
//           0%, 100% { box-shadow: 0 0 20px 5px rgba(255, 200, 0, 0.6); }
//           50% { box-shadow: 0 0 30px 15px rgba(255, 255, 255, 0.9); }
//         }
//         .animate-glow {
//           animation: glow 2s infinite alternate;
//         }
//       `}</style>
//     </div>
//   );
// }


// import "./App.css";
// import { useEffect, useState } from "react";

// export default function App() {
//   const [nom, setNom] = useState("");
//   const [typeMessage, setTypeMessage] = useState("noel");
//   const [resultat, setResultat] = useState("");
//   const [webviewMessage, setWebviewMessage] = useState("");

//   // 🟢 Fonction autoplay garantie
//   function forceAutoplay(audio) {
//     audio.muted = false;
//     audio.volume = 1;
//     audio.play().catch(() => {
//       setTimeout(() => {
//         audio.play().catch(() => {});
//       }, 200);
//     });
//   }

//   // 🟢 Autoplay lorsque quelqu’un ouvre le lien
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     if (params.get("from")) {
//       const exp = params.get("from");
//       const msgType = params.get("msg");
//       setTypeMessage(msgType || "noel");
//       setResultat(`Message reçu de ${exp}. Entrez votre nom et renvoyez 🎁`);
//       setTimeout(() => {
//         const audioNoel = document.getElementById("musiqueNoel");
//         const audioAnnee = document.getElementById("musiqueAnnee");
//         if (msgType === "annee") forceAutoplay(audioAnnee);
//         else forceAutoplay(audioNoel);
//       }, 400);
//     }
//   }, []);

//   // ❄️ Neige
//   useEffect(() => {
//     const interval = setInterval(createSnow, 200);
//     return () => clearInterval(interval);
//   }, []);

//   function createSnow() {
//     const snow = document.createElement("div");
//     snow.className = "snowflake";
//     snow.innerHTML = "❄";
//     snow.style.left = Math.random() * window.innerWidth + "px";
//     snow.style.fontSize = 12 + Math.random() * 40 + "px";
//     snow.style.animationDuration = 3 + Math.random() * 5 + "s";
//     document.body.appendChild(snow);
//     setTimeout(() => snow.remove(), 4000);
//   }

//   // 🎁 Générer message
//   function genererMessage() {
//     const audioNoel = document.getElementById("musiqueNoel");
//     const audioAnnee = document.getElementById("musiqueAnnee");
//     audioNoel.pause();
//     audioAnnee.pause();
//     if (typeMessage === "noel") {
//       setResultat(`🎄 Joyeux Noël de la part de ${nom} !`);
//       forceAutoplay(audioNoel);
//     } else {
//       setResultat(`🎉 Bonne Année de la part de ${nom} !`);
//       forceAutoplay(audioAnnee);
//     }
//     const newURL = `${window.location.origin}?from=${encodeURIComponent(
//       nom
//     )}&msg=${typeMessage}`;
//     window.history.pushState({}, "", newURL);
//   }

//   // 📱 Partager
//   async function partagerMessage() {
//     const url = window.location.href;
//     await fetch("/api/share", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         from: nom,
//         typeMessage,
//         app: "native_share",
//       }),
//     });
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: "Carte de fête 🎁",
//           text: "Voici une carte personnalisée 🎄🎉",
//           url,
//         });
//       } catch (err) {}
//     } else {
//       navigator.clipboard.writeText(url);
//       alert("Lien copié !");
//     }
//   }

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center text-white p-4 text-center bg-cover bg-center bg-no-repeat bg-fixed relative"
//       style={{
//         backgroundImage: `
//           linear-gradient(to bottom, rgba(13,27,42,0.9), rgba(27,38,59,0.9)),
//           url('/bg1.jpg'),
//           url('/bg2.jpg'),
//           url('/bg3.jpg'),
//           url('/bg4.jpg')
//         `
//       }}
//     >
//       {/* Icônes SVG flottantes */}
//       <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
//         {[...Array(10)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
//               transform: `rotate(${Math.random() * 360}deg)`,
//             }}
//             dangerouslySetInnerHTML={{
//               __html: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="gold" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <polygon points="12 2 15 8 22 9 17 14 18 21 12 18 6 21 7 14 2 9 9 8 12 2"></polygon>
//               </svg>`,
//             }}
//           />
//         ))}
//       </div>

//       {/* Carte principale */}
//       <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl max-w-md shadow-xl relative border-4 border-transparent animate-glow">
//         <h2 className="text-2xl font-bold text-pink-200">
//           🎄 Joyeux Noël & 🎉 Bonne Année
//         </h2>
//         <p className="mt-2">Partagez votre carte personnalisée :</p>

//         <select
//           className="champ"
//           value={typeMessage}
//           onChange={(e) => setTypeMessage(e.target.value)}
//         >
//           <option value="noel">Joyeux Noël</option>
//           <option value="annee">Bonne Année</option>
//         </select>

//         <input
//           type="text"
//           className="champ"
//           placeholder="Votre nom (expéditeur)"
//           value={nom}
//           onChange={(e) => setNom(e.target.value)}
//         />

//         <button
//           onClick={genererMessage}
//           className="w-32 p-3 mt-4 bg-red-600 hover:bg-red-500 rounded-lg"
//         >
//           Ecouter ici
//         </button>

//         <div className="mt-5 text-lg font-bold min-h-[40px]">{resultat}</div>

//         {resultat && (
//           <button
//             onClick={partagerMessage}
//             className="p-3 mt-2 bg-blue-900 hover:bg-blue-700 rounded-lg"
//           >
//             Partager 🎁
//           </button>
//         )}

//         {/* Bloc don sécurisé, court et visible */}
//         <div className="mt-4 p-3 bg-green-700 text-white rounded-lg text-sm text-center">
//           ❤️ Don ❤️ les familles vulnérables : 
//           <a href="tel:+243898688469" className="underline font-bold hover:text-yellow-300">
//             ❤️+243 898688469
//           </a>
//         </div>

//         {webviewMessage && (
//           <div className="mt-3 p-3 bg-yellow-600 text-black rounded-lg text-sm">
//             {webviewMessage}
//           </div>
//         )}

//         {/* Musiques */}
//         <audio id="musiqueNoel" src="/noel.mp3"></audio>
//         <audio id="musiqueAnnee" src="/bonne_annee.mp3"></audio>
//       </div>

//       {/* Styles supplémentaires */}
//       <style>{`
//         .snowflake {
//           position: fixed;
//           top: -10px;
//           color: white;
//           animation: fall linear infinite;
//           z-index: 9999;
//         }
//         @keyframes fall {
//           0% { transform: translateY(0); }
//           100% { transform: translateY(110vh); }
//         }
//         .champ {
//           width: 100%;
//           margin-top: 10px;
//           padding: 12px;
//           border-radius: 10px;
//           color: black;
//         }
//         @keyframes float {
//           0%, 100% { transform: translateY(0px) rotate(0deg); }
//           50% { transform: translateY(-30px) rotate(180deg); }
//         }
//         @keyframes glow {
//           0%, 100% { box-shadow: 0 0 20px 5px rgba(255, 200, 0, 0.6); }
//           50% { box-shadow: 0 0 30px 15px rgba(255, 255, 255, 0.9); }
//         }
//         .animate-glow {
//           animation: glow 2s infinite alternate;
//         }
//       `}</style>
//     </div>
//   );
// }
