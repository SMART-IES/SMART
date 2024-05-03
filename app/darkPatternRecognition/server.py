from flask import Flask, request, jsonify
from flask_cors import CORS
from Recognition import predictDarkPattern, initialize_models, checkDarkPattern

#---API for Prediction---
app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "*"}, r"/check": {"origins": "*"}})

# initialize models
initialize_models()

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  
    print("---------")
   
    result = predictDarkPattern(data)  # Assuming data is the array of text elements
    print("---------")
    return jsonify(result)

@app.route('/check', methods=['POST'])
def check():
    input = request.json
    result = checkDarkPattern(input)
    return jsonify(result)


if __name__ == '__main__':
    app.run(port=5000) 
