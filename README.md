# Etat-collection
Electron app permettant de renvoyer un CSV etat de collection ISTEX

![SCREENSHOT](https://raw.githubusercontent.com/istex/etat-collection/master/screenshot.png)

Technos : 
- ElectronJS
- Angular
- Sass
- MaterializeCSS

## Utilisation

0. Télécharger la [derniére version de l'application](https://github.com/istex/etat-collection/releases) pour votre systéme puis dézipper l'archive & lancer l'application
1. Choisissez ou non d'activer le proxy INIST
2. Copier coller un lien istex (aggregation/facette imbriquée à venir)
  ex : `https://api.istex.fr/document/?q=*&facet=publicationDate[perYear]&size=0`
3. Le résultat est directement visible en scrollant en bas dans l'application (un graph est ajouté)


## Developpement 

### Prérequis 
- Node >6.3
- Un systéme Unix pour la compilation (OSX/Linux)
- Libsass
- Wine pour linux ou osx pour compiler pour windows
- Un systeme OSX pour signer le .app si voulu

### Installation
`git clone https://github.com/istex/etat-collection && cd etat-collection && npm install && cd app && npm install`

### Pour lancer l'application en mode developpeur

0. Activer les developpeur tools:
  Décommenter la ligne `//this.win.webContents.openDevTools();` dans `/app/libs/app-class.js`

1. Surveiller les fichier sass:

  `npm run checkSass` (Attention editer les fichiers dans `'/app/assets/sass/'` ne pas editer les fichiers .css)
  
2. Lancer l'application

  `npm start`
  
### Edition de l'application

- L'application qui sera packagée est l'entiéreté du dossier /app (Moins les fichiers ignorés)
- Le point d'entrée de l'application est `/app/index.js`
- Le code electron principal (reformaté en class es6) se trouve dans `/app/libs/app-class.js`
- Le code principal se trouve dans `/app/assets/js/mains.js`
- Le code sass se trouve dans `/app/assets/sass/base.scss`
- Le template HTML se trouve dans `/app/views/index.html`


### Deployer l'application
Pour déployer l'application pour win,osx,linux (.exe,.app,.deb)

0. Desactiver les developpeur tools:
  Commenter la ligne `//this.win.webContents.openDevTools();` dans `/app/libs/app-class.js`

1. Packager `npm run pack`
