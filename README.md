﻿# SocialMediaApp
![image](https://github.com/user-attachments/assets/55c5d940-729c-4bb8-9db9-04ce36e6d75b)
![image](https://github.com/user-attachments/assets/322e75ea-92e3-4e31-964d-1a160a03e317)

There are initial users in database you can login on app with any of them, username and passwords are in backend/.../configuration/LoadDatabaseConfiguration.
If you want to create account you will be asked to verify email on mailhog SMTP server at http://localhost:8025
After verifying account there will be multi step form to fill in information such as first name, last name, username and description for better user experience

"Friends" feature isn't implemented yet so you will be able to see every post from users

TO DO features: Friends, Notifications, Messages

 Prerequisites

Node.js (version 22 or compatible), npm (version 10 or compatible), Java JDK (version 21), and Docker (version 24.0.7 or compatible).

You can access the backend at http://localhost:8080, the frontend at http://localhost:5173, and the Mailhog SMTP server UI at http://localhost:8025.
The database hostname is 127.0.0.1, the port is 3306, and the root password is root.

Backend setup

Navigate to the backend directory: cd backend
Run the docker container: docker-compose up
Setup continuous build:
Mac/Linux ./gradlew build -t -x test
Windows gradlew.bat build -t -x test
Run the backend:
Mac/Linux ./gradlew bootRun
Windows gradlew.bat bootRun

Frontend setup

Install dependencies: npm install
Run the frontend: npm run dev

Have fun!
