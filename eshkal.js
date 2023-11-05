/**
 * Resources
 * https://www.online-toolz.com/tools/character-map.php
 */

const rootShapeLetterMap = new Map();
const similarLettersMap = new Map();
const arabicToEnglishMap = new Map();
const distortionLetters = ['ا', 'ل', 'ر', 'م', 'و', 'ء', '(', ')', '{', '}', '-', '_', '*', '^', '~', '`', ':', '\'', '/', '\\', '=', '+', '@', '#', ',', '', ''];

let options = {
    normalized: true,
    similar: false,
    english: false,
    tashkeel: false,
    fasel: false,
    distortion: false,
    outputType: 'text',
    font: 'Droid Arabic Kufi',
    fontsize: 0,
    bgcolor: '#ffffff',
    additionalTopMargin: 0
}

const tashkeelat = ['َ', 'ً', 'ُ', 'ٌ', 'ِ', 'ٍ', 'ْ', 'ّ'];
const fawasel = [' ', ',', '.', 'ـ', '،'];
const fonts = ['Noto Naskh Arabic', 'Amiri', 'Droid Arabic Naskh', 'Noto Kufi Arabic', 'Noto Nastaliq Urdu', 'Vibes'];
const fontNames = ['عادي', 'أميري', 'نسخ', 'كوفي', 'أوردو', 'ملخبط'];
let selectedFontIndex = 0;

let finalOutputText = "";
const copyLabel = "نسخ"; 
const doneLabel = "تم النسخ"

const inputElement = document.getElementById("in");
const outputElement = document.getElementById("out");
const copyElement = document.getElementById("copy");
const canvas = document.getElementById('out-canvas');
const canvasContainer = document.getElementById('out-canvas-container');
const drawOptionsElements = document.getElementsByClassName('option-image');

var debug = false;


