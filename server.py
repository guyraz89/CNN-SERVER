from flask import Flask, request, render_template, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import os
import cnn_test as cnn

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads/'
ALLOWED_EXTENSIONS = set(['jpg', 'jpeg'])
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS
           
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(app.root_path + '/static/images', 'favicon.ico')
         
         
@app.route('/', methods=['GET', 'POST'])
def home():
    return render_template('index.html')


@app.route('/js/<path:filename>')
def js_static(filename):
    return send_from_directory(app.root_path + '/static/js/', filename)


@app.route('/css/<path:filename>')
def css_static(filename):
    return send_from_directory(app.root_path + '/static/css/', filename)

@app.route('/images/<path:filename>')
def images_static(filename):
    return send_from_directory(app.root_path + '/static/images/', filename)

@app.route('/<string:page_name>/')
def render_static(page_name):
    return render_template(app.root_path + '/static/pages/%s.html' % page_name)


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
        print('not alowd')
    print('opppsss')
    
if __name__ == '__main__':
    app.run(debug=True)