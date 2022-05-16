# construction-phasing-tutorial

# THIS IS A WORK IN PROGRESS!


[![Node.js](https://img.shields.io/badge/Node.js-16.15-blue.svg)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-8.5-blue.svg)](https://www.npmjs.com/)
![Platforms](https://img.shields.io/badge/Web-Windows%20%7C%20MacOS%20%7C%20Linux-lightgray.svg)
[![Data-Management](https://img.shields.io/badge/Data%20Management-v1-green.svg)](http://developer.autodesk.com/)

[![MIT](https://img.shields.io/badge/License-MIT-blue.svg)](http://opensource.org/licenses/MIT)
[![Level](https://img.shields.io/badge/Level-Basic-green.svg)](http://developer.autodesk.com/)

## Description

This sample leverages the new [Dashboard](https://forge-tutorials.autodesk.io/tutorials/dashboard/) and the Node version of [Simple Viewer](https://forge-tutorials.autodesk.io/tutorials/simple-viewer/) tutorials to create a construction phasing sample.
Feel free to also use .NET version and [Hubs Browser](https://forge-tutorials.autodesk.io/tutorials/hubs-browser/).

It's based in a configuration defined by a csv in order to map all the available elements in viewer, then categorize them into different packages.
It uses frappe/gantt as dependency.
We also need to handle inputs and messages with client, so we're going with sweetalert2 for that.

Here you can check the documentation of the library selected: https://frappe.io/gantt

We're using cdn to reference the required static files on client side.

To make this sample generic, we take advantage of a `config.json` and an input `csv`.

The `config.json` file specify the way the sample connect the model data with the csv data, and also how it will override the colors of the model to represent the current progress.

The input `csv` file defines the tasks that will appear on the GANTT chart.

### We can divide this sample in 2 main features:

1. Generate the GANTT chart based on `csv` input, with elements correlated to tasks
2. Generate a graphic representation of the progress on the model based on the GANTT chart.

## Thumbnail

![thumbnail](/thumbnail.png)

## Live version

You can run this sample live here:

https://forge-construction-phasing-tutorial.herokuapp.com

and the recording demonstrating how to run here:

https://www.youtube.com/watch?v=

# Web App Setup

## Prerequisites

1. **Forge Account**: Learn how to create a Forge Account, activate subscription and create an app at [this tutorial](http://learnforge.autodesk.io/#/account/).
2. **Base App**: A basic app from our new tutorial. This can be either [Simple Viewer](https://forge-tutorials.autodesk.io/tutorials/simple-viewer/) or [Hubs Browser](https://forge-tutorials.autodesk.io/tutorials/hubs-browser/). Select any of them (in NODE or .NET) as a base to integrate with client side. This extension is based on [Basic Extension](https://forge-tutorials.autodesk.io/tutorials/dashboard/basic), also available on our new tutorial.

For using this sample, you need an Autodesk developer credentials. Visit the [Forge Developer Portal](https://developer.autodesk.com), sign up for an account, then [create an app](https://developer.autodesk.com/myapps/create). For this new app, use **http://localhost:3000/api/forge/callback/oauth** as Callback URL. Finally take note of the **Client ID** and **Client Secret**.

## Running locally

Install [NodeJS](https://nodejs.org), version 16.15 or newer.

Clone this project or download it (this `nodejs` branch only). It's recommended to install [GitHub desktop](https://desktop.github.com/). To clone it via command line, use the following (**Terminal** on MacOSX/Linux, **Git Shell** on Windows):

    git clone (TBD)

Install the required packages using `npm install`.

### Setup & Run

- Clone this repository
- Install dependencies: `yarn install` or `npm install`
- Setup environment variables:
  - `FORGE_CLIENT_ID` - your Forge application client ID
  - `FORGE_CLIENT_SECRET` - your Forge application client secret
  - `FORGE_BUCKET` (optional) - name of Forge bucket to store your designs in
- Run the server: `npm start`

> When using [Visual Studio Code](https://code.visualstudio.com),
you can specify the env. variables listed above in a _.env_ file in this
folder, and run & debug the application directly from the editor.

## Using the app

Open the browser: [http://localhost:8080](http://localhost:3000).

1. Once you have a model loaded, the app will require a `csv` to build the tasks.

## Deployment

To deploy this application to Heroku, the **Callback URL** for Forge must use your `.herokuapp.com` address. After clicking on the button below, at the Heroku Create New App page, set your Client ID, Secret and Callback URL for Forge.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Autodesk-Forge/forge-takeoff.exchange.csv)

## Known issues


## Tips & Tricks


## License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT). Please see the [LICENSE](LICENSE) file for full details.

## Written by

João Martins [@JooPaulodeOrne2](http://twitter.com/JooPaulodeOrne2), [Developer Advocate and Support](http://forge.autodesk.com)
