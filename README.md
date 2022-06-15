# construction-phasing-tutorial

# THIS IS A WORK IN PROGRESS!

![Platforms](https://img.shields.io/badge/Web-Windows%20%7C%20MacOS%20%7C%20Linux-lightgray.svg)
[![Data-Management](https://img.shields.io/badge/Data%20Management-v1-green.svg)](http://developer.autodesk.com/)

[![MIT](https://img.shields.io/badge/License-MIT-blue.svg)](http://opensource.org/licenses/MIT)
[![Level](https://img.shields.io/badge/Level-Basic-green.svg)](http://developer.autodesk.com/)


## Thumbnail

![thumbnail](https://raw.githubusercontent.com/JoaoMartins-Forge/construction-phasing-tutorial-docs/main/assets/images/complete.gif)

## Description

This sample leverages the new [Dashboard](https://forge-tutorials.autodesk.io/tutorials/dashboard/) and the Node version of [Simple Viewer](https://forge-tutorials.autodesk.io/tutorials/simple-viewer/) tutorials (with a few modifications) to create a construction phasing sample.
Feel free to also use .NET version and [Hubs Browser](https://forge-tutorials.autodesk.io/tutorials/hubs-browser/).

Especifically in this repo, we're using the minimal configuration to store only what's really important (the content under wwwroot/extensions folder).

The sample is based in a configuration defined by a csv in order to map all the available elements in viewer, then categorize them into different tasks.
It uses frappe/gantt as dependency.
We also need to handle inputs and messages with client, so we're going with [sweetalert2](https://sweetalert2.github.io) for that.

Here you can check the documentation of the library selected: https://frappe.io/gantt

We're using cdn to reference the required static files on client side.

To make this sample generic, we take advantage of a `config.json` and an input `csv`.

The `config.json` file specify the way the sample connect the model data with the csv data, and also how it will override the colors of the model to represent the current progress.

The input `csv` file defines the tasks that will appear on the GANTT chart.

### We can divide this sample in 2 main features:

1. Generate the GANTT chart based on `csv` input, with elements correlated to tasks
2. Generate a graphic representation of the progress on the model based on the GANTT chart (overriding elements colors).


## Live version

You can run this sample live here:

https://joaomartins-forge.github.io/construction-phasing-tutorial/wwwroot/index.html

and the recording demonstrating how to run here:

https://www.youtube.com/watch?v=

# Web App Setup

## Prerequisites

1. **Forge Account**: Learn how to create a Forge Account, activate subscription and create an app at [this tutorial](http://learnforge.autodesk.io/#/account/).
2. **Base App**: A basic app from our new tutorial. This can be either [Simple Viewer](https://forge-tutorials.autodesk.io/tutorials/simple-viewer/) or [Hubs Browser](https://forge-tutorials.autodesk.io/tutorials/hubs-browser/). Select any of them (in NODE or .NET) as a base to integrate with client side. This extension is based on [Basic Extension](https://forge-tutorials.autodesk.io/tutorials/dashboard/basic), also available on our new tutorial.

To use this sample, you need an Autodesk developer credentials. Visit the [Forge Developer Portal](https://developer.autodesk.com), sign up for an account, then [create an app](https://developer.autodesk.com/myapps/create). For this new app, use **http://localhost:3000/api/forge/callback/oauth** as Callback URL. Finally take note of the **Client ID** and **Client Secret**.

Please, refer to the tutorial below for more details.

https://joaomartins-forge.github.io/construction-phasing-tutorial-docs/

## License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT). Please see the [LICENSE](LICENSE) file for full details.

## Written by

João Martins [@JooPaulodeOrne2](http://twitter.com/JooPaulodeOrne2), [Developer Advocate and Support](http://forge.autodesk.com)
