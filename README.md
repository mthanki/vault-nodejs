# More precise instructions can be found on the deployment section at Heruku dashboard for app

# To deploy

1. heroku login
2. git push heroku master
   
  # In case step 2. doesn't work, add the repo to heroku
  heroku git:remote -a vault-nodejs

  # then try step 2. again