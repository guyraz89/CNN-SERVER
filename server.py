from flask import Flask, request, render_template, url_for, send_from_directory, redirect, session
from werkzeug.utils import secure_filename
import os
import csv
import json
import cnn_test as cnn
from google.oauth2 import id_token
from google.auth.transport import requests


app = Flask(__name__)
app.secret_key = 'DogSecretDog'
UPLOAD_FOLDER = 'uploads/'
ALLOWED_EXTENSIONS = set(['jpg', 'jpeg'])
HTTP_REQUEST = requests.Request()
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def getBreeds():
    try:
        breeds=[]         #an empty list to store the second column
        with open('Data/labels.csv', 'r') as rf:
            reader = csv.reader(rf, delimiter=',')
            for row in reader:
                breeds.append(row[1])
    except FileNotFoundError as err:
        print(err)
    
    breed_set = list(set(breeds))
    for i in range(len(breed_set)):
        breed_set[i] = breed_set[i].replace('_', ' ')
        
    return breed_set


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


def index_verified():
    return render_template('index.html')

        
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(app.root_path + '/static/images', 'favicon.ico')
         
         
@app.route('/', methods=['GET', 'POST'])
def home():
    return render_template('login.html')


@app.route('/index', methods=['GET', 'POST'])
def render_index():
    if request.method == 'POST':
        idToken = request.headers['Authorization'].split(' ')[0]
        claims = id_token.verify_firebase_token(idToken, HTTP_REQUEST)
        if not claims:
            return redirect('logout')
        session['Logged'] = True
        return 'Logged'
    else:
        print('Logged in : ', session['Logged'])
        if session['Logged'] == True:
            return render_template('index.html')
        
        return redirect('logout')


@app.route('/logout', methods=['GET'])
def logout():
    session['Logged'] = False
    return redirect('/')


@app.route('/forum', methods=['GET'])
def render_forum():
    if session['Logged'] == True:
        return render_template('forum.html')
    else:
        return redirect('logout')


@app.route('/js/<path:filename>')
def js_static(filename):
    return send_from_directory(app.root_path + '/static/js/', filename)


@app.route('/css/<path:filename>')
def css_static(filename):
    return send_from_directory(app.root_path + '/static/css/', filename)

@app.route('/images/<path:filename>')
def images_static(filename):
    return send_from_directory(app.root_path + '/static/images/', filename)


@app.route('/breeds', methods=['POST'])
def serv_breeds():
    if request.method == 'POST':
        return json.dumps(getBreeds())


@app.route('/upload', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        file = request.files['file']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            pred = cnn.predict(file.filename)
            print(pred)
            return pred
        print('File should be jpg or jpeg')
    
if __name__ == '__main__':
    app.run(debug=True)