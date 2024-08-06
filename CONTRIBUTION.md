# Contribution Guidelines

Thank you for your interest in contributing to our project! To ensure a smooth and collaborative workflow, please follow these guidelines.

## Table of Contents
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
    - [Creating a New Feature](#creating-a-new-feature)
    - [Branch Naming Convention](#branch-naming-convention)
    - [Issues](#issues)
    - [Pull Requests](#pull-requests)
    - [Merging Changes](#merging-changes)
    - [Code Style](#code-style)
- [Running Tests](#running-tests)
- [Contact](#contact)

## Project Structure

- **Frontend:** Angular with Bootstrap for UI styling
- **Backend:** NestJS, TypeORM, SQLite for database, and Swagger for API documentation

## Getting Started

### Prerequisites

- Node.js (v16.x or higher)
- npm (v7.x or higher)
- Angular CLI
- NestJS CLI

### Setup

1. **Clone the repository:**
   ```bash
      git clone git@github.com:alexErh/tictactoe_online.git
      cd tictactoe_online
    ```
2. **Install dependencies:**
    
   ```bash
      cd backend
      npm install
      cd ..
      cd frontend
      npm install
    ```
3. **Running the backend:**

   Once the installation process is completed, you can run one of the following commands at your command prompt (within backend directory) to start the backend listening for inbound HTTP requests:
      
   ```bash
     # development
     npm run start
   
     # watch mode
     npm run start:dev
        
     # production mode
     npm run start:prod
   ```
4. **Running the frontend**
    
    Once the installation process is completed, you can run the following command at your command prompt (within frontend directory) to start the frontend:
    
    ```bash
      npm run start
   ```

## How to Contribute
### Issues
- Before creating a new issue, please check if it already exists.
- Clearly describe the issue and provide steps to reproduce it if possible.
### Branch Naming Convention
- The branch name should follow this format:
    ```bash
  [issue number]-[issue]-[name]
    ```
### Creating a New Feature
- To create a new feature, you should work on a separate branch.
- Create a new branch using the following command:
    ```bash
  git checkout -b [issue number]-[issue]-[name]
    ```
  For example, a branch to create a login page on the frontend side:
    ```bash
  git checkout -b 23-frontend-login-page
    ```
### Merging Changes
- Before merging your changes to the `main` branch, you must crate a Merge Request (MR) in GitHub.
- Create a Merge Request using the GitHub interface and request a review from at least one other developer.
- Once the Merge Request is approved, you can merge the changes using the following commands:
    ```bash
    git checkout main
    git pull origin main
    git merge [your-branch-name]
    git push origin main
    ```
  Sometimes Merge Conflicts are acquiring. In this case please check this [GitHub Documentation](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts/resolving-a-merge-conflict-using-the-command-line) or research, how you can resolve them in your IDE.

## Running Tests
    
- Frontend:
    ```bash
  cd frontend
  npm test
    ```
- Backend:
  ```bash
  cd backend
  npm test
  npm test:watch
  npm test:cov
  npm test:debug
    ```