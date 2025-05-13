import FileContent from './FileContent';

export default interface FileContentPort {
  get(filePath: string): Promise<FileContent>;
}
