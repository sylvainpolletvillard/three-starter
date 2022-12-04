export function sum(...array: number[]){
    return array.reduce((a,b)=> a+b, 0)
}

export function range(start: number, end: number) {
    return Array(end - start)
        .fill(0)
        .map((_, i) => start + i)
}

export function removeInArray(array: Array<any>, elem: any) {
    return array.splice(array.indexOf(elem), 1)
}

export function arrayEquals(a: any[], b: any[]): boolean {
    return a.length === b.length && a.every((val: any, i: number) => b[i] === val)
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
 export function shuffleArray(array: Array<any>) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
}

export function splitInGroupsOfSize(array: Array<any>, nb: number){    
    return Array(Math.ceil(array.length / nb)).fill(null).map((v,i) => array.slice(nb*i, nb*(i+1)))
}

export function pickRandomIn<T>(array: Array<T>): T {
    return array[Math.floor(Math.random() * array.length)]
}

export function pickNRandomIn<T>(array: Array<T>, number=1): Array<T> {
    let selection = [], options = [...array], nbSelected = 0;
    while(nbSelected < number && options.length > 0){
        let rand = Math.floor(Math.random() * options.length)
        selection.push(options[rand])
        options.splice(rand, 1)
        nbSelected++
    }
    return selection
}

export function ponderatedRandomIn<T>(array: Array<T>, ponderator: (elem: T) => number){
    const weights = array.map(ponderator)
    const sumWeights = sum(...weights)
    const rand = Math.random() * sumWeights
    for(let i=0, w=0; i < weights.length; i++){
        w += weights[i]
        if(rand < w) return array[i]
    }
    return array[array.length - 1]
}