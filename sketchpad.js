
const canvas = document.getElementById('drawingCanvas');
const context = canvas.getContext('2d');
let isDrawing = false;
let mode = 'freehand';
let startX, startY, endX, endY;
let vertices = [];
let currentColor = '#000000';

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 80;

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
canvas.addEventListener('dblclick', completePolygon);

document.getElementById('freehand').addEventListener('click', () => {
    mode = 'freehand';
});

document.getElementById('straightLine').addEventListener('click', () => {
    mode = 'straightLine';
});

document.getElementById('rectangle').addEventListener('click', () => {
    mode = 'rectangle';
});

document.getElementById('ellipse').addEventListener('click', () => {
    mode = 'ellipse';
});

document.getElementById('clear').addEventListener('click', () => {
    mode = 'clear';
});

document.getElementById('square').addEventListener('click', () => {
    mode = 'square';
});

document.getElementById('circle').addEventListener('click', () => {
    mode = 'circle';
});

document.getElementById('polygono').addEventListener('click', () => {
    mode = 'polygono';
});

document.getElementById('polygonc').addEventListener('click', () => {
    mode = 'polygonc';
});

document.getElementById('clear').addEventListener('click', () => {
    mode = 'clear';
    context.clearRect(0, 0, canvas.width, canvas.height);

});

const colorPicker = document.getElementById('colorPicker');
        colorPicker.addEventListener('input', () => {
            currentColor = '#' + colorPicker.value;
        });

function startDrawing(e) {

    startX = e.clientX - canvas.offsetLeft;
    startY = e.clientY - canvas.offsetTop;
    isDrawing = true;

    if (mode === 'freehand'){
        context.beginPath();
        context.moveTo(startX, startY);
    }
    else if (mode === 'polygono' || mode === 'polygonc'){
        vertices.push({ startX, startY });

        context.clearRect(0, 0, canvas.width, canvas.height);
        if (mode === 'polygono') {
            drawOpenPolygon();
        }
        else {
            drawClosedPolygon();
        }
    }
    
}

function draw(e) {
    if (!isDrawing) return;

    endX = e.clientX - canvas.offsetLeft;
    endY = e.clientY - canvas.offsetTop;
    context.strokeStyle = currentColor;

    

    if (mode === 'freehand') {
        context.lineTo(endX, endY);
        context.stroke();
    } else if (mode === 'straightLine') {
        context.lineTo(x, y);
        context.stroke();
    } else if (mode === 'rectangle' || mode === 'square') {
        drawRectangle();
    } else if (mode === 'ellipse' || mode === 'circle') {
        drawEllipse();
    } else if (mode === 'polygonc'){
        context.clearRect(0, 0, canvas.width, canvas.height);
            drawClosedPolygon();
            context.beginPath();
            context.moveTo(vertices[vertices.length - 1].endX, vertices[vertices.length - 1].endX);
            context.lineTo(endX, endX);
            context.stroke();
    }
}

function stopDrawing() {
    isDrawing = false;
    if (mode === 'straightLine'){
        drawLine();
    }
    else if (mode === 'rectangle' || mode === 'square'){
        drawRectangle();
    }
    else if (mode === 'ellipse' || mode === 'circle'){
        drawEllipse();
    }
    else if (mode === 'freehand'){
        context.closePath();
    }
    else if (mode === 'polygonc'){
        drawClosedPolygon();
    }
    
}


function drawLine() {
    

    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
    context.closePath();
}

function drawRectangle() {
    
    
    const width = endX - startX;
    const height = endY - startY;
    const sideLength = Math.min(Math.abs(width), Math.abs(height))

    context.beginPath();
    if (mode === 'rectangle'){
        context.rect(startX, startY, width, height);
    }
    else{
        context.rect(startX, startY, sideLength, sideLength);
    }
    context.stroke();
    context.closePath();
}


function drawEllipse() {
    //context.clearRect(0, 0, canvas.width, canvas.height);
    const radiusX = Math.abs(endX - startX);
    const radiusY = Math.abs(endY - startY);
    const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

    context.beginPath();
    if (mode === 'circle'){
        context.arc(startX, startY, radius, 0, 2 * Math.PI);
    }
    else{
        context.ellipse(startX, startY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    }
    
    context.stroke();
    context.closePath();
}

function drawOpenPolygon() {
    if (vertices.length < 2) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.beginPath();
    context.moveTo(vertices[0].startX, vertices[0].startY);

    for (let i = 1; i < vertices.length; i++) {
        context.lineTo(vertices[i].startX, vertices[i].startY);
    }

    context.stroke();
}

function drawClosedPolygon() {
    if (vertices.length < 2) return;

    context.beginPath();
    context.moveTo(vertices[0].startX, vertices[0].startY);

    for (let i = 1; i < vertices.length; i++) {
        context.lineTo(vertices[i].startX, vertices[i].startY);
    }

    context.closePath();
    context.stroke();
}

function completePolygon() {
    if (mode === 'polygonc'|| mode === 'polygono'){
        if (vertices.length > 2) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawClosedPolygon();
            context.closePath();
            vertices = [];
        }
    }    
}



