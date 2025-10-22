 # Sales Enquiry — Quick Setup & Project Info

 Short, focused information to get the project running locally (client + server) and where to find more documentation.

 ## Project structure (top-level)
 - `client/` — React + Vite frontend
 - `server/` — Node/Express backend (minimal at present)
 - `Readmi/readmi.md` — this quick setup file

 ## Prerequisites
 - Node.js (LTS recommended v18 or v20). Verify: `node -v` and `npm -v`
 - Git
 - (Optional) MongoDB if you plan to run the database locally

 ## Clone repository
 ```powershell
 cd $HOME\Projects
 git clone https://github.com/shivraj2805/Sales-Enquiry.git
 cd "Sales-Enquiry"
 ```

 ## Client (frontend) — install & run
 ```powershell
 cd .\client
 npm install
 npm run dev    # starts Vite dev server, typically at http://localhost:5173
 ```

 Build / preview production:
 ```powershell
 npm run build
 npm run preview
 ```

 Notes: `client/package.json` includes scripts: `dev`, `build`, `preview`.

 ## Server (backend) — minimal setup

 
 ```powershell
 cd .\server
 npm install
 npm install --save-dev nodemon   # optional for dev
 npm start    # or npm run dev
 ```

 ## Environment and database
 - Use `.env` files for secrets and DB URI 
 - If using MongoDB locally or Atlas, add `MONGODB_URI` and connect via `mongoose` from the server

 ## Where to find full plan
 The comprehensive project plan and full documentation live in `Readmi/Sales-Enquiry-Project-Plan.md` in this repo. Use that for detailed feature lists, team assignments, and the 6-month timeline.

 ---

 **Contact / Owner:** @shiv2805
