export default interface FileSystemService {
  findFiles(pattern: string): Promise<string[]>;
}
