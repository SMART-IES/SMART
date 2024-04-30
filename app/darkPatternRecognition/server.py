from flask import Flask, request, jsonify
from flask_cors import CORS
from Recognition import initialize_model, initialize_model_category, initialize_category_encoder, decode_labels
from googletrans import Translator
from langdetect import detect

# Initialize the model
category_encoder = initialize_category_encoder()
modelRandomForest = initialize_model()
modelRandomForestCategory = initialize_model_category(category_encoder)

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

def detect_and_translate(text):
    try:
        lang = detect(text)
        if lang == 'en':
            return text
        elif lang == 'fr':
            translator = Translator()
            translated = translator.translate(text, src='fr', dest='en')
            return translated.text
        else:
            return text
    except:
        return text

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  

    #Detect language and translate to English
    translated = detect_and_translate(data["text"])
    prediction = modelRandomForest.predict([translated])[0] 
    prediction_str = str(prediction)  

    prediction_category = modelRandomForestCategory.predict([translated])[0] 
    prediction_category_decoded = decode_labels(category_encoder, prediction_category)
    return jsonify({'prediction': prediction_str, 'category': prediction_category_decoded})
    

if __name__ == '__main__':
    app.run(port=5000) 
