## Personal Space

This project is built on MERN Stack deployed [here](https://enigmatic-fjord-75959.herokuapp.com/).

## Features

1. Authentication and Authorization using PassportJS and JSON Web Tokens.
2. Customized personal profile page.
3. Add and Delete Notes.
4. Auth using Google / FB / Github etc. (To be added).

## Steps to Directly Deploy the APP on HEROKU. :heart:

1. Create an account on Heroku.
2. Install Heroku CLI and Login through cli.
3. Clone this repo.
4. Get inside the root directory.
5. Type `heroku create 'app_name'` to create a new Heroku app. Once done check the Heroku Console. Your app should be listed there.
6. In the console click on the 'app*name', then click on Settings. Here Click \_Reveal Config Vars*.
7. Add the following two secrets exactly as given below.:exclamation:

```shell
key: MONGODB_URI, value: 'Your DB connection string from MongoDB'
key: JWT_SECRET_KEY, value: 'any_secret_key_string'
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
