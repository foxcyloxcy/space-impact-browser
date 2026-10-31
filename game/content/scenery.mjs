// Distinct clean-room scenery motifs for eight playable stages.
// No original Nokia level maps or proprietary art are included.
export const SCENES=Object.freeze([
 {id:'open-space',floor:false,ceiling:false,detail:0,speed:0},
 {id:'hills',floor:true,ceiling:false,detail:1,speed:6},
 {id:'cave',floor:true,ceiling:true,detail:2,speed:7},
 {id:'arches',floor:true,ceiling:true,detail:3,speed:6},
 {id:'ruins',floor:true,ceiling:false,detail:4,speed:8},
 {id:'tunnels',floor:true,ceiling:true,detail:5,speed:7},
 {id:'citadel',floor:true,ceiling:true,detail:6,speed:9},
 {id:'core',floor:true,ceiling:true,detail:7,speed:9}
])
export function sceneForStage(stage){return SCENES[Math.max(0,Math.min(7,stage-1))]}
export function sceneryAt(stage,worldX){
 const scene=sceneForStage(stage)
 if(!scene.floor)return {floor:48,ceiling:7}
 const a=Math.abs(Math.sin(worldX/(8+stage*.7)))
 const b=Math.abs(Math.cos(worldX/(15+stage)))
 const step=Math.floor(worldX/(10+stage))%4
 const floor=Math.max(34,Math.min(47,Math.round(46-a*(2+scene.detail)-b*3-(scene.detail%3===0?step:0))))
 const ceiling=scene.ceiling?Math.min(16,8+Math.round(Math.abs(Math.sin(worldX/13+stage))*((scene.detail%4)+2))):7
 return {floor,ceiling}
}
