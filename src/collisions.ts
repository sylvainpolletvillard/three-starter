import { getProjectiles } from "./projectiles"
import { getEnemies } from "./enemies"
import { getGame } from "./game"

export function checkCollisions(){
    checkProjectileCollisionsWithEnemies()
    checkEnemiesCollisionsWithPlayer()
}

export function checkProjectileCollisionsWithEnemies(){
    const projectiles = getProjectiles()
    const enemies = getEnemies()
    for(let enemy of enemies){
        for(let projectile of projectiles){
            if(enemy.hitbox.intersectsSphere(projectile.hitbox)){
                enemy.onHit()
                projectile.destroy()
                if(enemy.life < 0) continue;
            }
        }
    }
}

export function checkEnemiesCollisionsWithPlayer(){
    const player = getGame().player
    const enemies = getEnemies()
    for(let enemy of enemies){
        if(enemy.hitbox.intersectsBox(player.hitbox)){
            player.onHit()
            enemy.onHit()
        }
    }
}