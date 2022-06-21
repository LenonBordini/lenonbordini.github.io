class Game {
    constructor() {
        this.HTML = {};
        const elementsWithId = document.querySelectorAll('[id]');
        for (let i = 0; i < elementsWithId.length; i++)
            this.HTML[elementsWithId[i].id] = elementsWithId[i];

        this.projectiles = [];
        this.enemies = [];
        this.particles = [];

        this.shoot = { enable: false, direction: {}, lastShot: new Date() };
        this.animationId = 0;

        this.HTML.startGameBtn.addEventListener('click', () => this.startGame());
        window.addEventListener('mousedown', () => this.windowMouseDownEvent());
        window.addEventListener('mouseup', () => this.windowMouseUpEvent());
        window.addEventListener('mousemove', (e) => this.windowMouseMoveEvent(e));
    }

    init() {
        this.player = new Player();
        this.projectiles.splice(0, this.projectiles.length);
        this.enemies.splice(0, this.enemies.length);
        this.particles.splice(0, this.particles.length);
        this.score = 0;
        this.increaseScore(0);
        this.startShooting();
    }

    startGame() {
        this.init();
        this.animate();
        this.spawnEnemies();
        this.HTML.modalEl.style.display = 'none';
    }

    increaseScore(value) {
        this.score += value;
        this.HTML.scoreEl.innerHTML = this.HTML.bigScoreEl.innerHTML = this.score;
    }

    startShooting() {
        setInterval(() => {
            if (!this.shoot.enable || typeof this.shoot.direction.x === 'undefined' || typeof this.shoot.direction.y === 'undefined')
                return;

            const now = new Date();
            const diffTime = Math.abs(now - this.lastShot);
            if (diffTime <= 250)
                return;

            this.lastShot = now;
            this.projectiles.push(new Projectile(this.shoot.direction));
        }, 10);
    }

    spawnEnemies() {
        let enemyCount = 0;
        setInterval(() => {
            enemyCount++;
            let enemy;
            if (enemyCount <= GAME_CONFIG.BOSS.SPAWN_AFTER_X_ENEMIES) {
                enemy = new Enemy();
            } else {
                enemy = new Boss();
                enemyCount = 0;
            }

            this.enemies.push(enemy);
        }, GAME_CONFIG.ENEMY.SPAWN_AFTER_X_SECONDS * 1000);
    }

    animate() {
        this.animationId = requestAnimationFrame(() => { this.animate(); });

        ctx.fillStyle = 'rgba(0, 0, 0, .1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.player.draw();

        this.projectiles.forEach((projectile, projectileIndex) => {
            projectile.update();

            // Out of the edge
            if (projectile.x + projectile.radius < 0 ||
                projectile.x - projectile.radius > canvas.width ||
                projectile.y + projectile.radius < 0 ||
                projectile.y - projectile.radius > canvas.height) {
                setTimeout(() => {
                    this.projectiles.splice(projectileIndex, 0);
                }, 0);
            }

            // Hit a enemy
            this.enemies.forEach((enemy, enemyIndex) => {
                const distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
                if (distance - enemy.radius - projectile.radius < 1) {
                    if (enemy.radius - 10 > GAME_CONFIG.ENEMY.MINIMUM_RADIUS) {
                        this.increaseScore(50);

                        gsap.to(enemy, { radius: enemy.radius - GAME_CONFIG.ENEMY.MINIMUM_RADIUS });
                        setTimeout(() => {
                            this.projectiles.splice(projectileIndex, 1);
                        }, 0);
                    } else {
                        this.increaseScore(enemy instanceof Boss ? 500 : 100);

                        for (let i = 0; i < enemy.radius * 2; i++) {
                            const velocity = {
                                x: (Math.random() - 0.5) * (Math.random() * 6),
                                y: (Math.random() - 0.5) * (Math.random() * 6)
                            };

                            this.particles.push(new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.color, velocity));
                        }

                        setTimeout(() => {
                            this.enemies.splice(enemyIndex, 1);
                            this.projectiles.splice(projectileIndex, 1);
                        }, 0);
                    }
                }
            });
        });

        this.enemies.forEach((enemy) => {
            enemy.update();

            // Hit the player
            const distanceFromPlayer = Math.hypot(this.player.x - enemy.x, this.player.y - enemy.y);
            if (distanceFromPlayer - enemy.radius - this.player.radius < 1)
                this.gameOver();
        });

        this.particles.forEach((particle, index) => {
            if (particle.alpha <= 0)
                this.particles.splice(index, 1);
            else
                particle.update();
        });
    }

    gameOver() {
        cancelAnimationFrame(this.animationId);
        this.HTML.modalEl.style.display = 'flex';
    }

    windowMouseDownEvent() {
        this.shoot.enable = true;
    }

    windowMouseUpEvent() {
        this.shoot.enable = false;
    }

    windowMouseMoveEvent(e) {
        this.shoot.direction = { x: e.clientX, y: e.clientY };
    }
}
