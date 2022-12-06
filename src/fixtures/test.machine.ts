import { createMachine } from 'xstate';
import { assign } from '../assign';

export const machine = createMachine(
  {
    predictableActionArguments: true,
    preserveActionOrder: true,
    schema: {
      context: {} as { iterator: number },
    },
    tsTypes: {} as import('./test.machine.typegen').Typegen0,
    states: {
      on: {
        on: {
          TOGGLE: { target: 'off', actions: ['log', 'iterate'] },
        },
      },
      off: {
        on: {
          TOGGLE: { target: 'on', actions: ['log', 'iterate'] },
        },
      },
    },
  },
  {
    actions: {
      iterate: assign(context => {
        context.iterator++;
      }),
    },
  },
);
