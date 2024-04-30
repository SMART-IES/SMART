from flask import Flask, request, jsonify
from flask_cors import CORS
from Recognition import initialize_model

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

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  
    prediction = modelRandomForest.predict([data["text"]])[0] 
    prediction_str = str(prediction)  
    return jsonify({'prediction': prediction_str})

if __name__ == '__main__':
    app.run(port=5000) 
