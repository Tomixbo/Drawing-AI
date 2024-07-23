from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
import base64
import numpy as np
# import cv2
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
        # Convert PIL image to NumPy array
        image_np = np.array(image)
        # Process the image
        processed_image = run_lcm_or_sdxl(pipeline, image_np, prompt)
        # Convert the processed image from BGR to RGB
        # processed_image_rgb = cv2.cvtColor(processed_image_np, cv2.COLOR_BGR2RGB)
        # Convert NumPy array back to PIL image
        # processed_image = Image.fromarray(processed_image_np)

        img_io = io.BytesIO()
        processed_image.save(img_io, 'PNG')
        img_io.seek(0)
        
        img_base64 = base64.b64encode(img_io.getvalue()).decode('utf-8')
        return jsonify({'image': f'data:image/png;base64,{img_base64}'})
    return "No returned image", 400

if __name__ == '__main__':
    app.run(debug=True)
