const $dragon = $('#dragon');
const loop = (isReverse) => {
    const left = isReverse ? '-400px' : '120vw';

    $dragon.animate({left}, 2000, 'linear');
    $dragon.toggleClass('reversed');

    setTimeout(loop.bind(null, !isReverse), 3000);
};

$(document).ready(() => {
    loop();
});
