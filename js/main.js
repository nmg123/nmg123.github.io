var gElCanvas;
var gCtx;
let canvasContent;
let currentTextIndex;
let currentObj;
const gTouchEvs = ["touchstart", "touchmove", "touchend"];

const fonts = ["Sigmar One", "ariel", "david"];

const memes = [
  {
    img: "/meme-imgs (square)/1.jpg",
    type: "bad",
  },
  {
    img: "/meme-imgs (square)/2.jpg",
    type: "cute",
  },
  {
    img: "/meme-imgs (square)/3.jpg",
    type: "cute",
  },
  {
    img: "/meme-imgs (square)/4.jpg",
    type: "cute",
  },
  {
    img: "/meme-imgs (square)/5.jpg",
    type: "bad",
  },
  {
    img: "/meme-imgs (square)/6.jpg",
    type: "funny",
  },
];

function getDefaultTextSettings() {
  const defaultPositionX = gElCanvas.width / 2;
  const defaultPositionY = gElCanvas.width / 10;

  return {
    txt: "YOUR TEXT COMES HERE",
    position: {
      x: defaultPositionX,
      y: defaultPositionY,
    },
    size: 30,
    alignment: "center",
    color: "#feffff",
    font: "david",
    strokeStyle: "#000000",
    isDrag: false,
  };
}

function loadFromStorage(key) {
  const json = localStorage.getItem(key);
  const val = JSON.parse(json);
  return val;
}

function removeFromStorage(key) {
  localStorage.removeItem(key);
}

function saveToStorage(key, val) {
  var json = JSON.stringify(val);
  localStorage.setItem(key, json);
}

