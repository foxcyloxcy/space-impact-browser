export declare const WORLD: Readonly<{width: number;height: number;hud: number}>
export declare const STAGE_COUNT: number
export declare const START_LIVES: number
export declare const START_SPECIAL: number
export declare const FIRE_INTERVAL: number
export declare const INVULNERABILITY_SECONDS: number
export declare function clamp(value:number,min:number,max:number):number
export declare function intersects(a:{x:number;y:number;w:number;h:number},b:{x:number;y:number;w:number;h:number}):boolean
export declare function playerWithinBounds(x:number,y:number,w?:number,h?:number):{x:number;y:number}
export declare function advanceStage(current:number):{stage:number;won:boolean}
export declare function canTakeDamage(lives:number,invulnerability:number):boolean
export declare function damage(lives:number,invulnerability:number):{lives:number;invulnerability:number}
export declare function useSpecial(ammo:number):{ammo:number;fired:boolean}
export declare function nextFireTimer(fireHeld:boolean,timer:number):{fired:boolean;timer:number}
export declare function makeRandom(seed?:number):()=>number
export declare function fixedAdvance(accumulator:number,delta:number,step?:number,maxSteps?:number):{steps:number;accumulator:number}
