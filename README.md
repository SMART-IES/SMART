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
-Dataset dark patterns and their category
-Dataset text recognition

## Material
-Install JupyterNotebook, Flask, flask-cors, googletrans, langdetect, postman (optional to test API) 

## How to use
-Run server with command : python3 server.py
-In Google Chrome, click on Manage extensions, and then click on the Developer mode in the upper right corner of the web page
-Now click on the load unpacked button in the upper left corner, select the path of the folder app
-When using this plugin, click on the button "Analyze site", and wait for the result
-Click on the button "Get Number" to get the number of dark patterns

## Models for OCR
- EAST : https://github.com/argman/EAST
Download link : https://www.dropbox.com/s/r2ingd0l3zt8hxs/frozen_east_text_detection.tar.gz?dl=1

- CRNN : https://github.com/meijieru/crnn.pytorch
Download link : https://drive.google.com/drive/folders/1cTbQ3nuZG-EKWak6emD_s8_hHXWz7lAr?usp=sharing

## Note for Students

* Clone the created repository offline;
* Add your name and surname into the Readme file and your teammates as collaborators
* Complete the field above after project is approved
* Make any changes to your repository according to the specific assignment;
* Ensure code reproducibility and instructions on how to replicate the results;
* Add an open-source license, e.g., Apache 2.0;
* README is automatically converted into pdf

