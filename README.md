<div id="top"></div>

<h1 align="center">Local architectures for gamified learning and educational assesment</h1>

  <p align="center">
    Design and deployment of local and robust architectures based on wireless connectivity, as well as development of microservices and multi-device web applications and design of user interfaces based on utility.
    <br />
    <a href="https://github.com/TIGE-UPM/LoGaQuiz"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/TIGE-UPM/LoGaQuiz">View Demo</a>
    ·
    <a href="https://github.com/TIGE-UPM/LoGaQuiz/issues">Report Bug</a>
    ·
    <a href="https://github.com/TIGE-UPM/LoGaQuiz/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
   <li>
      <a href="#filestruc">File structure</a>
   </li>
   <li>
      <a href="#download">Downloading the app</a>
   </li>
    <li>
      <a href="#launch">Launching the app</a>
   </li>
  </ol>
</details>



<!-- GETTING STARTED -->
<div id="filestruc"></div>

## 1. File Structure 

In this repository we have recompiled the source code of the test app, where tests can be created, edited and played.

### 1.1 server.js and api.js

In these files, the HTTP requests sent from the frontend are handled.

<p align="right">(<a href="#top">back to top</a>)</p>

### 1.2 controllers/

In this folder, the functions for handling the HTTP requests are stored. It contains three files: auth.js, game.js and test.js, that handle requests for authentication, test playing and test creation respectively.


<p align="right">(<a href="#top">back to top</a>)</p>


### 1.3 db/

In this folder, the database is initialized with the ``index.js`` file and stored. It also contains the ``models.js`` file, where the models for the database are defined, and the ``test.js`` file, where the functions that handle the database are defined.

<p align="right">(<a href="#top">back to top</a>)</p>


### 1.4 settings/

In this folder, the settings for the test app are stored. 

<p align="right">(<a href="#top">back to top</a>)</p>


### 1.5 utils/

In this folder, the functions used to establish if the HTTP request is from a Player or an Admin are stored.

<p align="right">(<a href="#top">back to top</a>)</p>


<div id="download"></div>

## 2. Downloading the app

In order to download the app, first the repository must be cloned. Then, inside the cloned folder, the ``npm install`` command must be executed. This command will install all the dependencies of the app.


<p align="right">(<a href="#top">back to top</a>)</p>

<div id="launch"></div>

## 3. Launching the app

In order to launch the app after downloading the repository, the ``npm start`` command must be executed. This command will start the app.

<p align="right">(<a href="#top">back to top</a>)</p>