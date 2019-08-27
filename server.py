from flask import Flask, request, render_template, url_for, send_from_directory, redirect
from werkzeug.utils import secure_filename
import os
import csv
import json
import cnn_test as cnn

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads/'
ALLOWED_EXTENSIONS = set(['jpg', 'jpeg'])
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
           
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(app.root_path + '/static/images', 'favicon.ico')
         
         
@app.route('/', methods=['GET', 'POST'])
def home():
    return render_template('login.html')


@app.route('/index', methods=['GET', 'POST'])
def render_index():
    return render_template('index.html')


@app.route('/forum', methods=['GET', 'POST'])
def render_forum():
    return render_template('forum.html')


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
        print('not alowed')
    print('opppsss')
    
if __name__ == '__main__':
    app.run(debug=True)