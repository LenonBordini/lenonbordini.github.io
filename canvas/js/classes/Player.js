class Player {
    constructor(radius, color) {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;

        this.radius = radius;
        if (!this.radius)
            this.radius = GAME_CONFIG.PLAYER.RADIUS;

        this.color = color;
        if (!this.color)
            this.color = GAME_CONFIG.PLAYER.COLOR;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}
