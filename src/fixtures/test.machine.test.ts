import testmachine from '@bemedev/x-test';
import { describe, expect, test, vi } from 'vitest';
import { ActionFunction } from 'xstate';
import { machine } from './test.machine';
import { Context } from './test.machine.types';

const { assignAction } = testmachine(machine);

describe('Definition', () => {
  describe('Actions', () => {
    describe('#1 iterate', () => {
      const { createAcceptance, createExpect } = assignAction('iterate');

      test('#1 Acceptance', () => {
        const acceptance = createAcceptance();

        acceptance();
      });

      describe('#2 Expectations', () => {
        test('Expectation 1 : 0 -> 1', () => {
          const expectation = createExpect({
            context: { iterator: 0 },
            expected: { iterator: 1 },
          });

          expectation();
        });
        test('Expectation 2 : 59 -> 60', () => {
          const expectation = createExpect({
            context: { iterator: 59 },
            expected: { iterator: 60 },
          });

          expectation();
        });
      });
    });

    describe('#2 log', () => {
      test('#1 Acceptance', () => {
        const log = machine.options?.actions?.log;
        expect(log).toBeInstanceOf(Function);
      });

      test('#2 Console.log is called', () => {
        const log = machine.options?.actions?.log as ActionFunction<
          Context,
          any
        >;
        const spy = vi.spyOn(console, 'log');
        log({ iterator: 0 }, null, {} as any);
        expect(spy).toBeCalledWith('context', '=>', { iterator: 0 });
      });
    });
  });
});
