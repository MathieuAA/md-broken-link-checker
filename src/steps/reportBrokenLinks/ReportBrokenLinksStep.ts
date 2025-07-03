import File from '../../domain/files/File';
import CheckedLink from '../../domain/checkedLinks/CheckedLink';

export default class ReportBrokenLinksStep {
  execute(files: File[], checkedLinks: CheckedLink[]): string {
    const brokenLinks = checkedLinks.filter((link) => link.isBroken());

    const reportBeginning = `Files checked: ${files.length}
Links checked: ${checkedLinks.length}
Broken links found: ${brokenLinks.length}
`;

    if (brokenLinks.length === 0) {
      return reportBeginning;
    }

    return `${reportBeginning}
${brokenLinks
  .map((brokenLink, index) => {
    return `${index + 1}. ${brokenLink.getLinkTitle()} (${brokenLink.getLinkValue()})`;
  })
  .join('\n')}
`;
  }
}
