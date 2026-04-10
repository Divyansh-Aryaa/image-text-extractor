from PIL import Image
import io

def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes))
    
    image = image.convert("L")  # grayscale
    image = image.resize((1024, 1024))  # normalize size
    
    output = io.BytesIO()
    image.save(output, format="PNG")
    
    return output.getvalue()