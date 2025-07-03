import File from './File';

export default interface FilePort {
  findFiles(folderPath: string, fileExtension: string): Promise<File[]>;
}
