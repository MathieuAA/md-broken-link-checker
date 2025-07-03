import FileSystemService from './FileSystemService';

export default class FakeFileSystemService implements FileSystemService {
  constructor(private readonly files: string[]) {}

  findFiles(): Promise<string[]> {
    return Promise.resolve(this.files);
  }
}
