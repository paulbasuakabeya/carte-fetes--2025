// import "./App.css";
// import { useEffect, useState } from "react";
// import { collection, doc, getDoc, setDoc, increment } from "firebase/firestore";
// import { db } from "./firebaseConfig";

// export default function App() {
//   const [nom, setNom] = useState("");
//   const [expediteur, setExpediteur] = useState("");
//   const [typeMessage, setTypeMessage] = useState("noel");
//   const [resultat, setResultat] = useState("");
//   const [partages, setPartages] = useState(0);
//   const [showModal, setShowModal] = useState(false);

//   function forceAutoplay(audio) {
//     if (!audio) return;
//     audio.muted = false;
//     audio.volume = 1;
//     audio.play().catch(() => {});
//   }

//   // Lecture auto via URL params
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const from = params.get("from");
//     const msgType = params.get("msg");

//     if (from) {
//       setExpediteur(from);
//       setResultat(from);
//       setTypeMessage(msgType || "noel");

//       setTimeout(() => {
//         const audio =
//           msgType === "annee"
//             ? document.getElementById("musiqueAnnee")
//             : document.getElementById("musiqueNoel");
//         forceAutoplay(audio);
//       }, 500);
//     }
//   }, []);

//   // Débloque autoplay au premier clic/touch
//   useEffect(() => {
//     function unlockAudio() {
//       const audio =
//         typeMessage === "annee"
//           ? document.getElementById("musiqueAnnee")
//           : document.getElementById("musiqueNoel");
//       forceAutoplay(audio);
//       document.removeEventListener("click", unlockAudio);
//       document.removeEventListener("touchstart", unlockAudio);
//     }
//     document.addEventListener("click", unlockAudio);
//     document.addEventListener("touchstart", unlockAudio);
//     return () => {
//       document.removeEventListener("click", unlockAudio);
//       document.removeEventListener("touchstart", unlockAudio);
//     };
//   }, [typeMessage]);

//   // ❄️ Neige
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const snow = document.createElement("div");
//       snow.className = "snowflake";
//       snow.innerHTML = "❄";
//       snow.style.left = Math.random() * window.innerWidth + "px";
//       snow.style.fontSize = 12 + Math.random() * 40 + "px";
//       snow.style.animationDuration = 3 + Math.random() * 5 + "s";
//       document.body.appendChild(snow);
//       setTimeout(() => snow.remove(), 5000);
//     }, 200);
//     return () => clearInterval(interval);
//   }, []);

//   // 🎄 Sapins ou 2026
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const el = document.createElement("div");
//       el.className = "snowflake";
//       if (typeMessage === "annee") {
//         el.innerHTML = "2026";
//         el.style.fontWeight = "900";
//         el.style.color = "#FFD700";
//         el.style.textShadow = "0 0 8px #FFF, 0 0 15px #FFD700, 0 0 20px #FFF5C2";
//         el.style.fontSize = 18 + Math.random() * 25 + "px";
//         el.style.animationDuration = 4 + Math.random() * 3 + "s";
//       } else {
//         el.innerHTML = "🎄";
//         el.style.fontSize = 20 + Math.random() * 20 + "px";
//         el.style.animationDuration = 6 + Math.random() * 6 + "s";
//       }
//       el.style.left = Math.random() * window.innerWidth + "px";
//       document.body.appendChild(el);
//       setTimeout(() => el.remove(), 7000);
//     }, 400);
//     return () => clearInterval(interval);
//   }, [typeMessage]);

//   // 🔢 Charger compteur Firebase
//   useEffect(() => {
//     async function loadPartages() {
//       const docRef = doc(db, "stats", "partages");
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         setPartages(docSnap.data().count);
//       } else {
//         await setDoc(docRef, { count: 0 });
//         setPartages(0);
//       }
//     }
//     loadPartages();
//   }, []);

//   // Valider nom
//   function validerNom() {
//     if (!nom.trim()) return;
//     setExpediteur(nom);
//     setResultat(nom);
//     const newURL = `${window.location.origin}?from=${encodeURIComponent(
//       nom
//     )}&msg=${typeMessage}`;
//     window.history.pushState({}, "", newURL);
//   }

//   // 🎶 Écouter musique
//   function ecouterMusique() {
//     const audioNoel = document.getElementById("musiqueNoel");
//     const audioAnnee = document.getElementById("musiqueAnnee");
//     audioNoel.pause();
//     audioAnnee.pause();
//     typeMessage === "annee" ? forceAutoplay(audioAnnee) : forceAutoplay(audioNoel);
//   }

//   // 📤 Partager message
//   async function partagerMessage() {
//     const url = window.location.href;
//     const docRef = doc(db, "stats", "partages");

//     // Incrémente compteur
//     await setDoc(docRef, { count: increment(1) }, { merge: true });
//     const docSnap = await getDoc(docRef);
//     if (docSnap.exists()) setPartages(docSnap.data().count);

