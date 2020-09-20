# MM - Frontend

## MoneyMinx Frontend Application

[![CircleCI](https://circleci.com/gh/Money-Minx/mm-frontend.svg?style=svg&circle-token=74eebd24d6beb116aeac5a2498366d1da543759a)](<LINK>)

## Technologies

    - we are using React+Typescript as core technology
    - bootstrap is used with customization

## Architecture

    - we are following modular architecture for development
    - App Level files can be found in app folder (routes,context, env, etc)
    - API call will be included in api folder
    - Assets: all static assets used in app
    - Common: common files used in all modules
    - Layouts: All Basic layouts
    - Website: all website level content view and logic
      - Views: presentation
      - Partials: Presentation partials
      - Inc: Presentation Includes

## Setup

    -  clone repo
    -  navigate to project folder
    -  use `npm install` or `yarn install`  for installing dependencies
    -  create .env file and copy the content on .env.dev or staging file (after api integration)
    -  start your application on dev environment `yarn start`

## Project Navigation

    - routes are temporary
    - Home page will have homepage for website
    - 404: /404 or /w/404
    - Notice: /w/notice (click on footer link)
    - Privacy: /w/privacy (click on footer link)
