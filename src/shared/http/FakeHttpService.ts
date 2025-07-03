import HttpService, { HttpResponse } from './HttpService';

export default class FakeHttpService implements HttpService {
  constructor(private readonly behavior: Behavior) {}

  head(): Promise<HttpResponse> {
    if (this.behavior.head.error) {
      throw this.behavior.head.error;
    }

    if (!this.behavior.head.success) {
      throw new Error('No success response defined');
    }

    return Promise.resolve(this.behavior.head.success);
  }
}

interface Behavior {
  head: {
    success?: HttpResponse;
    error?: Error;
  };
}
