export type Transformation = 
  | 'letterSubstitution'
  | 'wordReversal'
  | 'spectralSymbols'
  | 'glitchText'
  | 'echoEffect';

export interface MessageRewriterInterface {
  rewrite(message: string, intensity?: number): string;
}

export interface Mutation {
  type: 'corruption' | 'replacement' | 'insertion';
  apply(content: string): string;
}

export interface FileMutationHookInterface {
  registerFile(path: string): void;
  unregisterFile(path: string): void;
  triggerMutation(path: string): Promise<void>;
}
