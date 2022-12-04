export function pickRandomIn<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

export function chance(n: number): boolean {
    return Math.random() < n
}

export function randomVariation(n: number, variation: number): number {
    return n * (1 + (Math.random() - 0.5)*2*variation)
}