//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: "Carte de fête 🎁",
//           text: `Carte personnalisée de ${expediteur} 🎄🎉`,
//           url,
//         });
//       } catch (err) {
//         // Si échec (ex: annulation), fallback modal
//         setShowModal(true);
//       }
//     } else {
//       setShowModal(true);
//     }
//   }

//   const nomAAfficher = resultat || expediteur;

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center text-white p-4 text-center bg-cover bg-center bg-no-repeat bg-fixed relative"
//       style={{
//         backgroundImage: `
//           linear-gradient(to bottom, rgba(13,27,42,0.9), rgba(27,38,59,0.9)),
//           url('/bg1.jpg'),
//           url('/bg2.jpg'),
//           url('/bg3.jpg')
//         `,
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

//         <div className="relative mt-2">
//           <input
//             type="text"
//             className="champ pr-12"
//             placeholder="Votre nom (expéditeur)"
//             value={nom}
//             onChange={(e) => setNom(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && validerNom()}
//           />
//           <button
//             onClick={validerNom}
//             title="Valider"
//             className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-500 text-white text-xs w-8 h-8 rounded-full flex items-center justify-center shadow-md"
//           >
//             OK
//           </button>
//         </div>

//         <button
//           onClick={ecouterMusique}
//           className="w-40 p-3 mt-4 bg-red-600 hover:bg-red-500 rounded-lg"
//         >
//           🎶 Écouter
//         </button>

//         <div className="mt-5 text-lg font-bold min-h-[60px]">
//           {nomAAfficher && (
//             <>
//               <div>
//                 {typeMessage === "annee"
//                   ? "🎉 Bonne Année de la part de :"
//                   : "🎄 Joyeux Noël de la part de :"}
//               </div>
//               <div className="nom-anime">
//                 {nomAAfficher.split("").map((lettre, i) => (
//                   <span
//                     key={i}
//                     className="lettre-expediteur"
//                     style={{
//                       animationDelay: `${i * 0.2}s`,
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

//         {nomAAfficher && (
//           <>
//             <button
//               onClick={partagerMessage}
//               className="p-3 mt-2 bg-blue-900 hover:bg-blue-700 rounded-lg"
//             >
//               Partager 🎁
//             </button>
//             <div className="mt-2 text-sm text-yellow-300">
//               🔢 Ce lien a été partagé {partages} fois !
//             </div>
//           </>
//         )}

//         <div className="mt-4 p-3 bg-green-700 rounded-lg text-sm">
//           ❤️ Don pour les familles vulnérables :
//           <div>
//             <a
//               href="tel:+243898688469"
//               className="underline font-bold hover:text-yellow-300"
//             >
//               +243 898 688 469
//             </a>
//           </div>
//         </div>

//         <audio id="musiqueNoel" src="/noel.mp3" />
//         <audio id="musiqueAnnee" src="/bonne_annee.mp3" />
//       </div>