function init() {

    debug = localStorage.getItem("debug") === 'y';

    initRootShapeLetterMap();
    initSimilarLettersMap();
    initArabicToEnglishMap();

    listenForWriting();
    listenForOptions();
    apply();

    function listenForOptions() {
        const optionElements = document.getElementsByClassName("option");
        for (let i = 0; i < optionElements.length; i++) {
            optionElements[i].onchange = () => apply();
        }
    }

    function listenForWriting() {
        const inputElement = document.getElementById("in");
        inputElement.onkeyup = () => apply();
    }

    function initRootShapeLetterMap() {
        rootShapeLetterMap['أ'] = 'ا';
        rootShapeLetterMap['إ'] = 'ا';
        rootShapeLetterMap['آ'] = 'ا';

        rootShapeLetterMap['ب'] = 'ٮ';
        rootShapeLetterMap['ت'] = 'ٮ';
        rootShapeLetterMap['ث'] = 'ٮ';

        rootShapeLetterMap['ج'] = 'ح';
        rootShapeLetterMap['خ'] = 'ح';

        rootShapeLetterMap['ذ'] = 'د';
        rootShapeLetterMap['ز'] = 'ر';
        rootShapeLetterMap['ش'] = 'س';
        rootShapeLetterMap['ض'] = 'ص';
        rootShapeLetterMap['ظ'] = 'ط';
        rootShapeLetterMap['غ'] = 'ع';

        rootShapeLetterMap['ف'] = 'ٯ';
        rootShapeLetterMap['ق'] = 'ٯ';

        rootShapeLetterMap['ن'] = 'ٮ';
        rootShapeLetterMap['ة'] = 'ه';
        rootShapeLetterMap['ؤ'] = 'و';

        rootShapeLetterMap['ي'] = 'ى';
        rootShapeLetterMap['ئ'] = 'ى';
    }

    function initSimilarLettersMap() {
        similarLettersMap['ا'] = ['ﺍ', 'ﺎ', 'ﺂ', 'ﺁ', 'آ', 'آ', 'إ', 'ٲ', 'ٳ', 'ٵ', 'i', '|', 'Ĩ'];

        similarLettersMap['ب'] = ['پ'];
        similarLettersMap['ت'] = ['ﺘ', 'ﺗ', 'ﺖ', 'ﺕ', 'ٺ', 'ὓ', 'ᒩ', 'ᒏ', 'ᓙ'];
        similarLettersMap['ث'] = ['ﺙ', 'ﺚ', 'ﺜ', 'ﺛ', 'ٽ', 'ٿ', 'ڽ', 'ῢ'];

        similarLettersMap['ج'] = ['ﺝ', 'ﺞ', 'ﺠ', 'ﺟ', 'چ', 'ڇ', 'ڄ', 'ڃ', 'ܓ', 'ܕ'];
        similarLettersMap['ح'] = ['Շ', 'ܒ', 'Ⴀ'];
        similarLettersMap['خ'] = ['ڂ'];
        
        
        similarLettersMap['د'] = ['ܖ'];
        similarLettersMap['ذ'] = ['ܪ'];
        similarLettersMap['ر'] = ['ڔ'];
        similarLettersMap['ز'] = ['ڒ'];

        

        similarLettersMap['ع'] = ['Ɛ', 'Ƹ', 'ƹ', 'ξ'];
        similarLettersMap['غ'] = ['ἐ', 'ἑ', 'ڠ'];

        similarLettersMap['ف'] = ['ġ', 'ᓅ'];
        similarLettersMap['ق'] = ['ﻕ', 'ﻖ', 'ﻘ', 'ﻗ', 'ᓆ'];

        similarLettersMap['س'] = ['ﺱ', 'ﺲ', 'ﺴ', 'ﺳ', 'w', 'Ɯ', '൘', 'ڛ'];
        similarLettersMap['ش'] = ['ѿ', 'ڜ', 'ڜ'];
        
        similarLettersMap['ص'] = ['ڝ'];
        similarLettersMap['ض'] = ['ڞ'];
        similarLettersMap['ظ'] = ['ڟ'];

        similarLettersMap['ل'] = ['ﻝ', 'ﻞ', 'ﻠ', 'ﻟ', 'ڵ', 'ڶ', 'ڷ', 'ڸ', 'j', 'Ĵ'];
        similarLettersMap['م'] = ['ﻡ', 'ﻢ', 'ﻤ', 'ﻣ', 'ܩ'];
        similarLettersMap['ن'] = ['ﻥ', 'ﻦ', 'ﻨ', 'ﻧ', 'ڼ', 'ڹ', 'ῡ', 'ᒨ', 'ᓘ'];

        similarLettersMap['ه'] = ['@', 'ö', 'Թ', 'ܤ', 'ܣ', 'ܣ'];
        similarLettersMap['و'] = ['ܦ'];

        similarLettersMap['ة'] = ['ᓏ', 'ᓍ'];
    }

    function initArabicToEnglishMap() {
        arabicToEnglishMap['ب'] = 'b';
        arabicToEnglishMap['ت'] = 't';
        arabicToEnglishMap['ج'] = 'g';
        arabicToEnglishMap['د'] = 'd';
        arabicToEnglishMap['ر'] = 'r';
        arabicToEnglishMap['ز'] = 'z';
        arabicToEnglishMap['س'] = 's';
        arabicToEnglishMap['ف'] = 'f';
        arabicToEnglishMap['ك'] = 'k';
        arabicToEnglishMap['م'] = 'm';
        arabicToEnglishMap['ن'] = 'n';
        arabicToEnglishMap['ه'] = 'h';
    }
}

function readOption(option) {
    return document.getElementById(option).checked;
}

function readOptionValue(option) {
    return document.getElementById(option).value;
}

// function changeFont() {
//     if (++selectedFontIndex >= fonts.length) {
//         selectedFontIndex = 0;
//     }
//     document.getElementById('option-font').value = fonts[selectedFontIndex];
//     debug && console.log('change font ', fonts[selectedFontIndex]);
//     debug && console.log('change font applied ', document.getElementById('option-font').value);
//     apply();
// }

function fontPlus() {
    fontSet(fontGet() + 5);
}

function fontMinus() {
    fontSet(fontGet() - 5);
}

function fontGet() {
    return parseInt(document.getElementById('option-fontsize').value);
}

function fontSet(value) {
    document.getElementById('option-fontsize').value = value;
    apply();
}

function readOptions() {
    return {
        similar: readOption('option-similar'),
        normalized: readOption('option-nodots'),
        english: readOption('option-english'),
        tashkeel: readOption('option-tashkeel'),
        fasel: readOption('option-fasel'),
        distortion: readOption('option-distortion'),
        outputType: document.querySelector('input[name="option-out"]:checked').value,
        font: readOptionValue('option-font'),
        fontsize: readOptionValue('option-fontsize'),
        bgcolor: readOptionValue('option-bgcolor'),
        imageSize: readOptionValue('option-image-size'),
        additionalTopMargin: 0
    }
}

function apply(e) {
    console.log('apply', e);
    options = readOptions();
    console.log('option-out', options.outputType, document.querySelector('input[name="option-out"]:checked').value);
    console.log('apply options', options);
    applyViewChanges(options);
    const inputValue = inputElement.value;
    finalOutputText = convertText(inputValue);
    outputElement.value = finalOutputText;
    if (options.outputType == 'image') {
        drawCanvas();
    }
}

