from flask import Flask, request, jsonify
from flask_cors import CORS
from Recognition import initialize_model
from googletrans import Translator
from langdetect import detect

# Initialize the model
modelRandomForest = initialize_model()

#simulate a model from DarkPattern
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

    return jsonify({'prediction': prediction_str})
    

if __name__ == '__main__':
    app.run(port=5000) 
