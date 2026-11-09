# StudentConnect local restoration and demo

This is the six-person StudentConnect team project. The restored application source matches the master branch used for the M5 presentation. This update adds reproducible local setup helpers and demo documentation; it does not deploy a public application or change the original application source.

## Start locally

Prerequisites: Node.js/npm and a local Docker daemon. Validated here with Node 24.22.1, npm 11.9.0, Linux and MongoDB 7. Docker commands deliberately select the local Unix socket. Windows/macOS installation was not tested.

From the repository root:

```bash
bash docs/restoration/install.sh
bash docs/restoration/start.sh
```

The install uses the committed lockfile with TLS/integrity checks enabled. Startup validates/reuses only the labelled demo container, publishes MongoDB on loopback port 27017, and starts Express on port 3000. Express serves the built React app and API. It creates a separate synthetic database and a persistent Docker volume. Do not expose this server publicly. Do not reuse a production database URI.

In another terminal:

```bash
python3 docs/restoration/smoke.py
```

This exercises real API/database flows and creates new synthetic accounts each run. Test account details are written to `/tmp/studentconnect-demo-users.json`. The password is deliberately synthetic and public. It does not clear databases. Avoid running tests against any old data.

Optional live React development frontend:

```bash
bash docs/restoration/dev.sh
```

It binds to loopback port 3001, proxies API requests to 3000, and uses a runtime helper to correct CRA 5's undefined allowed-host issue without disabling host checks. Port 3000 must be available for the backend. Keep existing user files/processes intact if ports or container names conflict.

## Validation

- Production build passed with existing lint/CRA/dependency warnings.
- Backend Jest: 9 suites / 23 tests passed. Some are mocked/helper tests.
- Real API smoke passed: registration, correct/incorrect login, create/join/list courses, announcements, questions, replies, answered reaction and karma increment, task create/list/complete/delete.
- Chromium browser checks passed: landing, six team links, login/home, task creation, courses, course content, question/reply view, profile, and no uncaught exceptions.
- Live development frontend and proxied API returned expected responses.

Backend suite, from `application`:

```bash
URI=mongodb://127.0.0.1:27017/studentconnect_synthetic DB_URI=mongodb://127.0.0.1:27017/studentconnect_synthetic CI=true npm run test:backend -- --runInBand
```

## Fictional portfolio content

For believable presentation data, run `node docs/restoration/seed-portfolio.mjs` after starting the local database. It creates fictional Maya Chen (`maya.chen`), instructor Alex Rivera (`prof.rivera`), Jordan Patel, Software Engineering and Database Systems courses, office-hours announcements, an API-design discussion and study tasks. It is separate from the random identifiers used by automated smoke checks. Example addresses use the reserved `.test` domain; no real student records are used.

The fixture password is deliberately public test data. Account details are saved outside the checkout at `/tmp/studentconnect-portfolio-users.json`. The seeder reuses only its own matching fixture identities, refuses username/course ownership collisions, and does not clear data. The recorded demo uses a brief “fictional demo data” note rather than placeholder wording throughout the app.

## Attribution and demo

Luke Thilgen (LucaT445) was Back End Lead. Git history records initial server/database setup (`8ed143b`), user CRUD (`8de7b87`), course endpoints (`b755e99`), class chatter endpoints (`67b64a0`), Q&A endpoints (`f858c37`), and further endpoint/schema work (`ade3bf8`). These are historical contributions, not a claim that Luke alone implemented every final route. Teammates subsequently developed and integrated the final app.

Original team: Kao Saephan (Team Lead), Collins Gichohi (Front End Lead), Sean Ibarra Diaz (Scrum Master), Zacharia Angha (Git Master / backend support), Luke Thilgen (Back End Lead), Salvador Avila (Front End Assist).

[Watch or download the demo](studentconnect-demo.mp4). See [DEMO.md](DEMO.md) for the slower, captioned demo structure. All displayed accounts/content are synthetic. Restoration was prepared with Codex assistance; original team authorship is retained.

## Remaining limitations

AI chat fails: no API key/service access was configured, and the code references the legacy gemini-1.0-pro model. It needs a supported integration and separate credential/cost review. No AI responses are simulated.

This is a local development restoration, not a public-ready deployment. Server-side authentication/authorization is incomplete, some API responses serialize full user documents, and a legacy diagnostic file contains an old credential. Do not run `application/backend/mongoConnectionTest.mjs`. Credential rotation/history handling requires a separate authorized process. No credentials or real user data were reused for restoration.

Profile-picture updates, malformed input, concurrency, comprehensive access controls, mobile/accessibility and every UI action were not fully tested. No remote AWS changes, new paid services, pushes or deployment were performed. Current cloud environment draft persistence failed; these repository helpers are independently reviewable and must not be described as a published environment snapshot.
