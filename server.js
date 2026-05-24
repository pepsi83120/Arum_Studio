const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const destinationEmail = process.env.TO_EMAIL || "maxime.tdc1@gmail.com";

app.use(express.json());
app.use(express.static(__dirname));

app.post("/contact", async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim();
  const service = String(req.body["Service souhaite"] || "").trim();
  const website = String(req.body["Site actuel ou Instagram"] || "").trim();
  const message = String(req.body.Besoin || "").trim();

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Champs obligatoires manquants." });
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return res.status(500).json({ error: "SMTP non configure sur Render." });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true") === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
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
      from: `"Aurum Studio" <${process.env.SMTP_USER}>`,
      to: destinationEmail,
      replyTo: email,
      subject: `Nouvelle demande Aurum Studio - ${name}`,
      text
    });

    res.json({ ok: true });
  } catch (error) {
    console.error("Erreur email:", error);
    res.status(500).json({ error: "Email non envoye." });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Aurum Studio en ligne sur le port ${port}`);
});
