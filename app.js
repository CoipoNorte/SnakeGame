// app.js

/**
 * Snake Game profesional
 * Módulo principal
 */
class SnakeGame {
    constructor(canvasId) {
        /** @type {HTMLCanvasElement} */
        this.canvas = document.getElementById(canvasId);
        /** @type {CanvasRenderingContext2D} */
        this.ctx = this.canvas.getContext('2d');

        /** Tamaño de celda y cuadrícula */
        this.gridSize = 20;
        this.cellSize = this.canvas.width / this.gridSize;

        /** Estados del juego */
        this.states = { START: 0, PLAYING: 1, PAUSED: 2, GAMEOVER: 3 };
        this.currentState = this.states.START;

        /** Serpiente */
        this.snake = [{ x: 10, y: 10 }];
        this.direction = { x: 0, y: 0 };
        this.nextDirection = { x: 0, y: 0 };
        this.tailLength = 5;

        /** Comida */
        this.food = this.randomCell();

        /** Contadores: color, puntos y nivel */
        this.hue = 0;
        this.score = 0;
        this.level = 1;

        /** Control de FPS */
        this.lastFrameTime = 0;
        this.fps = 15;
        this.frameInterval = 1000 / this.fps;

        this.bindEvents();
        this.showScreen('startScreen');
    }

    /** Setea todos los listeners */
    bindEvents() {
        document.getElementById('startBtn')
            .addEventListener('click', () => this.startGame());
        document.getElementById('resumeBtn')
            .addEventListener('click', () => this.togglePause());
        document.getElementById('restartBtn')
            .addEventListener('click', () => this.resetGame());
        window.addEventListener('keydown', e => this.onKeyDown(e));
    }

    /** Arranca o reanuda el juego */
    startGame() {
        // Si aún no se movió, iniciar hacia la derecha
        if (this.direction.x === 0 && this.direction.y === 0) {
            this.direction = this.nextDirection = { x: 1, y: 0 };
        }
        
        this.currentState = this.states.PLAYING;
        this.hideAllScreens();
        requestAnimationFrame(ts => this.gameLoop(ts));
    }

    /** Reinicia el juego completamente */
    resetGame() {
        this.snake = [{ x: 10, y: 10 }];
        this.direction = this.nextDirection = { x: 0, y: 0 };
        this.tailLength = 5;
        this.food = this.randomCell();
        this.score = 0;
        this.level = 1;
        this.hue = 0;
        this.startGame();
    }

    /** Pausa o reanuda */
    togglePause() {
        if (this.currentState === this.states.PLAYING) {
            this.currentState = this.states.PAUSED;
            this.showScreen('pauseScreen');
        } else if (this.currentState === this.states.PAUSED) {
            this.currentState = this.states.PLAYING;
            this.hideAllScreens();
            requestAnimationFrame(ts => this.gameLoop(ts));
        }
    }

    /**
     * Lee flechas y P para pausar
     * @param {KeyboardEvent} e
     */
    onKeyDown(e) {
        const map = {
            ArrowLeft:  { x: -1, y:  0 },
            ArrowUp:    { x:  0, y: -1 },
            ArrowRight: { x:  1, y:  0 },
            ArrowDown:  { x:  0, y:  1 },
            KeyP:       'PAUSE'
        };
        const act = map[e.code];
        if (act === 'PAUSE') {
            this.togglePause();
        } else if (act) {
            // impedir cambio a dirección opuesta
            if (act.x !== -this.direction.x || act.y !== -this.direction.y) {
                this.nextDirection = act;
            }
        }
    }

    /** Loop de juego con requestAnimationFrame */
    gameLoop(timestamp) {
        if (this.currentState !== this.states.PLAYING) return;
        const delta = timestamp - this.lastFrameTime;
        if (delta > this.frameInterval) {
            this.update();
            this.draw();
            this.lastFrameTime = timestamp;
        }
        requestAnimationFrame(ts => this.gameLoop(ts));
    }

    /** Lógica: movimiento, colisiones y comida */
    update() {
        // Aplica la nueva dirección
        this.direction = this.nextDirection;

        // Nueva posición de la cabeza
        const head = {
            x: (this.snake[0].x + this.direction.x + this.gridSize) % this.gridSize,
            y: (this.snake[0].y + this.direction.y + this.gridSize) % this.gridSize
        };

        // Colisión con el cuerpo (ignora el índice 0)
        if (this.snake.some((seg, idx) => idx > 0
                && seg.x === head.x && seg.y === head.y)) {
            this.currentState = this.states.GAMEOVER;
            this.showGameOver();
            return;
        }

        // Inserta cabeza y recorta si excede longitud
        this.snake.unshift(head);
        while (this.snake.length > this.tailLength) {
            this.snake.pop();
        }

        // Comer
        if (head.x === this.food.x && head.y === this.food.y) {
            this.tailLength++;
            this.score += 10;
            this.level = Math.floor(this.tailLength / 5);
            this.food = this.randomCell();
        }
    }

    /** Dibuja fondo, serpiente, comida y UI */
    draw() {
        // Fondo
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Serpiente con hue dinámico
        this.hue = (this.hue + 2) % 360;
        this.snake.forEach((seg, i) => {
            this.ctx.fillStyle = `hsl(${this.hue + i * 5},100%,50%)`;
            this.ctx.fillRect(
                seg.x * this.cellSize,
                seg.y * this.cellSize,
                this.cellSize - 2,
                this.cellSize - 2
            );
        });

        // Comida
        this.ctx.fillStyle = `hsl(${(this.hue * 2) % 360},100%,50%)`;
        this.ctx.fillRect(
            this.food.x * this.cellSize,
            this.food.y * this.cellSize,
            this.cellSize - 2,
            this.cellSize - 2
        );

        // Puntos y nivel
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`Puntos: ${this.score}`, 10, 20);
        this.ctx.fillText(`Nivel: ${this.level}`, 10, 40);
    }

    /** Genera posición aleatoria en grid */
    randomCell() {
        return {
            x: Math.floor(Math.random() * this.gridSize),
            y: Math.floor(Math.random() * this.gridSize)
        };
    }

    /** Oculta overlays */
    hideAllScreens() {
        ['startScreen', 'pauseScreen', 'gameOverScreen']
            .forEach(id => document.getElementById(id).classList.add('hidden'));
    }

    /** Muestra overlay */
    showScreen(id) {
        document.getElementById(id).classList.remove('hidden');
    }

    /** Muestra Game Over y puntos finales */
    showGameOver() {
        document.getElementById('finalScore').textContent =
            `Puntuación: ${this.score}`;
        this.showScreen('gameOverScreen');
    }
}

// Arranca todo al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame('gameCanvas');
});
