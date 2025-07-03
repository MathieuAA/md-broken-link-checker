import path from 'node:path';
import FilePort from '../../../domain/files/FilePort';
import File from '../../../domain/files/File';
import FileSystemService from '../../../shared/fileSystem/FileSystemService';

export default class FileAdapter implements FilePort {
  constructor(private readonly fileSystemService: FileSystemService) {}

  async findFiles(folderPath: string, fileExtension: string): Promise<File[]> {
    const filePaths = await this.fileSystemService.findFiles(path.join(folderPath, '**', `*.${fileExtension}`));
    return filePaths.map((filePath) => {
      return new File(filePath);
    });
  }
}
