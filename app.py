from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np
import pandas as pd
import os

app = Flask(__name__)

# Load the pre-trained model and pipeline
MODEL_FILE = "model.pkl"
PIPELINE_FILE = "pipeline.pkl"

try:
    model = joblib.load(MODEL_FILE)
    pipeline = joblib.load(PIPELINE_FILE)
    print("✅ Model and pipeline loaded successfully!")
except FileNotFoundError:
    print("❌ Error: Model files not found. Please train the model first.")
    model = None
    pipeline = None

@app.route('/')
def home():
    """Render the main page"""
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    """Handle prediction requests"""
    try:
        if model is None or pipeline is None:
            return jsonify({
                'error': 'Model not loaded. Please train the model first.'
            }), 500
        
        # Get data from the form
        data = request.get_json()
        
        # Extract features
        features = {
            'longitude': float(data['longitude']),
            'latitude': float(data['latitude']),
            'housing_median_age': float(data['housing_median_age']),
            'total_rooms': float(data['total_rooms']),
            'total_bedrooms': float(data['total_bedrooms']),
            'population': float(data['population']),
            'households': float(data['households']),
            'median_income': float(data['median_income']),
            'ocean_proximity': data['ocean_proximity']
        }
        
        # Create DataFrame
        input_df = pd.DataFrame([features])
        
        # Transform and predict
        input_prepared = pipeline.transform(input_df)
        prediction = model.predict(input_prepared)[0]
        
        # Return prediction
        return jsonify({
            'success': True,
            'prediction': float(prediction),
            'formatted_prediction': f"${prediction:,.2f}"
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/health')
def health():
    """Health check endpoint for Render"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)