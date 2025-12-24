const sectors = [
    {text: '1', value: 0},
    {text: '2', value: 10},
    {text: '3', value: -11},
    {text: '4', value: 50},
    {text: '5', value: -55},
    {text: '6', value: 100},
    {text: '7', value: -110},
    {text: '8', value: 150},
    {text: '9', value: -165},
    {text: '10', value: 'SPECIAL'}
];

let balance = 100;
let spinning = false;
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const scream = new Audio('scream.mp3');
let bgMusic = null;

function initMusic() {
    bgMusic = new Audio('bm.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.8;
    
    document.addEventListener('click', function playMusic() {
        if (bgMusic.paused) {
            bgMusic.play();
        }
        document.removeEventListener('click', playMusic);
    });
    
    setTimeout(() => {
        if (bgMusic.paused) {
            bgMusic.play().catch(() => {});
        }
    }, 1000);
}

function drawWheel() {
    ctx.clearRect(0, 0, 400, 400);
    
    const angle = (2 * Math.PI) / 10;
    
    for(let i = 0; i < 10; i++) {
        const start = i * angle;
        const end = start + angle;
        
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 190, start, end);
        ctx.closePath();
        
        ctx.fillStyle = i % 2 ? '#8B0000' : '#006400';
        ctx.fill();
        
        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate(start + angle/2);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(sectors[i].text, 175, 5);
        ctx.restore();
    }
    
    ctx.beginPath();
    ctx.arc(200, 200, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#D4AF37';
    ctx.fill();
}

function playSound(folder, count) {
    const num = Math.floor(Math.random() * count) + 1;
    const audio = new Audio(`${folder}${num}.mp3`);
    audio.volume = 0.7;
    audio.play();
}

function showScreamer() {
    document.getElementById('screamer').style.display = 'block';
    document.getElementById('screamer-img').src = 'screamer.jpg';
    scream.play();
    setTimeout(() => {
        document.getElementById('screamer').style.display = 'none';
        scream.pause();
        scream.currentTime = 0;
    }, 3000);
}

function spin() {
    if(spinning) return;
    spinning = true;
    
    const selectedIndex = Math.floor(Math.random() * 10);
    const win = sectors[selectedIndex];
    
    const totalDegrees = 5 * 360 + 360 - (selectedIndex * 36 + 18);
    
    canvas.style.transition = 'transform 3s ease-out';
    canvas.style.transform = `rotate(${totalDegrees}deg)`;
    
    setTimeout(() => {
        if(win.value === 'SPECIAL') {
            showScreamer();
            document.getElementById('result').textContent = 'Сектор 10: Сюрприз!';
        } else {
            balance += win.value;
            document.getElementById('balance').textContent = balance;
            document.getElementById('result').textContent = `Сектор ${win.text}: ${win.value > 0 ? '+' : ''}${win.value}$`;
            
            if(win.value > 0) {
                playSound('win', 3);
            } else {
                playSound('los', 3);
            }
            
            if(balance <= 0) {
                document.getElementById('spin').disabled = true;
            }
        }
        
        spinning = false;
    }, 3000);
}

initMusic();
document.getElementById('spin').onclick = spin;
window.onload = drawWheel;