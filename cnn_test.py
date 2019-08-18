from keras.models import Model
from keras.models import load_model
from keras.layers import *
from keras import backend as K
import os
import numpy as np
import sys
import pandas as pd
import matplotlib.pyplot as plt
import cv2
import tensorflow as tf
from keras.preprocessing import image

IMAGE_SIZE = 256
working_path = os.path.join(os.getcwd(), 'Data/')
strModelFileName = os.path.join(working_path, 'Models/InceptionV3_Sgd.h5')
labels = pd.read_csv(working_path + 'labels.csv')
breeds = np.unique(labels['breed'])
map_characters = {}

for i in range(len(breeds)):
    map_characters[i] = breeds[i].replace('_', ' ')

def predict(fileName):
    
    model = load_model(strModelFileName)
    img_path = os.path.join(working_path, 'test/' + fileName)
    img = image.load_img(img_path) #basset.jpg")
    img_1 = image.img_to_array(img)
    img_1 = cv2.resize(img_1, 
        (IMAGE_SIZE, IMAGE_SIZE), 
        interpolation = cv2.INTER_AREA)
    img_1 = np.expand_dims(img_1, axis=0) / 255.

    y_pred = model.predict(img_1)
    Y_pred_classes = np.argmax(y_pred,axis = 1) 
    y_pred_ids = y_pred[0].argsort()[-5:][::-1]
    for i in range(len(y_pred_ids)):
        print('\n\t' + map_characters[y_pred_ids[i]] + ' (' + str(y_pred[0][y_pred_ids[i]] * 100) + '%)')
    # fig, ax = plt.subplots()
    # ax.imshow(img) 
    # ax.axis('off')
    # print(map_characters[Y_pred_classes[0]])
    # ax.set_title(map_characters[Y_pred_classes[0]])
    # plt.show()
    K.clear_session()
    return map_characters[Y_pred_classes[0]]

if __name__ == '__main__':
    predict(sys.argv[1])