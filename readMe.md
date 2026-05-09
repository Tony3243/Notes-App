# Notes App(backend)

A functioning backend notes app that allows users to sign-up, log-in, log-off, and manage their notes using JWT authentication

**Tech Stack**
- node.js + Express
- JWT
- bcrypt
- postgreSQL

**Instalization**

**Prerequisites**
- Install node.js
- create a supabase

**Installation Steps**

1. Clone the Repository:
```bash
git clone: https://github.com/Tony3243/Notes-App
cd Notes app
```

2. Install Backend Dependencies
```bash
cd Backend
npm install
```
3. Set Up Environment Varaibles:
create an `.env` in the `Backend` folder

4. Create Database:
Create a `users` , `notes`, and `refresh_token` database

5. Run the application
```bash
cd Backend
nodemon server.js
```

## Features
- ✅ sign-up into a new account
- ✅ log-in into existing account
- ✅ log out of account
- ✅ get all users notes
- ✅ create new note
- ✅ update existing note
- ✅ delete note

## Design Decisions
 - Used Supabase(postgreSQL) to be eqipped with its already managed tools for making databases and it's extensivbility

 - Used JWT authentication to contest https statless returns so that traveling between states is shown to the server from an authenticated token created by a reliable user.

 - Incorporated a token refresh so that user logins aren't repetitive from the low-duration expiration times and instantly met with a new access token


## Futue Improvements

- add a database for the deleted refresh_tokens when a user logs off to resite them back later
