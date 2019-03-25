from flask import Flask
from flask import request
from flask_cors import CORS
import random
import nn
import json

exporting_threads = {}

app = Flask(__name__)
CORS(app)


@app.route('/process', methods=['GET', 'POST'])
def run_nueral_network():
    global exporting_threads

    if request.method == 'POST':
        data = request.get_json()

        thread_id = random.randint(0, 10000)
        exporting_threads[thread_id] = nn.ExportingNNThread(data['activation'], data['learningRate'], data['epochs'])
        exporting_threads[thread_id].start()

        return '%s' % thread_id

@app.route('/process/<int:thread_id>')
def process(thread_id):
    global exporting_threads

    response = {'epoch': exporting_threads[thread_id].epoch, 'testAccuracy': str(exporting_threads[thread_id].testAccuracy)}
    json_string = json.dumps(response)
    return json_string