function drawCanvas() {
    console.log('canvas', canvas);
    var ctx = canvas.getContext("2d");
    ctx.direction = "rtl";
    // ctx.filter = "blur(2 px)";
    // ctx.globalAlpha = 0.5;
    // canvas.width = canvas.parentElement.width;
    // canvas.height = canvas.parentElement.height;

    options.additionalTopMargin = 0;

    let fontSize = parseInt(options.fontsize);

    options.drawEnabled = false;
    while ((textHeight = tryDrawWithFont(canvas, ctx, fontSize)) > canvas.height) {
        fontSize -= 5;
        if (fontSize <=10) {
            break;
        }
        debug && console.log('*** Text not fit, decreasing font-size', fontSize);
    }

    bottomSpace = canvas.height - textHeight;
    options.additionalTopMargin = bottomSpace / 2;
    console.log("remeasure spacing", canvas.height, textHeight, bottomSpace, ctx.additionalTopMargin);
    options.drawEnabled = true;
    tryDrawWithFont(canvas, ctx, fontSize);

    // ctx.rotate((45 * Math.PI) / 180);
    // ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function tryDrawWithFont(canvas, ctx, fontSize) {
    var lines = finalOutputText.split('\n');
    // console.log(lines);
    
    var lineHeight = fontSize * 1.5;
    var margin = 140;
    
    ctx.font = fontSize + "px " + options.font;
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = options.bgcolor;
    options.drawEnabled && ctx.fillRect(0, 0, canvas.width, canvas.height);

    options.drawEnabled && (ctx.fillStyle = isDarkColor(options.bgcolor) ? 'white' : 'black');


    debug && console.log('draw context', ctx);
    debug && console.log('font', ctx.font);
    
    var writingAreaWidth = canvas.width - margin;
    var x = canvas.width - margin / 2;
    var y = lineHeight + options.additionalTopMargin;
    console.log("draw init", x, y, options);

    var lineIndex = 0;
    for (var i = 0; i<lines.length; i++) {
        let line = lines[i];
        debug && console.log('line measure', ctx.measureText(line));
        while (ctx.measureText(line).width > writingAreaWidth) {
            let breakIndex = findBreakIndex(line, writingAreaWidth, ctx);
            debug && console.log('breakIndex', breakIndex);
            if (breakIndex == -1) {
                debug && console.log('breakIndex WARN', breakIndex);
                breakIndex = 50;
            }
            let printedLine = line.substring(0, breakIndex);
            if (options.drawEnabled) {
                ctx.fillText(printedLine, x, y + (lineIndex * lineHeight) );
                if (options.distortion) {
                    for(d=0; d<canvas.width; d+=canvas.width/7) {
                        ctx.fillText(randomFrom(distortionLetters), d - random(canvas.width/7), y + (lineIndex * lineHeight) );
                    }
                }
            }
            lineIndex++;
            debug && console.log('PRINT-L1', printedLine, x, y);
            line = line.substring(breakIndex + 1);
        }
        if (options.drawEnabled) {
            options.drawEnabled && ctx.fillText(line, x, y + (lineIndex * lineHeight) );
            if (options.distortion) {
                ctx.fillText(randomFrom(distortionLetters), canvas.width - random(canvas.width/5), y + (lineIndex * lineHeight) );
            }
        }
        
        lineIndex++
        debug && console.log('PRINT-L2', line);
    }
    lineIndex--;
    const textHeight = lineIndex * lineHeight + 2 * lineHeight;
    debug && console.log('Text fitting check', textHeight, canvas.height);

    return textHeight;
}

function findBreakIndex(line, maxWidth, ctx) {
    let index = line.length - 1;
    // debug && console.log('COMPARE', ctx.measureText(line.substring(index)).width)
    while (ctx.measureText(line.substring(0, index)).width > maxWidth) {
        debug && console.log('measure', line.substring(0, index), ctx.measureText(line.substring(0, index)).width, maxWidth)
        i = findNearestSpace(line, --index);
        if (i < 1) {
            return index;
        }
        index = i;
    }
    return index;
}

function findNearestSpace(line, index) {
    while (line.charAt(index) !== ' ') {
        if (index == 0) {
            return 0;
        }
        index--;
    }
    return index;
}

