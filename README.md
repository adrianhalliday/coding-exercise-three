# TUBR : Browse YouTube with a Tinder-style interface

Based on Nuxt Minimal Starter from [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Contents
- :pineapple: Pinia store with parallel LocalStorage within setters
- :electric_plug: Custom middleware (currently disabled due to clash with Player)
- :left_right_arrow: Server-side calls to YouTube APIs
- :hearts: Custom 'swipe' actions using GSAP Draggable and `hitTest()` on a CSS Grid hit box
- :arrow_forward: NuxtScripts YouTube player with custom controls

## Use:
1. Best to open the demo on Desktop [here](https://coding-exercise-three.vercel.app)
2. Initialise a search in the custom-built search UI (no form/UI library)
3. Browse the search results cards using:
  - :arrow_up: Swipe up to remove video from results (data calls not implemented)
  - :arrow_left: Swipe left to 'dislike' video (data calls not _fully_ implemented)
  - :arrow_right: Swipe right to 'favourite' video (with de-duplication)
  - :arrow_down: Swipe down to add video to your playlist (no de-duplication so you can add multiple times)
4. Tap a card to play it directly in the player
5. Navigate to Playlist or Favourites pages to play/delete videos from these lists
6. Rinse and repeat!

## Incomplete
Several parts of the app are incomplete due to time constraints such as:
1. Page transitions: a custom transition was in progress for the Feed -> Player transition, however this clashed with the Card and Player initialisations. Cards initialised incorrectly positioned and the Player would not initialise on load. Due to time constraints I had to pause finding a workaround for this as it was not essential.
2. Video Duration: Interestingly the YouTube Data API does not provide video durations and this felt essential to user experience. I added a new call to the YouTube Data API for each video, and parsed the ISO time format to display either h:mm or mm:ss depending on video length. 
  - _However this resulted in a LOT of calls to the API during countless hot reloads and I maxed my API allowance on both Sunday and Monday so I have commented this out._
3. Video Player: Ideally this would include extra controls, progress bar, and the playlist. I felt implementing this would be going a _bit too far_ (if I haven't done already!) for this exercise.
4. UI: Most of it is blocked out in a fairly basic way since the main effort went on the unique card swipe navigation.
5. Refactoring: most logic in CardIndex should be abstracted, as is the case for a lot of the other logic, and potentially the CSS. Both of these aspects spiralled in complexity as the project went on and there has not been enough time to refactor.

## Setup

```bash
# npm
npm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev
```

## Production

Build the application for production and preview:

```bash
# npm
npm run build
npm run preview
```