import { createMachine } from 'xstate';
import { assign } from '../assign';
import { Context, Events } from './test.machine.types';

export const machine = createMachine(
  {
    predictableActionArguments: true,
    preserveActionOrder: true,
    schema: {
      context: {} as Context,
      events: {} as Events,
    },
    tsTypes: {} as import('./test.machine.typegen').Typegen0,

    context: {
      iterator: 0,
    },
    initial: 'off',
    states: {
      off: {
        on: {
          TOGGLE: { target: 'on', actions: ['log', 'iterate'] },
        },
      },
      on: {
        on: {
          TOGGLE: { target: 'off', actions: ['log', 'iterate'] },
        },
        tags: ['busy'],
      },
    },
  },
  {
    actions: {
      iterate: assign(context => {
        context.iterator++;
      }),
      log: context => {
        console.log('context', '=>', context);
      },
    },
  },
);
