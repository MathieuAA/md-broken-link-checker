import * as fs from 'node:fs';
import FileContent from '../../../domain/files/FileContent';
import FileContentPort from '../../../domain/files/FileContentPort';
import { FileNotFoundError } from './FileNotFoundError';

export default class FileSystemFileContentAdapter implements FileContentPort {
  async get(filePath: string): Promise<FileContent> {
    try {
      await fs.promises.access(filePath, fs.constants.W_OK);
      const content = await fs.promises.readFile(filePath, 'utf8');
      return new FileContent(content);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new FileNotFoundError(filePath);
    }
  }
}
