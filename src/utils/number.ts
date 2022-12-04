export function clamp(value: number, min: number, max: number): number {
    return value < min ? min : value > max ? max : value
}

export function isBetween(value: number, min: number, max:number): boolean {
    return value >= min && value <= max
}

export function closestTo(value: number, propositions: number[]): number {
    return propositions.sort((a,b) => Math.abs(a-value) - Math.abs(b-value))[0]
}