from flask import Flask, request, jsonify

app = Flask(__name__)

# Route pour effectuer des prédictions
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  # Les données à analyser (par exemple, le texte)
    #prediction = modelRandomForest.predict(data)  # Utilisation du modèle pour faire une prédiction
    prediction = testModel(data)
    return jsonify({'prediction': prediction})

if __name__ == '__main__':
    app.run(port=5000)  # Démarrer le serveur Flask sur le port 5000
