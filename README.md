# Etat-collection
Electron app permettant de renvoyer un CSV etat de collection ISTEX

![SCREENSHOT](https://raw.githubusercontent.com/istex/etat-collection/master/screenshot.png)

## Installation
`cd istex-collection && npm install && cd app && npm install`

## Deployer l'application
Pour déployer l'application pour win,osx,linux (.exe,.app,.deb)

`npm run pack`

Pour lancer l'application en mode developpeur

1. Surveiller les fichier sass:

  `npm run checkSass` (Attention editer les fichiers dans `'/app/assets/sass'` ne pas editer les fichiers .css)
  
2. Lancer l'application

  `npm start`


## Utilisation

1. Choisissez ou non d'activer le proxy INIST
2. Copier coller un lien istex (aggregation/facette imbriquée à venir)
  ex : `https://api.istex.fr/document/?q=*&facet=publicationDate[perYear]&size=0`
3. Le résultat est directement visible en scrollant en bas dans l'application

