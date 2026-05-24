# Aurum Studio - formulaire email fiable

Cette version utilise un petit serveur Node.js sur Render pour envoyer les demandes du formulaire par email.

## Fichiers a mettre sur GitHub

- index.html
- server.js
- package.json
- render.yaml
- README.md

## Variables a mettre dans Render

Ajoute ces variables d'environnement dans Render :

- SMTP_USER : maxime.tdc1@gmail.com
- SMTP_PASS : mot de passe d'application Gmail
- TO_EMAIL : maxime.tdc1@gmail.com

Les autres variables sont deja dans render.yaml.

## Important pour Gmail

SMTP_PASS ne doit pas etre ton mot de passe Gmail normal.
Il faut activer la validation en deux etapes sur Google, puis creer un mot de passe d'application.

## Deploiement

Sur Render, utilise Blueprint avec :

Blueprint Path : render.yaml
