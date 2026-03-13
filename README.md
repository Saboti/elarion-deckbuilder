# Elarion Deckbuilder

Ein Fantasy-Kartenspiel Deckbuilder mit öffentlichen Decks, Like-System und Deck-Codes.

## Deployment mit Docker Compose

### Voraussetzungen

- Docker & Docker Compose installiert
- Git
- Port 80 frei (oder anpassen in `docker-compose.yml`)

### 1. Repository klonen

```bash
git clone <repository-url>
cd elarion-deckbuilder
```

### 2. Umgebungsvariablen konfigurieren

Kopiere die Beispiel-Konfiguration:

```bash
cp .env.example .env
```

**Wichtig: Ändere in `.env` folgende Werte für Produktion:**

```env
# Sicheres Passwort für die Datenbank
POSTGRES_PASSWORD=dein_sicheres_passwort

# Muss zum Passwort oben passen
DATABASE_URL=postgresql://elarion:dein_sicheres_passwort@postgres:5432/elarion_deckbuilder

# Generiere einen sicheren JWT-Secret (z.B. mit: openssl rand -base64 32)
JWT_SECRET=dein_geheimer_jwt_schluessel

# Deine Server-URL (ohne trailing slash)
VITE_API_URL=http://deine-domain.de
```

### 3. docker-compose.yml für Produktion anpassen

Öffne `docker-compose.yml` und ändere die hartkodierten Werte:

```yaml
services:
  postgres:
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}  # aus .env

  backend:
    environment:
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}

  frontend:
    environment:
      - VITE_API_URL=${VITE_API_URL}
```

### 4. Starten

```bash
# Im Hintergrund starten
docker compose up -d

# Logs anschauen
docker compose logs -f
```

Die App ist jetzt unter `http://deine-server-ip` erreichbar.

### 5. Stoppen

```bash
docker compose down
```

Daten bleiben erhalten (PostgreSQL Volume). Zum vollständigen Reset:

```bash
docker compose down -v
```

## Architektur

```
                    ┌─────────────┐
                    │   Nginx     │
                    │   Port 80   │
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               │
    ┌─────────────┐ ┌─────────────┐        │
    │  Frontend   │ │  Backend    │        │
    │  (Vite)     │ │  (Node.js)  │        │
    │  :5173      │ │  :3001      │        │
    └─────────────┘ └──────┬──────┘        │
                           │               │
                           ▼               │
                    ┌─────────────┐        │
                    │  PostgreSQL │        │
                    │  :5432      │        │
                    └─────────────┘        │
```

- **Nginx**: Reverse Proxy, routet `/` zum Frontend und `/api` zum Backend
- **Frontend**: React/Vite SPA
- **Backend**: Node.js/Express mit Prisma ORM
- **PostgreSQL**: Datenbank für User, Decks, Likes

## Nützliche Befehle

```bash
# Container-Status
docker compose ps

# In Container einloggen
docker compose exec backend sh
docker compose exec postgres psql -U elarion -d elarion_deckbuilder

# Datenbank-Migrationen manuell ausführen
docker compose exec backend npx prisma db push

# Rebuild nach Code-Änderungen
docker compose up -d --build
```

## HTTPS/SSL (Optional)

Für HTTPS empfehle ich einen Reverse Proxy wie Traefik oder Caddy vor dem Setup, oder die nginx.conf anzupassen und Zertifikate (z.B. via Let's Encrypt/Certbot) einzubinden.

## Troubleshooting

**Backend startet nicht?**
- Prüfe ob PostgreSQL healthy ist: `docker compose ps`
- Logs checken: `docker compose logs backend`

**Datenbank-Verbindung fehlgeschlagen?**
- `DATABASE_URL` in docker-compose.yml muss `postgres` als Host haben (nicht `localhost`)

**Frontend zeigt Fehler?**
- `VITE_API_URL` muss die öffentlich erreichbare URL sein
- Bei Änderungen: `docker compose up -d --build frontend`
