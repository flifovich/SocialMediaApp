# SocialMediaApp
![image](https://github.com/user-attachments/assets/55c5d940-729c-4bb8-9db9-04ce36e6d75b)
![image](https://github.com/user-attachments/assets/322e75ea-92e3-4e31-964d-1a160a03e317)
## About project

There are initial users in database you can login on app with any of them, username and passwords are in backend/.../configuration/LoadDatabaseConfiguration
If you want to create account you will be asked to verify email on mailhog SMTP server at http://localhost:8025
After verifying account there will be multi step form to fill in information such as first name, last name, username and description for better user experience

"Friends" feature isn't implemented yet so you will be able to see every post from users

TO DO features: Friends, Notifications, Messages

## Running the project on your machine

### Prerequisites

Node.js (version 22 or compatible), npm (version 10 or compatible),
Java JDK (version 21), and Docker (version 24.0.7 or compatible).

#### Backend Setup

Navigate to the backend directory:

```
cd backend
```

Run the docker containers:

```
docker-compose up
```

Set up continuous build:

_Mac/Linux:_

```
./gradlew build -t -x test
```

_Windows:_

```
gradlew.bat build -t -x test
```

Run the backend:

_Mac/Linux:_

```
./gradlew bootRun
```

_Windows:_

```
gradlew.bat bootRun
```

#### Frontend Setup

Navigate to the frontend directory:

```
cd frontend
```

Set up the necessary environment variables on frontend:

_Mac/Linux:_

```
cp .env
```

_Windows:_

```
copy .env
```
if you are changing something, make sure variable is filled in

Install dependencies:

```
npm install
```

Run the frontend in development mode:

```
npm run dev
```

Have fun!
