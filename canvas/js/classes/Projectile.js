class Projectile {
    constructor(direction, speed, radius, color) {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;

        this.radius = radius;
        if (!this.radius)
            this.radius = GAME_CONFIG.PROJECTILE.RADIUS;

        this.color = color;
        if (!this.color)
            this.color = GAME_CONFIG.PROJECTILE.COLOR;

        const angle = Math.atan2(direction.y - canvas.height / 2, direction.x - canvas.width / 2);
        speed = speed || GAME_CONFIG.PROJECTILE.SPEED;
        this.velocity = {
            x: Math.cos(angle) * GAME_CONFIG.PROJECTILE.SPEED,
            y: Math.sin(angle) * GAME_CONFIG.PROJECTILE.SPEED
        };
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}
