from fastapi import FastAPI,UploadFile,File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from predict import predict

app = FastAPI(title="Cats vs Dogs AI API",description="ResNet18 Image Classification API",version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://catsvsdogsai-1.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message":"Cats vs Dogs AI API","status":"Running"}

@app.get("/health")
def health():
    return {"status":"Healthy"}

@app.post("/predict")
async def prediction(file:UploadFile = File(...)):
    try:
        image = Image.open(file.file)
        result = predict(image)
        return result
    except Exception as e:
        return {"error":str(e)}