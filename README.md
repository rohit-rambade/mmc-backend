## Installation
### Backend

##### **Prerequsites**

1. [VS Code Download](https://code.visualstudio.com/download) - Download according to your OS requirements
2. [Node Js Download](https://nodejs.org/en) - Got to this link and install the latest **LTS Version(only)** Note - Current Version are generally unstable, please use LTS Only.
Once Installed, check the instalation by running the followiung commands from your terminal

3. [PostgreSQL Download](https://www.postgresql.org/download/) - PostgreSQL database server up and running.


##### **Getting Started**

1. Clone the repository to your local machine:
```bash
git clone <repository_url>
cd <repository_name>
```
2. Install the required packages using npm:
```bash
npm install
```
3. Set Up the .env File:
* Create a .env file in the root directory of your project.

* Add your database credentials and other sensitive information to the .env file. 
Example:
```bash
# Postgres 
DB_USER=postgres-user (eg. postgres)
DB_PASSWORD=db-password
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=db-name (eg. testdb)

# Port
PORT=5000



```

##### **Usage**
Access your API endpoints using a tool like **Postman** or by making HTTP requests from your frontend application.
[Postman Download](https://www.postman.com/downloads/)
