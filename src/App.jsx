import "./App.css";
import { useEffect, useState } from "react";

export default function App() {
  const [nom, setNom] = useState("");
  const [expediteur, setExpediteur] = useState("");
  const [typeMessage, setTypeMessage] = useState("noel");
  const [resultat, setResultat] = useState("");

  // 🔊 Autoplay sécurisé
  function forceAutoplay(audio) {
    if (!audio) return;
    audio.muted = false;
    audio.volume = 1;
    audio.play().catch(() => {
      setTimeout(() => audio.play().catch(() => {}), 300);
    });
  }

  // 🔗 Lecture auto quand lien ouvert
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    const msgType = params.get("msg");

    if (from) {
      setExpediteur(from);
      setResultat(from);
      setTypeMessage(msgType || "noel");

      setTimeout(() => {
        msgType === "annee"
          ? forceAutoplay(document.getElementById("musiqueAnnee"))
          : forceAutoplay(document.getElementById("musiqueNoel"));
      }, 500);
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
    setTimeout(() => snow.remove(), 5000);
  }

  // ✅ Valider le nom (sans musique)
  function validerNom() {
    if (!nom.trim()) return;

    setExpediteur(nom);
    setResultat(nom);

    const newURL = `${window.location.origin}?from=${encodeURIComponent(
      nom
    )}&msg=${typeMessage}`;
    window.history.pushState({}, "", newURL);
  }

  // 🎶 Bouton écouter (musique seule)
  function ecouterMusique() {
    const audioNoel = document.getElementById("musiqueNoel");
    const audioAnnee = document.getElementById("musiqueAnnee");

    audioNoel.pause();
    audioAnnee.pause();

    typeMessage === "annee"
      ? forceAutoplay(audioAnnee)
      : forceAutoplay(audioNoel);
  }

  // 📤 Partage
  async function partagerMessage() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: "Carte de fête 🎁",
        text: `Carte personnalisée de ${expediteur} 🎄🎉`,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Lien copié !");
    }
  }

  const nomAAfficher = resultat || expediteur;

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white p-4 text-center bg-cover bg-center bg-no-repeat bg-fixed relative"
      style={{
        backgroundImage: `
          linear-gradient(to bottom, rgba(13,27,42,0.9), rgba(27,38,59,0.9)),
          url('/bg1.jpg'),
          url('/bg2.jpg'),
          url('/bg3.jpg')
        `,
      }}
    >
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

        {/* 🔹 Champ expéditeur + bouton valider intégré */}
        <div className="relative mt-2">
          <input
            type="text"
            className="champ pr-12"
            placeholder="Votre nom (expéditeur)"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && validerNom()}
          />

          <button
            onClick={validerNom}
            title="Valider"
            className="absolute right-2 top-1/2 -translate-y-1/2
                       bg-green-600 hover:bg-green-500
                       text-white text-sm
                       w-8 h-8 rounded-full
                       flex items-center justify-center shadow-md"
          >
            Ok
          </button>
        </div>

        {/* 🎶 Musique seulement */}
        <button
          onClick={ecouterMusique}
          className="w-40 p-3 mt-4 bg-red-600 hover:bg-red-500 rounded-lg"
        >
          🎶 Écouter
        </button>

        {/* ✨ Texte + nom doré animé */}
        <div className="mt-5 text-lg font-bold min-h-[60px]">
          {nomAAfficher && (
            <>
              <div>
                {typeMessage === "annee"
                  ? "🎉 Bonne Année de la part de :"
                  : "🎄 Joyeux Noël de la part de :"}
              </div>

              <div className="nom-anime">
                {nomAAfficher.split("").map((lettre, i) => (
                  <span
                    key={i}
                    className="lettre-expediteur"
                    style={{
                      animationDelay: `${i * 0.2}s`,
                      "--x": `${Math.random() * 500 - 250}px`,
                      "--y": `${Math.random() * 400 - 200}px`,
                      "--r": `${Math.random() * 360}deg`,
                    }}
                  >
                    {lettre === " " ? "\u00A0" : lettre}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* 📤 Partage */}
        {nomAAfficher && (
          <button
            onClick={partagerMessage}
            className="p-3 mt-2 bg-blue-900 hover:bg-blue-700 rounded-lg"
          >
            Partager 🎁
          </button>
        )}

        {/* ❤️ Don */}
        <div className="mt-4 p-3 bg-green-700 rounded-lg text-sm">
          ❤️ Don pour les familles vulnérables :
          <div>
            <a
              href="tel:+243898688469"
              className="underline font-bold hover:text-yellow-300"
            >
              +243 898 688 469
            </a>
          </div>
        </div>

        <audio id="musiqueNoel" src="/noel.mp3" />
        <audio id="musiqueAnnee" src="/bonne_annee.mp3" />
      </div>

      {/* 🎨 Styles */}
      <style>{`
        .snowflake {
          position: fixed;
          top: -10px;
          color: white;
          animation: fall linear infinite;
          z-index: 9999;
        }
        @keyframes fall {
          to { transform: translateY(110vh); }
        }
        .champ {
          width: 100%;
          margin-top: 10px;
          padding: 12px;
          border-radius: 10px;
          color: black;
        }
        .animate-glow {
          animation: glow 2s infinite alternate;
        }
        @keyframes glow {
          0% { box-shadow: 0 0 15px gold; }
          100% { box-shadow: 0 0 30px white; }
        }
        .nom-anime { margin-top: 6px; }
        .lettre-expediteur {
          display: inline-block;
          font-size: 1.6rem;
          font-weight: 900;
          background: linear-gradient(45deg,#FFD700,#FFF5C2,#FFB700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          opacity: 0;
          transform: translate(var(--x),var(--y)) rotate(var(--r)) scale(0.3);
          animation: arriveeNom 2.2s ease-out forwards;
        }
        @keyframes arriveeNom {
          0% {
            opacity: 0;
            transform: translate(var(--x),var(--y)) rotate(var(--r)) scale(0.3);
          }
          80% {
            transform: translate(0,0) rotate(0deg) scale(1.2);
          }
          100% {
            opacity: 1;
            transform: translate(0,0) rotate(0deg) scale(1);
          }
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

//   // 🟢 Fonction autoplay
//   function forceAutoplay(audio) {
//     if (!audio) return;
//     audio.muted = false;
//     audio.volume = 1;
//     audio.play().catch(() => {
//       setTimeout(() => audio.play().catch(() => {}), 300);
//     });
//   }

//   // 🟢 Lecture auto quand le lien est ouvert
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const from = params.get("from");
//     const msgType = params.get("msg");

//     if (from) {
//       setExpediteur(from);
//       setTypeMessage(msgType || "noel");
//       setResultat(from);

//       // Autoplay musique
//       setTimeout(() => {
//         if (msgType === "annee") forceAutoplay(document.getElementById("musiqueAnnee"));
//         else forceAutoplay(document.getElementById("musiqueNoel"));
//       }, 500);
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
//     setTimeout(() => snow.remove(), 5000);
//   }

//   // 🎁 Générer message
//   function genererMessage() {
//     const audioNoel = document.getElementById("musiqueNoel");
//     const audioAnnee = document.getElementById("musiqueAnnee");
//     audioNoel.pause();
//     audioAnnee.pause();

//     const nomAffiche = nom || expediteur || "🎁";
//     setResultat(nomAffiche);

//     if (typeMessage === "annee") forceAutoplay(audioAnnee);
//     else forceAutoplay(audioNoel);

//     const newURL = `${window.location.origin}?from=${encodeURIComponent(nomAffiche)}&msg=${typeMessage}`;
//     window.history.pushState({}, "", newURL);
//   }

//   // 📱 Partage
//   async function partagerMessage() {
//     const url = window.location.href;
//     if (navigator.share) {
//       await navigator.share({
//         title: "Carte de fête 🎁",
//         text: `Carte personnalisée de ${nom || expediteur} 🎄🎉`,
//         url,
//       });
//     } else {
//       navigator.clipboard.writeText(url);
//       alert("Lien copié !");
//     }
//   }

//   // 🔹 Détermine le nom à partager directement
//   const nomAAfficher = resultat || expediteur || nom;

//   return (
//     <div className="min-h-screen flex items-center justify-center text-white p-4 text-center bg-cover bg-center bg-no-repeat bg-fixed relative" style={{ backgroundImage: `linear-gradient(to bottom, rgba(13,27,42,0.9), rgba(27,38,59,0.9)), url('/bg1.jpg'), url('/bg2.jpg'), url('/bg3.jpg')` }}>
//       <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl max-w-md shadow-xl relative border-4 border-transparent animate-glow">
//         <h2 className="text-2xl font-bold text-pink-200">🎄 Joyeux Noël & 🎉 Bonne Année</h2>

//         <select className="champ" value={typeMessage} onChange={(e) => setTypeMessage(e.target.value)}>
//           <option value="noel">Joyeux Noël</option>
//           <option value="annee">Bonne Année</option>
//         </select>

//         <input type="text" className="champ" placeholder="Votre nom (expéditeur)" value={nom} onChange={(e) => setNom(e.target.value)} />

//         <button onClick={genererMessage} className="w-40 p-3 mt-4 bg-red-600 hover:bg-red-500 rounded-lg">
//           🎶 Écouter
//         </button>

//         {/* ✨ NOM DORÉ ANIMÉ */}
//         <div className="mt-5 text-lg font-bold min-h-[60px]">
//           {nomAAfficher && (
//             <>
//               <div>{typeMessage === "annee" ? "🎉 Bonne Année de la part de :" : "🎄 Joyeux Noël de la part de :"}</div>
//               <div className="nom-anime">
//                 {nomAAfficher.split("").map((lettre, index) => (
//                   <span key={index} className="lettre-expediteur" style={{ animationDelay: `${index*0.2}s`, "--x": `${Math.random()*500-250}px`, "--y": `${Math.random()*400-200}px`, "--r": `${Math.random()*360}deg` }}>
//                     {lettre===" "? "\u00A0": lettre}
//                   </span>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>

//         {/* 🔹 Partage prêt automatiquement si nom déjà présent */}
//         {nomAAfficher && (
//           <button onClick={partagerMessage} className="p-3 mt-2 bg-blue-900 hover:bg-blue-700 rounded-lg">
//             Partager 🎁
//           </button>
//         )}

//         {/* Bloc don */}
//         <div className="mt-4 p-3 bg-green-700 text-white rounded-lg text-sm text-center">
//           ❤️ Don pour les familles vulnérables :
//           <div><a href="tel:+243898688469" className="underline font-bold hover:text-yellow-300">+243 898 688 469</a></div>
//         </div>

//         <audio id="musiqueNoel" src="/noel.mp3" />
//         <audio id="musiqueAnnee" src="/bonne_annee.mp3" />
//       </div>

//       <style>{`
//         .snowflake { position: fixed; top: -10px; color: white; animation: fall linear infinite; z-index: 9999; }
//         @keyframes fall { to { transform: translateY(110vh); } }
//         .champ { width: 100%; margin-top: 10px; padding: 12px; border-radius: 10px; color: black; }
//         .animate-glow { animation: glow 2s infinite alternate; }
//         @keyframes glow { 0% { box-shadow: 0 0 15px gold; } 100% { box-shadow: 0 0 30px white; } }
//         .nom-anime { margin-top: 6px; }
//         .lettre-expediteur { display: inline-block; font-size: 1.6rem; font-weight: 900; background: linear-gradient(45deg, #FFD700, #FFF5C2, #FFB700); -webkit-background-clip: text; -webkit-text-fill-color: transparent; opacity: 0; transform: translate(var(--x), var(--y)) rotate(var(--r)) scale(0.3); animation: arriveeNom 2.2s ease-out forwards; }
//         @keyframes arriveeNom { 0% { opacity:0; transform: translate(var(--x), var(--y)) rotate(var(--r)) scale(0.3); } 80% { transform: translate(0,0) rotate(0deg) scale(1.2); } 100% { opacity:1; transform: translate(0,0) rotate(0deg) scale(1); } }
//       `}</style>
//     </div>
//   );
// }



// import "./App.css";
// import { useEffect, useState } from "react";

// export default function App() {
//   const [nom, setNom] = useState("");
//   const [expediteur, setExpediteur] = useState("");
//   const [typeMessage, setTypeMessage] = useState("noel");
//   const [resultat, setResultat] = useState("");
//   const [webviewMessage, setWebviewMessage] = useState("");

//   // 🟢 Fonction autoplay
//   function forceAutoplay(audio) {
//     if (!audio) return;
//     audio.muted = false;
//     audio.volume = 1;
//     audio.play().catch(() => {
//       setTimeout(() => audio.play().catch(() => {}), 300);
//     });
//   }

//   // 🟢 Lecture auto quand le lien est ouvert
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const from = params.get("from");
//     const msgType = params.get("msg");

//     if (from) {
//       setExpediteur(from);
//       setTypeMessage(msgType || "noel");
//       setResultat(from);

//       setTimeout(() => {
//         if (msgType === "annee") {
//           forceAutoplay(document.getElementById("musiqueAnnee"));
//         } else {
//           forceAutoplay(document.getElementById("musiqueNoel"));
//         }
//       }, 500);
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
//     setTimeout(() => snow.remove(), 5000);
//   }

//   // 🎁 Générer message
//   function genererMessage() {
//     const audioNoel = document.getElementById("musiqueNoel");
//     const audioAnnee = document.getElementById("musiqueAnnee");
//     audioNoel.pause();
//     audioAnnee.pause();

//     const nomAffiche = nom || expediteur || "🎁";
//     setResultat(nomAffiche);

//     if (typeMessage === "annee") forceAutoplay(audioAnnee);
//     else forceAutoplay(audioNoel);

//     const newURL = `${window.location.origin}?from=${encodeURIComponent(
//       nomAffiche
//     )}&msg=${typeMessage}`;
//     window.history.pushState({}, "", newURL);
//   }

//   // 📱 Partage
//   async function partagerMessage() {
//     const url = window.location.href;
//     if (navigator.share) {
//       await navigator.share({
//         title: "Carte de fête 🎁",
//         text: "Carte personnalisée 🎄🎉",
//         url,
//       });
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
//         linear-gradient(to bottom, rgba(13,27,42,0.9), rgba(27,38,59,0.9)),
//         url('/bg1.jpg'),
//         url('/bg2.jpg'),
//         url('/bg3.jpg')
//       `,
//       }}
//     >
//       <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl max-w-md shadow-xl relative border-4 border-transparent animate-glow">
//         <h2 className="text-2xl font-bold text-pink-200">
//           🎄 Joyeux Noël & 🎉 Bonne Année
//         </h2>

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
//           className="w-40 p-3 mt-4 bg-red-600 hover:bg-red-500 rounded-lg"
//         >
//           🎶 Écouter
//         </button>

//         {/* ✨ TEXTE NORMAL + NOM DORE ANIME ✨ */}
//         <div className="mt-5 text-lg font-bold min-h-[60px]">
//           {resultat && (
//             <>
//               <div>
//                 {typeMessage === "annee"
//                   ? "🎉 Bonne Année de la part de :"
//                   : "🎄 Joyeux Noël de la part de :"}
//               </div>

//               <div className="nom-anime">
//                 {expediteur.split("").map((lettre, index) => (
//                   <span
//                     key={index}
//                     className="lettre-expediteur"
//                     style={{
//                       animationDelay: `${index * 0.2}s`,
//                       "--x": `${Math.random() * 500 - 250}px`,
//                       "--y": `${Math.random() * 400 - 200}px`,
//                       "--r": `${Math.random() * 360}deg`,
//                     }}
//                   >
//                     {lettre === " " ? "\u00A0" : lettre}
//                   </span>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>

//         {resultat && (
//           <button
//             onClick={partagerMessage}
//             className="p-3 mt-2 bg-blue-900 hover:bg-blue-700 rounded-lg"
//           >
//             Partager 🎁
//           </button>
//         )}

//         {/* Bloc don complet */}
//         <div className="mt-4 p-3 bg-green-700 text-white rounded-lg text-sm text-center">
//           ❤️ Don pour les familles vulnérables :
//           <div>
//             <a href="tel:+243898688469" className="underline font-bold hover:text-yellow-300">
//               +243 898 688 469
//             </a>
//           </div>
//         </div>

//         <audio id="musiqueNoel" src="/noel.mp3" />
//         <audio id="musiqueAnnee" src="/bonne_annee.mp3" />
//       </div>

//       {/* 🎨 STYLES EXISTANTS + NOM DORE ANIME */}
//       <style>{`
//         .snowflake {
//           position: fixed;
//           top: -10px;
//           color: white;
//           animation: fall linear infinite;
//           z-index: 9999;
//         }
//         @keyframes fall { to { transform: translateY(110vh); } }
//         .champ {
//           width: 100%;
//           margin-top: 10px;
//           padding: 12px;
//           border-radius: 10px;
//           color: black;
//         }
//         .animate-glow {
//           animation: glow 2s infinite alternate;
//         }
//         @keyframes glow { 0% { box-shadow: 0 0 15px gold; } 100% { box-shadow: 0 0 30px white; } }

//         /* NOM EXPÉDITEUR DORÉ ANIME */
//         .nom-anime { margin-top: 6px; }
//         .lettre-expediteur {
//           display: inline-block;
//           font-size: 1.6rem;
//           font-weight: 900;
//           background: linear-gradient(45deg, #FFD700, #FFF5C2, #FFB700);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           opacity: 0;
//           transform: translate(var(--x), var(--y)) rotate(var(--r)) scale(0.3);
//           animation: arriveeNom 2.2s ease-out forwards;
//         }
//         @keyframes arriveeNom {
//           to {
//             opacity: 1;
//             transform: translate(0, 0) rotate(0deg) scale(1);
//           }
//         }
//       `}</style>
//     </div>
//   );
// }
