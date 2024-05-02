from flask import Flask, request, jsonify
from flask_cors import CORS
from Recognition import predictDarkPattern, initialize_models

#---API for Prediction---
app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "*"}})

# initialize models
initialize_models()

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  
    print("---------")
   
    result = predictDarkPattern(data)  # Assuming data is the array of text elements
    print("---------")
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5000) 
