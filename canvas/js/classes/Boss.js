class Boss extends Enemy {
    constructor(radius, color, speed) {
        super(
            radius || GAME_CONFIG.BOSS.RADIUS, 
            color, 
            speed || GAME_CONFIG.BOSS.SPEED
        );
    }
}
