
var gameMode;

localStorage.clear();

function modeSelect(mode) {
    gameMode = mode;
    localStorage.setItem('gameMode', JSON.stringify(gameMode));
    window.location.href = './page/settings.html';
}