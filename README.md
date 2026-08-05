# Oleevia DocFlow

Vite + React deploy package for Oleevia DMS (document / purchase-request workflow).

## Live demo

- **Production:** https://oleevia-docflow.vercel.app
- **GitHub:** https://github.com/gouthamnath-ai/OleeviaDMS

## Finish deploying the full app

The scaffold (Vite, `main.jsx`, `logo.js`, package files) is already on `main`.
The full `src/App.jsx` (~200KB with the embedded logo) must be pushed from the
`oleevia-deploy.zip` package:

```bash
unzip oleevia-deploy.zip
cd oleevia-deploy
git clone https://github.com/gouthamnath-ai/OleeviaDMS.git
cp src/App.jsx OleeviaDMS/src/App.jsx
cd OleeviaDMS
git add src/App.jsx
git commit -m "Add full Oleevia DocFlow App.jsx"
git push origin main
```

If the Vercel project is linked to this GitHub repo, it will rebuild automatically.
Otherwise redeploy with `vercel --prod` from the project folder.

## Demo logins

| Employee ID | Password    | Role      |
|-------------|-------------|-----------|
| OGC100      | Admin@123   | Admin     |
| OGC111      | Welcome@123 | Requester |
| OGC112      | Welcome@123 | Approver  |
| OGC113      | Welcome@123 | Accounts  |

## Local run

```bash
npm install
npm run dev
```
