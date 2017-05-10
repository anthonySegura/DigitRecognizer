
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
from keras.models import load_model

#Configuración del WebService
app = Flask(__name__)
app.debug = True

#EndPoints

@app.route('/')
def index():
    return render_template('index.html')

#Convierte la imagen a Escala de grises
def toGray(img):
    return img.convert('1')

@app.route('/upload', methods = ['POST'])
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
    x = gray.reshape(1, 28, 28)

#Evita que Chrome almacene en cache la aplicación
@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response

    #Prediccion

if __name__ == '__main__':
    app.run(host = '0.0.0.0', port = 8080, debug = 'True')
