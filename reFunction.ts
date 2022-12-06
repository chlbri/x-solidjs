function _reFunction<P extends any[] = any[], R = any>(
  fn: main.Fn<P, R>,
  bind: any,
) {
  return (...args: P) => fn.bind(bind)(...args);
}

export function reFunction<
  T extends object = object,
  FnKey extends main.KeysFn<T> = main.KeysFn<T>,
>(object: T, fn: FnKey) {
  const _fn = object[fn];
  type Pm = T[FnKey] extends (...args: infer P) => any ? P : any[];
  type Re = T[FnKey] extends (...args: any) => infer R ? R : any;
  return _reFunction<Pm, Re>(_fn as any, object);
}
