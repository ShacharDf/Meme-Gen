var gStartPos;
var gMeme = {
    selectedImgId: 0,
    selectedLineIdx: null,
    selectedStickerIdx: null,
    lines: [{
        txt: '',
        size: 20,
        align: 'left',
        color: 'red',
        pos: {
            x: 10,
            y: 10
        }
    }],
    stickers: [{

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
var gKeywords = {
    'cats': 1,
    'dogs': 12,
    'trump': 1,
    'kids': 1,
    'alien': 1
};
var gStickers = [{
    id: 'sticker1',
    url: 'stickers/1.png'
}, {
    id: 'sticker2',
    url: 'stickers/2.png'
}, {
    id: 'sticker3',
    url: 'stickers/3.png'
}, {
    id: 'sticker4',
    url: 'stickers/4.png'
}, {
    id: 'sticker5',
    url: 'stickers/5.png'
}]

function getKeyWords(){
    //TODO: Add key words
}

function getStickers() {
    //TODO: 1 size stickers & sizes
    return gStickers;
}
//TODO: design the search bar
//TODO: desin the btns
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

function changeAlignS(align) {
    gMeme.lines[gMeme.selectedLineIdx].align = align;
}

function removeTextS() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    gMeme.selectedLineIdx = null;
}

function addTextS(text, color) {
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
        pos: {
            x: pos.x,
            y: pos.y
        }
    }
    gMeme.lines.push(line);
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

function getMeme() {
    return gMeme;
}

function getSelectedValue() {
    return (gMeme.selectedLineIdx);
}

function setSelectedValue(idx) {
    gMeme.selectedLineIdx = idx;
}

function getSelectedLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}

function updateLinePos(dx, dy) {
    gMeme.lines[gMeme.selectedLineIdx].pos.x += dx;
    gMeme.lines[gMeme.selectedLineIdx].pos.y += dy;
}

function changeSizeS(diff) {
    gMeme.lines[gMeme.selectedLineIdx].size += diff;
}

function changeColorS(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color;
}

function getCurrUrl() {
    return gImages[gMeme.selectedImgId].url;
}