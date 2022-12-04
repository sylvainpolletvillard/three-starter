export function promisify(fn: (...args: any[]) => any) {
  return (...args: any[]) =>
    new Promise((resolve, reject) => {
      fn(...args, function (err: any, result: any) {
        err ? reject(err) : resolve(result);
      });
    });
}

export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  delay: number
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), delay);
  };

  return debounced as (...args: Parameters<F>) => ReturnType<F>;
};

export const throttle = <F extends (...args: any[]) => any>(
  func: F,
  delay: number
) => {
  let ready: boolean = true;

  const throttled = (...args: Parameters<F>) => {
    if (!ready) return;
    ready = false;
    func(...args);
    setTimeout(() => {
      ready = true;
    }, delay);
  };

  return throttled as (...args: Parameters<F>) => ReturnType<F>;
};
