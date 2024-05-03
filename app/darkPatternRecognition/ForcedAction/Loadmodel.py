import numpy as np
from sklearn.metrics import PredictionErrorDisplay
import tensorflow as tf

from pathlib import Path

from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.models import Sequential

# chargement du modele
base_path = Path(__file__).parent
modelname = "forcedactionmodel.keras"
model_path = (base_path / ("../ForcedAction/" + modelname)).resolve()

class_names = ["absent", "present"]
img_height = 926
img_width = 1920

def initialize_forced_action_classifier_model():
    try:
        print("Looking for forced action classifier, please wait ...")
        forcedActionClassifier = tf.keras.models.load_model(model_path)
        print("Model found")
        return forcedActionClassifier
    except (OSError) as e:
        print("Model not found, skipping forced action image recognition")

def getForcedActionScore(model,image):
    predictions = model.predict(image)
    score = tf.nn.softmax(predictions[0])
    
    return score

def predictForcedAction(URL):
    model = initialize_forced_action_classifier_model()
    
    # data to image

    score = getForcedActionScore(model, image)

    classe = class_names[np.argmax(score)]
    probability = 100 * np.max(score)
    
    print("This image most likely belongs to {} with a {:.2f} percent confidence.".format(classe, probability))

    return classe, probability