import FileContentPort from '../../domain/files/FileContentPort';
import FileContent from '../../domain/files/FileContent';
import { WrongFileExtensionError } from './WrongFileExtensionError';

export default class ReadFileStep {
  constructor(private readonly fileContentGetter: FileContentPort) {}

  async execute(filePath: string): Promise<FileContent> {
    if (!filePath.endsWith('.md')) {
      throw new WrongFileExtensionError(filePath, 'md');
    }
    return this.fileContentGetter.get(filePath);
  }
}
