import FileContent from '../../../domain/files/FileContent';
import FileContentPort from '../../../domain/files/FileContentPort';

export default class InMemoryFileContentAdapter implements FileContentPort {
  constructor(private readonly behaviour: Behaviour) {}

  get(): Promise<FileContent> {
    if (this.behaviour.error) {
      throw this.behaviour.error;
    }
    return Promise.resolve(new FileContent(this.behaviour.content!));
  }
}

interface Behaviour {
  content?: string;
  error?: Error;
}
