import "./App.css";
import { useEffect, useState } from "react";

export default function App() {
  const [nom, setNom] = useState("");
  const [typeMessage, setTypeMessage] = useState("noel");
  const [resultat, setResultat] = useState("");
  const [webviewMessage, setWebviewMessage] = useState("");

  // 🟢 Fonction autoplay garantie
  function forceAutoplay(audio) {
    audio.muted = false;
    audio.volume = 1;

    audio.play().catch(() => {
      setTimeout(() => {
        audio.play().catch(() => {});
      }, 200);
    });
  }

  // 🟢 Autoplay lorsque quelqu’un ouvre le lien
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("from")) {
      const exp = params.get("from");
      const msgType = params.get("msg");

      setTypeMessage(msgType || "noel");
      setResultat(`Message reçu de ${exp}. Entrez votre nom et renvoyez 🎁`);

      setTimeout(() => {
        const audioNoel = document.getElementById("musiqueNoel");
        const audioAnnee = document.getElementById("musiqueAnnee");

        if (msgType === "annee") {
          forceAutoplay(audioAnnee);
        } else {
          forceAutoplay(audioNoel);
        }
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

  // 🎁 Générer message
  function genererMessage() {
    const audioNoel = document.getElementById("musiqueNoel");
    const audioAnnee = document.getElementById("musiqueAnnee");

    audioNoel.pause();
    audioAnnee.pause();

    if (typeMessage === "noel") {
      setResultat(`🎄 Joyeux Noël de la part de ${nom} !`);
      forceAutoplay(audioNoel);
    } else {
      setResultat(`🎉 Bonne Année de la part de ${nom} !`);
      forceAutoplay(audioAnnee);
    }

    const newURL = `${window.location.origin}?from=${encodeURIComponent(
      nom
    )}&msg=${typeMessage}`;

    window.history.pushState({}, "", newURL);
  }

  // 📱 Partager
  async function partagerMessage() {
    const url = window.location.href;

    await fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from: nom,
        typeMessage,
        app: "native_share",
      }),
    });

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Carte de fête 🎁",
          text: "Voici une carte personnalisée 🎄🎉",
          url,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(url);
      alert("Lien copié !");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0d1b2a] to-[#1b263b] text-white p-4 text-center">
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
      `}</style>

      <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl max-w-md shadow-xl">

        <h2 className="text-2xl font-bold text-pink-200">
          🎄 Joyeux Noël & 🎉 Bonne Année
        </h2>

        <p className="mt-2">Partagez votre carte personnalisée :</p>

        <select
          className="champ"
          value={typeMessage}
          onChange={(e) => setTypeMessage(e.target.value)}
        >
          <option value="noel">Joyeux Noël</option>
          <option value="annee">Bonne Année</option>
        </select>

        <input
          type="text"
          className="champ"
          placeholder="Votre nom (expéditeur)"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />

        <button
          onClick={genererMessage}
          className="w-32 p-3 mt-4 bg-red-600 hover:bg-red-500 rounded-lg"
        >
          Générer
        </button>

        <div className="mt-5 text-lg font-bold min-h-[40px]">
          {resultat}
        </div>

        {resultat && (
          <button
            onClick={partagerMessage}
            className="p-3 mt-2 bg-blue-900 hover:bg-blue-700 rounded-lg"
          >
            Partager 🎁
          </button>
        )}

        {webviewMessage && (
          <div className="mt-3 p-3 bg-yellow-600 text-black rounded-lg text-sm">
            {webviewMessage}
          </div>
        )}

        {/* Musiques */}
        <audio id="musiqueNoel" src="/noel.mp3"></audio>
        <audio id="musiqueAnnee" src="/bonne_annee.mp3"></audio>
      </div>
    </div>
  );
}



// import "./App.css";
// import { useEffect, useState } from "react";

// export default function App() {
//   const [nom, setNom] = useState("");
//   const [typeMessage, setTypeMessage] = useState("noel");
//   const [resultat, setResultat] = useState("");
//   const [webviewMessage, setWebviewMessage] = useState("");

//   // 👉 Fonction pour forcer l’autoplay sur iPhone / Android / Chrome
//   function forceAutoplay(audio) {
//     audio.volume = 0;
//     audio.muted = true;

//     audio.play().then(() => {
//       setTimeout(() => {
//         audio.muted = false;
//         audio.volume = 1;
//         audio.play().catch(() => {});
//       }, 300);
//     }).catch(() => {});
//   }

//   // 👉 Lien partagé + autoplay
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

//         if (msgType === "annee") {
//           forceAutoplay(audioAnnee);
//         } else {
//           forceAutoplay(audioNoel);
//         }
//       }, 300);
//     }
//   }, []);

//   // ❄️ Effet neige
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

//   // 🎁 Générer message + musique
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

//   // 📱 Partage natif + backend
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
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0d1b2a] to-[#1b263b] text-white p-4 text-center">
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
//       `}</style>

