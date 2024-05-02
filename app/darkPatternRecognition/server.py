from flask import Flask, request
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
    return predictDarkPattern(data["text"])

if __name__ == '__main__':
    app.run(port=5000) 
