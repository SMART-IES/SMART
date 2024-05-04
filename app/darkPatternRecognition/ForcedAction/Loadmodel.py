import numpy as np
from sklearn.metrics import PredictionErrorDisplay
import tensorflow as tf

from pathlib import Path
from html2image import Html2Image
from urllib.parse import urlparse

from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.models import Sequential

# chargement du modele
base_path = Path(__file__).parent
modelname = "forcedactionmodel.keras"
model_path = (base_path / ("../ForcedAction/" + modelname)).resolve()
screenshots_path = (base_path / "../ForcedAction/screenshots/").resolve()

class_names = ["absent", "present"]
img_height = 926
img_width = 1920

def initialize_forced_action_classifier_model():
    try:
        print("Looking for forced action classifier, please wait ...")
        global forcedActionClassifier 
        forcedActionClassifier = tf.keras.models.load_model(model_path)
        print("Model found")
        return forcedActionClassifier
    except (OSError) as e:
        print("Model not found, skipping forced action image recognition")

def getForcedActionScore(model,image):
    predictions = model.predict(image)
    score = tf.nn.softmax(predictions[0])
    
    return score

def extract_screenshot(URL):
    hti = Html2Image(output_path=screenshots_path,size=(img_width, img_height))

    print(URL)
    domainName = urlparse(URL).netloc.replace('.','_')
    print(domainName)
    
    screenshot = hti.screenshot(url=URL, save_as=(domainName + '.png'))
    print(screenshot)

    return screenshot


def predictForcedActionWithURL(URL):
    screenshot_path = extract_screenshot(URL)

    img = tf.keras.utils.load_img(screenshot_path[0], target_size=(img_height, img_width))
    img_array = tf.keras.utils.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0) # Create a batch

    score = getForcedActionScore(forcedActionClassifier, img_array)

    classe = class_names[np.argmax(score)]
    probability = 100 * np.max(score)
    
    print("This image most likely belongs to {} with a {:.2f} percent confidence.".format(classe, probability))

    return classe, probability