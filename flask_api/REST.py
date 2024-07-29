from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image, ImageOps
import io
import base64
import numpy as np
import cv2
from diffusion import run_lcm_or_sdxl, prepare_lcm_controlnet_or_sdxlturbo_pipeline


app = Flask(__name__)
CORS(app)

#Initialization of the diffusion model
pipeline = prepare_lcm_controlnet_or_sdxlturbo_pipeline() 

@app.route('/transform', methods=['POST'])
def transform_image():
    if 'file' not in request.files:
        return "No file part", 400

    file = request.files['file']
    if file.filename == '':
        return "No selected file", 400

    prompt = request.form.get('prompt')  # Get the prompt from the form data
    if prompt:
        print(f"Received prompt: {prompt}")  # Print the prompt to the console
        
        image = Image.open(file)

        # Process the image - Diffusion model
        image_np = np.array(image)
        processed_image = run_lcm_or_sdxl(pipeline, image_np, prompt)


        # Convert image to grayscale - to comment
        # processed_image = ImageOps.grayscale(image)

        img_io = io.BytesIO()
        processed_image.save(img_io, 'PNG')
        img_io.seek(0)
        
        img_base64 = base64.b64encode(img_io.getvalue()).decode('utf-8')
        return jsonify({'image': f'data:image/png;base64,{img_base64}'})
    return "No returned image", 400

if __name__ == '__main__':
    app.run(debug=True)
