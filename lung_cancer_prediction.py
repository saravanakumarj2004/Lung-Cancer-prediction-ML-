# Lung Cancer Prediction - Final Working Version

import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report


# ==============================
# 1️⃣ LOAD DATASET
# ==============================

df = pd.read_csv("lung_cancer_dataset.csv")

print("Dataset Loaded Successfully!\n")
print(df.head())


# ==============================
# 2️⃣ PREPROCESSING
# ==============================

# Dataset already contains numeric values (0 and 1)
# So we don't need mapping

print("\nMissing values before cleaning:\n")
print(df.isnull().sum())

# Fill missing values (if any) with 0
df = df.fillna(0)


# ==============================
# 3️⃣ FEATURE & TARGET SPLIT
# ==============================

X = df.drop('LUNG_CANCER', axis=1)
y = df['LUNG_CANCER']


# ==============================
# 4️⃣ TRAIN TEST SPLIT
# ==============================

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)


# ==============================
# 5️⃣ TRAIN MODEL (Logistic Regression)
# ==============================

model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)


# ==============================
# 6️⃣ MODEL EVALUATION
# ==============================

y_pred = model.predict(X_test)

print("\nModel Evaluation Results:")
print("Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))


# ==============================
# 7️⃣ SAVE MODEL
# ==============================

joblib.dump(model, "lung_model.pkl")
print("\nModel saved successfully as lung_model.pkl")


# ==============================
# 8️⃣ PREDICTION FUNCTION
# ==============================

def predict_lung_cancer():
    print("\nEnter Patient Details:\n")

    Gender = int(input("Gender (Male=1, Female=0): "))
    Age = int(input("Age: "))
    Smoking = int(input("Smoking (YES=1 or NO=0): "))
    Yellow_fingers = int(input("Yellow fingers (YES=1 or NO=0): "))
    Anxiety = int(input("Anxiety (YES=1 or NO=0): "))
    Peer_pressure = int(input("Peer pressure (YES=1 or NO=0): "))
    Chronic_Disease = int(input("Chronic disease (YES=1 or NO=0): "))
    Fatigue = int(input("Fatigue (YES=1 or NO=0): "))
    Allergy = int(input("Allergy (YES=1 or NO=0): "))
    Wheezing = int(input("Wheezing (YES=1 or NO=0): "))
    Alcohol = int(input("Alcohol (YES=1 or NO=0): "))
    Coughing = int(input("Coughing (YES=1 or NO=0): "))
    Shortness_of_Breath = int(input("Shortness of Breath (YES=1 or NO=0): "))
    Swallowing_Difficulty = int(input("Swallowing Difficulty (YES=1 or NO=0): "))
    Chest_pain = int(input("Chest pain (YES=1 or NO=0): "))

    x_new = [[
        Gender, Age, Smoking, Yellow_fingers, Anxiety,
        Peer_pressure, Chronic_Disease, Fatigue, Allergy,
        Wheezing, Alcohol, Coughing, Shortness_of_Breath,
        Swallowing_Difficulty, Chest_pain
    ]]

    prediction = model.predict(x_new)

    if prediction[0] == 1:
        print("\nPrediction: The patient is likely to have lung cancer.")
    else:
        print("\nPrediction: The patient is NOT likely to have lung cancer.")


# ==============================
# 9️⃣ RUN PREDICTION
# ==============================

predict_lung_cancer()