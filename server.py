import os
#Funcionalidades para el WebService
from flask import Flask, jsonify, request, render_template
#Manipulación de imagenes
from io import BytesIO
from PIL import Image
from scipy.misc import imresize
import base64
#Manejo de vectores y matrices
import numpy as np
#Keras para cargar y usar el modelo
import keras
from keras.models import load_model
from keras import backend as K
K.set_image_dim_ordering('th')

#Configuración del WebService
app = Flask(__name__)
app.debug = True

#Se carga la red neuronal
graph = K.get_session().graph
cnn = load_model('model.h5')

#EndPoints

@app.route('/')
def index():
    return render_template('index.html')

#Convierte la imagen a Escala de grises
def toGray(img):
    return np.dot(img[...,:3], [0.333, 0.333, 0.333])

@app.route('/upload', methods=['POST'])
def upload():
    data = request.form['img']
    #La imagen se recibe desde la petición en formato base64
    #Procesamiento de la imagen
    #Se convierte a imagen
    img = Image.open(BytesIO(base64.b64decode(data)))
    #Se pasa la imagen a 28x28 pixeles
    img = imresize(img, (28,28,3))
    gray = toGray(img)
    #Normalización de los pixeles
    gray = gray / 255
    #Ultimos ajustes para pasarsela al modelo
    x = gray.reshape(1, 1, 28, 28)
    #Predicciones en probabilidades
    with graph.as_default():
        prediction = cnn.predict(x)
        label = cnn.predict_classes(x)
    #Se envia el resultado en jSON
    return jsonify(status = 'true', number = label.tolist()[0], probabilities = prediction.tolist()[0])

@app.route('/test', methods=['POST'])
def test():
    print(request.form)
    return jsonify(status = 'ok')

#Evita que Chrome almacene en cache la aplicación
@app.after_request
def add_header(response):
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response

    #Prediccion

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
