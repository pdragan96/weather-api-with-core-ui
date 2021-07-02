import { Injectable } from '@angular/core';

@Injectable()
export class StateService {

  private applicationState: {
    [other: string]: any
  };

  constructor() {
    this.applicationState = {};
  }

  getState(stateId: string): any | null {
    return this.applicationState[stateId] || null;
  }

  setState(stateId: string, data: any) {
    const newState = {
      [stateId]: data
    };

    Object.assign(this.applicationState, newState);
  }

  invalidate() {
    this.applicationState = {};
  }
}
