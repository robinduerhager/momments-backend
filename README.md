# Momments-Backend
This project contains all source code for the backend of the Momments prototype from [Robin Dürhager's](https://github.com/robinduerhager) [master's thesis](https://doi.org/10.18445/20250727-164533-0) entitled `Designing multimodal communication options for exchange between musicians during collaborative composing independent of time and location.`

> [!NOTE]
> **Dependencies of this Project**
> * [NodeJS 22.11.0](https://nodejs.org/download/release/v22.11.0/)
> * An [AWS S3](https://aws.amazon.com/de/s3/) instance
> * [PostgreSQL](https://www.postgresql.org/) Version `16.9` and `UTF-8` encoding (see `docker-compose.yml` for an already configured PostgreSQL container with [Docker](https://www.docker.com/))
> 
> **Legal Notice**
> * The images `testuser1.png` and `testuser2.png` in the `public` folder were taken from the website [Avatar Placeholder](https://avatar-placeholder.iran.liara.run/)

## Installation for Development
1. Copy this project to a folder of your choice
2. Go to the project: `cd momments-backend`
3. Copy `example.env.development` to `.env`
4. Fill in the missing information for the [AWS S3](https://aws.amazon.com/de/s3/) connection in `.env`
5. Start your `PostgreSQL 16.9` database e.g. via `docker compose up -d momments-db`
7. Run `npm install` to install all necessary NodeJS modules
8. Run `npx prisma db push` to create the database tables for the [Prisma ORM](https://www.prisma.io/) schema in the database
9. Run `npx prisma db seed` to populate the database with test users
10. Run `npm run dev`

## Project Structure
The folder structure is shown below and explained briefly in the comments to improve the extensibility of this project. Other files, such as the `package*.json` files and this `README.md` file, have been omitted for clarity.

```bash
momments-backend/
├── docker-compose.yml              # Definition of the backend + database as a Docker container (e.g., for production)
├── Dockerfile                      # Packaging the backend as a Docker container for simple deployment
├── example.env.development         # Template for an .env file for setting up the project locally in development mode
├── example.env.production          # Template for a .env file for production mode, in which SSL information (private key and full chain + domain) must be used.
├── prisma                          # Folder containing files for Prisma ORM
│   ├── migrations                  # SQL migration files created by Prisma ORM
│   ├── schema.prisma               # Schema for the database definition
│   └── seed.ts                     # Seed script to populate the database with test users
├── public                          # Folder containing files that should be accessible without authentication (e.g. avatar images of test users)
│   ├── testuser1.png
│   └── testuser2.png
├── src                             # Folder for all business logic
│   ├── controller                  # Collection of all controllers for managing the database (e.g. DiscussionController)
│   ├── db                          # Folders for different persistence strategies (e.g. S3 Client + Prisma ORM Client for database connection)
│   ├── index.ts                    # Entry point for the backend
│   ├── middleware                  # Collection of middleware for the backend (e.g. authentication middleware for isolating certain routes, such as creating discussions)
│   ├── routes                      # Collection of REST API routers for individual database entities
│   ├── types                       # Extension of the ExpressJS framework so that the authentication middleware can append a userId to a request, eliminating the need to redetermine it for each route.
│   └── utils                       # Additional utility modules, such as global variables and type definitions  
├── ssl                             # SSL folder for deploying the backend in production mode
│   └── momments-example-domain.org # The URL of the backend must be created as a folder in the backend project with privkey.pem and fullchain.pem for SSL encryption.
└── tsconfig.json                   # TypeScript configuration
```