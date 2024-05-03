from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import numpy as np
from flask import jsonify
from langdetect import detect

#Model parameters
n_estimators = 150 

# dataset
dataset_path_en = "dataset.tsv"
dataset_path_fr = "dataset_français.tsv"

#function to create model
def initialize_model(dataset_path):
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


    #return the trained model
    return modelRandomForest

def initialize_model_category(label_encoder, dataset_path):
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

def detect(text):
    try:
        lang = detect(text)
        return lang
    except:
        return "en"

def checkDarkPattern(input):
    lang = detect(input)
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

def initialize_models():
    global modelRandomForest_en
    global modelRandomForest_fr
    global modelRandomForestCategory_en
    global modelRandomForestCategory_fr
    global category_encoder_en
    global category_encoder_fr

    #initialize the models
    modelRandomForest_en = initialize_model(dataset_path_en)
    modelRandomForest_fr = initialize_model(dataset_path_fr)

    category_encoder_en = initialize_category_encoder(dataset_path_en)
    category_encoder_fr = initialize_category_encoder(dataset_path_fr)

    modelRandomForestCategory_en = initialize_model_category(category_encoder_en, dataset_path_en)
    modelRandomForestCategory_fr = initialize_model_category(category_encoder_fr, dataset_path_fr)

def predictDarkPattern(text_elements):
    results = []
    for text_element in text_elements['texts']:
        text = text_element['text']
        tag = text_element['tag']
        
        results.append(checkDarkPattern(text))

    return results



