## Personal Space

A small social platform replication in the making.
This project is built on MERN Stack deployed [here](https://enigmatic-fjord-75959.herokuapp.com/).

## Features

1. Authentication and Authorization using PassportJS and JSON Web Tokens.
2. Customized personal profile page.
3. Add and Delete Notes.
4. Auth using Google.
5. Upload Media (Admin Only).

## Steps for Running the App Locally.

The App utilizes Mongo DB (Atlas) for storage and Google Cloud for Google Auth. Both of these require some private keys.

1. Create a Mongo DB Cluster and within that create a new Database. Then from the security tab add a new user credentials to use the DB. Once done with these steps tap on Connect App, fill the desired info. Copy the MONGODB_URL generated.

- **Note: The above steps are quite common and you can simply work them out.**
- **Still of you are STUCK anywhere, take help from [here](https://medium.com/swlh/creating-connecting-a-mongodb-database-and-node-js-server-to-a-front-end-6a53d400ae6a)**.

2. **(Optional)** This step deals with getting Keys for Google Auth. You can skip this step and just add some **random** string in GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in the steps below. Otherwise continue with the following:

- Login/SignUp to the GCP Console.
- Create a new project.
- Go to APIs and Services -> ENABLE APIs AND SERVICES.
- Select and enable Google+ API.
- Now go to Credentials from the side tab.
- Click on **Create Credentials** -> OAuth client ID.
- Select **Web Applcation**.
- Fill http://localhost:3000 under both _Authorised JavaScript origins_ and _Authorised redirect URIs_.
- Note: When deployed on a Hosting service, also add that hosting URL in the above step.
- Once done, Copy the save the Client ID and Client Secret, which we use on the nect steps.

3. Now create a new file inside the **config** folder named named as **localkeys.js**.
4. Add the following code and replace these strings with respective keys generated above:

```javascript
const MONGODB_URI = "INSERT_MONGODB_URI";
// Sample MONGODB KEY -> "mongodb+srv://<username>:<password>@cluster0-ncegj.mongodb.net/<dbname>?retryWrites=true&w=majority"
const JWT_SECRET_KEY = "INSERT_A_RANDOM_STRING";
const GOOGLE_CLIENT_ID = "INSERT_THE_GOOGLE_CLIENT_ID";
const GOOGLE_CLIENT_SECRET = "INSERT_GOOGLE_CLIENT_SECRET";

module.exports = {
  MONGODB_URI,
  JWT_SECRET_KEY,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
};
```

5. Save the file.
6. Stay in the root directory and run `npm install`. This installs server side dependecies.
7. Go to **client folder** by `cd client` and run `npm install` to install client side dependencies.
8. Now come back to the root and run `npm start` to run the server. If all goes well, you will get message on console stating _MONGODB Connected_.
9. Open another terminal and browse inside the client folder and run `npm start` to run the frontend part.
10. Browse to `http://localhost:3000`.
11. Congrats! the project is now running on your local machine.

## Steps to Directly Deploy the APP on HEROKU. :heart:

1. Create an account on Heroku.
2. Install Heroku CLI and Login through cli.
3. Clone this repo.
4. Get inside the root directory.
5. Type `heroku create 'app_name'` to create a new Heroku app. Once done check the Heroku Console. Your app should be listed there.
6. In the console click on the 'appname', then click on Settings. Here Click _Reveal Config Vars_.
7. Add the following two secrets exactly as given below.:exclamation:

```shell
key: MONGODB_URI, value: 'Your DB connection string from MongoDB'
key: JWT_SECRET_KEY, value: 'any_secret_key_string'
key: REACT_APP_GOOGLE_CLIENT_ID: 'Insert Google Client ID'
```

8. These variables are directly accessed isnside the code by `process.env.MONGODB_URI` and `process.env.JWT_SECRET_KEY`.
9. Go back to terminal.
10. Make changes if you require.
11. Add and commit changes by typing the following git commands:  
    `git add .`  
    `git commit -m "Some Description"`
12. Push to Heroku and wait for build to complete and be deployed:  
    `git push heroku master`.
13. Open the through the URL shown on terminal when the above process completes without any errors.

## :fire: Contribute

Feel free to open ISSUES and contrbutions via PRs.

### :star: Leave a star if it was helpful.

### Thank you!
