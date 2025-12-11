import "./App.css";
import { useEffect, useState } from "react";

export default function App() {
  const [nom, setNom] = useState("");
  const [typeMessage, setTypeMessage] = useState("noel");
  const [resultat, setResultat] = useState("");
  const [webviewMessage, setWebviewMessage] = useState("");

  // 👉 Lien partagé + autoplay
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
          audioAnnee.muted = false;
          audioAnnee.play().catch(() => {});
        } else {
          audioNoel.muted = false;
          audioNoel.play().catch(() => {});
        }
      }, 500);
    }
  }, []);

  // ❄️ Effet neige
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

  // 🎁 Message + musique
  function genererMessage() {
    const audioNoel = document.getElementById("musiqueNoel");
    const audioAnnee = document.getElementById("musiqueAnnee");

    audioNoel.pause();
    audioAnnee.pause();

    if (typeMessage === "noel") {
      setResultat(`🎄 Joyeux Noël de la part de ${nom} !`);
      audioNoel.muted = false;
      audioNoel.play();
    } else {
      setResultat(`🎉 Bonne Année de la part de ${nom} !`);
      audioAnnee.muted = false;
      audioAnnee.play();
    }

    const newURL = `${window.location.origin}?from=${encodeURIComponent(
      nom
    )}&msg=${typeMessage}`;

    window.history.pushState({}, "", newURL);
  }

  // 📱 Partage natif + enregistrement backend
  async function partagerMessage() {
    const url = window.location.href;

    await fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from: nom,
        typeMessage: typeMessage,
        app: "native_share",
      }),
    });

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Carte de fête 🎁",
          text: "Voici une carte personnalisée 🎄🎉",
          url: url,
        });
      } catch (err) {
        console.log("Partage annulé.");
      }
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
        }
        @keyframes fall {
          0% { transform: translateY(0); }
          100% { transform: translateY(110vh); }
        }
      `}</style>

      <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl max-w-md shadow-xl">

        <h2 className="text-2xl font-bold text-pink-200">
          🎄 Joyeux Noël & 🎉 Bonne Année
        </h2>

        <p className="mt-2">Créer et partager votre carte personnalisée :</p>

        {/* Select corrigé */}
        <select
          className="champ"
          value={typeMessage}
          onChange={(e) => setTypeMessage(e.target.value)}
        >
          <option value="noel">Joyeux Noël</option>
          <option value="annee">Bonne Année</option>
        </select>

        {/* Input corrigé */}
        <input
          type="text"
          className="champ"
          placeholder="Votre nom (expéditeur)"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />

        <button
          onClick={genererMessage}
          className="w-full p-3 mt-4 bg-red-600 hover:bg-red-500 rounded-lg"
        >
          Générer
        </button>

        <div className="mt-5 text-lg font-bold min-h-[40px]">
          {resultat}
        </div>

        {resultat && (
          <button
            onClick={partagerMessage}
            className="w-full p-3 mt-2 bg-blue-900 hover:bg-blue-700 rounded-lg"
          >
            Partager 🎁
          </button>
        )}

        {webviewMessage && (
          <div className="mt-3 p-3 bg-yellow-600 text-black rounded-lg text-sm">
            {webviewMessage}
          </div>
        )}

        <audio id="musiqueNoel" src="/noel.mp3" muted></audio>
        <audio id="musiqueAnnee" src="/bonne_annee.mp3" muted></audio>
      </div>
    </div>
  );
}





// import './App.css'
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

//       // 🎵 Auto play musique
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
//     snow.style.fontSize = 12 + Math.random() * 20 + "px";
//     snow.style.animationDuration = 3 + Math.random() * 5 + "s";
//     document.body.appendChild(snow);
//     setTimeout(() => snow.remove(), 8000);
//   }

//   // 🎁 Générer message + musique
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

//   // 📱 Partage natif (Android / iPhone) – déclenché uniquement sur clic
//   // async function partagerMessage() {
//   //   const url = window.location.href;

//   //   if (navigator.share) {
//   //     try {
//   //       await navigator.share({
//   //         title: "Carte de fête 🎁",
//   //         text: "Voici une carte personnalisée 🎄🎉",
//   //         url: url,
//   //       });
//   //       console.log("Menu de partage ouvert !");
//   //     } catch (err) {
//   //       console.log("Partage annulé ou erreur :", err);
//   //     }
//   //   } else {
//   //     // Détecter WebView (Facebook / Instagram)
//   //     const ua = navigator.userAgent || navigator.vendor || window.opera;
//   //     if (/FBAN|FBAV|Instagram/.test(ua)) {
//   //       setWebviewMessage("Pour partager cette carte, ouvrez le lien dans Chrome ou Safari.");
//   //     } else {
//   //       // Fallback : copier le lien
//   //       navigator.clipboard.writeText(url);
//   //       alert("Lien copié ! Vous pouvez l'envoyer manuellement.");
//   //     }
//   //   }
//   // }
//   async function partagerMessage() {
//   const url = window.location.href;

//   // Enregistrer dans le backend avant le partage
//   await fetch("/api/share", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       from: nom,
//       typeMessage: typeMessage,
//       app: "native_share",
//     }),
//   });

//   // Ouvre le menu de partage natif
//   if (navigator.share) {
//     try {
//       await navigator.share({
//         title: "Carte de fête 🎁",
//         text: "Voici une carte personnalisée 🎄🎉",
//         url: url,
//       });
//     } catch (err) {
//       console.log("Partage annulé.");
//     }
//   } else {
//     navigator.clipboard.writeText(url);
//     alert("Lien copié !");
//   }
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
//         <p className="mt-2">Créer et partager votre carte personnalisée :</p>

//         <select
//           className="w-full p-3 mt-4 rounded-lg text-black"
//           value={typeMessage}
//           onChange={(e) => setTypeMessage(e.target.value)}
//         >
//           <option value="noel">Joyeux Noël</option>
//           <option value="annee">Bonne Année</option>
//         </select>

//         <input
//           type="text"
//           className="w-full p-3 mt-4 rounded-lg text-black"
//           placeholder="Votre nom (expéditeur)"
//           value={nom}
//           onChange={(e) => setNom(e.target.value)}
//         />

//         <button
//           onClick={genererMessage}
//           className="w-full p-3 mt-4 bg-red-600 hover:bg-red-500 rounded-lg"
//         >
//           Générer
//         </button>

//         <div className="mt-5 text-lg font-bold min-h-[40px]">{resultat}</div>

//         {resultat && (
//           <button
//             onClick={partagerMessage}
//             className="w-full p-3 mt-2 bg-blue-900 hover:bg-blue-700 rounded-lg"
//           >
//             Partager 🎁
//           </button>
//         )}

//         {webviewMessage && (
//           <div className="mt-3 p-3 bg-yellow-600 text-black rounded-lg text-sm">
//             {webviewMessage}
//           </div>
//         )}

//         {/* 🎵 Audios */}
//         <audio id="musiqueNoel" src="/noel.mp3" muted></audio>
//         <audio id="musiqueAnnee" src="/bonne_annee.mp3" muted></audio>
//       </div>
//     </div>
//   );
// }
