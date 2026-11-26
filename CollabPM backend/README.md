# CollabPM – Plateforme collaborative de gestion de projets

## Présentation

CollabPM est une application web collaborative développée pour faciliter la gestion des projets, l'organisation des tâches et le suivi de leur avancement.

Elle propose un espace centralisé permettant aux utilisateurs de collaborer efficacement, avec un système d'authentification et de gestion des autorisations basé sur les rôles.

## Fonctionnalités principales

- Authentification et inscription des utilisateurs.
- Gestion des utilisateurs et des rôles.
- Création, consultation, modification et suppression des projets.
- Création et affectation des tâches.
- Suivi de l'avancement des tâches.
- Tableau Kanban pour visualiser les tâches selon leur statut.
- Commentaires sur les tâches.
- Tableau de bord avec indicateurs de suivi.
- Gestion des accès selon les rôles.

## Rôles et permissions

| Rôle | Description |
|---|---|
| ADMIN | Gestion complète des utilisateurs, projets et tâches. |
| PROJECT_MANAGER | Consultation des projets et gestion des tâches dans les projets auxquels il appartient. |
| MEMBER | Consultation des projets et tâches, ajout de commentaires et modification du statut des tâches qui lui sont affectées. |

## Technologies utilisées

**Frontend**
- Angular
- TypeScript
- HTML5
- CSS3

**Backend**
- Java
- Spring Boot
- Spring Security
- JWT (JSON Web Token)
- Maven

**Base de données**
- MySQL

**Outils**
- IntelliJ IDEA
- Visual Studio Code
- Postman
- Git et GitHub
- XAMPP / phpMyAdmin

## Architecture

Le projet est organisé en deux parties principales :

```text
CollabPM/
├── CollabPM backend/
│   └── src/
│       └── main/
│           ├── java/
│           └── resources/
│
├── collabpm-frontend/
│   ├── src/
│   │   └── app/
│   │       ├── components/
│   │       ├── guards/
│   │       ├── interceptors/
│   │       ├── pages/
│   │       └── services/
│   ├── angular.json
│   └── package.json
│
├── .gitignore
└── README.md
```

Le backend adopte une architecture en couches : API, application, domaine, repositories et sécurité.

## Installation et exécution

### Prérequis

- JDK 25
- Maven
- Node.js et npm
- Angular CLI
- MySQL

### 1. Base de données

Créer une base de données MySQL :

```sql
CREATE DATABASE collabpm_db;
```

Configurer les paramètres de connexion à la base de données dans le fichier local `application.properties`.

### 2. Backend

Accéder au dossier du backend :

```bash
cd "CollabPM backend"
```

Lancer l'application :

```bash
mvn spring-boot:run
```

Le backend sera accessible sur :

`http://localhost:8080`

### 3. Frontend

Ouvrir un deuxième terminal :

```bash
cd collabpm-frontend
```

Installer les dépendances :

```bash
npm install
```

Lancer le serveur Angular :

```bash
ng serve
```

Le frontend sera accessible sur :

`http://localhost:4200`

## Sécurité

La sécurité est assurée par Spring Security et JWT. Les endpoints protégés nécessitent un token valide, et les autorisations sont contrôlées selon le rôle de l'utilisateur.

## Tests

Les API REST du backend ont été testées avec Postman afin de vérifier les opérations disponibles, les réponses du serveur et les contrôles d'accès.

## Auteur

**Likihel Syrine**

Licence en Sciences de l'Informatique  
Spécialité : Génie Logiciel et Système d'Information