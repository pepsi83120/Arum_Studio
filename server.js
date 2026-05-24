const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const destinationEmail = process.env.TO_EMAIL || "maxime.tdc1@gmail.com";

app.use(express.json());
app.use(express.static(__dirname));

app.get("/healthz", (req, res) => {
  res.json({
    ok: true,
    smtpUserConfigured: Boolean(process.env.SMTP_USER),
    smtpPassConfigured: Boolean(process.env.SMTP_PASS),
    toEmail: destinationEmail
  });
});

app.post("/contact", async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim();
  const service = String(req.body["Service souhaite"] || "").trim();
  const website = String(req.body["Site actuel ou Instagram"] || "").trim();
  const message = String(req.body.Besoin || "").trim();

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Champs obligatoires manquants." });
  }

  const smtpUser = String(process.env.SMTP_USER || "").trim();
  const smtpPass = String(process.env.SMTP_PASS || "").replace(/\s/g, "");

  if (!smtpUser || !smtpPass) {
    return res.status(500).json({ error: "SMTP non configure sur Render." });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true") === "true",
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });

  const text = [
    "Nouvelle demande depuis le site Aurum Studio",
    "",
    `Nom : ${name}`,
    `Email : ${email}`,
    `Service souhaite : ${service || "Non renseigne"}`,
    `Site actuel / Instagram : ${website || "Non renseigne"}`,
    "",
    "Besoin :",
    message
  ].join("\n");

  try {
    await transporter.sendMail({
      from: `"Aurum Studio" <${smtpUser}>`,
      to: destinationEmail,
      replyTo: email,
      subject: `Nouvelle demande Aurum Studio - ${name}`,
      text
    });

    res.json({ ok: true });
  } catch (error) {
    console.error("Erreur email:", error);
    res.status(500).json({
      error: "Email non envoye.",
      details: error.response || error.message || "Erreur SMTP inconnue.",
      code: error.code || "",
      command: error.command || ""
    });
  }
});

app.get("/contact", (req, res) => {
  res.status(405).json({ error: "Utilisez le formulaire pour envoyer une demande." });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use((error, req, res, next) => {
  console.error("Erreur serveur:", error);
  res.status(500).json({
    error: "Erreur serveur.",
    details: error.message || "Erreur inconnue."
  });
});

app.listen(port, () => {
  console.log(`Aurum Studio en ligne sur le port ${port}`);
});
