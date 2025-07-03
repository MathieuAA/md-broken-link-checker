import FilePort from '../../domain/files/FilePort';
import Folder from '../../domain/files/Folder';

export default class GetMdFilesFromFolderStep {
  constructor(private readonly filePort: FilePort) {}

  async execute(folderPath: string): Promise<Folder> {
    const mdFiles = await this.filePort.findFiles(folderPath, 'md');
    const folder = new Folder(folderPath);
    mdFiles.forEach((mdFile) => {
      folder.addFile(mdFile);
    });
    return Promise.resolve(folder);
  }
}
