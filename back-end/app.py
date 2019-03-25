from flask import Flask
from flask import request
from flask_cors import CORS
import random
import threading
import time
import nn
import json


class ExportingThread(threading.Thread):
    def __init__(self):
        self.progress = 0
        super().__init__()

    def run(self):
        # Your exporting stuff goes here ...
        print("a")
        for _ in range(10):
            time.sleep(0.2)
            self.progress += 5

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


