declare class Interpreter {
  constructor(code: string, initFunc?: (interpreter: Interpreter, globalObject: any) => void);

  step(): boolean;
  setProperty(obj: any, prop: string, value: any): void;
  createNativeFunction(fn: Function): any;
  createAsyncFunction(fn: Function): any;

  stateStack: any[];
  globalObject: any;
}

