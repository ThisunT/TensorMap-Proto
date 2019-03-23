from flask import Flask, make_response, send_file, send_from_directory
from flask import request
from flask_cors import CORS
import nn

app = Flask(__name__)
CORS(app)

@app.route('/process', methods=['GET', 'POST'])
def run_nueral_network():
    if request.method == 'POST':
        data = request.get_json()
        return str(nn.predict_digit_accuracy(data['epochs'], data['learningRate'], data['activation']))


