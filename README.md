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
dotnet user-secrets set "ImgBB_API_Key" "YOUR API KEY"
dotnet user-secrets set "JWT_Secret" "YOUR SECRET"
dotnet user-secrets set "SendGrid_API_Key" "YOUR API KEY"
dotnet user-secrets set "SendGrid_Email" "Sender Email Address"
dotnet user-secrets set "OpenAI_API_Key" "YOUR API KEY" 
dotnet user-secrets set "ConnectionStrings_DefaultConnection" "Host=localhost; Port=5432; Database=familyplanner; Username=familyplanner; Password=familyplanner"
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

## Production Setup

### Environmemnt Variables
This project requires the following environment variables to be set in the production environment:

### Database Configuration
- `ConnectionStrings_DefaultConnection` : connection strings to the database
    **Example**: `Host=<host>; Port=<port>; Database=<database name>; Username=<database usename>; Password=<passowrd>`

### API Keys
- `SendGrid_Email` : sender email address for sending email to users
- `SendGrid_API_Key` : API Key for using SendGrid
- `OpenAI_API_Key` : API Key for using OpenAI
- `ImgBB_API_Key` : API Key for using ImgBB
- `JWT_Issuer` : JWT Issuer
    **Example**: `http://localhost:5107`
- `JWT_Audience`: JWT Audience
    **Example**: `http://localhost:3000`
- `JWT_AppName`: JWT AppName
    **Example**: `FamilyMealPlanner`
- `JWT_RefreshTokenName`: JWT Refresh Token Name
    **Example**: `FMPToken`
- `JWT_Secret`: JWT Secret
    **Example**: `dummy-jwt-secret-xxxxxxxxxxxxxxx`