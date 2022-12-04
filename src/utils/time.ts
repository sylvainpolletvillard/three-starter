let timeouts: Set<number> = new Set();

export function wait(ms: number = 0): Promise<void>{
    return new Promise((resolve) => {
        const timeout = setTimeout(() => {
            resolve()
            timeouts.delete(timeout)
        }, ms)
        timeouts.add(timeout)
    })
}

export function defer(callback: () => void): Promise<void> {
    return Promise.resolve().then(callback)
}

export function clearTimeouts(){
    timeouts.forEach(timeout => clearTimeout(timeout))
    timeouts.clear()
}