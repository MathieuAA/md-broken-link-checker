import { beforeAll, describe, expect, it } from 'vitest';
import FileContent from '../domain/FileContent';
import Link from '../domain/Link';
import ExtractLinksFromFileContentStep from './ExtractLinksFromFileContentStep';

describe('ExtractLinksFromFileContent', () => {
  describe('when the content contain links', () => {
    let links: Link[];

    beforeAll(() => {
      const step = new ExtractLinksFromFileContentStep();
      const fileContent = new FileContent(`# MyTitle

[Here](https://www.google.fr/) is a first link, and [there](https://duckduckgo.com/) is yet another one.`);
      links = step.execute(fileContent);
    });

    it('should return them', () => {
      expect(links.length).to.equal(2);
      expect(links[0].getTitle()).to.equal('Here');
      expect(links[0].getValue().toString()).to.equal('https://www.google.fr/');
      expect(links[1].getTitle()).to.equal('there');
      expect(links[1].getValue().toString()).to.equal('https://duckduckgo.com/');
    });
  });

  describe('when the content does not contain links', () => {
    const step = new ExtractLinksFromFileContentStep();

    it('should return an empty list', () => {
      const links: Link[] = step.execute(new FileContent('# NoLink'));
      expect(links.length).to.equal(0);
    });
  });
});