function applyViewChanges(options) {
    debug && console.log('applyViewChanges', options);
    if (options.outputType == 'image') {
        canvasContainer.style.display = 'block';

        dim = options.imageSize.split('x');
        canvas.width = dim[0];
        canvas.height = dim[1];

        console.log('image size', canvas.width, canvas.height);

        for (let i = 0; i < drawOptionsElements.length; i++) {
            drawOptionsElements[i].style.display = 'block';
        }
        outputElement.style.display = 'none';

        document.getElementById('option-font').style.font = options.font;

    } else {
        canvasContainer.style.display = 'none';
        for (let i = 0; i < drawOptionsElements.length; i++) {
            drawOptionsElements[i].style.display = 'none';
        }
        outputElement.style.display = 'block';
    }
}

function convertText(original) {
    const lines = original.split("\n");
    let output = "";
    for (let i = 0; i < lines.length; i++) {
        const lineOut = convertLine(lines[i])
        output += lineOut;
        if (i < lines.length - 1) {
            output += "\n";
        }
    }
    return output;
}

function convertLine(original) {
    const words = original.split(" ");
    let output = "";
    for (let i = 0; i < words.length; i++) {
        const wordOut = convertWord(words[i])
        output += wordOut;
        if (i < words.length - 1) {
            output += " ";
        }
    }
    return output;
}

function convertWord(original) {
    // debug && console.log('convert word', original);
    if (original.charAt(0) === '#') {
        return original;
    }
    let output = "";
    const wordContext = {
        skipNextShapeChange: false,
        skipNextLetterAppend: false,
        skipallShapeChanges: false,
        englishCharacterReplaced: false,
        canChangeShape: () => !this.skipNextShapeChange && !this.skipallShapeChanges
    };

    if (original.length < 4) {
        wordContext.skipShapeChange = true;
    }

    for (let i = 0; i < original.length; i++) {
        const out = convertChar(original.charAt(i), wordContext);
        if (original.charAt(i) === 'ه') {
            wordContext.skipShapeChange = true;
            wordContext.skipNextLetterAppend = true;
        }
        output += out;
    }
    return output;
}

function convertChar(c, wordContext) {

    let out = c;
    
    if (options.normalized && rootShapeLetterMap[c]) {
        out = rootShapeLetterMap[c];
    } else if (wordContext.canChangeShape() && options.english && !wordContext.englishCharacterReplaced && arabicToEnglishMap[c] && probabilityOf(2)) {
        out = arabicToEnglishMap[c];
        wordContext.englishCharacterReplaced = true;
    } else if (wordContext.canChangeShape() && options.similar && similarLettersMap[c] && probabilityOf(2)) {
        out = similarLettersMap[c][random(similarLettersMap[c].length)];
    }

    if (options.tashkeel && probabilityOf(2)) {
        out += randomFrom(tashkeelat);
    }

    if (!wordContext.skipNextLetterAppend && options.fasel && probabilityOf(4)) {
        out += randomFrom(fawasel);
    }

    if (wordContext.skipNextShapeChange) {
        wordContext.skipNextShapeChange = false;
    }
    if (wordContext.skipNextLetterAppend) {
        wordContext.skipNextLetterAppend = false;
    }

    return out;
}

/* utils */

function copyToClipBoard() {
    if (!navigator.clipboard) {
        return;
    }
    if (options.outputType = 'image') {
        var canvas = document.getElementById("out-canvas");
        canvas.toBlob(function(blob) { 
            const item = new ClipboardItem({ "image/png": blob });
            navigator.clipboard.write([item]); 
            toast('تم النسخ');
        });
    } else {
        navigator.clipboard.writeText(finalOutputText).then(function () {
            toast('تم النسخ');
        }, function (err) {
            debug && console.log('Async: Copying to clipboard was successful!');
            toast('غير ممكن, قم بالنسخ يدوياً');
        });
    }
}

function changeButtonLabel(element, text){
    element.innerText = text;
}

function toast(message) {
    var snackbar = document.getElementById("snackbar");
    snackbar.innerHTML = message;
    snackbar.className = 'show'
    setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 3000);
}

function probabilityOf(lessThan) {
    return Math.floor(Math.random() * lessThan) == 0;
}

function randomFrom(arr) {
    return arr[random(arr.length)];
}

function random(lessThan) {
    return Math.floor(Math.random() * lessThan);
}

/* https://stackoverflow.com/questions/12043187/how-to-check-if-hex-color-is-too-black */
function isDarkColor(color) {
    var c = color.substring(1);      // strip #
    var rgb = parseInt(c, 16);   // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff;  // extract red
    var g = (rgb >>  8) & 0xff;  // extract green
    var b = (rgb >>  0) & 0xff;  // extract blue

    var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

    return luma < 140;
}