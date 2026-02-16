// Form handling
const form = document.getElementById('predictionForm');
const predictBtn = document.getElementById('predictBtn');
const btnText = predictBtn.querySelector('.btn-text');
const btnLoader = predictBtn.querySelector('.btn-loader');
const resultCard = document.getElementById('resultCard');
const errorCard = document.getElementById('errorCard');
const formCard = document.querySelector('.form-card');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Show loading state
    predictBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'block';
    
    // Hide previous results
    resultCard.style.display = 'none';
    errorCard.style.display = 'none';
    
    // Collect form data
    const formData = {
        longitude: parseFloat(document.getElementById('longitude').value),
        latitude: parseFloat(document.getElementById('latitude').value),
        housing_median_age: parseFloat(document.getElementById('housing_median_age').value),
        total_rooms: parseFloat(document.getElementById('total_rooms').value),
        total_bedrooms: parseFloat(document.getElementById('total_bedrooms').value),
        population: parseFloat(document.getElementById('population').value),
        households: parseFloat(document.getElementById('households').value),
        median_income: parseFloat(document.getElementById('median_income').value),
        ocean_proximity: document.getElementById('ocean_proximity').value
    };
    
    try {
        // Make API request
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Show result
            document.getElementById('resultValue').textContent = data.formatted_prediction;
            
            // Hide form and show result with animation
            formCard.style.display = 'none';
            resultCard.style.display = 'block';
            
            // Scroll to result
            resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // Show error
            throw new Error(data.error || 'Prediction failed');
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('errorMessage').textContent = error.message;
        formCard.style.display = 'none';
        errorCard.style.display = 'block';
        errorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } finally {
        // Reset button state
        predictBtn.disabled = false;
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
    }
});

// Reset form function
function resetForm() {
    formCard.style.display = 'block';
    resultCard.style.display = 'none';
    formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Hide error function
function hideError() {
    formCard.style.display = 'block';
    errorCard.style.display = 'none';
    formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Add sample data button functionality (optional)
function loadSampleData() {
    document.getElementById('longitude').value = '-122.23';
    document.getElementById('latitude').value = '37.88';
    document.getElementById('housing_median_age').value = '41';
    document.getElementById('total_rooms').value = '880';
    document.getElementById('total_bedrooms').value = '129';
    document.getElementById('population').value = '322';
    document.getElementById('households').value = '126';
    document.getElementById('median_income').value = '8.3252';
    document.getElementById('ocean_proximity').value = 'NEAR BAY';
}

// Input validation
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', function() {
        if (this.value < 0) {
            this.value = 0;
        }
    });
});