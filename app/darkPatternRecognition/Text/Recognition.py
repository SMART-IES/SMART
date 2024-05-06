from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

from flask import jsonify
from langdetect import detect

import numpy as np
import pandas as pd
import os
import pickle
import re
from pathlib import Path

# Model parameters
n_estimators = 150

# dataset
base_path = Path(__file__).parent
dataset_en = "dataset.tsv"
dataset_fr = "dataset_francais.tsv"
base_url = "url.csv"

url_path = (base_path / ("url.csv")).resolve()
dataset_path_en = (base_path / ("../Text/" + dataset_en)).resolve()
dataset_path_fr = (base_path / ("../Text/" + dataset_fr)).resolve()

def make_pickle_file(filetype,filename):
    return (base_path / ("../Text/pickle/" + filetype + filename + ".pickle")).resolve().__str__()

# function to create model (for determining whether a text is a dark pattern or not) => binary classifier
def initialize_and_train_binary_classifier(dataset_path,filename):
    try:
        filenamewithoutformat = re.findall(filename,dataset_path.__str__())[0].replace('.tsv','')

        print("Looking for an existing Dark Pattern classifier model trained on " + filenamewithoutformat)

        modelRandomForest = pickle.load(open(make_pickle_file("binaryClassifier",filenamewithoutformat), "rb"))

        print("Model was found\n")
    except (OSError) as e:
        print("Model was not found, training a new one...")

        #get the training data
        data = pd.read_csv(dataset_path, sep='\t')

        #split data into training and testing subsets
        data.dropna(subset=['text'], inplace=True)
        x = data['text']
        y = data['label']

        #create random forest model, train it
        X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)

        modelRandomForest = make_pipeline(TfidfVectorizer(), RandomForestClassifier(n_estimators=n_estimators, criterion="gini", max_features=None, random_state=42))
        modelRandomForest.fit(X_train, y_train)

        ## evaluate the accuracy
        ## predictions = modelRandomForest.predict(X_test)

        ## accuracy = accuracy_score(y_test, predictions)
        ## print(f"Accuracy: {accuracy}")

        picklefile = make_pickle_file("binaryClassifier",filenamewithoutformat)
        pickle.dump(modelRandomForest, open(picklefile, "wb"))
        print("Done! New model saved on the file " + picklefile + "\n")

    #return the trained model
    return modelRandomForest

def initialize_and_train_category_classifier_model(label_encoder, dataset_path,filename):
    try:
        filenamewithoutformat = re.findall(filename,dataset_path.__str__())[0].replace('.tsv','')

        print("Looking for an existing model trained on " + filenamewithoutformat + "")

        modelRandomForest = pickle.load(open(make_pickle_file("categoryClassifier",filenamewithoutformat), "rb"))

        print("Model was found\n")
    except (OSError) as e:
        print("Model was not found, training a new one...")

        data = pd.read_csv(dataset_path, sep='\t')

        # Drop rows with missing values in 'text' and 'Pattern Category' columns
        data.dropna(subset=['text', 'Pattern Category'], inplace=True)

        # Split data into features (x), labels (y), and additional variable (z)
        x = data['text']
        z = data['Pattern Category']
        y = data['label']

        # Transform string labels to numerical labels using the provided LabelEncoder
        z_encoded = label_encoder.transform(z)

        # Split data into training and testing subsets
        X_train, X_test, y_train, y_test, z_train, z_test = train_test_split(x, y, z_encoded, test_size=0.2, random_state=42)

        # Initialize the model with provided parameters
        modelRandomForest = make_pipeline(TfidfVectorizer(), RandomForestClassifier(n_estimators=n_estimators, criterion="entropy", max_features=None, random_state=42))

        # Train the model
        modelRandomForest.fit(X_train, z_train)

        picklefile = make_pickle_file("categoryClassifier",filenamewithoutformat)
        pickle.dump(modelRandomForest, open(picklefile, "wb"))
        print("Done! New model saved on the file " + picklefile + "\n")

    # Return the trained model
    return modelRandomForest

def initialize_category_encoder(dataset_path):
    data = pd.read_csv(dataset_path, sep='\t')

    # Drop rows with missing values in 'text' and 'Pattern Category' columns
    data.dropna(subset=['text', 'Pattern Category'], inplace=True)

    # Split data into features (x), labels (y), and additional variable (z)
    x = data['text']
    z = data['Pattern Category']
    y = data['label']

    label_encoder = LabelEncoder()

    # Fit LabelEncoder on the combined set of string labels
    label_encoder.fit(z)

    return label_encoder

