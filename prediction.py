import warnings
warnings.filterwarnings('ignore')

from datetime import timedelta
from datetime import datetime
from datetime import date
import dateutil.parser
import sys
import random
import numpy as np
np.random.seed(21)

from sklearn import linear_model, cross_validation, metrics, svm
from sklearn.metrics import confusion_matrix, precision_recall_fscore_support, accuracy_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

import pandas as pd
import matplotlib.pyplot as plt

from sklearn.externals import joblib
clf_rf_new = joblib.load('/home/sohail/FYP/rf_prediction/rf_prediction_new.pkl')
pred_test_new = clf_rf_new.predict([sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5],sys.argv[6],sys.argv[7], sys.argv[8]])
print pred_test_new
