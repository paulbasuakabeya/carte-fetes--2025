import "./App.css";
import { useEffect, useState } from "react";

export default function App() {
  const [nom, setNom] = useState("");
  const [expediteur, setExpediteur] = useState("");
  const [typeMessage, setTypeMessage] = useState("noel");
  const [resultat, setResultat] = useState("");
  const [webviewMessage, setWebviewMessage] = useState("");

  // 🟢 Fonction autoplay
  function forceAutoplay(audio) {
    if (!audio) return;
    audio.muted = false;
    audio.volume = 1;
    audio.play().catch(() => {
      setTimeout(() => audio.play().catch(() => {}), 300);
    });
  }

  // 🟢 Lecture auto quand le lien est ouvert
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    const msgType = params.get("msg");

    if (from) {
      setExpediteur(from);
      setTypeMessage(msgType || "noel");
      setResultat(from);

      setTimeout(() => {
        if (msgType === "annee") {
          forceAutoplay(document.getElementById("musiqueAnnee"));
        } else {
          forceAutoplay(document.getElementById("musiqueNoel"));
        }
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
    snow.style.fontSize = 12 + Math.random() * 35 + "px";
    snow.style.animationDuration = 3 + Math.random() * 5 + "s";
    document.body.appendChild(snow);
    setTimeout(() => snow.remove(), 5000);
  }

  // 🎁 Générer message
  function genererMessage() {
    const audioNoel = document.getElementById("musiqueNoel");
    const audioAnnee = document.getElementById("musiqueAnnee");
    audioNoel.pause();
    audioAnnee.pause();

    const nomAffiche = nom || expediteur || "🎁";
    setResultat(nomAffiche);

    if (typeMessage === "annee") forceAutoplay(audioAnnee);
    else forceAutoplay(audioNoel);

    const newURL = `${window.location.origin}?from=${encodeURIComponent(
      nomAffiche
    )}&msg=${typeMessage}`;
    window.history.pushState({}, "", newURL);
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

        <input
          type="text"
          className="champ"
          placeholder="Votre nom (expéditeur)"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />

        <button
          onClick={genererMessage}
          className="w-40 p-3 mt-4 bg-red-600 hover:bg-red-500 rounded-lg"
        >
          🎶 Écouter
        </button>

        {/* ✨ TEXTE NORMAL + NOM DORE ANIME ✨ */}
        <div className="mt-5 text-lg font-bold min-h-[60px]">
          {resultat && (
            <>
              <div>
                {typeMessage === "annee"
                  ? "🎉 Bonne Année de la part de :"
                  : "🎄 Joyeux Noël de la part de :"}
              </div>

              <div className="nom-anime">
                {expediteur.split("").map((lettre, index) => (
                  <span
                    key={index}
                    className="lettre-expediteur"
                    style={{
                      animationDelay: `${index * 0.2}s`,
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

        {resultat && (
          <button
            onClick={partagerMessage}
            className="p-3 mt-2 bg-blue-900 hover:bg-blue-700 rounded-lg"
          >
            Partager 🎁
          </button>
        )}

        {/* Bloc don complet */}
        <div className="mt-4 p-3 bg-green-700 text-white rounded-lg text-sm text-center">
          ❤️ Don pour les familles vulnérables :
          <div>
            <a href="tel:+243898688469" className="underline font-bold hover:text-yellow-300">
              +243 898 688 469
            </a>
          </div>
        </div>

        <audio id="musiqueNoel" src="/noel.mp3" />
        <audio id="musiqueAnnee" src="/bonne_annee.mp3" />
      </div>

      {/* 🎨 STYLES EXISTANTS + NOM DORE ANIME */}
      <style>{`
        .snowflake {
          position: fixed;
          top: -10px;
          color: white;
          animation: fall linear infinite;
          z-index: 9999;
        }
        @keyframes fall { to { transform: translateY(110vh); } }
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
        @keyframes glow { 0% { box-shadow: 0 0 15px gold; } 100% { box-shadow: 0 0 30px white; } }

        /* NOM EXPÉDITEUR DORÉ ANIME */
        .nom-anime { margin-top: 6px; }
        .lettre-expediteur {
          display: inline-block;
          font-size: 1.6rem;
          font-weight: 900;
          background: linear-gradient(45deg, #FFD700, #FFF5C2, #FFB700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          opacity: 0;
          transform: translate(var(--x), var(--y)) rotate(var(--r)) scale(0.3);
          animation: arriveeNom 2.2s ease-out forwards;
        }
        @keyframes arriveeNom {
          to {
            opacity: 1;
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
