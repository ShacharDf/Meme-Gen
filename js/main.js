var gElCanvas = document.querySelector('#my-canvas');
var gCtx = gElCanvas.getContext('2d');
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']
var gIsDragging = false;

function init() {
    renderGallery(getImage());
    //renderKeyWords(5);
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

function renderKeyWords(amount) {
    var elKeyWords = document.querySelector('.keywords-holder');
    var strHtml = getKeyWords(amount).map(word => {
        return `<span class="key-word ${word.keyWord}" style="font-size: ${word.value+20}px"> ${word.keyWord}</span>`;
    });
    elKeyWords.innerHTML = strHtml.join('');
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
    renderStickers();
}

function returnToGallery() {
    document.querySelector('.meme-area-container').classList.add('display-none');
    document.querySelector('.main-container-gallery').classList.remove('display-none');
    document.querySelector('.search').classList.remove('display-none');
    document.querySelector('.gallery').classList.add('selected');
}

function RemoveText() {
    if (getSelectedValue() !== -1 && getSelectedValue() !== null) {
        removeTextS(true);
    }else if(getSelectedSticker() !== -1 && getSelectedSticker() !== null){
        removeTextS(false);
    }
    renderCanvas();
}

function addText() {
    if (gMeme.selectedLineIdx !== -1 && gMeme.selectedLineIdx !== null) {
        gMeme.lines[gMeme.selectedLineIdx].txt = document.querySelector('.meme-text').value;
    } else {
        addTextS(document.querySelector('.meme-text').value, document.querySelector('.color-picker-text').value, document.querySelector('.color-picker-frame').value);
        document.querySelector('.meme-text').value = '';
    }
    renderCanvas();
}

function selectSticker(stickerId, elImg) {
    addStickerS(stickerId);
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
        setSelectedSticker(null);
        gStartPos = pos;
        document.body.style.cursor = 'grabbing';
        gIsDragging = true;
    } else {
        document.querySelector('.meme-text').value = '';
        setSelectedValue(null);
        //document.body.style.cursor = 'default';
        setSelectedSticker(isStickerClicked(pos));
        if (getSelectedSticker() !== -1 && getSelectedSticker() !== null) {
            gStartPos = pos;
            gIsDragging = true;
            document.body.style.cursor = 'grabbing';
        } else {
            setSelectedSticker(null);
            document.body.style.cursor = 'default';
        }
        //return;
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
    } else if (getSelectedSticker() !== -1 && getSelectedSticker() !== null && gIsDragging) {
        const pos = getEvPos(ev);
        const dx = pos.x - gStartPos.x;
        const dy = pos.y - gStartPos.y;
        updatestickerPos(dx, dy);
        gStartPos = pos;
        renderCanvas();
    }
}

function onUp(ev) {
    if ((getSelectedValue() !== -1 && getSelectedValue() !== null) || (getSelectedSticker() !== -1 && getSelectedSticker() !== null)) {
        gIsDragging = false;
    } else {
        setSelectedValue(null);
        setSelectedSticker(null);
        document.body.style.cursor = 'grab';
    }
    renderCanvas();
}

function changeSize(diff) {
    if ((getSelectedValue() !== -1 && getSelectedValue() !== null) || (getSelectedSticker() !== -1 && getSelectedSticker() !== null)) {
        changeSizeS(diff);
        renderCanvas();
    }
}

function changeColorIn() {
    let color = document.querySelector('.color-picker-text').value;
    document.querySelector('.picker-text').style.background = color;
    if (getSelectedValue() !== -1 && getSelectedValue() !== null) {
        changeColorInS(color);
        renderCanvas();
    }
}

function changeColorOut() {
    let color = document.querySelector('.color-picker-frame').value;
    document.querySelector('.picker-frame').style.background = color;
    if (getSelectedValue() !== -1 && getSelectedValue() !== null) {
        changeColorOutS(color);
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

function isStickerClicked(clickedPos) {
    const {
        x,
        y
    } = clickedPos;
    var clickedStickerIdx = getMeme().stickers.findIndex(sticker => {
        let stickerImg = new Image();
        stickerImg.src = sticker.url;
        return x > sticker.pos.x &&
            x < (sticker.pos.x + 100 * sticker.size) &&
            y > sticker.pos.y &&
            y < sticker.pos.y + (100 * sticker.size / (stickerImg.width / stickerImg.height))
    })
    return clickedStickerIdx;
}

function renderCanvas() {
    var base_image = new Image();
    const meme = getMeme();
    base_image.src = getCurrUrl();
    base_image.onload = function () {
        gCtx.drawImage(base_image, 0, 0, gElCanvas.width, gElCanvas.height);
        meme.stickers.forEach((sticker, idx) => {
            if (idx === meme.selectedStickerIdx) {
                drawRect(sticker.pos.x, sticker.pos.y, sticker, false);
            }
            drawSticker(sticker, sticker.pos.x, sticker.pos.y);
        });
        meme.lines.forEach((line, idx) => {
            if (idx === meme.selectedLineIdx) {
                drawRect(line.pos.x, line.pos.y, line, true);
            }
            drawText(line, line.pos.x, line.pos.y);
        });
    }
}

function renderStickers() {
    const stickers = getStickers();
    var elStickerHolder = document.querySelector('.stickers-holder');
    var strHtml = stickers.reduce((acc, sticker) => {
        return `<img class="sticker-btn" src="${sticker.url}" onclick="selectSticker('${sticker.id}', this)">`  + acc
    }, '')
    elStickerHolder.innerHTML = strHtml;
}

function drawRect(x, y, picked, isLine) {
    gCtx.beginPath();
    if (isLine) gCtx.rect(x, y, gCtx.measureText(picked.txt).width, -getSelectedLine().size);
    else {
        var stickerImg = new Image();
        stickerImg.src = picked.url;
        let ratio = stickerImg.width / stickerImg.height;
        gCtx.rect(x, y, 100 * picked.size, (100 * picked.size) / ratio);
    }
    gCtx.strokeStyle = 'black';
    gCtx.stroke();
}

function drawText(line, x, y) {
    gCtx.lineWidth = 2
    gCtx.strokeStyle = line.frame;
    gCtx.fillStyle = line.color;
    gCtx.font = `${line.size}px Arial`;
    gCtx.textAlign = line.align;
    gCtx.fillText(line.txt, x, y);
    gCtx.strokeText(line.txt, x, y);
}

function drawSticker(sticker, x, y) {
    var stickerImg = new Image();
    stickerImg.src = sticker.url;
    let ratio = stickerImg.width / stickerImg.height;
    gCtx.drawImage(stickerImg, x, y, 100 * sticker.size, (100 * sticker.size) / ratio);
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

