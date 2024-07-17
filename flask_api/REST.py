from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image, ImageOps
import io
import base64

app = Flask(__name__)
CORS(app)

@app.route('/transform', methods=['POST'])
def transform_image():
    if 'file' not in request.files:
        return "No file part", 400

    file = request.files['file']
    if file.filename == '':
        return "No selected file", 400

    prompt = request.form.get('prompt')  # Get the prompt from the form data
    print(f"Received prompt: {prompt}")  # Print the prompt to the console

    image = Image.open(file)
    grayscale_image = ImageOps.grayscale(image)

    img_io = io.BytesIO()
    grayscale_image.save(img_io, 'PNG')
    img_io.seek(0)
    
    img_base64 = base64.b64encode(img_io.getvalue()).decode('utf-8')
    return jsonify({'image': f'data:image/png;base64,{img_base64}'})

if __name__ == '__main__':
    app.run(debug=True)