//       {/* Modal copier lien pour desktop */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-white text-black p-6 rounded-lg max-w-sm text-center">
//             <p className="mb-2 font-bold">Copiez ce lien pour partager :</p>
//             <input
//               type="text"
//               readOnly
//               value={window.location.href}
//               className="w-full p-2 border rounded mb-4"
//               onClick={(e) => e.target.select()}
//             />
//             <button
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
//               onClick={() => {
//                 navigator.clipboard.writeText(window.location.href);
//                 alert("Lien copié !");
//                 setShowModal(false);
//               }}
//             >
//               Copier
//             </button>
//             <button
//               className="px-4 py-2 ml-2 bg-gray-400 text-white rounded hover:bg-gray-300"
//               onClick={() => setShowModal(false)}
//             >
//               Fermer
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




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
    audio.play().catch(() => {});
  }

  // 🔗 Lecture auto quand lien est ouvert
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    const msgType = params.get("msg");

    if (from) {
      setExpediteur(from);
      setResultat(from);
      setTypeMessage(msgType || "noel");

      setTimeout(() => {
        const audio =
          msgType === "annee"
            ? document.getElementById("musiqueAnnee")
            : document.getElementById("musiqueNoel");

        forceAutoplay(audio);
      }, 500);
    }
  }, []);

  // 🔓 Débloque autoplay au premier clic/touch
  useEffect(() => {
    function unlockAudio() {
      const audio =
        typeMessage === "annee"
          ? document.getElementById("musiqueAnnee")
          : document.getElementById("musiqueNoel");

      forceAutoplay(audio);

      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("touchstart", unlockAudio);
    }

    document.addEventListener("click", unlockAudio);
    document.addEventListener("touchstart", unlockAudio);

    return () => {
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("touchstart", unlockAudio);
    };
  }, [typeMessage]);

  // ❄️ Neige de base
  useEffect(() => {
    const interval = setInterval(() => {
      const snow = document.createElement("div");
      snow.className = "snowflake";
      snow.innerHTML = "❄";
      snow.style.left = Math.random() * window.innerWidth + "px";
      snow.style.fontSize = 12 + Math.random() * 40 + "px";
      snow.style.animationDuration = 3 + Math.random() * 5 + "s";
      document.body.appendChild(snow);
      setTimeout(() => snow.remove(), 5000);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // 🎄🎉 Sapins ou 2026 selon le message
  useEffect(() => {
    const interval = setInterval(() => {
      const el = document.createElement("div");
      el.className = "snowflake";

      if (typeMessage === "annee") {
        el.innerHTML = "2026";
        el.style.fontWeight = "900";
        el.style.color = "#FFD700";
        el.style.textShadow = "0 0 8px #FFF, 0 0 15px #FFD700, 0 0 20px #FFF5C2";
      } else {
        el.innerHTML = "🎄";
        el.style.fontSize = 20 + Math.random() * 20 + "px";
        el.style.animationDuration = 6 + Math.random() * 6 + "s"; // plus lent
      }

      if (typeMessage === "annee") el.style.fontSize = 18 + Math.random() * 25 + "px";

      el.style.left = Math.random() * window.innerWidth + "px";
      if (!el.style.animationDuration) el.style.animationDuration = 4 + Math.random() * 4 + "s";

      document.body.appendChild(el);
      setTimeout(() => el.remove(), 7000);
    }, 400);

    return () => clearInterval(interval);
  }, [typeMessage]);

  // ✅ Valider nom
  function validerNom() {
    if (!nom.trim()) return;

    setExpediteur(nom);
    setResultat(nom);

    const newURL = `${window.location.origin}?from=${encodeURIComponent(
      nom
    )}&msg=${typeMessage}`;
    window.history.pushState({}, "", newURL);
  }

  // 🎶 Écouter musique
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

        {/* Champ expéditeur + bouton valider */}
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
                       text-white text-xs
                       w-8 h-8 rounded-full
                       flex items-center justify-center shadow-md"
          >
            OK
          </button>
        </div>

        <button
          onClick={ecouterMusique}
          className="w-40 p-3 mt-4 bg-red-600 hover:bg-red-500 rounded-lg"
        >
          🎶 Écouter
        </button>

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

        {nomAAfficher && (
          <button
            onClick={partagerMessage}
            className="p-3 mt-2 bg-blue-900 hover:bg-blue-700 rounded-lg"
          >
            Partager 🎁
          </button>
        )}

        <div className="mt-4 p-3 bg-green-700 rounded-lg text-sm">
          ❤️ Don aux familles vulnérables❤️ :
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

//   // 🔊 Autoplay sécurisé
//   function forceAutoplay(audio) {
//     if (!audio) return;
//     audio.muted = false;
//     audio.volume = 1;
//     audio.play().catch(() => {});
//   }

//   // 🔗 Lecture auto quand lien est ouvert
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const from = params.get("from");
//     const msgType = params.get("msg");

//     if (from) {
//       setExpediteur(from);
//       setResultat(from);
//       setTypeMessage(msgType || "noel");

//       setTimeout(() => {
//         const audio =
//           msgType === "annee"
//             ? document.getElementById("musiqueAnnee")
//             : document.getElementById("musiqueNoel");

//         forceAutoplay(audio);
//       }, 500);
//     }
//   }, []);

//   // 🔓 Débloque autoplay au premier clic/touch (solution PRO)
//   useEffect(() => {
//     function unlockAudio() {
//       const audio =
//         typeMessage === "annee"
//           ? document.getElementById("musiqueAnnee")
//           : document.getElementById("musiqueNoel");

//       forceAutoplay(audio);

//       document.removeEventListener("click", unlockAudio);
//       document.removeEventListener("touchstart", unlockAudio);
//     }

//     document.addEventListener("click", unlockAudio);
//     document.addEventListener("touchstart", unlockAudio);

//     return () => {
//       document.removeEventListener("click", unlockAudio);
//       document.removeEventListener("touchstart", unlockAudio);
//     };
//   }, [typeMessage]);

//   // ❄️ Neige
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const snow = document.createElement("div");
//       snow.className = "snowflake";
//       snow.innerHTML = "❄";
//       snow.style.left = Math.random() * window.innerWidth + "px";
//       snow.style.fontSize = 12 + Math.random() * 40 + "px";
//       snow.style.animationDuration = 3 + Math.random() * 5 + "s";
//       document.body.appendChild(snow);
//       setTimeout(() => snow.remove(), 5000);
//     }, 200);

//     return () => clearInterval(interval);
//   }, []);

//   // ✅ Valider nom (sans musique)
//   function validerNom() {
//     if (!nom.trim()) return;

//     setExpediteur(nom);
//     setResultat(nom);

//     const newURL = `${window.location.origin}?from=${encodeURIComponent(
//       nom
//     )}&msg=${typeMessage}`;
//     window.history.pushState({}, "", newURL);
//   }

//   // 🎶 Écouter musique seulement
//   function ecouterMusique() {
//     const audioNoel = document.getElementById("musiqueNoel");
//     const audioAnnee = document.getElementById("musiqueAnnee");

//     audioNoel.pause();
//     audioAnnee.pause();

//     typeMessage === "annee"
//       ? forceAutoplay(audioAnnee)
//       : forceAutoplay(audioNoel);
//   }

//   // 📤 Partage
//   async function partagerMessage() {
//     const url = window.location.href;

//     if (navigator.share) {
//       await navigator.share({
//         title: "Carte de fête 🎁",
//         text: `Carte personnalisée de ${expediteur} 🎄🎉`,
//         url,
//       });
//     } else {
//       navigator.clipboard.writeText(url);
//       alert("Lien copié !");
//     }
//   }

//   const nomAAfficher = resultat || expediteur;

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

//         {/* Champ expéditeur + bouton valider intégré */}
//         <div className="relative mt-2">
//           <input
//             type="text"
//             className="champ pr-12"
//             placeholder="Votre nom (expéditeur)"
//             value={nom}
//             onChange={(e) => setNom(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && validerNom()}
//           />

//           <button
//             onClick={validerNom}
//             title="Valider"
//             className="absolute right-2 top-1/2 -translate-y-1/2
//                        bg-green-600 hover:bg-green-500
//                        text-white text-xs
//                        w-8 h-8 rounded-full
//                        flex items-center justify-center shadow-md"
//           >
//             OK
//           </button>
//         </div>

//         {/* 🎶 Musique */}
//         <button
//           onClick={ecouterMusique}
//           className="w-40 p-3 mt-4 bg-red-600 hover:bg-red-500 rounded-lg"
//         >
//           🎶 Écouter
//         </button>

//         {/* ✨ Texte + nom animé */}
//         <div className="mt-5 text-lg font-bold min-h-[60px]">
//           {nomAAfficher && (
//             <>
//               <div>
//                 {typeMessage === "annee"
//                   ? "🎉 Bonne Année de la part de :"
//                   : "🎄 Joyeux Noël de la part de :"}
//               </div>

//               <div className="nom-anime">
//                 {nomAAfficher.split("").map((lettre, i) => (
//                   <span
//                     key={i}
//                     className="lettre-expediteur"
//                     style={{
//                       animationDelay: `${i * 0.2}s`,
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

//         {/* 📤 Partage */}
//         {nomAAfficher && (
//           <button
//             onClick={partagerMessage}
//             className="p-3 mt-2 bg-blue-900 hover:bg-blue-700 rounded-lg"
//           >
//             Partager 🎁
//           </button>
//         )}

//         {/* ❤️ Don */}
//         <div className="mt-4 p-3 bg-green-700 rounded-lg text-sm">
//           ❤️ Don pour les familles vulnérables :
//           <div>
//             <a
//               href="tel:+243898688469"
//               className="underline font-bold hover:text-yellow-300"
//             >
//               +243 898 688 469
//             </a>
//           </div>
//         </div>

//         <audio id="musiqueNoel" src="/noel.mp3" />
//         <audio id="musiqueAnnee" src="/bonne_annee.mp3" />
//       </div>

//       {/* 🎨 Styles */}
//       <style>{`
//         .snowflake {
//           position: fixed;
//           top: -10px;
//           color: white;
//           animation: fall linear infinite;
//           z-index: 9999;
//         }
//         @keyframes fall {
//           to { transform: translateY(110vh); }
//         }
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
//         @keyframes glow {
//           0% { box-shadow: 0 0 15px gold; }
//           100% { box-shadow: 0 0 30px white; }
//         }
//         .nom-anime { margin-top: 6px; }
//         .lettre-expediteur {
//           display: inline-block;
//           font-size: 1.6rem;
//           font-weight: 900;
//           background: linear-gradient(45deg,#FFD700,#FFF5C2,#FFB700);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           opacity: 0;
//           transform: translate(var(--x),var(--y)) rotate(var(--r)) scale(0.3);
//           animation: arriveeNom 2.2s ease-out forwards;
//         }
//         @keyframes arriveeNom {
//           0% {
//             opacity: 0;
//             transform: translate(var(--x),var(--y)) rotate(var(--r)) scale(0.3);
//           }
//           80% {
//             transform: translate(0,0) rotate(0deg) scale(1.2);
//           }
//           100% {
//             opacity: 1;
//             transform: translate(0,0) rotate(0deg) scale(1);
//           }
//         }
//       `}</style>
//     </div>
//   );
// }
