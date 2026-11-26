# CollabPM – Plateforme collaborative de gestion de projets

## Présentation

**CollabPM** est une application web collaborative conçue pour faciliter la gestion des projets, l'organisation des tâches et le suivi de leur avancement au sein d'une équipe.

La plateforme permet aux utilisateurs de collaborer efficacement grâce à une interface intuitive, un système de gestion des rôles et une authentification sécurisée.

Le projet est développé avec **Angular** pour le Frontend et **Spring Boot** pour le Backend, avec une base de données **MySQL**.

## Fonctionnalités principales

### Authentification et gestion des utilisateurs
- Inscription et connexion des utilisateurs.
- Authentification sécurisée avec JWT.
- Gestion des comptes utilisateurs.
- Attribution et gestion des rôles.

### Gestion des projets
- Création, consultation, modification et suppression des projets selon les permissions.
- Consultation des détails d'un projet.
- Gestion des membres associés aux projets.

### Gestion des tâches
- Création et modification des tâches.
- Affectation des tâches aux membres.
- Suivi de l'état d'avancement.
- Organisation des tâches sous forme de tableau Kanban.

### Collaboration
- Ajout et consultation des commentaires.
- Suivi des activités liées aux tâches.
- Collaboration entre les membres d'une équipe.

### Tableau de bord
- Visualisation des statistiques.
- Suivi global des projets et des tâches.
- Consultation des informations importantes depuis une interface centralisée.

## Gestion des rôles et permissions

La plateforme propose trois rôles principaux :

| Rôle | Permissions |
|---|---|
| **ADMIN** | Gestion complète des utilisateurs, projets et tâches. |
| **PROJECT_MANAGER** | Consultation des projets et gestion des tâches dans les projets auxquels il appartient, selon ses permissions. |
| **MEMBER** | Consultation des projets et des tâches, ajout de commentaires et modification du statut des tâches qui lui sont affectées. |

## Technologies utilisées

### Frontend
- Angular
- TypeScript
- HTML5
- CSS3

### Backend
- Java
- Spring Boot
- Spring Security
- JWT (JSON Web Token)
- Maven

### Base de données
- MySQL

### Outils de développement
- IntelliJ IDEA
- Postman
- Git
- GitHub

## Architecture du projet

Le projet est organisé en deux parties principales :

```text
CollabPM/
│
├── CollabPM backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── .../
│   │       │       ├── api/
│   │       │       │   ├── controller/
│   │       │       │   ├── dto/
│   │       │       │   ├── mapper/
│   │       │       │   └── exception/
│   │       │       ├── application/
│   │       │       │   ├── service/
│   │       │       │   └── interface/
│   │       │       ├── domain/
│   │       │       │   ├── entity/
│   │       │       │   └── enum/
│   │       │       ├── repository/
│   │       │       └── security/
│   │       └── resources/
│   └── pom.xml
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
└── README.md
```

## Installation et exécution

### Prérequis

Avant de lancer le projet, il faut installer :

- JDK 25
- Maven
- Node.js et npm
- Angular CLI
- MySQL

### 1. Cloner le repository

```bash
git clone https://github.com/syrine-likihel/CollabPM.git
cd CollabPM
```

### 2. Configurer la base de données

Créer une base de données MySQL :

```sql
CREATE DATABASE collabpm_db;
```

Configurer ensuite les paramètres de connexion à la base de données dans le fichier `application.properties` du Backend.

Ne pas publier ce fichier s'il contient des informations sensibles.

### 3. Lancer le Backend

Ouvrir un terminal dans le dossier Backend :

```bash
cd "CollabPM backend"
mvn spring-boot:run
```

Le Backend sera accessible à l'adresse :

`http://localhost:8080`

### 4. Lancer le Frontend

Ouvrir un deuxième terminal :

```bash
cd collabpm-frontend
npm install
ng serve
```

Le Frontend sera accessible à l'adresse :

`http://localhost:4200`

## Sécurité

La sécurité de l'application repose notamment sur :

- Spring Security pour la sécurisation des endpoints.
- JWT pour l'authentification.
- La gestion des rôles et des autorisations.
- Le contrôle d'accès aux fonctionnalités selon les permissions des utilisateurs.

## Tests

Les API Backend ont été testées avec **Postman**, notamment pour vérifier :

- L'authentification.
- Les opérations CRUD.
- La gestion des utilisateurs.
- La gestion des projets et des tâches.
- Les réponses en cas d'erreurs et d'accès non autorisé.

## Auteur

**Likihel Syrine**

Étudiante en 3ème année Licence en Sciences de l'Informatique  
Spécialité : Génie Logiciel et Système d'Information  
ISLAI Béja

---

*CollabPM – Simplifier la collaboration, organiser les projets et suivre les tâches efficacement.*
