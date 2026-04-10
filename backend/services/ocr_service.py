
import os
from dotenv import load_dotenv
import zipfile
from sarvamai import SarvamAI
from bs4 import BeautifulSoup
from utils.image_preprocess import preprocess_image

load_dotenv()

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")

if not SARVAM_API_KEY:
    raise ValueError("API key not found!")

client = SarvamAI(api_subscription_key=SARVAM_API_KEY)

os.makedirs("temp", exist_ok=True)

def extract_text_from_image(image_bytes):

    # preprocess
    image_bytes = preprocess_image(image_bytes)

    # save temp image
    input_path = "temp/input.png"
    with open(input_path, "wb") as f:
        f.write(image_bytes)

    # create job
    job = client.document_intelligence.create_job(
        language="en-IN",
        output_format="html"
    )

    # upload file
    job.upload_file(input_path)

    # start job
    job.start()

    # wait for completion
    status = job.wait_until_complete()

    if status.job_state.lower() != "completed":
        return f"Error: Job failed with state {status.job_state}"

    # download output
    output_zip = "temp/output.zip"
    job.download_output(output_zip)

    # extract ZIP
    extract_folder = "temp/output"
    os.makedirs(extract_folder, exist_ok=True)

    with zipfile.ZipFile(output_zip, 'r') as zip_ref:
        zip_ref.extractall(extract_folder)

    # read extracted HTML/text
    extracted_text = ""

    for file in os.listdir(extract_folder):
        if file.endswith(".html") or file.endswith(".txt"):
            with open(os.path.join(extract_folder, file), "r", encoding="utf-8") as f:
                soup = BeautifulSoup(f, "html.parser")
                extracted_text += soup.get_text()

    return extracted_text