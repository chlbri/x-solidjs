import testmachine from '@bemedev/x-test';
import { describe, test } from 'vitest';
import { machine } from './test.machine';

const {
  start,
  context,
  hasTags,
  matches,
  stop,
  sender,
  send,
  assignAction,
  guard,
  promise,
} = testmachine(machine.withContext({ iterator: 0 }));

describe('Components', () => {
  describe('Actions', () => {
    describe('iterate', () => {
      const { createAcceptance, createExpect } = assignAction('iterate');

      test('Acceptance', () => {
        const acceptance = createAcceptance();

        acceptance();
      });

      test('Expectation', () => {
        const expectation = createExpect({
          expected: { iterator: 1 },
          context: { iterator: 0 },
        });

        expectation();
      });
    });
  });
});