def decode_labels(label_encoder, encoded_labels):
    # Ensure that encoded_labels is at least 1D array
    encoded_labels = np.atleast_1d(encoded_labels)

    # Decode the labels
    decoded_labels = label_encoder.inverse_transform(encoded_labels)

    # Convert the decoded labels to a list
    decoded_labels_list = decoded_labels.tolist()

    return decoded_labels_list

# function to detect the language of a text
def detect_lang(text):
    try:
        lang = detect(text)
        return lang
    except:
        return "en"

# function to initialize the models
def initialize_text_models():
    global modelRandomForest_en
    global modelRandomForest_fr
    global modelRandomForestCategory_en
    global modelRandomForestCategory_fr
    global category_encoder_en
    global category_encoder_fr

    #initialize the models
    modelRandomForest_en = initialize_and_train_binary_classifier(dataset_path_en, dataset_en)
    modelRandomForest_fr = initialize_and_train_binary_classifier(dataset_path_fr, dataset_fr)

    category_encoder_en = initialize_category_encoder(dataset_path_en)
    category_encoder_fr = initialize_category_encoder(dataset_path_fr)

    modelRandomForestCategory_en = initialize_and_train_category_classifier_model(category_encoder_en, dataset_path_en, dataset_en)
    modelRandomForestCategory_fr = initialize_and_train_category_classifier_model(category_encoder_fr, dataset_path_fr, dataset_fr)

# function to check if a text is a dark pattern
def checkDarkPattern(input):
    lang = detect_lang(input)

    if lang == "en":
        prediction = modelRandomForest_en.predict([input])[0] 
        prediction_str = str(prediction)  

        prediction_category = modelRandomForestCategory_en.predict([input])[0] 
        prediction_category_decoded = decode_labels(category_encoder_en, prediction_category)

        return {'prediction': prediction_str, 'category': prediction_category_decoded}

    else:
        prediction = modelRandomForest_fr.predict([input])[0] 
        prediction_str = str(prediction)  

        prediction_category = modelRandomForestCategory_fr.predict([input])[0] 
        prediction_category_decoded = decode_labels(category_encoder_fr, prediction_category)

        return {'prediction': prediction_str, 'category': prediction_category_decoded}

# function to predict if a website contains dark patterns
def predictDarkPattern(text_elements, url):
    results = []
    # add in file url.csv the url and number of elements
    data = pd.read_csv(url_path, sep=',')

    coeff = 0
    nbTextElement = 0
    nbDarkPattern = 0

    nbDarkPatternUrgency = 0            
    nbDarkPatternObstruction = 0       
    nbDarkPatternSneaking = 0           
    nbDarkPatternForcedAction = 0       
    nbDarkPatternScarcity = 0           
    nbDarkPatternMisdirection = 0       
    nbDarkPatternSocialProof = 0        

      
    for text_element in text_elements['texts']:
        text = text_element['text']
        tag = text_element['tag']
        result = checkDarkPattern(text)
        #quantity of all text elements 
        nbTextElement += 1
        if result['prediction'] == '1':
            nbDarkPattern += 1
        results.append(checkDarkPattern(text))

        #quantity of dark patterns and PonderationCoeff
        if result['category'] == ['Urgency']:
            if nbDarkPatternUrgency == 0:
                coeff += 1
            nbDarkPatternUrgency += 1
        if result['category'] == ['Obstruction']:
            if nbDarkPatternObstruction == 0:
                coeff += 2
            nbDarkPatternObstruction += 1
        if result['category'] == ['Sneaking']:
            if nbDarkPatternSneaking == 0:
                coeff += 2
            nbDarkPatternSneaking += 2
        if result['category'] == ['Forced Action']:
            if nbDarkPatternForcedAction == 0:
                coeff += 3
            nbDarkPatternForcedAction += 1
        if result['category'] == ['Scarcity']:
            if nbDarkPatternScarcity == 0:
                coeff += 1
            nbDarkPatternScarcity += 1
        if result['category'] == ['Misdirection']:
            if nbDarkPatternMisdirection == 0:
                coeff += 1
            nbDarkPatternMisdirection += 1
        if result['category'] == ['Social Proof']:
            if nbDarkPatternSocialProof == 0:
                coeff += 1
            nbDarkPatternSocialProof += 1

    score = (nbDarkPattern/nbTextElement) * coeff
    print("coff : ", coeff)
    print("Score: ", score)

    # add in file url.csv the url and score 
    if data['url'].str.contains(url).any():
        url_index = data[data['url'] == url].index
        data.loc[url_index, 'score'] = score
        data.to_csv(url_path, sep=',', index=False)

    else:
        new_row = pd.DataFrame({'url': [url], 'score': [score]})
        data = pd.concat([data, new_row], ignore_index=True)
        data.to_csv(url_path, sep=',', index=False)

    
    return results, score