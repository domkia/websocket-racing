const WIDTH = 768;
const HEIGHT = 640;

var carImages = loadCarImages();
var trackImages = loadTrackImages();
var sceneImages = loadSceneImages();

var input = {};
input.x = 0;
input.y = 0;

// get canvas
var canvas = document.getElementById('ctx');
canvas.width = WIDTH;
canvas.height = HEIGHT;

var context = canvas.getContext('2d');

var socket = io();

socket.on('onUpdate', function(players)
{
    // redraw everything
    context.clearRect(0, 0, WIDTH, HEIGHT);
    drawBackground();
    drawTrack();
    drawPlayers(players);
    drawForeground();
});

function drawPlayers(players)
{
    for(var i = 0; i < players.length; i++)
    {
        context.save();
        context.translate(players[i].x, players[i].y);
        context.rotate(players[i].a + Math.PI / 2);
        context.translate(-players[i].x, -players[i].y);

        let p = players[i];
        context.drawImage(carImages[Number(p.id)], p.x - 20, p.y - 32, 39, 65);
        context.restore();
    }
}

function drawTrack()
{
    context.drawImage(trackImages[2],   0, 0);
    context.drawImage(trackImages[1], 128, 0);
    context.drawImage(trackImages[1], 256, 0);
    context.drawImage(trackImages[3], 384, 0);

    context.drawImage(trackImages[4],   0, 128);
    context.drawImage(trackImages[3], 128, 128);
    context.drawImage(trackImages[4], 384, 128);
    context.drawImage(trackImages[1], 512, 128);
    context.drawImage(trackImages[3], 640, 128);

    context.drawImage(trackImages[0], 128, 256);
    context.drawImage(trackImages[2], 384, 256);
    context.drawImage(trackImages[3], 512, 256);
    context.drawImage(trackImages[0], 640, 256);

    context.drawImage(trackImages[2],   0, 384);
    context.drawImage(trackImages[5], 128, 384);
    context.drawImage(trackImages[0], 384, 384);
    context.drawImage(trackImages[4], 512, 384);
    context.drawImage(trackImages[5], 640, 384);

    context.drawImage(trackImages[4], 0, 512);
    context.drawImage(trackImages[1], 128, 512);
    context.drawImage(trackImages[1], 256, 512);
    context.drawImage(trackImages[5], 384, 512);
}

function drawBackground()
{
    for(var y = 0; y < 5; y++)
    {
        for(var x = 0; x < 6; x++)
        {
            context.drawImage(sceneImages[2], x * 128, y * 128);
        }
    }
}

function drawForeground()
{
    context.drawImage(sceneImages[0], 216, 250);
    context.drawImage(sceneImages[1], 14, 270, 100, 100);
    context.drawImage(sceneImages[3], 526, 8, 240, 100);
}

function loadTrackImages()
{
    var track = new Array();
    track[0] = new Image();
    track[0].src = 'client/res/track/track_straight_vert.png';
    track[1] = new Image();
    track[1].src = 'client/res/track/track_straight_hor.png';
    track[2] = new Image();
    track[2].src = 'client/res/track/track_right_turn.png';
    track[3] = new Image();
    track[3].src = 'client/res/track/track_left_turn.png';
    track[4] = new Image();
    track[4].src = 'client/res/track/track_right_turn_flip.png';
    track[5] = new Image();
    track[5].src = 'client/res/track/track_left_turn_flip.png';
    return track;
}

function loadCarImages()
{
    var cars = new Array();
    for(var i = 0; i < 5; i++)
    {
        cars[i] = new Image();
        cars[i].src = 'client/res/cars/car_'+ i +'.png';
    }
    return cars;
}

function loadSceneImages()
{
    var images = new Array();
    images[0] = new Image();
    images[0].src = 'client/res/scene/tree.png';
    images[1] = new Image();
    images[1].src = 'client/res/scene/tent.png';
    images[2] = new Image();
    images[2].src = 'client/res/scene/grass.png';
    images[3] = new Image();
    images[3].src = 'client/res/scene/tribune.png';
    return images;
}

document.onkeydown = function(event)
{
    event.view.event.preventDefault();
    if(event.keyCode === 37){
        input.x = -1;
    }
    if(event.keyCode === 38){
        input.y = 1;
    }
    if(event.keyCode === 39){
        input.x = 1;
    }
    if(event.keyCode === 40){
        input.y = -1;
    }
    socket.emit('carInput', input);
}

document.onkeyup = function(event)
{
    if(event.keyCode === 37){
        if(input.x < 0)
            input.x = 0;
    }
    if(event.keyCode === 39){
        if(input.x > 0)
            input.x = 0;
    }
    if(event.keyCode === 38){
        if(input.y > 0)
            input.y = 0;
    }
    if(event.keyCode === 40){
        if(input.y < 0)
            input.y = 0;
    }
    socket.emit('carInput', input);
}