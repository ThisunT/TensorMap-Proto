import threading

import tensorflow as tf
from tensorflow.examples.tutorials.mnist import input_data


class ExportingNNThread(threading.Thread):
    def __init__(self, activation, learningRate, epochs):
        self.testAccuracy = 0
        self.epoch = 0
        self.activation = activation
        self.learningRate = learningRate
        self.epochs = epochs
        super().__init__()

    def run(self):
        # Your exporting stuff goes here ...
        mnist = input_data.read_data_sets("MNIST_data/", one_hot=True)

        x = tf.placeholder(tf.float32, shape=[None, 784])

        y_ = tf.placeholder(tf.float32, [None, 10])

        W = tf.Variable(tf.zeros([784, 10]))
        b = tf.Variable(tf.zeros([10]))

        if (self.activation == "softmax"):
            y = tf.nn.softmax(tf.matmul(x, W) + b)
        elif (self.activation == "relu"):
            y = tf.nn.relu(tf.matmul(x, W) + b)
        elif (self.activation == "tanh"):
            y = tf.nn.tanh(tf.matmul(x, W) + b)
        else:
            y = tf.nn.sigmoid(tf.matmul(x, W) + b)

        cross_entropy = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(labels=y_, logits=y))

        train_step = tf.train.GradientDescentOptimizer(float(self.learningRate)).minimize(cross_entropy)

        init = tf.global_variables_initializer()

        sess = tf.Session()

        sess.run(init)

        for i in range(int(self.epochs)):
            batch_xs, batch_ys = mnist.train.next_batch(100)
            sess.run(train_step, feed_dict={x: batch_xs, y_: batch_ys})

            correct_prediction = tf.equal(tf.argmax(y, 1), tf.argmax(y_, 1))
            accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))
            accuracyPercentage = format(sess.run(accuracy, feed_dict={x: mnist.test.images, y_: mnist.test.labels})*100)
            self.testAccuracy = round(float(accuracyPercentage), 2)
            self.epoch = i
            # print("Test Accuracy: {0}%".format(test_accuracy * 100.0))