function loadCanvasContent() {
  const ongoing = loadFromStorage("ongoing");
  if (ongoing) {
    canvasContent = ongoing;
  } else {
    canvasContent = {
      txt: [getDefaultTextSettings()],
      img: null,
      emojis: [],
    };
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function saveMeme(update) {
  let savedMemes = loadFromStorage("savedMemes");
  if (!savedMemes) {
    savedMemes = [];
  }

  const data = gElCanvas.toDataURL();

  canvasContent.dataUrl = data;

  if (!update) {
    canvasContent.id = getRandomInt(10, 9999);
  } else {
    const index = savedMemes.findIndex((meme) => meme.id === canvasContent.id);
    savedMemes.shift(index);
  }

  savedMemes.push(canvasContent);
  saveToStorage("savedMemes", savedMemes);
}

function init() {
  gElCanvas = document.querySelector("#my-canvas");
  gCtx = gElCanvas.getContext("2d");
  document.getElementById("text-input").reset();
  addMouseListeners();
  addTouchListeners();

  currentTextIndex = 0;

  loadCanvasContent();

  window.addEventListener("resize", resizeCanvas);

  const select = document.getElementById("select");

  for (let a = 0; a < fonts.length; a++) {
    const opt = document.createElement("option");
    opt.value = opt.innerHTML = fonts[a];
    opt.style.fontFamily = fonts[a];
    select.add(opt);
  }

  currentObj = canvasContent.txt[0];
  renderCanvas();
}

function renderSavedMemes() {
  const savedMemes = loadFromStorage("savedMemes");

  if (savedMemes) {
    let html = "";

    savedMemes.forEach((meme) => {
      html += `<div class="responsive" onclick="setMemeFromSaved(${meme.id})">
      <div class="gallery">
          <img
            src="${meme.dataUrl}"
            alt="Forest"
            width="600"
            height="400"
          />
      </div>
    </div>`;
    });

    document.getElementById("memes-container").innerHTML = html;
  }
}
function renderMemes(type) {
  loadCanvasContent();
  let filteredMemes = memes;
  if (type) {
    filteredMemes = memes.filter((meme) => meme.type === type);
  }

  let html = "";
  filteredMemes.forEach((meme) => {
    html += `<div class="responsive" onclick="setImgFromGallery('${meme.img}')">
    <div class="gallery">
        <img
          src="${meme.img}"
          alt="Forest"
          width="600"
          height="400"
        />
    </div>
  </div>`;
  });

  document.getElementById("memes-container").innerHTML = html;
}

function setImgFromGallery(img) {
  canvasContent.img = img;
  saveToStorage("ongoing", canvasContent);

  document.location = "index.html";
}

function setMemeFromSaved(memeId) {
  const savedMemes = loadFromStorage("savedMemes");
  const meme = savedMemes.find((meme) => meme.id === memeId);

  saveToStorage("ongoing", meme);

  document.location = "index.html";
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

function setTextColor(color) {
  canvasContent.txt[currentTextIndex].color = color;
  renderCanvas();
}

function setStrokeColor(color) {
  canvasContent.txt[currentTextIndex].strokeStyle = color;
  renderCanvas();
}

function setFont(font) {
  canvasContent.txt[currentTextIndex].font = font;
  renderCanvas();
}

function renderText() {
  canvasContent.txt.forEach((text) => {
    gCtx.textAlign = text.alignment;

    gCtx.fillStyle = text.color;

    gCtx.font = `${text.size}px ${text.font}`;

    gCtx.strokeStyle = text.strokeStyle;

    gCtx.fillText(text.txt, text.position.x, text.position.y);
    gCtx.strokeText(text.txt, text.position.x, text.position.y);
  });
}

function renderEmojis() {
  canvasContent.emojis.forEach((emoji) => {
    gCtx.fillText(emoji.emoji, emoji.position.x, emoji.position.y);
  });
}

function renderElements() {
  renderText();
  renderEmojis();
}

function renderCanvas() {
  clearCanvas();

  if (canvasContent.img) {
    drawImage(canvasContent.img, renderElements);
  } else {
    renderElements();
  }

  if (canvasContent.txt.length > 0) {
    document.getElementById("stroke-color").value =
      canvasContent.txt[currentTextIndex].strokeStyle;

    document.getElementById("text-color").value =
      canvasContent.txt[currentTextIndex].color;

    document.getElementById("select").value =
      canvasContent.txt[currentTextIndex].font;
  }

  saveToStorage("ongoing", canvasContent);
}

function setText(txt) {
  if (!canvasContent.txt[currentTextIndex]) {
    canvasContent.txt[currentTextIndex] = getDefaultTextSettings();
  }
  canvasContent.txt[currentTextIndex].txt = txt;
  renderCanvas();
}

function clearCanvas() {
  gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height);
}

function setSize(direction) {
  let step = 5;
  if (direction === "down") {
    step = step * -1;
  }

  const currSize = canvasContent.txt[currentTextIndex].size;
  canvasContent.txt[currentTextIndex].size = currSize + step;

  renderCanvas();
}

function setPosition(direction) {
  let step = -5;
  if (direction === "down") {
    step = step * -1;
  }

  const currPos = canvasContent.txt[currentTextIndex].position;
  canvasContent.txt[currentTextIndex].position.y = currPos.y + step;

  renderCanvas();
}

function setAlignment(alignment) {
  canvasContent.txt[currentTextIndex].alignment = alignment;

  renderCanvas();
}

function remove() {
  if (currentObj.txt) {
    const index = canvasContent.txt.findIndex((obj) => obj === currentObj);
    canvasContent.txt.shift(index);
    if (currentTextIndex > 0) {
      currentTextIndex--;
    }
    document.getElementById("text-input").reset();
  }

  if (currentObj.emoji) {
    const index = canvasContent.emojis.findIndex((obj) => obj === currentObj);
    canvasContent.emojis.shift(index);
  }

  renderCanvas();
}

function drawImage(image, onLoad) {
  var img = new Image();
  img.src = image;
  img.onload = () => {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
    onLoad();
  };
}

function addText() {
  if (canvasContent.txt.length != 0) {
    currentTextIndex++;
  }
  canvasContent.txt.push(getDefaultTextSettings());
  document.getElementById("text-input").reset();
  renderCanvas();
}

function addEmoji(emoji) {
  canvasContent.emojis.push({
    emoji,
    position: {
      x: 100,
      y: 30,
    },
    isDrag: false,
  });

  renderCanvas();
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

function getObj(ev) {
  const { offsetX, offsetY } = ev;

  const objects = [...canvasContent.txt, ...canvasContent.emojis];
  let choosenObj = objects[0];

  objects.forEach((obj) => {
    if (!obj) {
      return;
    }
    const diffFromCurrentX = choosenObj.position.x - offsetX;
    const diffFromCurrentY = choosenObj.position.y - offsetY;

    const diffFromObjX = obj.position.x - offsetX;
    const diffFromObjY = obj.position.y - offsetY;

    if (diffFromObjY < 0) {
      return;
    }

    if (diffFromObjY < diffFromCurrentY || diffFromCurrentY < 0) {
      choosenObj = obj;
    }
  });

  return choosenObj;
}

function addMouseListeners() {
  gElCanvas.addEventListener("mousemove", onMove);
  gElCanvas.addEventListener("mousedown", onPress);
  gElCanvas.addEventListener("mouseup", onUp);
}

function addTouchListeners() {
  gElCanvas.addEventListener("touchmove", onMove);
  gElCanvas.addEventListener("touchstart", onPress);
  gElCanvas.addEventListener("touchend", onUp);
}

function getEvPos(ev) {
  var pos = {
    x: ev.offsetX,
    y: ev.offsetY,
  };
  if (gTouchEvs.includes(ev.type)) {
    ev.preventDefault();
    ev = ev.changedTouches[0];
    pos = {
      x: ev.pageX - ev.target.offsetLeft,
      y: ev.pageY - ev.target.offsetTop,
    };
  }
  return pos;
}

function onMove(ev) {
  if (!currentObj.isDrag) return;
  const { offsetX, offsetY } = ev;

  if (currentObj.txt) {
    const index = canvasContent.txt.findIndex((obj) => obj === currentObj);
    canvasContent.txt[index].position.x = offsetX;
    canvasContent.txt[index].position.y = offsetY;
  }
  if (currentObj.emoji) {
    const index = canvasContent.emojis.findIndex((obj) => obj === currentObj);
    canvasContent.emojis[index].position.x = offsetX;
    canvasContent.emojis[index].position.y = offsetY;
  }

  renderCanvas();
}

function onUp() {
  currentObj.isDrag = false;
  document.body.style.cursor = "grab";
}

function onPress(ev) {
  const clickedObj = getObj(ev);
  if (clickedObj !== currentObj) {
    if (clickedObj.txt) {
      document.getElementById("text").value = clickedObj.txt;
      const index = canvasContent.txt.findIndex((obj) => obj === clickedObj);

      currentTextIndex = index;
    }

    currentObj = clickedObj;
    return;
  }

  currentObj.isDrag = true;
  document.body.style.cursor = "grabbing";
}
