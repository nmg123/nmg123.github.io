var gElCanvas;
var gCtx;
var gCurrShape = "triangle";

let canvasContent;

function init() {
  gElCanvas = document.querySelector("#my-canvas");
  gCtx = gElCanvas.getContext("2d");
  document.getElementById("text-input").reset();
  clearCanvas();
  canvasContent = {
    title: null,
    footer: null,
    img: null,
  };
  // console.log('ctx', gCtx);

  // drawLine(0, 0, 250, 250)
  // clearCanvas()
  // drawTriangle(0, 0)
  // drawRect(50, 50)
  // drawArc(50, 50);
  // drawText('HELLO WORD !', gElCanvas.width / 2, gElCanvas.height / 2)
  // saveAndRestoreExample()
  // drawImg()
  // drawImg2()

  window.addEventListener("resize", resizeCanvas);
  // drawText('Nothing like a good stretch ', 0, 225)
  // window.addEventListener('resize', () => {
  //     resizeCanvas()
  //         // Debouncing?..
  //     drawText('Nothing like a good stretch ', 0, 225)
  // })

  // click on canvas
}

function drawLine(x, y, xEnd = 250, yEnd = 250) {
  gCtx.lineWidth = 2;
  gCtx.moveTo(x, y);
  gCtx.lineTo(xEnd, yEnd);
  gCtx.strokeStyle = "green";
  gCtx.stroke();
}

function setImg(event) {
  var selectedFile = event.files[0];
  var reader = new FileReader();
  reader.readAsDataURL(selectedFile);

  reader.onload = function (event) {
    canvasContent.img = event.target.result;
    renderCanvas();
  };
}
function drawTriangle(x, y) {
  // gCtx.beginPath();
  gCtx.lineWidth = 5;
  gCtx.moveTo(x, y);
  gCtx.lineTo(200, 330);
  gCtx.lineTo(50, 370);
  gCtx.lineTo(x, y);
  // gCtx.closePath();
  gCtx.fillStyle = "gold";
  gCtx.fill();
  gCtx.strokeStyle = "purple";
  gCtx.stroke();
}

function drawRect(x, y) {
  gCtx.rect(x, y, 200, 200);
  gCtx.fillStyle = "green";
  gCtx.fillRect(x, y, 200, 200);
  gCtx.strokeStyle = "red";
  gCtx.stroke();
}

function drawArc(x, y) {
  gCtx.lineWidth = 2;
  gCtx.arc(x, y, 50, 0, 2 * Math.PI);
  gCtx.fillStyle = "blue";
  gCtx.fill();
  gCtx.strokeStyle = "black";
  gCtx.stroke();
}

function renderText() {
  drawText("title");
  drawText("footer");
}
function renderCanvas() {
  clearCanvas();

  if (canvasContent.img) {
    drawImg2(canvasContent.img, renderText);
  } else {
    renderText();
  }
}

function setTitle(txt) {
  canvasContent.title = txt;
  renderCanvas();
}

function setFooter(txt) {
  canvasContent.footer = txt;
  renderCanvas();
}

function drawText(type) {
  let txt = canvasContent.title;
  gCtx.textBaseline = "middle";
  gCtx.textAlign = "center";

  gCtx.fillStyle = "blue";
  gCtx.font = "50px david";

  gCtx.strokeStyle = "red";
  let positionX = gElCanvas.width / 2;
  let positionY = gElCanvas.width / 10;

  if (type === "footer") {
    positionY = gElCanvas.width - gElCanvas.width / 10;
    txt = canvasContent.footer;
  }
  if (!txt) {
    return;
  }
  gCtx.strokeText(txt, positionX, positionY);
}

function saveAndRestoreExample() {
  gCtx.font = "50px Arial";
  gCtx.strokeStyle = "green";
  gCtx.strokeText("Saving the context", 10, 50);
  gCtx.save();
  gCtx.font = "30px david";
  gCtx.strokeStyle = "black";
  gCtx.strokeText("Switching to something else", 10, 100);
  gCtx.restore();
  gCtx.strokeText("Back to previous", 10, 150);
}

function clearCanvas() {
  gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height);
  // You may clear part of the canvas
  // gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height/4)
}

function drawImg() {
  var elImg = document.querySelector("img");
  // Naive approach:
  // there is a risk that image is not loaded yet and nothing will be drawn on canvas
  gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height);
  // drawLine(50, 50)
}

function drawImg2(base64, onLoad) {
  var img = new Image();
  img.src = base64;
  img.onload = () => {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
    onLoad();
  };
}

function downloadCanvas(elLink) {
  const data = gElCanvas.toDataURL();
  elLink.href = data;
  elLink.download = "my-canvas";
}

function resizeCanvas() {
  var elContainer = document.querySelector(".canvas-container");
  // Note: changing the canvas dimension this way clears the canvas
  gElCanvas.width = elContainer.offsetWidth - 100;
  // Unless needed, better keep height fixed.
  //   gCanvas.height = elContainer.offsetHeight
}

function setShape(shape) {
  gCurrShape = shape;
}

function draw(ev) {
  // const offsetX = ev.offsetX;
  // const offsetY = ev.offsetY;
  console.log(ev);
  const { offsetX, offsetY } = ev;
  console.log(offsetX, offsetY);
  switch (gCurrShape) {
    case "triangle":
      drawTriangle(offsetX, offsetY);
      break;
    case "rect":
      drawRect(offsetX, offsetY);
      break;
    case "line":
      drawLine(offsetX, offsetY);
      break;
  }
}
