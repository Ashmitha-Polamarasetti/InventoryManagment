# Inventory Management System (Admin Panel)

## Run locally (Docker Compose)

- Ensure Docker Desktop is running.
- From project root:

```
docker compose build
docker compose run --rm backend npm run migrate
docker compose run --rm backend npm run seed
docker compose up
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000/api/health

## Stack
- Frontend: Vite + React + TailwindCSS
- Backend: Node.js + Express + Knex + SQLite
- Dockerized services with Compose
- CI: GitHub Actions (build/test)

## Scripts
- Backend migrations: `docker compose run --rm backend npm run migrate`
- Backend seed: `docker compose run --rm backend npm run seed`

## Deploy to AWS
- Provision an EC2 host with Docker installed.
- Copy repo and run `docker compose up -d`.
