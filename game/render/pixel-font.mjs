// Integer-aligned 3x5 LCD glyphs for the original 84x48 logical playfield.
// Browser canvas fonts antialias at 5-6px and become blurry when scaled.
// All HUD digits are composed exclusively of opaque single logical pixels.
export const DIGITS=Object.freeze({
 '0':Object.freeze(['###','#.#','#.#','#.#','###']),
 '1':Object.freeze(['.#.','##.','.#.','.#.','###']),
 '2':Object.freeze(['###','..#','###','#..','###']),
 '3':Object.freeze(['###','..#','###','..#','###']),
 '4':Object.freeze(['#.#','#.#','###','..#','..#']),
 '5':Object.freeze(['###','#..','###','..#','###']),
 '6':Object.freeze(['###','#..','###','#.#','###']),
 '7':Object.freeze(['###','..#','..#','..#','..#']),
 '8':Object.freeze(['###','#.#','###','#.#','###']),
 '9':Object.freeze(['###','#.#','###','..#','###'])
})
export const HUD_POSITIONS=Object.freeze({
 stage:Object.freeze({x:30,y:1,digits:2}),
 ammo:Object.freeze({x:47,y:1,digits:1}),
 score:Object.freeze({x:62,y:1,digits:5})
})
export function numberPixels(value,{x,y,digits}){
 if(!Number.isInteger(digits)||digits<1||digits>5)throw new RangeError('HUD digits must be 1–5')
 const safe=Number.isFinite(value)?Math.max(0,Math.trunc(value)):0
 const text=String(safe%(10**digits)).padStart(digits,'0')
 const cells=[]
 for(let i=0;i<text.length;i++){
  const rows=DIGITS[text[i]]
  for(let py=0;py<5;py++)
   for(let px=0;px<3;px++)
    if(rows[py][px]==='#')cells.push([x+i*4+px,y+py])
 }
 return cells
}
