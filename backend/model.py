import torch
import torch.nn as nn
from torchvision.models import resnet18

if torch.cuda.is_available():
    DEVICE="cuda"
else:
    DEVICE="cpu"

model = resnet18(weights=None)

model.fc = nn.Linear(model.fc.in_features,2)
model.load_state_dict(torch.load("best_model.pth",map_location=DEVICE))

model.to(DEVICE)
model.eval()