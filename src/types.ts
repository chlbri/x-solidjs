import type {
  MatchOptions,
  StateMatching,
  StateValue,
} from '@bemedev/x-matches';
import type { Prop, TypegenEnabled } from 'xstate';

type TSV<T> = T extends TypegenEnabled
  ? Prop<Prop<T, 'resolved'>, 'matchesStates'>
  : never;

type MatchesProps<T> = MatchOptions<
  StateMatching<TSV<T> extends StateValue ? TSV<T> : StateValue>
>[];

// #region SubType
type FilterFlags<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
};

type AllowedNames<Base, Condition> = FilterFlags<
  Base,
  Condition
>[keyof Base];

type SubType<Base extends object, Condition> = Pick<
  Base,
  AllowedNames<Base, Condition>
>;
// #endregion

type Fn<P extends any[] = any, R = any> = (...arg: P) => R;
type KeysFn<T extends object = object> = keyof SubType<T, Fn>;

type FineType<
  T,
  PartialKeys extends keyof T = keyof T,
  RequiredKeys extends keyof T = never,
  OtherKeys extends keyof T = never,
> = Partial<Pick<T, PartialKeys>> &
  Required<Pick<T, RequiredKeys>> &
  Pick<T, OtherKeys>;

type Tags<TResolvedTypesMeta> = (TResolvedTypesMeta extends TypegenEnabled
  ? Prop<Prop<TResolvedTypesMeta, 'resolved'>, 'tags'>
  : string)[];

export type { SubType, MatchesProps, FineType, StateValue, Tags };
