# Momments-Backend
Dieses Projekt enthält jeglichen Quellcode für das Backend des Momments-Prototypen der Masterarbeit von Robin Dürhager mit dem Titel `Konzeption multimodaler Kommunikationsmöglichkeiten zum Austausch zwischen Musikern beim zeit- und ortsunabhängigen, kollaborativen Komponieren`.

> **Hinweis:** Dieses Projekt wird für den Betrieb des Projekts `momments-frontend` benötigt.
> 
## Aufsetzen des Projekts (Fokus auf Entwicklungsmodus / lokales aufsetzen)
1. Kopiere dieses Projekt in einen Ordner deiner Wahl
2. Gehe in das Projekt per `cd momments-backend`
3. Kopiere `example.env.development` in `.env`
4. Fülle in `.env` die fehlenden Informationen für die [AWS S3](https://aws.amazon.com/de/s3/) Verbindung aus
5. Starte über `docker compose up momments-db` die PostgreSQL 16.9 Datenbank. Alternativ kann auch eine eigene lokale PostgreSQL Datenbank verwendet werden.
7. Führe `npm install` aus, um alle nötigen NodeJS Module zu installieren
8. Führe `npx prisma db push` aus, damit die Datenbanktabellen für das Prisma ORM Schema in der Datenbank erstellt werden
9. Führe `npx prisma db seed` aus, um die Datenbank mit Testnutzern zu füllen
10. Führe `npm run dev` aus

## Projektstruktur
Im Folgenden wird die Ordnerstruktur dargestellt und über Kommentare kurz und prägnant erläutert, um die Erweiterbarkeit dieses Projekts zu verbessern. Weitere Dateien, wie die `package*.json` Dateien und diese `README.md` Datei wurden aus Platzgründen ausgelassen. Die `package.json` definiert dieses NodeJS Projekt und stellt beispielsweise alle verwendeten Bibliotheken und ihre Versionen dar.

```bash
momments-backend/
├── docker-compose.yml              # Definition des Backends + Datenbank als Docker Container (bspw. für die Produktion)
├── Dockerfile                      # Packetierung des Backends als Docker Container zum einfachen Deployen auf einem Server
├── example.env.development         # Template für eine .env zum lokalen Aufsetzen des Projekts im Entwicklungsmodus
├── example.env.production          # Template für eine .env für den Produktionsmodus, in dem SSL Informationen (private key und fullchain + Domain) verwendet werden müssen
├── prisma                          # Ordner mit Dateien für das Prisma ORM
│   ├── migrations                  # SQL Migrationsdateien, die von Prisma ORM erstellt wurden
│   ├── schema.prisma               # Schema für die Datenbankdefinition, die zu den Migrationsdateien führte
│   └── seed.ts                     # Seed Skript, um die Datenbank mit Testnutzern zu befüllen
├── public                          # Ordner mit Dateien, die ohne Authentifizierung zugänglich sein sollten (Avatarbilder der Testnutzer)
│   ├── testuser1.png
│   └── testuser2.png
├── src                             # Ordner für die gesamte Geschäftslogik
│   ├── controller                  # Sammlung jeglicher Controller zur Verwaltung der Datenbank (z.B. DiscussionController)
│   ├── db                          # Ordner für verschiedene Persistierungsstrategien (S3 Client + Prisma ORM Client für Datenbankanbindung)
│   ├── index.ts                    # Einstiegspunkt für das Backend
│   ├── middleware                  # Sammlung von Middleware für das Backend (Authentifizierungsmiddleware für die Abschottung bestimmter Routen, wie z.B. Erstellung von Diskussionen)
│   ├── routes                      # Sammlung von REST API Routern für die einzelnen Datenbankentitäten 
│   ├── types                       # Erweiterung des ExpressJS Frameworks, sodass die Authentifizierungsmiddleware an einem Request eine userId anhängen kann, sodass diese nicht von jeder Route neu ermittelt werden muss
│   └── utils                       # Weitere Helfermodule, wie globale Variablen und Typdefinitionen 
├── ssl                             # SSL Ordner für das Deployen des Backends im Produktionsmodus, bspw. für einen Nutzertest
│   └── momments-example-domain.org # Die URL des Backends muss dabei als Ordner im Backendprojekt angelegt werden mit privkey.pem und fullchain.pem für SSL-Verschlüsselung
└── tsconfig.json                   # TypeScript Konfigurationsdatei
```

## Abhängigkeiten
Hier werden Abhängigkeiten aufgelistet, die nicht über die `package.json` Datei direkt einsehbar sind. Für Bibliotheksabhängigkeiten sollte die `package.json` Datei konsultiert werden.

* Für das Projekt wurde NodeJS in der Version 22.11.0 verwendet
* Zudem wird eine Anbindung zu einem [AWS S3](https://aws.amazon.com/de/s3/) Bucket (Die Dateispeicherkomponente) benötigt
* Als Datenbank wird PostgreSQL in der Version 16.9 verwendet. Spätere Versionen sollten allerdings auch klappen, solange die Datenbank eine `UTF-8` Kodierung unterstützt.