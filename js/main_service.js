var gMeme = {
    selectedImgId: 0,
    selectedLineIdx: null,
    selectedStickerIdx: null,
    lines: [{
        txt: '',
        size: 20,
        align: 'left',
        color: 'red',
        frame: 'white',
        pos: {
            x: 10,
            y: 10
        }
    }],
    stickers: [{
        id: 1,
        size: 1,
        pos: {
            x: 10,
            y: 10
        }
    }]
};
var gImages = [{
    id: 0,
    url: 'img/1.jpg',
    keywords: ['trump', 'politician']
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
    keywords: ['kids']
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
    keywords: ['omaba', 'politician']
}, {
    id: 10,
    url: 'img/11.jpg',
    keywords: ['kiss', 'people']
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
    keywords: ['people']
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
    keywords: ['putin', 'politician']
}, {
    id: 17,
    url: 'img/18.jpg',
    keywords: ['bla']
}, {
    id: 18,
    url: 'img/19.jpg',
    keywords: ['bla']
}, {
    id: 19,
    url: 'img/20.jpg',
    keywords: ['bla']
}, {
    id: 20,
    url: 'img/21.jpg',
    keywords: ['bla']
}, {
    id: 21,
    url: 'img/22.jpg',
    keywords: ['bla']
}, {
    id: 22,
    url: 'img/23.jpg',
    keywords: ['people', 'dance']
}, {
    id: 23,
    url: 'img/24.jpg',
    keywords: ['trump', 'politician']
}, {
    id: 24,
    url: 'img/25.jpg',
    keywords: ['opera']
}];
/*var gKeywords = {
    'cats': 5,
    'dogs': 4,
    'trump': 9,
    'kids': 2,
    'alien': 3
};*/
var gStickers = [{
    id: '0',
    url: 'stickers/1.png'
}, {
    id: '1',
    url: 'stickers/2.png'
}, {
    id: '2',
    url: 'stickers/3.png'
}, {
    id: '3',
    url: 'stickers/4.png'
}, {
    id: '4',
    url: 'stickers/5.png'
}]

function getKeyWords(size) {
    let keyWordsAndValue = [];
    for (keyWord in gKeywords) {
        keyWordsAndValue.push({
            keyWord,
            value: gKeywords[keyWord]
        });
    }
    keyWordsAndValue.sort((a, b) => {
        return b.value - a.value;
    })

    return (keyWordsAndValue.slice(0, size));
}

function getStickers() {
    return gStickers;
}

function getImage(search = '') {
    let searchedImages = [];
    if (!search) return gImages;
    else {
        searchedImages = gImages.filter(img => {
            return img.keywords.some(word => {
                return (word.includes(search));
            })
        })
    }
    return searchedImages;
}

function removeText(isLine) {
    if (isLine) {
        gMeme.lines.splice(gMeme.selectedLineIdx, 1);
        gMeme.selectedLineIdx = null;
    } else {
        gMeme.stickers.splice(gMeme.selectedStickerIdx, 1);
        gMeme.selectedStickerIdx = null;
    }
}

function addText(text, color, frame) {
    let pos = (gMeme.lines.length === 0) ? {
        x: 0,
        y: 50
    } : {
        x: 0,
        y: gElCanvas.height
    }
    const line = {
        txt: text,
        size: 50,
        align: 'left',
        color: color,
        frame: frame,
        pos: {
            x: pos.x,
            y: pos.y
        }
    }
    gMeme.lines.push(line);
}

function addSticker(stickerId) {
    const stkr = {
        id: stickerId,
        size: 1,
        url: gStickers[stickerId].url,
        pos: {
            x: 10,
            y: 10
        }
    }
    gMeme.stickers.push(stkr);
}

function createMeme(imgId) {
    gMeme = {
        selectedImgId: imgId,
        selectedLineIdx: null,
        selectedStickerIdx: null,
        lines: [],
        stickers: []
    };
}

function getMeme() {
    return gMeme;
}

function getSelectedValue() {
    return (gMeme.selectedLineIdx);
}

function setSelectedValue(idx) {
    gMeme.selectedLineIdx = idx;
}

function setSelectedSticker(idx) {
    gMeme.selectedStickerIdx = idx;
}

function getSelectedSticker() {
    return gMeme.selectedStickerIdx;
}

function getSelectedLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}

function updateLinePos(dx, dy) {
    gMeme.lines[gMeme.selectedLineIdx].pos.x += dx;
    gMeme.lines[gMeme.selectedLineIdx].pos.y += dy;
}

function updatestickerPos(dx, dy) {
    gMeme.stickers[gMeme.selectedStickerIdx].pos.x += dx;
    gMeme.stickers[gMeme.selectedStickerIdx].pos.y += dy;
}

function changeSize(diff) {
    if (gMeme.selectedLineIdx !== null) gMeme.lines[gMeme.selectedLineIdx].size += diff;
    else if (gMeme.selectedStickerIdx !== null) gMeme.stickers[gMeme.selectedStickerIdx].size += diff * 0.1;
}

function changeColorIn(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color;
}

function changeColorOut(color) {
    gMeme.lines[gMeme.selectedLineIdx].frame = color;
}

function changeColor(color, key) {
    gMeme.lines[gMeme.selectedLineIdx][key] = color;
}

function getCurrUrl() {
    return gImages[gMeme.selectedImgId].url;
}

function changeAlignS(align) {
    gMeme.lines[gMeme.selectedLineIdx].align = align;
}