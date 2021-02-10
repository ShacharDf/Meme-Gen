var gStartPos;
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

function getImage() {
    //TODO: Add search
    return gImages;
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

function getCurrUrl(){
    return gImages[gMeme.selectedImgId].url;
}