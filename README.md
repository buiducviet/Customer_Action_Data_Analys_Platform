# CUSTOMER DATA ANALYS PLATFORM

## About this project

- I made this project to learn how to collect and analytic data from custom action in web platform. In this project, I made an E-commerce platform (a fashion shop ) that allow customer buy fashion items online and shop ower can manage their shop in automatic way. Shop owner can mange shop's products,orders and customers's information. I'm updating the data analytic part of the website that allow shop owner see the processed data about the online shop traffic.


## Technologies
- Frontend : Reactjs 18.2.0

- Backend : Nodejs v21.7.1
            MySQL 

- Data Analys: Snowplow micro 2.0.0

- Others: Docker 26.1.3
         
               

## How to install and test 

### If you haven't installed Reactjs, Nodejs, start here
[How to start with reactjs](https://react.dev/learn/installation)

### Install npm
[How to install npm](https://docs.npmjs.com/cli/v10/commands/npm-install)

### Install Docker
[How to install Docker](https://docs.docker.com/engine/install/)

### Run your app
- Open project folder's terminal and run this command to install necessary packages
    ```terminal
    npm install
    ```

- Open server terminal and run this command to start node server
    ```terminal
    npm start
    ```
- Open frontend terminal and run this command to start vite service
    ```terminal
    npm run dev
    ```

### Data analys
- In this project, I only use micro snowplow for testing and debugging
[All about micro snowplow](https://docs.snowplow.io/docs/testing-debugging/snowplow-micro/)


- Open snowplow/micro terminal and run this commad
``` terminal 
docker run -p 9090:9090 \
  --mount type=bind,source={path to shemas folder} \
  snowplow/snowplow-micro:2.0.0
```

- 9090 is micro default port

- If no error occurs, you can see tracking result in http://localhost:9090/micro/ui

- In snowplow, tracking data is saved in JSON format and devide into two types
***good event***: http://localhost:9090/micro/good
***bad event*** : http://localhost:9090/micro/bad

## Process raw data and push them into mongoDB database
1. Pull mongoDB image from Docker
2. Run this command
```terminal
docker run -d -p 27017:27017 --name mymongodb mongo
```
3. Run two python files in customdata folder and see the tracking result.


