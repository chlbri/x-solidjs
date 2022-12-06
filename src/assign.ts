import { produce } from 'solid-js/store';
import { assign as _assign, EventObject } from 'xstate';

export function assign<
  TContext = unknown,
  TEvents extends EventObject = EventObject,
>(producer: (context: TContext, event: TEvents) => void) {
  const fn = _assign<TContext, TEvents>((context, event) => {
    const immer = produce<TContext>(context => {
      producer(context, event);
    });

    return immer(context);
  });

  return fn;
}
