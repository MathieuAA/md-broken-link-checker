import FileSystemService from './FileSystemService';
import * as fg from 'fast-glob';

export default class FastGlobFileSystemService implements FileSystemService {
  findFiles(pattern: string): Promise<string[]> {
    return fg.glob(pattern);
  }
}
