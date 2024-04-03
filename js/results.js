
var points = JSON.parse(localStorage.getItem('points'));
var maxPoints = JSON.parse(localStorage.getItem('maxPoints'));

console.log(maxPoints);

document.getElementById("progress-bar-vertical").style.height = `${(100*points)/maxPoints}%`;
document.getElementById("points").innerText = points;