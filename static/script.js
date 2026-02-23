// script.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Particle.js Init (subtle dark mode premium effect)
    if (window.particlesJS) {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 40, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#ffffff" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.2, "random": true },
                "size": { "value": 2, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.1, "width": 1 },
                "move": { "enable": true, "speed": 1, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "bubble" }, "onclick": { "enable": false }, "resize": true },
                "modes": { "bubble": { "distance": 200, "size": 3, "duration": 2, "opacity": 0.4, "speed": 3 } }
            },
            "retina_detect": true
        });
    }

    // 2. Navigation Logic
    const welcomeSection = document.getElementById('welcome-section');
    const predictionSection = document.getElementById('prediction-section');
    const startBtn = document.getElementById('start-btn');
    const backBtn = document.getElementById('back-btn');

    startBtn.addEventListener('click', () => {
        welcomeSection.classList.replace('slide-active', 'slide-hidden');
        predictionSection.classList.replace('slide-hidden', 'slide-active');
    });

    backBtn.addEventListener('click', () => {
        predictionSection.classList.replace('slide-active', 'slide-hidden');
        welcomeSection.classList.replace('slide-hidden', 'slide-active');
    });

    // 3. Dynamic Form Field Generation
    const formFields = [
        { id: 'Smoking', label: 'Smoking History', icon: 'fa-smoking' },
        { id: 'Yellow_fingers', label: 'Yellow Fingers', icon: 'fa-hand' },
        { id: 'Anxiety', label: 'High Anxiety', icon: 'fa-brain' },
        { id: 'Peer_pressure', label: 'Peer Pressure', icon: 'fa-users' },
        { id: 'Chronic_Disease', label: 'Chronic Disease', icon: 'fa-virus-slash' },
        { id: 'Fatigue', label: 'Frequent Fatigue', icon: 'fa-bed' },
        { id: 'Allergy', label: 'Allergies', icon: 'fa-viruses' },
        { id: 'Wheezing', label: 'Wheezing', icon: 'fa-lungs' },
        { id: 'Alcohol', label: 'Alcohol Consumption', icon: 'fa-wine-glass' },
        { id: 'Coughing', label: 'Persistent Coughing', icon: 'fa-head-side-cough' },
        { id: 'Shortness_of_Breath', label: 'Shortness of Breath', icon: 'fa-wind' },
        { id: 'Swallowing_Difficulty', label: 'Difficulty Swallowing', icon: 'fa-utensils' },
        { id: 'Chest_pain', label: 'Chest Pain', icon: 'fa-heart-pulse' }
    ];

    const dynamicFieldsContainer = document.getElementById('dynamic-fields');

    // Add Age
    dynamicFieldsContainer.innerHTML += `
        <div class="input-group full-width">
            <label for="Age"><i class="fa-solid fa-person-cane"></i> Patient Age</label>
            <input type="number" id="Age" class="modern-input" name="Age" min="1" max="120" placeholder="Enter patient age (e.g., 65)" required>
        </div>
    `;

    // Add Gender
    dynamicFieldsContainer.innerHTML += `
        <div class="input-group">
            <label><i class="fa-solid fa-venus-mars"></i> Gender</label>
            <div class="toggle-group" id="toggle-Gender">
                <button type="button" class="toggle-btn gender-btn" data-val="1">Male</button>
                <button type="button" class="toggle-btn gender-btn" data-val="0">Female</button>
            </div>
            <input type="hidden" name="Gender" id="input-Gender" value="" required>
        </div>
    `;

    // Add Yes/No toggles for remaining 13 features
    formFields.forEach(field => {
        dynamicFieldsContainer.innerHTML += `
            <div class="input-group">
                <label><i class="fa-solid ${field.icon}"></i> ${field.label}</label>
                <div class="toggle-group" id="toggle-${field.id}">
                    <button type="button" class="toggle-btn" data-val="1">Yes</button>
                    <button type="button" class="toggle-btn active active-no" data-val="0">No</button>
                </div>
                <input type="hidden" name="${field.id}" id="input-${field.id}" value="0">
            </div>
        `;
    });

    // 4. Toggle Interaction Logic
    document.querySelectorAll('.toggle-group').forEach(group => {
        const btns = group.querySelectorAll('.toggle-btn');
        const hiddenInput = group.nextElementSibling;

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                // remove active state from all buttons within group
                btns.forEach(b => b.classList.remove('active', 'active-no'));

                // set active state on clicked button
                const val = btn.getAttribute('data-val');
                if (btn.textContent.trim().toLowerCase() === 'no') {
                    btn.classList.add('active', 'active-no');
                } else {
                    btn.classList.add('active');
                }

                // update hidden input
                hiddenInput.value = val;
            });
        });
    });

    // 5. Form Submission Logic
    const form = document.getElementById('prediction-form');
    const modal = document.getElementById('result-modal');
    const modalClose = document.getElementById('modal-close');
    const resetBtn = document.getElementById('reset-btn');
    const btnText = document.getElementById('btn-text');
    const btnIcon = document.getElementById('btn-icon');
    const predictBtn = document.getElementById('predict-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Collect form data explicitly, mapping string values to integers
        const formData = new FormData(form);
        const dataObj = {};
        formData.forEach((value, key) => {
            if (value !== "") {
                dataObj[key] = parseInt(value, 10);
            }
        });

        // Validation for Gender
        const genderInput = document.getElementById('input-Gender');
        if (genderInput && genderInput.value === "") {
            alert("Please select a Gender.");
            return;
        }

        // Loading state
        predictBtn.disabled = true;
        btnText.textContent = "Analyzing Patient Data...";
        btnIcon.className = "fa-solid fa-spinner fa-spin";

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataObj)
            });

            const result = await response.json();

            if (result.success) {
                showResultModal(result.prediction, result.confidence);
            } else {
                alert('Analysis Error: ' + result.error);
                resetButton();
            }
        } catch (error) {
            alert('Server Connection Error. Please verify backend state.');
            resetButton();
        }
    });

    function showResultModal(prediction, confidence) {
        modal.classList.remove('hidden');
        resetButton();

        const rIconContainer = document.getElementById('result-icon-container');
        const rIcon = document.getElementById('result-icon');
        const rTitle = document.getElementById('result-title');
        const rDesc = document.getElementById('result-desc');
        const confContainer = document.getElementById('confidence-container');
        const confText = document.getElementById('confidence-text');
        const confFill = document.getElementById('confidence-fill');
        const rstBtn = document.getElementById('reset-btn');

        // Initial loading state map
        rIconContainer.className = "result-icon-container analyzing";
        rIcon.className = "fa-solid fa-spinner fa-spin";
        rTitle.textContent = "Analyzing Data...";
        rTitle.style.color = "var(--text-main)";
        rDesc.textContent = "Processing patient variables through the predictive model...";
        confFill.className = "progress-fill";
        confFill.style.width = "0%";
        rstBtn.classList.add('hidden');
        confContainer.classList.add('hidden');

        // Delay to simulate processing animation for premium feel
        setTimeout(() => {
            if (prediction === 1) {
                // High Risk
                rIconContainer.className = "result-icon-container danger";
                rIcon.className = "fa-solid fa-triangle-exclamation";
                rTitle.textContent = "Lung Cancer Prediction: Yes";
                rTitle.style.color = "#ef4444";
                rDesc.textContent = "The predictive model indicates a high likelihood of lung cancer based on the provided clinical and lifestyle factors. We strongly advise consulting a healthcare professional for a comprehensive clinical screening.";
                confFill.className = "progress-fill danger-fill";
            } else {
                // Low Risk
                rIconContainer.className = "result-icon-container safe";
                rIcon.className = "fa-solid fa-circle-check";
                rTitle.textContent = "Lung Cancer Prediction: No";
                rTitle.style.color = "#059669"; // Using primary medical green
                rDesc.textContent = "The patient variables currently indicate a very low probability of lung cancer. However, maintaining a healthy lifestyle and regular medical supervision remain essential preventative measures.";
                confFill.className = "progress-fill safe-fill";
            }

            // Animate confidence bar
            if (confidence !== null && confidence !== undefined) {
                confContainer.classList.remove('hidden');
                confText.textContent = confidence.toFixed(2) + "%";
                setTimeout(() => {
                    confFill.style.width = confidence + "%";
                }, 100);
            }

            rstBtn.classList.remove('hidden');

        }, 1200);
    }

    function resetButton() {
        predictBtn.disabled = false;
        btnText.textContent = "Generate Prediction";
        btnIcon.className = "fa-solid fa-microchip";
    }

    modalClose.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    resetBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        form.reset();

        // Reset toggles to default
        document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active', 'active-no'));
        document.querySelectorAll('.toggle-btn:not(.gender-btn)[data-val="0"]').forEach(btn => btn.classList.add('active', 'active-no'));

        document.querySelectorAll('input[type="hidden"]:not(#input-Gender)').forEach(inp => inp.value = "0");
        const genderInput = document.getElementById('input-Gender');
        if (genderInput) genderInput.value = "";

        // Return to welcome section
        predictionSection.classList.replace('slide-active', 'slide-hidden');
        welcomeSection.classList.replace('slide-hidden', 'slide-active');
    });
});
