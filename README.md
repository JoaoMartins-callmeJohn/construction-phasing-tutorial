# Construction-Schedule

![Platforms](https://img.shields.io/badge/Web-Windows%20%7C%20MacOS%20%7C%20Linux-lightgray.svg)
[![Data-Management](https://img.shields.io/badge/Data%20Management-v1-green.svg)](http://developer.autodesk.com/)

[![MIT](https://img.shields.io/badge/License-MIT-blue.svg)](http://opensource.org/licenses/MIT)
[![Level](https://img.shields.io/badge/Level-Basic-green.svg)](http://developer.autodesk.com/)


## Thumbnail

![thumbnail](https://raw.githubusercontent.com/JoaoMartins-Forge/construction-phasing-tutorial-docs/main/assets/images/complete.gif)

## Description

This sample demonstrates a way to add a Gantt chart with tasks connected to the elements of the loaded model. It leverages the new [Dashboard](https://forge-tutorials.autodesk.io/tutorials/dashboard/) and the [Simple Viewer](https://forge-tutorials.autodesk.io/tutorials/simple-viewer/) tutorials (with a few modifications).
Feel free to also use .NET version and [Hubs Browser](https://forge-tutorials.autodesk.io/tutorials/hubs-browser/) if you prefer.

Especifically in this repo, we're using the minimal configuration to store only what's really important (the content under wwwroot/extensions folder).

The sample is based in a configuration defined by a csv in order to map all the available elements in viewer, then categorize them into different tasks.
It uses [frappe/gantt](https://frappe.io/gantt) as dependency.

To make this sample generic, we take advantage of a `config.json` and an input `csv`.

You can find a csv to test with the model loaded [here](https://raw.githubusercontent.com/JoaoMartins-Forge/construction-phasing-tutorial/main/samples/sample.csv)

The `config.json` file specify the way the sample connect the model data with the csv data, and also how it will override the colors of the model to represent the current progress.

The input `csv` file defines the tasks that will appear on the GANTT chart.

### We can divide this sample in 2 main features:

1. Generate the GANTT chart based on `csv` input, with elements connected to the tasks defined.
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

## Running locally

You can take advantage of this extension by adding the `phasingExtension.js`, `PhasingPanel.js`and `config.js` files in your app.
You can add those under `wwwroot/extensions` folder, if you want to take advantage of [Simple Viewer](https://forge-tutorials.autodesk.io/tutorials/simple-viewer/) or [Hubs Browser](https://forge-tutorials.autodesk.io/tutorials/hubs-browser/) tutorials.
It's also requires to reference [SweetAlert2](https://sweetalert2.github.io) library in index.html:
```html
...
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
...
```

And reference the extension in vieweration (for the tutorials, it's done at `wwwroot/viewer.js`):
```js
onst config = {
    extensions: [
        'PhasingExtension'
    ]
};
const viewer = new Autodesk.Viewing.GuiViewer3D(container, config);
```

## License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT). Please see the [LICENSE](LICENSE) file for full details.

## Written by

João Martins [@JooPaulodeOrne2](http://twitter.com/JooPaulodeOrne2), [Developer Advocate and Support](http://forge.autodesk.com)
