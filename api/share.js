export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { from, typeMessage, app } = req.body;

  console.log("📩 Nouveau partage reçu :", {
    from,
    typeMessage,
    app,
    date: new Date().toISOString(),
  });

  // Ici tu peux envoyer vers une base, Google Sheet, Supabase, etc.
  // Pour l'instant on renvoie juste que c'est OK.

  return res.status(200).json({
    ok: true,
    message: "Partage enregistré avec succès !",
  });
}
