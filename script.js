document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('buscaminas-grid');
    const resetBtn = document.getElementById('reset-btn');
    if(!grid) return; // Si no estamos en el home, no ejecuta el juego

    const width = 8;
    const bombAmount = 10;
    let squares = [];
    let isGameOver = false;

    function createBoard() {
        grid.innerHTML = '';
        squares = [];
        isGameOver = false;
        resetBtn.innerText = 'Reiniciar 😃';

        // Crear bombas y celdas vacías de forma aleatoria
        const bombsArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(width * width - bombAmount).fill('valid');
        const gameArray = emptyArray.concat(bombsArray).sort(() => Math.random() - 0.5);

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.setAttribute('id', i);
            square.classList.add('cell');
            square.classList.add(gameArray[i]);
            grid.appendChild(square);
            squares.push(square);

            // Click izquierdo
            square.addEventListener('click', function() {
                click(square);
            });

            // Click derecho (bandera)
            square.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                addFlag(square);
            });
        }

        // Calcular números de cercanía
        for (let i = 0; i < squares.length; i++) {
            let total = 0;
            const isLeftEdge = (i % width === 0);
            const isRightEdge = (i % width === width - 1);

            if (squares[i].classList.contains('valid')) {
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++;
                if (i > 7 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++;
                if (i > 7 && squares[i - width].classList.contains('bomb')) total++;
                if (i > 8 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++;
                if (i < 63 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++;
                if (i < 56 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++;
                if (i < 56 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++;
                if (i < 56 && squares[i + width].classList.contains('bomb')) total++;
                squares[i].setAttribute('data', total);
            }
        }
    }

    function addFlag(square) {
        if (isGameOver) return;
        if (!square.classList.contains('revealed') && square.innerHTML === '') {
            square.innerHTML = '🚩';
        } else if (square.innerHTML === '🚩') {
            square.innerHTML = '';
        }
    }

    function click(square) {
        if (isGameOver || square.classList.contains('revealed') || square.innerHTML === '🚩') return;
        
        if (square.classList.contains('bomb')) {
            gameOver(square);
        } else {
            let total = square.getAttribute('data');
            if (total != 0) {
                square.classList.add('revealed');
                square.innerHTML = total;
                // Colores clásicos de los números
                if (total == 1) square.style.color = 'blue';
                if (total == 2) square.style.color = 'green';
                if (total == 3) square.style.color = 'red';
                if (total == 4) square.style.color = 'darkblue';
                return;
            }
            checkSquare(square, square.id);
        }
        square.classList.add('revealed');
    }

    // Lógica para abrir celdas vacías (recursividad básica)
    function checkSquare(square, currentId) {
        const isLeftEdge = (currentId % width === 0);
        const isRightEdge = (currentId % width === width - 1);

        setTimeout(() => {
            if (currentId > 0 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId > 7 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId > 7) {
                const newId = squares[parseInt(currentId) - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId > 8 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 63 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 56 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 56 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 56) {
                const newId = squares[parseInt(currentId) + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
        }, 10);
    }

    function gameOver(square) {
        resetBtn.innerText = 'Perdiste 😵';
        isGameOver = true;
        // Mostrar todas las bombas
        squares.forEach(sq => {
            if (sq.classList.contains('bomb')) {
                sq.innerHTML = '💣';
                sq.classList.remove('bomb');
                sq.classList.add('revealed');
            }
        });
    }

    resetBtn.addEventListener('click', createBoard);
    createBoard();
});