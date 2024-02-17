export function createContext<T>(initial: T) {
  const map: WeakMap<HTMLElement, T> = new WeakMap();
  return {
    use(element: HTMLElement): T {
      // walk up the tree to find the nearest context
      let current: HTMLElement | null = element;
      while (current) {
        if (map.has(current)) {
          return map.get(current)!;
        }
        current = current.parentElement;
      }
      return initial;
    },
    provide(element: HTMLElement, value: T) {
      map.set(element, value);
      return value;
    },
  };
}

export type Context<T> = ReturnType<typeof createContext<T>>;
