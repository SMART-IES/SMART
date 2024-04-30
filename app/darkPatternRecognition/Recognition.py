from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import numpy as np

#function to create model
def initialize_model():
    #get the training data
    data = pd.read_csv('dataset.tsv', sep='\t')

    #split data into training and testing subsets
    data.dropna(subset=['text'], inplace=True)
    x = data['text']
    y = data['label']
    X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)

    #create random forest model, train it
    modelRandomForest = make_pipeline(TfidfVectorizer(), RandomForestClassifier(n_estimators=1200, criterion="entropy", max_features=None, random_state=42))
    modelRandomForest.fit(X_train, y_train)

    #return the trained model
    return modelRandomForest

def initialize_model_category(label_encoder):
    data = pd.read_csv('dataset.tsv', sep='\t')

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
    modelRandomForest = make_pipeline(TfidfVectorizer(), RandomForestClassifier(n_estimators=1200, criterion="entropy", max_features=None, random_state=42))
    
    # Train the model
    modelRandomForest.fit(X_train, z_train)

    # Return the trained model
    return modelRandomForest

def initialize_category_encoder():
    data = pd.read_csv('app/darkPatternRecognition/dataset.tsv', sep='\t')

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

