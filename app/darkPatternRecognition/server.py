from flask import Flask, request, jsonify
from flask_cors import CORS
from Recognition import initialize_model, initialize_model_category, initialize_category_encoder, decode_labels
from googletrans import Translator
from langdetect import detect

# dataset
dataset_path_en = "dataset.tsv"
dataset_path_fr = "dataset_français.tsv"

# Initialize the model
category_encoder_en = initialize_category_encoder(dataset_path_en)
modelRandomForest_en = initialize_model(dataset_path_en)
modelRandomForestCategory_en = initialize_model_category(category_encoder_en, dataset_path_en)

category_encoder_fr = initialize_category_encoder(dataset_path_fr)
modelRandomForest_fr = initialize_model(dataset_path_fr)
modelRandomForestCategory_fr = initialize_model_category(category_encoder_fr, dataset_path_fr)

# Simulate a model from DarkPattern
key_words = ["payer cet article en", "il ne reste plus que", "Achetez"]
def testModel(text): 
    text_lower = text.lower()  
    for word in key_words:
        if word.lower() in text_lower: 
            return "Yes"  
    return "No" 

#---API for Prediction---
app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "*"}})

def detect(text):
    try:
        lang = detect(text)
        return lang
    except:
        return "en"

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  

    #Detect language and translate to English
    lang = detect(data["text"])
    if lang == "fr":
        prediction = modelRandomForest_fr.predict([data["text"]])[0] 
        prediction_str = str(prediction)  

        prediction_category = modelRandomForestCategory_fr.predict([data["text"]])[0] 
        prediction_category_decoded = decode_labels(category_encoder_fr, prediction_category)
        return jsonify({'prediction': prediction_str, 'category': prediction_category_decoded})
    else:
        prediction = modelRandomForest_en.predict([data["text"]])[0] 
        prediction_str = str(prediction)  

        prediction_category = modelRandomForestCategory_en.predict([data["text"]])[0] 
        prediction_category_decoded = decode_labels(category_encoder_en, prediction_category)
        return jsonify({'prediction': prediction_str, 'category': prediction_category_decoded})


    

if __name__ == '__main__':
    app.run(port=5000) 
