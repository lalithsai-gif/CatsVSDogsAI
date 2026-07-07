// ==============================
// DOM ELEMENTS
// ==============================

const imageInput = document.getElementById("imageInput");
const browseBtn = document.getElementById("browseBtn");
const dropArea = document.getElementById("dropArea");
const previewImage = document.getElementById("previewImage");
const predictBtn = document.getElementById("predictBtn");
const loading = document.getElementById("loading");
const resultCard = document.getElementById("resultCard");

// Prediction Elements

const prediction = document.getElementById("prediction");
const confidence = document.getElementById("confidence");

const progressBar = document.getElementById("progressBar");

const label1 = document.getElementById("label1");
const score1 = document.getElementById("score1");

const label2 = document.getElementById("label2");
const score2 = document.getElementById("score2");

const modelName = document.getElementById("modelName");
const framework = document.getElementById("framework");
const imageSize = document.getElementById("imageSize");
const inferenceTime = document.getElementById("inferenceTime");

// ==============================
// BACKEND URL
// ==============================

// Local
// const API_URL = "http://127.0.0.1:8000";

const API_URL = "https://grafterlalith-cats-vs-dogs-ai.hf.space";

// ==============================
// BROWSE BUTTON
// ==============================

browseBtn.addEventListener("click", () => {

    imageInput.click();

});

// ==============================
// IMAGE PREVIEW
// ==============================

imageInput.addEventListener("change", () => {

    if(imageInput.files.length===0) return;

    const file=imageInput.files[0];

    previewImage.src=URL.createObjectURL(file);

    previewImage.style.display="block";

});

// ==============================
// DRAG EVENTS
// ==============================

dropArea.addEventListener("dragover",(e)=>{

    e.preventDefault();

    dropArea.classList.add("dragover");

});

dropArea.addEventListener("dragleave",()=>{

    dropArea.classList.remove("dragover");

});

dropArea.addEventListener("drop",(e)=>{

    e.preventDefault();

    dropArea.classList.remove("dragover");

    imageInput.files=e.dataTransfer.files;

    const file=imageInput.files[0];

    previewImage.src=URL.createObjectURL(file);

    previewImage.style.display="block";

});

// ==============================
// PREDICT
// ==============================

predictBtn.addEventListener("click",predictImage);

async function predictImage(){

    if(imageInput.files.length===0){

        alert("Please choose an image");

        return;

    }

    loading.style.display="block";

    resultCard.style.display="none";

    const formData=new FormData();

    formData.append(

        "file",

        imageInput.files[0]

    );

    try{

        const start=performance.now();

        const response=await fetch(

            API_URL+"/predict",

            {

                method:"POST",

                body:formData

            }

        );

        const end=performance.now();

        const data=await response.json();

        loading.style.display="none";

        resultCard.style.display="block";

        resultCard.classList.add("fade-in");

        prediction.innerHTML=data.prediction;

        confidence.innerHTML=

        `Confidence : ${data.confidence.toFixed(2)}%`;

        progressBar.style.width=

        data.confidence+"%";

        // Top Predictions

        if(data.top_predictions){

            label1.innerHTML=data.top_predictions[0].label;

            score1.innerHTML=

            data.top_predictions[0].confidence.toFixed(2)+"%";

            label2.innerHTML=data.top_predictions[1].label;

            score2.innerHTML=

            data.top_predictions[1].confidence.toFixed(2)+"%";

        }

        modelName.innerHTML=data.model;

        framework.innerHTML=data.framework;

        imageSize.innerHTML=data.image_size;

        inferenceTime.innerHTML=

        Math.round(end-start)+" ms";

    }

    catch(error){

        loading.style.display="none";

        alert("Cannot connect to FastAPI Server");

        console.log(error);

    }

}