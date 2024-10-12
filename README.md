## Setting up

A database needs to be prepared, and all required dependencies need to be installed, before the project can be successfully run.

### Inside pgAdmin

First, create a user with the following credentials and permissions:

- Username `familyplanner`
- Password `familyplanner`
- Able to login

Then, create a database called `familyplanner`, owned by the user created previously (also called `familyplanner`).

Execute the following SQL to create database table for NLog, change the owner to `familyplanner`

```sql
CREATE TABLE nlogs
( 
    Id serial primary key,
    Application character varying(100) NULL,
    Logged text,
    Level character varying(100) NULL,
    Message character varying(8000) NULL,
    Logger character varying(8000) NULL, 
    Callsite character varying(8000) NULL, 
    Exception character varying(8000) NULL
)
``` 

### Inside the root directory

```bash
dotnet tool restore
npm install
```

### Inside the `backend/` directory

```bash
dotnet restore
dotnet ef database update
dotnet user-secrets set "ImgBB:API_KEY" "YOUR API KEY"
dotnet user-secrets set "JWT:SECRET" "YOUR SECRET"
dotnet user-secrets set "SendGrid:API_KEY" "YOUR API KEY"
dotnet user-secrets set "SendGrid:Email" "Sender Email Address"
dotnet user-secrets set "HuggingFace:API_KEY" "YOUR API KEY" 
```

### Inside the `frontend/` directory
create a .env file by referring to .env.template

```bash
npm install
```

## Running the project

To run the project locally, the backend and frontend should be started separately.

### Inside the `backend/` directory

```bash
dotnet watch run
```

### Inside the `frontend/` directory

```bash
npm start
```

## During Development
After changing any Models/Data

### Add and Update migrations
```bash
dotnet ef migrations add <YOUR MIGRATION NAME HERE>
dotnet ef database update
```