//       <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl max-w-md shadow-xl">
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
//           Générer
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

//         {webviewMessage && (
//           <div className="mt-3 p-3 bg-yellow-600 text-black rounded-lg text-sm">
//             {webviewMessage}
//           </div>
//         )}

//         {/* Musiques */}
//         <audio id="musiqueNoel" src="/noel.mp3"></audio>
//         <audio id="musiqueAnnee" src="/bonne_annee.mp3"></audio>
//       </div>
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

//   // 👉 Lien partagé + autoplay
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

//         if (msgType === "annee") {
//           audioAnnee.muted = false;
//           audioAnnee.play().catch(() => {});
//         } else {
//           audioNoel.muted = false;
//           audioNoel.play().catch(() => {});
//         }
//       }, 500);
//     }
//   }, []);

//   // ❄️ Effet neige
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

//   // 🎁 Message + musique
//   function genererMessage() {
//     const audioNoel = document.getElementById("musiqueNoel");
//     const audioAnnee = document.getElementById("musiqueAnnee");

//     audioNoel.pause();
//     audioAnnee.pause();

//     if (typeMessage === "noel") {
//       setResultat(`🎄 Joyeux Noël de la part de ${nom} !`);
//       audioNoel.muted = false;
//       audioNoel.play();
//     } else {
//       setResultat(`🎉 Bonne Année de la part de ${nom} !`);
//       audioAnnee.muted = false;
//       audioAnnee.play();
//     }

//     const newURL = `${window.location.origin}?from=${encodeURIComponent(
//       nom
//     )}&msg=${typeMessage}`;

//     window.history.pushState({}, "", newURL);
//   }

//   // 📱 Partage natif + enregistrement backend
//   async function partagerMessage() {
//     const url = window.location.href;

//     await fetch("/api/share", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         from: nom,
//         typeMessage: typeMessage,
//         app: "native_share",
//       }),
//     });

//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: "Carte de fête 🎁",
//           text: "Voici une carte personnalisée 🎄🎉",
//           url: url,
//         });
//       } catch (err) {
//         console.log("Partage annulé.");
//       }
//     } else {
//       navigator.clipboard.writeText(url);
//       alert("Lien copié !");
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0d1b2a] to-[#1b263b] text-white p-4 text-center">
//       <style>{`
//         .snowflake {
//           position: fixed;
//           top: -10px;
//           color: white;
//           animation: fall linear infinite;
//         }
//         @keyframes fall {
//           0% { transform: translateY(0); }
//           100% { transform: translateY(110vh); }
//         }
//       `}</style>

//       <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl max-w-md shadow-xl">

//         <h2 className="text-2xl font-bold text-pink-200">
//           🎄 Joyeux Noël & 🎉 Bonne Année
//         </h2>

//         <p className="mt-2">partager votre carte personnalisée :</p>

//         {/* Select corrigé */}
//         <select
//           className="champ"
//           value={typeMessage}
//           onChange={(e) => setTypeMessage(e.target.value)}
//         >
//           <option value="noel">Joyeux Noël</option>
//           <option value="annee">Bonne Année</option>
//         </select>

//         {/* Input corrigé */}
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
//           Générer
//         </button>

//         <div className="mt-5 text-lg font-bold min-h-[40px]">
//           {resultat}
//         </div>

//         {resultat && (
//           <button
//             onClick={partagerMessage}
//             className="rounded-full  p-3 mt-2 bg-blue-900 hover:bg-blue-700 rounded-lg"
//           >
//             Partager 🎁
//           </button>
//         )}

//         {webviewMessage && (
//           <div className="mt-3 p-3 bg-yellow-600 text-black rounded-lg text-sm">
//             {webviewMessage}
//           </div>
//         )}

//         <audio id="musiqueNoel" src="/noel.mp3" muted></audio>
//         <audio id="musiqueAnnee" src="/bonne_annee.mp3" muted></audio>
//       </div>
//     </div>
//   );
// }
