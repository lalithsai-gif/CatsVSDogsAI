import time
import torch
from PIL import Image
from torchvision import transforms
from model import model, DEVICE

classes = ["Cat", "Dog"]

transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485,0.456,0.406],
        std=[0.229,0.224,0.225]
    )
])

def predict(image):
    start = time.perf_counter()

    image = image.convert("RGB")
    image = transform(image)
    image = image.unsqueeze(0)
    image = image.to(DEVICE)

    with torch.no_grad():

        outputs = model(image)
        probabilities = torch.softmax(outputs,dim=1)

    probs = probabilities.cpu().numpy()[0]

    top = sorted(zip(classes,probs),key=lambda x:x[1],reverse=True)

    end = time.perf_counter()

    return {
        "prediction":top[0][0],
        "confidence":round(float(top[0][1]*100),2),
        "top_predictions":[
            {
                "label":top[0][0],
                "confidence":round(float(top[0][1]*100),2)
            },
            {
                "label":top[1][0],
                "confidence":round(float(top[1][1]*100),2)
            }
        ],
        "model":"ResNet18",
        "framework":"PyTorch",
        "image_size":"224x224",
        "inference_time":f"{(end-start)*1000:.2f} ms"
    }