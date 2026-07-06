import torch
import torch.nn as nn
from torchvision.models import resnet18
from pathlib import Path

if torch.cuda.is_available():
    DEVICE="cuda"
else:
    DEVICE="cpu"

model = resnet18(weights=None)

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "best_model.pth"

model.fc = nn.Linear(model.fc.in_features,2)
model.load_state_dict(torch.load(MODEL_PATH,map_location=DEVICE))

model.to(DEVICE)
model.eval()