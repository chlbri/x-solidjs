import buildMatches from '@bemedev/x-matches';
import { createMemo, createRoot, from } from 'solid-js';
import {
  AreAllImplementationsAssumedToBeProvided,
  BaseActionObject,
  EventObject,
  interpret,
  InterpreterOptions,
  NoInfer,
  ResolveTypegenMeta,
  ServiceMap,
  StateMachine,
  TypegenDisabled,
  Typestate,
} from 'xstate';
import { defaultSelector } from './defaultSelector';
import { MatchesProps, Tags } from './types';

export function createInterpret<
  TContext extends object,
  TEvents extends EventObject = EventObject,
  TTypestate extends Typestate<TContext> = {
    value: any;
    context: TContext;
  },
  TAction extends BaseActionObject = BaseActionObject,
  TServiceMap extends ServiceMap = ServiceMap,
  TResolvedTypesMeta = ResolveTypegenMeta<
    TypegenDisabled,
    NoInfer<TEvents>,
    TAction,
    TServiceMap
  >,
>(
  machine: AreAllImplementationsAssumedToBeProvided<TResolvedTypesMeta> extends true
    ? StateMachine<
        TContext,
        any,
        TEvents,
        TTypestate,
        TAction,
        TServiceMap,
        TResolvedTypesMeta
      >
    : 'Some implementations missing',
  options?: InterpreterOptions,
) {
  const service = interpret(machine, options);
  const _store = createRoot(() => from(service));
  const store = () => _store() ?? service.initialState;

  type GetProps<T = any, S = ReturnType<typeof store>> = [
    accessor?: (state: S) => T,
    equals?: (prev: T, next: T) => boolean,
  ];

  const state = <T>(
    ...[accessor = defaultSelector, equals]: GetProps<T>
  ) =>
    createRoot(() =>
      createMemo(() => accessor(store()), undefined, {
        equals,
      }),
    );

  const reducer = <T>(accessor: Required<GetProps<T>>[0]) => {
    const stateAccessor = accessor;

    const reduceS = <R = T>(
      ...[_accessor = defaultSelector, equals]: GetProps<R, T>
    ) =>
      state(_state => {
        const step1 = stateAccessor(_state);
        const step2 = _accessor(step1);
        return step2;
      }, equals);

    return reduceS;
  };

  const context = reducer(state => state.context);

  const send = service.send;

  const sender = <T extends TEvents['type']>(type: T) => {
    type E = TEvents extends {
      type: T;
    } & infer U
      ? // eslint-disable-next-line @typescript-eslint/ban-types
        U extends {}
        ? Omit<U, 'type'>
        : never
      : never;

    function fn(...[event]: E extends never ? [] : [event: E]) {
      return send({ type, ...(event as any) });
    }

    return fn;
  };

  const value = createRoot(() =>
    createMemo(() => store().value, undefined, {
      equals(prev, next) {
        return prev === next;
      },
    }),
  );

  type _MatchesProps = MatchesProps<TResolvedTypesMeta>;
  const matches = (...values: _MatchesProps) => {
    return createRoot(() =>
      createMemo(() => {
        const fn = buildMatches(value());
        return fn(...values);
      }),
    );
  };

  const tags = (...tags: Tags<TResolvedTypesMeta>) => {
    const output = state(state => tags.every(tag => state.hasTag(tag)));
    return output;
  };

  const stop: typeof service.stop = () => service.stop();
  const start: typeof service.start = initial => service.start(initial);
  const status = () => service.status;

  const output = {
    start,
    stop,
    send,
    sender,
    state,
    reducer,
    matches,
    context,
    status,
    tags,
  } as const;

  return output;
}
