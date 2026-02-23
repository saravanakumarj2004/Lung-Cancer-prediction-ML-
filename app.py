import os
import joblib
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# Ensure model exists
model_path = os.path.join(os.path.dirname(__file__), 'lung_model.pkl')
try:
    model = joblib.load(model_path)
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/how-it-works')
def how_it_works():
    return render_template('how_it_works.html')

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded.'}), 500
        
    try:
        data = request.json
        
        # Build a named DataFrame exactly as the model was trained — suppresses sklearn warning
        FEATURE_COLUMNS = [
            'GENDER', 'AGE', 'SMOKING', 'YELLOW_FINGERS', 'ANXIETY',
            'PEER_PRESSURE', 'CHRONIC_DISEASE', 'FATIGUE', 'ALLERGY',
            'WHEEZING', 'ALCOHOL', 'COUGHING',
            'SHORTNESS_OF_BREATH', 'SWALLOWING_DIFFICULTY', 'CHEST_PAIN'
        ]
        feature_values = [
            int(data.get('Gender', 0)),
            int(data.get('Age', 0)),
            int(data.get('Smoking', 0)),
            int(data.get('Yellow_fingers', 0)),
            int(data.get('Anxiety', 0)),
            int(data.get('Peer_pressure', 0)),
            int(data.get('Chronic_Disease', 0)),
            int(data.get('Fatigue', 0)),
            int(data.get('Allergy', 0)),
            int(data.get('Wheezing', 0)),
            int(data.get('Alcohol', 0)),
            int(data.get('Coughing', 0)),
            int(data.get('Shortness_of_Breath', 0)),
            int(data.get('Swallowing_Difficulty', 0)),
            int(data.get('Chest_pain', 0))
        ]
        input_data = pd.DataFrame([feature_values], columns=FEATURE_COLUMNS)

        # Determine Prediction
        prediction = model.predict(input_data)[0]
        
        # Try to get probability for confidence score calculation
        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(input_data)[0]
            # Since probabilities returns array like [prob_0, prob_1]
            confidence = probabilities[prediction] * 100
        else:
            confidence = None
            
        return jsonify({
            'success': True,
            'prediction': int(prediction),
            'confidence': round(confidence, 2) if confidence is not None else None
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
