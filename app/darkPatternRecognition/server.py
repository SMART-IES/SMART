from flask import Flask, request, jsonify
from flask_cors import CORS
from Text.Recognition import predictDarkPattern, initialize_text_models, checkDarkPattern
from ForcedAction.Loadmodel import initialize_forced_action_classifier_model, predictForcedActionWithURL
from urllib.parse import urlparse

#---API for Prediction---
app = Flask(__name__)
CORS(app, resources={r"/predictText": {"origins": "*"}, r"/check": {"origins": "*"}, r"/predictForcedAction": {"origins": "*"}})


initialize_forced_action_classifier_model()
initialize_text_models()

@app.route('/predictText', methods=['POST'])
def predictText():
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

@app.route('/predictForcedAction', methods=['POST'])
def predictForcedAction():
    input = request.json
    classe, probability = predictForcedActionWithURL(input)
    return [classe, probability]

if __name__ == '__main__':
    app.run(port=5000)
