# LeadNest

A small CRM dashboard for tracking sales leads through a pipeline (new → contacted → won/lost).
Built with Angular (standalone components, TypeScript strict mode), Firebase Auth, and Firestore.

## Demo login

- **Email:** `demo@leadnest.app`
- **Password:** `Leadnest123!`

## Live demo
 `https://your-project-id.web.app`

## What's included

- Firebase Auth email/password sign-in, gating every route except `/login`.
- Create, edit, and delete leads (name, company, contact, stage).
- Dashboard with a live per-stage count strip and a searchable, filterable lead table.
- Move a lead between stages from the dashboard or its detail page.
- Per-lead notes (text + timestamp), live from Firestore.
- Firestore security rules that scope leads to the salesperson who owns them.

## 1. Install dependencies

```bash
npm install
```

## 2. Connect your Firebase project

1. Go to the [Firebase console](https://console.firebase.google.com), open your project.
2. In **Project settings > General > Your apps**, add a **Web app** if you haven't already, and copy the config object.
3. Paste those values into `src/app/core/firebase.config.ts`, replacing the placeholders:

   ```ts
   const firebaseConfig = {
     apiKey: '...',
     authDomain: '...',
     projectId: '...',
     storageBucket: '...',
     messagingSenderId: '...',
     appId: '...',
   };
   ```

4. In the Firebase console, enable:
   - **Authentication > Sign-in method > Email/Password**
   - **Firestore Database** (start in production mode; the rules below lock it down)

## 3. Create the demo user

In the Firebase console, go to **Authentication > Users > Add user**, and create:

- Email: `demo@leadnest.app`
- Password: `Leadnest123!`

(Or any email/password you prefer — just update the README and use those to sign in.)

## 4. Run it locally

```bash
npm start
```

Visit `http://localhost:4200`, sign in with the demo user, and start adding leads.

## 5. Deploy

This repo is set up for Firebase Hosting.

```bash
npm install -g firebase-tools   # if you don't already have it
firebase login
```

Edit `.firebaserc` and replace `YOUR_FIREBASE_PROJECT_ID` with your actual project ID, then:

```bash
firebase deploy --only firestore:rules,firestore:indexes
npm run build
firebase deploy --only hosting
```

Firebase CLI will print your live URL (e.g. `https://your-project-id.web.app`) — put that in the
**Live demo** section above.

## Usage guide

1. **Sign in** with the demo credentials above.
2. **Dashboard** shows a count per pipeline stage at the top, and a table of all your leads below.
3. Use the **search box** to filter by name or company, and the **stage dropdown** to filter by stage.
4. Click **New lead** to add one (name, company, contact, starting stage).
5. From the dashboard, change a lead's stage directly in its row dropdown, or open the lead to see
   its full detail page.
6. On a lead's detail page you can **edit**, **delete**, change its **stage**, and add **notes**
   (each note is timestamped and shows immediately — no page refresh needed).
7. **Sign out** from the top-right of the header.

## Project structure

```
src/app/
  core/            Firebase config, auth service/guard, lead & note services
  models/          Lead and Note TypeScript interfaces
  pages/
    login/         Sign-in screen
    dashboard/      Pipeline counts + searchable/filterable lead list
    lead-form/      Create/edit a lead
    lead-detail/     Lead detail, stage change, notes
```

## Notes on scope

This was built as a below-medium-scope take-home task, so a few things are intentionally simple:

- Search/filter is done client-side over the signed-in user's own leads (small dataset, no need for
  a search index).
- There's a single "salesperson" role — every signed-in user sees only their own leads.

See the accompanying written explanation for what would change for a production, 10k-user/day version.
