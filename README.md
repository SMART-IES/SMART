# SMART 2024 Template Repository

![Insalogo](./images/logo-insa_0.png)

Project [SMART(PLD)](riccardotommasini.com/teaching/smart) is provided by [INSA Lyon](https://www.insa-lyon.fr/).

Students: **Zeyang Kong, Hugo Saysana, Hélène Dos Santos, An Jun Tong, Florentin Koch, Seynabou Sarr**

### Abstract
Chrome extension for recognizing some commercial dark patterns on the web. 

## Description 
Dark Pattern definition : "a user interface that has been carefully crafted to trick users into doing things, such as buying overpriced insurance with their purchase or signing up for recurring bills"

## Project Goal
Inform clearly and precisely the users about the dark patterns present during their internet browsing

## Requirements
- Dataset dark patterns and their category
- Dataset text recognition
- Forced action image recognition model : either train it yourself or download it from https://filesender.renater.fr/?s=download&token=201280b9-cfea-473e-9750-6552eaebf0af or https://drive.google.com/drive/folders/19KObFhm64D3wkj8BK-OWNxWxE261t0dP?usp=drive_link and put it in ./darkPatternRecognition/ForcedAction

## Material
- Install Google Chrome on your system. If you use ubuntu, you must install chrome on your ubuntu using these commands: 
* wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
* sudo dpkg -i google-chrome-stable_current_amd64.deb

- Install python packages: JupyterNotebook, Flask, flask-cors, googletrans, langdetect, html2image, tensorflow, scikit-learn, postman (optional to test API) 

## How to use
- Generate the ForceAction model using LoadForcedActionModel.py. Model size is about 1.2GB, if you don't have enough memory to generate this model, you can use these download link: https://filesender.renater.fr/?s=download&token=201280b9-cfea-473e-9750-6552eaebf0af or https://drive.google.com/drive/folders/19KObFhm64D3wkj8BK-OWNxWxE261t0dP?usp=drive_link
- Run server with command : python3 server.py
- In Google Chrome, click on Manage extensions, and then click on the Developer mode in the upper right corner of the web page
- Now click on the load unpacked button in the upper left corner, select the path of the folder app
- When using this plugin, click on the button "Analyze site", and wait for the result
- If you want to know if a sentence is a dark pattern, enter it in the text box below and click on button check it.

## Note for Students

* Clone the created repository offline;
* Add your name and surname into the Readme file and your teammates as collaborators
* Complete the field above after project is approved
* Make any changes to your repository according to the specific assignment;
* Ensure code reproducibility and instructions on how to replicate the results;
* Add an open-source license, e.g., Apache 2.0;
* README is automatically converted into pdf

