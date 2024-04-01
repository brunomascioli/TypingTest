import text from "./text.js";

const $screenCard = document.querySelector("#screen-card");
const $timeCounter = document.querySelector("#time");
const $botaoIniciar1min = document.querySelector("#botao-1min");
const $botaoIniciar2min = document.querySelector("#botao-2min");
const $botaoIniciar3min = document.querySelector("#botao-3min");
const $telaInicial = document.querySelector("#tela-inicial");
const $endGame = document.querySelector("#end-game");
const $gameTitle = document.querySelector("#game-title");

let started = 0, caracteres_digitados = 0;
let count = 0, erros = 0, count_palavras = 0, countTime = 0, timeCount = 0;
let words = text.split(" ").map(p => p + " ");

$botaoIniciar1min.addEventListener("click", ()=>{
    timeCount = 60
    mainFunction()
});

$botaoIniciar3min.addEventListener("click", ()=>{
    timeCount = 120
    mainFunction()
});

$botaoIniciar2min.addEventListener("click", ()=>{
    timeCount = 180
    mainFunction()
});

function loadText(){
    words.forEach(str => {
        let word = document.createElement("div")
        word.classList.add("word");
        [...str].forEach(char => {
            let letter = document.createElement("div");
            letter.classList.add("letter");
            char == " " ? letter.innerHTML = "&nbsp" : letter.innerText = char;
            word.appendChild(letter)
        })
        $screenCard.appendChild(word);
    })
    $screenCard.style.display = "flex";
};

function showStats(){
    let ppm = document.createElement("p");
    let precisao = document.createElement("p");
    console.log(erros, count)
    precisao.innerText = `Precisão: ${(1 - erros/caracteres_digitados).toFixed(2) * 100}%`;
    ppm.innerText = `Velocidade: ${count_palavras}ppm`;

    $screenCard.style.filter = 'blur(4px)';
    $endGame.appendChild(ppm);
    $endGame.appendChild(precisao);
    $endGame.style.display = 'flex';
}

function iniciarContagem(){
    
    $timeCounter.innerHTML = '-';

    const intervalId = setInterval(() => {
        timeCount --;
        
        if (timeCount < 0) {
            clearInterval(intervalId);
            showStats();
        }else{
            $timeCounter.innerHTML = `${timeCount}`;
        }
    }, 1000);
}

function adicionarEfeitoSonoro(acertouCaractere){
    let audio = acertouCaractere ? new Audio('./typingsound.mp3') :
    new Audio('./wrongtyping.mp3'); 

    audio.play();
}

function handleKeyPress(event) {
    const $allCharacters = document.querySelectorAll(".letter")
    
    const palavraDigitada = event.key;

    if(event.key && !started){
        started = 1
        iniciarContagem();
    }
    
    if(event.keyCode === 32){
        event.preventDefault();
    }
    
    if (isPunctuationOrSpace(palavraDigitada)) {
        count_palavras++;
    }
    
    if('abcdefghijklmnopqrstuvwxyzáéíóúãõç.,?! '.split("").includes(palavraDigitada.toLowerCase())){
        if (palavraDigitada === text[count]) {
            $allCharacters[count].style.color = '#95c590';
            $allCharacters[count].style.backgroundColor = '#edf7e7';
            adicionarEfeitoSonoro(true);
            count++;
        } else {
            $allCharacters[count].style.color = '#d55b60';
            $allCharacters[count].style.backgroundColor = '#ffdcd9';
            adicionarEfeitoSonoro(false)
            erros++;
        }
        caracteres_digitados ++;
    }
}

function isPunctuationOrSpace(char) {
    return [".", "?", "!", " "].includes(char);
}

function initGame(){
    $telaInicial.style.display = 'none';
    $gameTitle.style.display = 'none';
    document.querySelector(".time-counter").style.display = 'flex'
}

function mainFunction() {
    initGame();
    
    window.document.addEventListener("keydown", handleKeyPress);   
    
    loadText();
}
