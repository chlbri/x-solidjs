import { describe, expect, test } from 'vitest';
import { InterpreterStatus } from 'xstate';
import { createInterpret } from './createInterpret';
import { machine } from './fixtures/test.machine';

const {
  start,
  stop,
  sender,
  state,
  reducer,
  matches,
  context,
  send,
  status,
  tags,
} = createInterpret(machine);

describe('Acceptation', () => {
  const expectFn = (arg: unknown) => expect(arg).toBeInstanceOf(Function);

  test.concurrent('start is function', () => {
    expectFn(start);
  });

  test.concurrent('stop is function', () => {
    expectFn(stop);
  });

  test.concurrent('sender is function', () => {
    expectFn(sender);
  });

  test.concurrent('state is function', () => {
    expectFn(state);
  });

  test.concurrent('context is function', () => {
    expectFn(context);
  });

  test.concurrent('matches is function', () => {
    expectFn(matches);
  });

  test.concurrent('reducer is function', () => {
    expectFn(reducer);
  });

  test.concurrent('send is function', () => {
    expectFn(send);
  });

  test.concurrent('tags is function', () => {
    expectFn(tags);
  });
});

describe('Workflow', () => {
  test('#0 -> Start the machine', () => {
    expect(status()).toBe(InterpreterStatus.NotStarted);
    start();
    expect(status()).toBe(InterpreterStatus.Running);
  });

  test('#1 -> Current state is "off"', () => {
    const matcher = matches('off');
    expect(matcher()).toBe(true);
  });

  test('#2 -> Current iterator is "0"', () => {
    const currentContext = context();
    expect(currentContext().iterator).toBe(0);
  });

  test('#3 -> Send "TOGGLE" event', () => {
    const toggle = sender('TOGGLE');
    toggle();
  });

  test('#4 -> Current state is "on"', () => {
    const matcher = matches('on');
    expect(matcher()).toBe(true);
  });

  test('#5 -> The current state has a tag : "busy"', () => {
    const hasTag = tags('busy');
    expect(hasTag()).toBe(true);
  });

  test('#6 -> Send "TOGGLE" event again', () => {
    send('TOGGLE');
  });

  test('#7 -> Current iterator is now "2"', () => {
    const iterator = context(context => context.iterator);
    expect(iterator()).toBe(2);
  });

  test('#8 -> Stop the machine', () => {
    stop();
    expect(status()).toBe(InterpreterStatus.Stopped);
  });
});
