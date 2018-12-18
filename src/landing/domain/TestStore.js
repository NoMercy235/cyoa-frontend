import { observable, action } from 'mobx';

class TestStore {
  @observable name = observable.box('obsv');

  @action changeName(name) {
    this.name.set(name);
  }
}

export const testStore = new TestStore();
