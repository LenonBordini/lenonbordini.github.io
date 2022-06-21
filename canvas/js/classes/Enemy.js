class Enemy {
    constructor(radius, color, speed) {
        this.radius = radius;
        if (!this.radius)
            this.radius = Math.random() * (GAME_CONFIG.ENEMY.MAXIMUM_RADIUS - GAME_CONFIG.ENEMY.MINIMUM_RADIUS + 1) + GAME_CONFIG.ENEMY.MINIMUM_RADIUS;

        this.color = color || `hsl(${Math.random() * 360}, 50%, 50%)`;

        speed = speed || 1;

        if (Math.random() < 0.5) {
            this.x = Math.random() < 0.5 ? 0 - this.radius : canvas.width + this.radius;
            this.y = Math.random() * canvas.height;
        } else {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() < 0.5 ? 0 - this.radius : canvas.height + this.radius;
        }

        const angle = Math.atan2(canvas.height / 2 - this.y, canvas.width / 2 - this.x);
        this.velocity = {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
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
