// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: 'log';
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    iterate: 'TOGGLE';
    log: 'TOGGLE';
  };
  eventsCausingServices: {};
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates: 'off' | 'on';
  tags: never;
}
