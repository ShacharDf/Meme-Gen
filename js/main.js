var gElCanvas = document.querySelector('#my-canvas');
var gCtx = gElCanvas.getContext('2d');
var gStartPos;
var gMoveToggle = false;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']
var gMeme = {
    selectedImgId: 0,
    selectedLineIdx: null,
    lines: [{
        txt: '',
        size: 20,
        align: 'left',
        color: 'red',
        pos: {
            x: 10,
            y: 10
        }
    }]
};
var gImages = [{
    id: 0,
    url: 'img/1.jpg',
    keywords: ['trump', 'idiot']
}, {
    id: 1,
    url: 'img/2.jpg',
    keywords: ['dogs']
}, {
    id: 2,
    url: 'img/3.jpg',
    keywords: ['dogs', 'kids']
}, {
    id: 3,
    url: 'img/4.jpg',
    keywords: ['cats']
}, {
    id: 4,
    url: 'img/5.jpg',
    keywords: ['kids']
}, {
    id: 5,
    url: 'img/6.jpg',
    keywords: ['alien']
}, {
    id: 6,
    url: 'img/7.jpg',
    keywords: ['alien', 'kids']
}, {
    id: 7,
    url: 'img/8.jpg',
    keywords: ['bla']
}, {
    id: 8,
    url: 'img/9.jpg',
    keywords: ['kids']
}, {
    id: 9,
    url: 'img/10.jpg',
    keywords: ['omaba', 'idiot']
}, {
    id: 10,
    url: 'img/11.jpg',
    keywords: ['kiss', 'black-people']
}, {
    id: 11,
    url: 'img/12.jpg',
    keywords: ['bla']
}, {
    id: 12,
    url: 'img/13.jpg',
    keywords: ['bla']
}, {
    id: 13,
    url: 'img/14.jpg',
    keywords: ['black-people']
}, {
    id: 14,
    url: 'img/15.jpg',
    keywords: ['bla']
}, {
    id: 15,
    url: 'img/16.jpg',
    keywords: ['bla']
}, {
    id: 16,
    url: 'img/17.jpg',
    keywords: ['putin', 'love']
}, {
    id: 17,
    url: 'img/18.jpg',
    keywords: ['bla']
}];
var gKeywords = {
    'cats': 1,
    'dogs': 12,
    'idiot': 1,
    'trump': 1,
    'kids': 1,
    'alien': 1,
    'omaba': 1,
    'putin': 1,
    'bla': 1
};


function init() {
    renderGallery(gImages);
    addListeners();
    renderCanvas(gMeme);
}

function renderGallery(imgs) {
    var elGallery = document.querySelector('.imgs-grid');
    var strHtmls = imgs.map(img => {
        return `<img class="meme-img" src="${img.url}" id="${img.id}" alt="meme-img" onclick="selectImg('${img.id}')">`
    });
    elGallery.innerHTML = ''
    elGallery.innerHTML = strHtmls.join('');
}

function ToggleMove() {
    gMoveToggle = !gMoveToggle;
    document.querySelector('.move-btn').innerText = (gMoveToggle) ? 'Unmove' : 'Move';
}

function changeAlign(align) {
    if (gMeme.selectedLineIdx !== -1 && gMeme.selectedLineIdx !== null) {
        gMeme.lines[gMeme.selectedLineIdx].align = align;
        renderCanvas();
    }
}

function selectImg(imgId) {
    document.querySelector('.meme-area-container').classList.remove('display-none');
    document.querySelector('.main-container-gallery').classList.add('display-none');
    const selectedMeme = createMeme(imgId);
    renderCanvas(selectedMeme);
    renderGallery(gImages);
}

function RemoveText() {
    if (gMeme.selectedLineIdx !== -1 && gMeme.selectedLineIdx !== null) {
        gMeme.lines.splice(gMeme.selectedLineIdx, 1);
        gMeme.selectedLineIdx = null;
    }
    renderCanvas();
}

function addText() {
    if (gMeme.selectedLineIdx !== -1 && gMeme.selectedLineIdx !== null) {
        gMeme.lines[gMeme.selectedLineIdx].txt = document.querySelector('.meme-text').value;
    } else {
        let pos = (gMeme.lines.length === 0) ? {
            x: 0,
            y: 50
        } : {
            x: 0,
            y: gElCanvas.height
        }
        const line = {
            txt: document.querySelector('.meme-text').value,
            size: 50,
            align: 'left',
            color: document.querySelector('.color-picker-text').value,
            pos: {
                x: pos.x,
                y: pos.y
            }
        }
        gMeme.lines.push(line);
        document.querySelector('.meme-text').value = '';
    }
    renderCanvas();
}

function createMeme(imgId) {
    gMeme = {
        selectedImgId: imgId,
        selectedLineIdx: null,
        lines: [],
        canvasW: null,
        canvasH: null
    };
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
    window.addEventListener('resize', () => {
        renderCanvas(gMeme)
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
    gMeme.selectedLineIdx = isTextClicked(pos);
    if (gMeme.selectedLineIdx !== -1 && gMeme.selectedLineIdx !== null) {
        gStartPos = pos;
        document.body.style.cursor = 'grabbing';
        if (!gMoveToggle) {
            document.querySelector('.meme-text').value = gMeme.lines[gMeme.selectedLineIdx].txt;
        }
    } else {
        document.querySelector('.meme-text').value = '';
        gMeme.selectedLineIdx = null;
        return;
    }
    renderCanvas();
}

function onMove(ev) {
    if (gMeme.selectedLineIdx !== -1 && gMeme.selectedLineIdx !== null && gMoveToggle) {
        const pos = getEvPos(ev)
        const dx = pos.x - gStartPos.x
        const dy = pos.y - gStartPos.y
        gMeme.lines[gMeme.selectedLineIdx].pos.x += dx
        gMeme.lines[gMeme.selectedLineIdx].pos.y += dy
        gStartPos = pos
        renderCanvas();
    }
}

function onUp(ev) {
    if (gMeme.selectedLineIdx !== -1 && gMeme.selectedLineIdx !== null && gMoveToggle) {
        gMeme.selectedLineIdx = null;
        document.body.style.cursor = 'grab';
    }
    renderCanvas();
}

function changeSize(diff) {
    if (gMeme.selectedLineIdx !== -1 && gMeme.selectedLineIdx !== null) {
        gMeme.lines[gMeme.selectedLineIdx].size += diff;
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
    var clickedTextIdx = gMeme.lines.findIndex(line => {
        return x > line.pos.x &&
            x < line.pos.x + gCtx.measureText(line.txt).width &&
            y < line.pos.y &&
            y > line.pos.y - line.size
    })
    return clickedTextIdx;
}

function renderCanvas() {
    var base_image = new Image();
    base_image.src = gImages[gMeme.selectedImgId].url;
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

function drawRect(x, y, line) {
    gCtx.beginPath();
    gCtx.rect(x, y, gCtx.measureText(line.txt).width, -gMeme.lines[gMeme.selectedLineIdx].size);
    gCtx.strokeStyle = 'black'
    gCtx.stroke()
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