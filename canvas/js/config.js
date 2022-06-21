const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');

const GAME_CONFIG = {
    PLAYER: {
        RADIUS: 10,
        COLOR: 'white'
    },
    PROJECTILE: {
        RADIUS: 2,
        COLOR: 'white',
        SPEED: 6
    },
    ENEMY: {
        MINIMUM_RADIUS: 14,
        MAXIMUM_RADIUS: 40,
        SPAWN_AFTER_X_SECONDS: 1
    },
    BOSS: {
        RADIUS: 120,
        SPEED: 0.25,
        SPAWN_AFTER_X_ENEMIES: 20
    }
};
