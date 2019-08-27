import tensorflow as tf
import pandas as pd
import numpy as np
import datetime as dt
import matplotlib.pyplot as plt

from tqdm import tqdm
import os
import sys
import random
import warnings
import cv2
import shutil
import img_proc as im

import keras

from sklearn.model_selection import train_test_split
from keras.preprocessing import image
from keras.preprocessing.image import ImageDataGenerator
from keras.applications import inception_v3
from keras.applications.inception_v3 import InceptionV3
from keras.applications.inception_v3 import preprocess_input as inception_v3_preprocessor
from keras.layers import Dropout, GlobalAveragePooling2D
from keras.layers import Dense
from keras.models import Model
from keras.callbacks import ModelCheckpoint


warnings.filterwarnings('ignore')
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
np.random.seed(7)

start = dt.datetime.now()
working_path = os.path.join(os.getcwd(), 'Data/')
strModelFileName = os.path.join(working_path, 'Models/InceptionV3_Sgd.h5')

BATCH_SIZE = 16
EPOCHS = 15
TESTING_SPLIT=0.3
NUM_CLASSES = 120
IMAGE_SIZE = 256


def copyFileSet(strDirFrom, strDirTo, arrFileNames):
	arrBreeds = np.asarray(arrFileNames['breed'])
	arrFileNames = np.asarray(arrFileNames['id'])

	if not os.path.exists(strDirTo):
		os.makedirs(strDirTo)

	for i in tqdm(range(len(arrFileNames))):
		strFileNameFrom = strDirFrom + arrFileNames[i] + ".jpg"
		strFileNameTo = strDirTo + arrBreeds[i] + "/" + arrFileNames[i] + ".jpg"

		if not os.path.exists(strDirTo + arrBreeds[i] + "/"):
			os.makedirs(strDirTo + arrBreeds[i] + "/")

			# As a new breed dir is created, copy 1st file 
			# to "test" under name of that breed
			if not os.path.exists(working_path + "test/"):
				os.makedirs(working_path + "test/")

			strFileNameTo = working_path + "test/" + arrBreeds[i] + ".jpg"
			shutil.copy(strFileNameFrom, strFileNameTo)

		shutil.copy(strFileNameFrom, strFileNameTo)

def createModelInceptionV3():
#  model.layers[0].trainable = False
#  model.compile(optimizer='sgd', 
#    loss='categorical_crossentropy', 
#    metrics=['accuracy']) 

	base_model = InceptionV3(weights = 'imagenet', 
		include_top = False, 
		input_shape=(IMAGE_SIZE, IMAGE_SIZE, 3))
			
	x = base_model.output
	x = GlobalAveragePooling2D()(x)

	x = Dense(512, activation='relu')(x)
	predictions = Dense(NUM_CLASSES, 
	activation='softmax')(x)

	model = Model(inputs = base_model.input, 
		outputs = predictions)

	for layer in base_model.layers:
		layer.trainable = False

#  model.compile(optimizer='adam', 
#    loss='categorical_crossentropy', 
#    metrics=['accuracy']) 
	model.compile(optimizer='sgd', 
		loss='categorical_crossentropy', 
		metrics=['accuracy'])
			
	model.summary()      
			
	return(model)

# Make sure that previous "best network" is deleted.
def deleteSavedNet(best_weights_filepath):
	if(os.path.isfile(best_weights_filepath)):
		os.remove(best_weights_filepath)
		print("deleteSavedNet():File removed")
	else:
		print("deleteSavedNet():No file to remove")


if __name__ == '__main__':

	# Load labels from csv file.
	labels = pd.read_csv(os.getcwd() + '/Data/labels.csv')
	print(labels.head())

	# Divide labels into 70 / 30 for train id's and validation id's
	train_ids, valid_ids = train_test_split(labels, test_size = TESTING_SPLIT)
	print(len(train_ids), 'train ids', len(valid_ids), 'validation ids')
	print('Total', len(labels), 'testing images')
	# Set all dog images into train valid and test folders (known input for keras)
	copyFileSet(working_path + "all_images/", working_path + "train/", train_ids)
	copyFileSet(working_path + "all_images/",  working_path + "valid/", valid_ids)
	
	train_datagen = ImageDataGenerator(
		preprocessing_function=im.preprocess,
		#rescale=1./255, # done in preprocess()
		# randomly rotate images (degrees, 0 to 30)
		rotation_range=30,
		# randomly shift images horizontally 
		# (fraction of total width)
		width_shift_range=0.3, 
		height_shift_range=0.3,
		# randomly flip images
		horizontal_flip=True,  
		vertical_flip=False,
		zoom_range=0.3)

	val_datagen = ImageDataGenerator(
		preprocessing_function=im.preprocess)

	train_gen = train_datagen.flow_from_directory(
		working_path + "train/", 
		batch_size=BATCH_SIZE, 
		target_size=(IMAGE_SIZE, IMAGE_SIZE), 
		shuffle=True,
		class_mode="categorical")

	val_gen = val_datagen.flow_from_directory(
		working_path + "valid/", 
		batch_size=BATCH_SIZE, 
		target_size=(IMAGE_SIZE, IMAGE_SIZE), 
		shuffle=True,
		class_mode="categorical")

	deleteSavedNet(strModelFileName) 
	model = createModelInceptionV3()
	checkpoint = ModelCheckpoint(strModelFileName, 
		monitor='val_acc',
		verbose=1,
		save_best_only=True,
		mode='auto',
		save_weights_only=False)
	callbacks_list = [ checkpoint ]

	# TODO: Train the NN on the data from Data folder.

		# Calculate sizes of training and validation sets
	STEP_SIZE_TRAIN = train_gen.n // train_gen.batch_size
	STEP_SIZE_VALID = val_gen.n // val_gen.batch_size
	
	bDoTraining = True 

	if bDoTraining == True:
		# model.fit_generator does the actual training
		history = model.fit_generator(generator=train_gen,
			steps_per_epoch=STEP_SIZE_TRAIN,
			validation_data=val_gen,
			validation_steps=STEP_SIZE_VALID,
			epochs=EPOCHS,
			callbacks=callbacks_list)

		# --- After fitting, load the best model
		model.load_weights(strModelFileName)


		# summarize history for accuracy
		plt.plot(history.history['acc'])
		plt.plot(history.history['val_acc'])
		plt.title('model accuracy')
		plt.ylabel('accuracy')
		plt.xlabel('epoch')
		plt.legend(['acc', 'val_acc'], loc='upper left')
		plt.show()
				
		# summarize history for loss
		plt.plot(history.history['loss'])
		plt.plot(history.history['val_loss'])
		plt.title('model loss')
		plt.ylabel('loss')
		plt.xlabel('epoch')
		plt.legend(['loss', 'val_loss'], loc='upper left')
		plt.show()
			
		# TODO: Convert model to android form.

