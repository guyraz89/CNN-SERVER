import cv2
import numpy as np
import image

IMAGE_SIZE = 256

def preprocess(img):
	img = cv2.resize(img, 
		(IMAGE_SIZE, IMAGE_SIZE), 
		interpolation = cv2.INTER_AREA)
	# or use ImageDataGenerator( rescale=1./255...

	img_1 = image.img_to_array(img)
	img_1 = cv2.resize(img_1, (IMAGE_SIZE, IMAGE_SIZE), 
		interpolation = cv2.INTER_AREA)
	img_1 = np.expand_dims(img_1, axis=0) / 255.

	#img = cv2.blur(img,(5,5))

	return img_1[0]

    