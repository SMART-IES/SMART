from flask import Flask, request, jsonify
from flask_cors import CORS

#simulate a model from DarkPattern
key_words = ["payer cet article en", "il ne reste plus que"]
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
    #prediction = modelRandomForest.predict(data) 
    prediction = testModel(data["text"])
    return jsonify({'prediction': prediction})

if __name__ == '__main__':
    app.run(port=5000) 
