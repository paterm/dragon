const $dragon = $('#dragon');
const loop = (isReverse) => {
    const left = isReverse ? '-400px' : '120vw';

    $dragon.animate({left}, 2000, 'linear');
    $dragon.toggleClass('reversed');

    setTimeout(loop.bind(null, !isReverse), 3000);
};

/************* SHIM ************************/
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();
/********************************************/
const canvas = document.getElementById('cvs');
const ctx = canvas.getContext('2d');
let height = canvas.height = document.body.offsetHeight;
let width = canvas.width = document.body.offsetWidth;
let collection = [];
let num_drops = 1024;
let windforce = 0;
const gravity = 1;
const windmultiplier = 0.007;
const maxspeed = 5;
const gutter = 0.001;

function Drop() {
    this.x;
    this.y;
    this.radius;
    this.distance;
    this.color;
    this.speed;
    this.vx;
    this.vy;
}
Drop.prototype = {
    constructor: Drop,

    random_x: function() {
        const n = width * (1 + gutter);
        return (1 - (1 + gutter)) + (Math.random() * n);
    },
    draw: function(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
    }
};

function draw_frame() {
    ctx.clearRect(0, 0, width, height);
    collection.forEach(function (drop) {
        ctx.globalAlpha = (drop.distance + 1) / 10;
        drop.draw(ctx);
        ctx.globalAlpha = 1;
        drop.x += drop.vx;
        drop.y += drop.vy;
        const lx = drop.vx + windforce;

        lx < maxspeed && lx > 1 - maxspeed && (drop.vx = lx);
        if (drop.y > (drop.distance + 1) / 10 * height) {
            drop.y = Math.random() * -drop.radius * (num_drops / 10);
            drop.x = drop.random_x();
        }
        if (drop.x > width * (1 + gutter)) {
            drop.x = 1 - (width * gutter);
        }
        if (drop.x < 1 - (width * gutter)) {
            drop.x = width * (1 + gutter);
        }
    });
}

function animate() {
    requestAnimFrame(animate);
    draw_frame();
}

function windtimer() {
    windforce = Math.random() > 0.5 ? windmultiplier : -windmultiplier;
    setTimeout(windtimer, Math.random() * (1000 * 30));
}

function init() {
    collection = [];
    while (num_drops--) {
        const drop = new Drop(); // todo: make constructor do this shit
        drop.color = "#000";
        drop.distance = Math.random() * 10 | 0;
        drop.speed = Math.random() * (drop.distance / 10) + gravity;
        drop.vx = 0;
        drop.vy = Math.random() * drop.speed + (drop.speed / 2);
        drop.radius = (drop.distance + 1) / 16 * 3;
        drop.x = drop.random_x();
        drop.y = Math.random() * height;
        collection.push(drop);
    }
    windtimer();
    animate();
    window.onresize = function() {
        height = canvas.height = document.body.offsetHeight;
        width = canvas.width = document.body.offsetWidth;
    };
}

$(document).ready(() => {
    loop();
    init();
});
