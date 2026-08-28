# Wake Challenge

Application mobile de reveil par defis.

## Lancer en 2 commandes

```bash
npm install
npm run dev
```

Le navigateur s'ouvre automatiquement sur `http://localhost:8081`. Testez directement l'application dans le navigateur.

## Tester sur mobile

```bash
npx expo start
```

Puis scannez le QR code avec **Expo Go** (Android) ou l'appareil photo (iOS).

## Fonctionnalites

- Alarme programmable
- Defis : Calcul, Scanner, Photo, Mouvement, Recopie, Localisation
- Ecran de reveil avec defis obligatoires
- Persistance locale

## Structure

```
src/
  contexts/AlarmContext.tsx  - Etat global
  screens/                   - Ecrans
  components/                - UI
  utils/                     - Audio, notifications
  storage/                   - Persistance
  types/                     - Types
```

## Notes

- `npm run dev` = lancement web le plus rapide pour developper
- Son d'alarme : ajouter un fichier `assets/alarm.mp3`
- Defis camera/mouvement/localisation : simulations UI pretes pour integration native
