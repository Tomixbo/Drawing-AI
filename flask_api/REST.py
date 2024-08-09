from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
import base64
import numpy as np
import json
from diffusion import run, prepare_pipeline
app = Flask(__name__)
CORS(app)

# Initialization of the diffusion model
pipeline = prepare_pipeline()

@app.route('/transform', methods=['POST'])
def transform_image():
    if 'file' not in request.files:
        return "No file part", 400

    file = request.files['file']
    if file.filename == '':
        return "No selected file", 400

    prompt = request.form.get('prompt')
    settings = request.form.get('settings')  # Get the hyperparameters as a JSON string
    if prompt and settings:
        print(f"Received prompt: {prompt}")  
        print(f"Received settings: {settings}")  
        
        settings = json.loads(settings)  # Convert the JSON string to a dictionary
        
        image = Image.open(file)

        # Process the image using the diffusion model
        image_np = np.array(image)
        processed_image = run(
            pipeline,
            image_np,
            prompt,
            guidance_scale=settings.get('GUIDANCE_SCALE', 4.0),
            inference_steps=settings.get('INFERENCE_STEPS', 30),
            random_seed=settings.get('RANDOM_SEED', 21),
            conditioning_scale=settings.get('CONDITIONING_SCALE', 0.5),
            guidance_start=settings.get('GUIDANCE_START', 0.0),
            guidance_end=settings.get('GUIDANCE_END', 0.7)
        )

        img_io = io.BytesIO()
        processed_image.save(img_io, 'PNG')
        img_io.seek(0)
        
        img_base64 = base64.b64encode(img_io.getvalue()).decode('utf-8')
        return jsonify({'image': f'data:image/png;base64,{img_base64}'})
    return "No returned image", 400


if __name__ == '__main__':
    app.run(debug=True)
