from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

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

