# Wake Challenge

Application mobile de reveil nouvelle generation avec systeme de defis obligatoires.

## Installation

```bash
npm install
```

## Lancer l'application

```bash
npx expo start
```

Puis scannez le QR code avec l'application Expo Go (Android) ou l'appareil photo (iOS).

## Fonctionnalites

- Alarme programmable avec defis obligatoires
- Defis : Calcul, Scanner, Photo, Mouvement, Recopie, Localisation
- Ecran de reveil avec progression
- Mode test pour development
- Persistance locale des donnees

## Permissions

- Notifications : pour les alarmes
- Camera : pour les defis scanner/photo
- Localisation : pour le defi de localisation
- Capteurs : pour le defi de mouvement

## Compilation Android

```bash
npx expo prebuild --platform android
npx expo run:android
```

## Notes

- Le son d'alarme doit etre place dans assets/alarm.mp3
- Les defis Scanner, Photo, Mouvement et Localisation utilisent des simulations pour le prototype
- Architecture prevue pour integration IA de vision (scanner/photo) et detection de mouvement reelle

## Structure du projet

```
src/
  contexts/     - Gestion d'etat (AlarmContext)
  screens/      - Ecrans de l'application
  components/   - Composants reutilisables
  utils/        - Utilitaires (audio, notifications)
  storage/      - Persistance locale
  types/        - Types TypeScript
  data/         - Donnees et templates de defis
```
