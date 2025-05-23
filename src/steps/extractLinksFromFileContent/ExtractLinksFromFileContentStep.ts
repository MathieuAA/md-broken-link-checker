import FileContent from '../../domain/files/FileContent';
import Link from '../../domain/links/Link';

export default class ExtractLinksFromFileContentStep {
  execute(fileContent: FileContent): Link[] {
    const content = fileContent.getValue();
    const matches = [...content.matchAll(/\[(.+?)]\((.+?)\)/g)];
    return matches.map((capturedGroup) => {
      const [, title, value] = capturedGroup;
      return new Link(title, value);
    });
  }
}
