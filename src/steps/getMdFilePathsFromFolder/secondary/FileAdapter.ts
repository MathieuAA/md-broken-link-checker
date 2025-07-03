import * as fg from 'fast-glob';
import path from 'node:path';
import FilePort from '../../../domain/files/FilePort';
import File from '../../../domain/files/File';

export default class FileAdapter implements FilePort {
  async findFiles(folderPath: string, fileExtension: string): Promise<File[]> {
    const filePaths = await fg.glob(path.join(folderPath, '**', `*.${fileExtension}`));
    return filePaths.map((filePath) => {
      return new File(filePath);
    });
  }
}
