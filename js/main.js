var gElCanvas = document.querySelector('#my-canvas');
var gCtx = gElCanvas.getContext('2d');
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']
var gIsDragging = false;


function init() {
    renderGallery(getImage());
    addListeners();
    //renderCanvas(gMeme);
}

function renderGallery(imgs) {
    var elGallery = document.querySelector('.imgs-grid');
    var strHtmls = imgs.map(img => {
        return `<img class="meme-img" src="${img.url}" id="${img.id}" alt="meme-img" onclick="selectImg('${img.id}')">`
    });
    elGallery.innerHTML = ''
    elGallery.innerHTML = strHtmls.join('');
}

function changeAlign(align) {
    if (gMeme.selectedLineIdx !== -1 && gMeme.selectedLineIdx !== null) {
        changeAlignS(align);
        renderCanvas();
    }
}

function selectImg(imgId) {
    document.querySelector('.meme-area-container').classList.remove('display-none');
    document.querySelector('.main-container-gallery').classList.add('display-none');
    document.querySelector('.search').classList.add('display-none');
    document.querySelector('.gallery').classList.remove('selected');

    const selectedMeme = createMeme(imgId);
    setCanvasSize(document.getElementById(imgId));
    renderCanvas();
    //renderStickers();
}

function returnToGallery() {
    document.querySelector('.meme-area-container').classList.add('display-none');
    document.querySelector('.main-container-gallery').classList.remove('display-none');
    document.querySelector('.search').classList.remove('display-none');
    document.querySelector('.gallery').classList.add('selected');
}

function RemoveText() {
    if (gMeme.selectedLineIdx !== -1 && gMeme.selectedLineIdx !== null) {
        removeTextS();
    }
    renderCanvas();
}

function addText() {
    if (gMeme.selectedLineIdx !== -1 && gMeme.selectedLineIdx !== null) {
        gMeme.lines[gMeme.selectedLineIdx].txt = document.querySelector('.meme-text').value;
    } else {
        addTextS(document.querySelector('.meme-text').value, document.querySelector('.color-picker-text').value);
        document.querySelector('.meme-text').value = '';
    }
    renderCanvas();
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
    window.addEventListener('resize', () => {
        renderCanvas(getMeme());
    })
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    const pos = getEvPos(ev);
    setSelectedValue(isTextClicked(pos));
    if (getSelectedValue() !== -1 && getSelectedValue() !== null) {
        gStartPos = pos;
        document.body.style.cursor = 'grabbing';
        gIsDragging = true;
    } else {
        document.querySelector('.meme-text').value = '';
        setSelectedValue(null);
        document.body.style.cursor = 'default';
        return;
    }
    renderCanvas();
}

function onMove(ev) {
    if (getSelectedValue() !== -1 && getSelectedValue() !== null && gIsDragging) {
        const pos = getEvPos(ev);
        const dx = pos.x - gStartPos.x;
        const dy = pos.y - gStartPos.y;
        updateLinePos(dx, dy);
        gStartPos = pos;
        renderCanvas();
    }
}

function onUp(ev) {
    if (getSelectedValue() !== -1 && getSelectedValue() !== null) {
        gIsDragging = false;
        //setSelectedValue(null);
        //document.body.style.cursor = 'grab';
    } else {
        setSelectedValue(null);
        document.body.style.cursor = 'grab';
    }
    renderCanvas();
}

function changeSize(diff) {
    if (getSelectedValue() !== -1 && getSelectedValue() !== null) {
        changeSizeS(diff);
        renderCanvas();
    }
}

function changeColor() {
    if (getSelectedValue() !== -1 && getSelectedValue() !== null) {
        let color = document.querySelector('.color-picker-text').value;
        changeColorS(color);
        renderCanvas();
    }
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos;
}

function isTextClicked(clickedPos) {
    const {
        x,
        y
    } = clickedPos;
    var clickedTextIdx = getMeme().lines.findIndex(line => {
        return x > line.pos.x &&
            x < line.pos.x + gCtx.measureText(line.txt).width &&
            y < line.pos.y &&
            y > line.pos.y - line.size
    })
    return clickedTextIdx;
}

function renderCanvas() {
    var base_image = new Image();
    base_image.src = getCurrUrl();
    base_image.onload = function () {
        gCtx.drawImage(base_image, 0, 0, gElCanvas.width, gElCanvas.height);
        gMeme.lines.forEach((line, idx) => {
            if (idx === gMeme.selectedLineIdx) {
                drawRect(line.pos.x, line.pos.y, line);
            }
            drawText(line, line.pos.x, line.pos.y);
        });
    }
}

function renderStickers() {
    const stickers = getStickers();
    var elStickerHolder = document.querySelector('.stickers-holder');
    var strHtml = stickers.map(sticker => {
        return `<img src="${sticker.url}" onclick="selectSticker('${sticker.id}', this)">`
    })
    elStickerHolder.innerHTML = strHtml;
}

function drawRect(x, y, line) {
    gCtx.beginPath();
    gCtx.rect(x, y, gCtx.measureText(line.txt).width, -getSelectedLine().size);
    gCtx.strokeStyle = 'black';
    gCtx.stroke();
}

function drawText(line, x, y) {
    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'white';
    gCtx.fillStyle = line.color;
    gCtx.font = `${line.size}px Arial`;
    gCtx.textAlign = line.align;
    gCtx.fillText(line.txt, x, y);
    gCtx.strokeText(line.txt, x, y);
}

function downloadImg(elLink) {
    var imgContent = gElCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent;
}

function changeSearch(elText) {
    renderGallery(getImage(elText.value));
}

function setCanvasSize(img) {
    let ratio = img.width / img.height;
    gElCanvas.width = 500;
    gElCanvas.height = 500 / ratio;
}