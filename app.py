from flask import Flask, request, jsonify, render_template, abort
from werkzeug.utils import secure_filename
from PIL import Image
from base64 import encodebytes
import io
import os
import torch
import torchvision.transforms as transforms
from torch.autograd import Variable

device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
model = torch.load("./models/myModel.pth")
model.eval()
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
       mean=[0.485, 0.456, 0.406],
       std=[0.229, 0.224, 0.225]
    )
])


@app.route("/hello")
def index():
    return {"result": "Hello World!"} 

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        print("ERROR, NO IMAGE IN REQUEST")
        abort(400)

    f = request.files["image"]
    #f.save("./data/" + secure_filename(f.filename))
    img = Image.open(f)

    f_img = format_image(img)
    neg_prob, pos_prob = make_a_pred(f_img)
    
    return jsonify({"pos_prob": pos_prob, "neg_prob": neg_prob, "is_cat": True if (pos_prob > 0.98) else False})
    
@app.route("/save", methods=["POST"])
def save():
    if "image" not in request.files:
        print("ERROR, NO IMAGE IN REQUEST")
        abort(400)
    
    f = request.files["image"]
    f.save("./data/" + secure_filename(f.filename))

    return {"msg": "Img Saved"}

@app.route("/cats", methods=["GET"])
def cats():
    imgs = [get_response_image("data/" + f) for f in os.listdir("data")]

    return {"base64_imgs": imgs}

def format_image(img):
    img_t = preprocess(img)
    batch_t = torch.unsqueeze(img_t, 0)
    return batch_t.to(device) # cuda float

def make_a_pred(format_img):
    sigmoid = torch.nn.Sigmoid()
    pred = sigmoid(model(format_img))
    x, y = [pred[0][i].item() for i in range(2)];
    print("preds:")
    print(x, y)
    return x, y

def get_response_image(image_path):
    pil_img = Image.open(image_path, mode='r') # reads the PIL image
    byte_arr = io.BytesIO()
    pil_img.save(byte_arr, format='PNG') # convert the PIL image to byte array
    encoded_img = encodebytes(byte_arr.getvalue()).decode('ascii') # encode as base64
    return encoded_img


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=3000)
