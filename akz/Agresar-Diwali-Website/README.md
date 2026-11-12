# Diwali Spin & Play

A small static website for a festive Diwali game celebration.

## Pages
- `index.html` – welcome screen, wheel, game selection, results and session history.
- `instructions.html` – rules for all ten games.

## Run locally
Open `index.html` in a browser. For the most reliable local preview, use a simple static server (for example, VS Code Live Server).

## Publish with GitHub Pages
1. Create a GitHub repository for the game.
2. Upload all files and folders from this project.
3. Open **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**.
5. Choose the `main` branch and `/ (root)`, then Save.
6. GitHub will provide the public website URL after deployment.

## Game modes
- **Open Play:** games may repeat; the last two selections are avoided when possible to reduce back-to-back repetition.
- **No-Repeat Round:** every game is selected once per round. A new round becomes available only after all ten games have appeared.

## Data and privacy
Game history and round progress are stored in the browser's local storage on the device being used. No server or external database is used. Clearing browser data or using another device will not carry over the session.

## Notes
- The website is static and does not require a backend.
- The wheel artwork is a custom SVG illustration.
- This is a standalone event website.


## Festive visual update
The website uses venue and rangoli photography, a custom Diwali wheel illustration, and a photo for each game. The welcome overlay includes canvas fireworks; pointer interactions create small gold sparkles; winning launches celebratory fireworks/confetti; losing shows a playful dud-firecracker animation. Effects are created locally in CSS/JavaScript without animation libraries.

Game and reward photos are hosted by Unsplash, so an internet connection is needed to load those images.
