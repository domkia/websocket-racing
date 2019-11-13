const PORT = 9000;

// initialize
var express = require('express');
var app = express();
var server = require('http').Server(app);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

server.listen(PORT);
console.log('Server listening on port: ' + PORT);

var io = require('socket.io')(server, {});
var cars = {};

io.sockets.on('connection', function(car)
{
    // create car
    car.id = Math.random();
    car.angle = -Math.PI / 2;
    car.x = 460;
    car.y = 430;
    car.speed = 0;
    car.input = { x: 0, y: 0 };
    car.carId = Math.floor(Math.random() * 4);
    cars[car.id] = car;

    // handle disconnection
    car.on('disconnect', function()
    {
        console.log('Socket disconnected: ' + car.id);
        delete cars[car.id];
    });

    // handle car input
    car.on('carInput', (input) => car.input = input);
});

setInterval(function()
{
    var data = [];

    // update clients positions
    for(var i in cars)
    {
        var car = cars[i];
        updateCar(car);
        data.push(
            {
                x: car.x,
                y: car.y,
                a: car.angle,
                id: car.carId
            }
        );
    }

    // send positional data to all clients
    for(var i in cars)
    {
        var car = cars[i];
        car.emit('onUpdate', data);
    }
}, 33);

const MAX_SPEED = 12;
const ACCELERATION = 1;
const BRAKING = 2;
const DRAG = 0.95;
const STEERING = 0.12;

function updateCar(car)
{
    // car steering
    if(car.input.x != 0)
    {
        let steerAmount = STEERING;
        if(car.speed < 2.0)
        {
            steerAmount = car.speed / 2.0 * STEERING;
        }
        car.angle += car.input.x * steerAmount;
    }

    // car acceleration / braking
    if(car.input.y > 0)
    {
        if(car.speed < MAX_SPEED)
        {
            car.speed += ACCELERATION;
        }
    }
    else if(car.input.y < 0)
    {
        if(car.speed > 0)
        {
            car.speed -= BRAKING;
        }
    }
    else
    {
        if(car.speed != 0)
        {
            car.speed *= DRAG;
        }
    }

    // update car position
    let dir_x = Math.cos(car.angle);
    let dir_y = Math.sin(car.angle);
    car.x = car.x + dir_x * car.speed;
    car.y = car.y + dir_y * car.speed;
}