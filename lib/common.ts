export type Nullable<T> = T | null;
export type Predicate<T> = (...params: T[]) => boolean;
export type FuncOut<T> = () => T;
