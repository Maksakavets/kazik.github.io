const SECTORS = [
    {id: '1', value: 0},
    {id: '2', value: 10},
    {id: '3', value: -11},
    {id: '4', value: 50},
    {id: '5', value: -55},
    {id: '6', value: 100},
    {id: '7', value: -110},
    {id: '8', value: 150},
    {id: '9', value: -165},
    {id: '10', value: 'SPECIAL'}
];

const COLORS = ['#006400', '#8B0000'];
const SECTOR_COUNT = SECTORS.length;
const SECTOR_ANGLE = 360 / SECTOR_COUNT;
const CENTER = 200;
const RADIUS = 190;

let balance = 100;
let isSpinning = false;
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const screamAudio = new Audio('scream.mp3');
let bgMusic = null;

function initMusic() {
    bgMusic = new Audio('bm.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.8;
    
    document.addEventListener('click', () => {
        if (bgMusic.paused) bgMusic.play();
    });
    
    setTimeout(() => {
        if (bgMusic.paused) bgMusic.play().catch(() => {});
    }, 1000);
}

function drawWheel() {
    ctx.clearRect(0, 0, 400, 400);
    const angle = (2 * Math.PI) / SECTOR_COUNT;
    
    for(let i = 0; i < SECTOR_COUNT; i++) {
        const start = i * angle;
        
        ctx.beginPath();
        ctx.moveTo(CENTER, CENTER);
        ctx.arc(CENTER, CENTER, RADIUS, start, start + angle);
        ctx.closePath();
        ctx.fillStyle = COLORS[i % 2];
        ctx.fill();
        
        ctx.save();
        ctx.translate(CENTER, CENTER);
        ctx.rotate(start + angle/2);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(SECTORS[i].id, RADIUS - 15, 5);
        ctx.restore();
    }
    
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#D4AF37';
    ctx.fill();
}

function playRandomSound(type) {
    const num = Math.floor(Math.random() * 3) + 1;
    new Audio(`${type}${num}.mp3`).play();
}

function showScreamer() {
    const screamer = document.getElementById('screamer');
    screamer.style.display = 'block';
    document.getElementById('screamer-img').src = 'screamer.jpg';
    screamAudio.play();
    setTimeout(() => {
        screamer.style.display = 'none';
        screamAudio.pause();
        screamAudio.currentTime = 0;
    }, 3000);
}

function spin() {
    if (isSpinning) return;
    isSpinning = true;
    
    const selectedIndex = Math.floor(Math.random() * SECTOR_COUNT);
    const sector = SECTORS[selectedIndex];
    const totalRotation = 5 * 360 + 360 - (selectedIndex * SECTOR_ANGLE + SECTOR_ANGLE/2);
    
    canvas.style.transition = 'transform 3s ease-out';
    canvas.style.transform = `rotate(${totalRotation}deg)`;
    
    setTimeout(() => {
        if (sector.value === 'SPECIAL') {
            showScreamer();
            document.getElementById('result').textContent = 'Сектор 10: Сюрприз!';
        } else {
            balance += sector.value;
            document.getElementById('balance').textContent = balance;
            document.getElementById('result').textContent = 
                `Сектор ${sector.id}: ${sector.value > 0 ? '+' : ''}${sector.value}$`;
            
            playRandomSound(sector.value > 0 ? 'win' : 'los');
            
            if (balance <= 0) {
                document.getElementById('spin').disabled = true;
            }
        }
        
        isSpinning = false;
    }, 3000);
}

initMusic();
document.getElementById('spin').addEventListener('click', spin);
window.addEventListener('load', drawWheel);