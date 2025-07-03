import ReadFileStep from './readFile/ReadFileStep';
import ExtractLinksFromFileContentStep from './extractLinksFromFileContent/ExtractLinksFromFileContentStep';
import CheckForBrokenLinksStep from './checkForBrokenLinks/CheckForBrokenLinksStep';
import GetMdFilesFromFolderStep from './getMdFilePathsFromFolder/GetMdFilesFromFolderStep';

export default class StepsExecutor {
  constructor(
    private readonly getMdFilesFromFolderStep: GetMdFilesFromFolderStep,
    private readonly readFileStep: ReadFileStep,
    private readonly extractLinksFromFileContentStep: ExtractLinksFromFileContentStep,
    private readonly checkForBrokenLinksStep: CheckForBrokenLinksStep
  ) {}

  async execute(filePath: string): Promise<void> {
    const files = await this.getMdFilesFromFolderStep.execute(filePath);
    files.forEachFile(async (file) => {
      const fileContent = await this.readFileStep.execute(filePath);
      const links = this.extractLinksFromFileContentStep.execute(fileContent);
      await this.checkForBrokenLinksStep.execute(links);
    });
  }
}
