from flask import Flask, request, jsonify
from flask_cors import CORS
from Recognition import predictDarkPattern, initialize_models, checkDarkPattern
from urllib.parse import urlparse

#---API for Prediction---
app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "*"}, r"/check": {"origins": "*"}})

# initialize models
initialize_models()

@app.route('/predict', methods=['POST'])
def predict():
    request_data = request.json
    
    # Separate data and url from request JSON
    url = request_data['url']
    # get the hostname from the url
    parsed_url = urlparse(url)
    hostname = parsed_url.hostname

    print("---------")
   
    result = predictDarkPattern(request_data, hostname)  # Assuming data is the array of text elements
    print("---------")
    return jsonify(result)

@app.route('/check', methods=['POST'])
def check():
    input = request.json
    result = checkDarkPattern(input)
    return jsonify(result)


if __name__ == '__main__':
    app.run(port=5000) 
