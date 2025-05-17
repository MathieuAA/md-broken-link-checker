import { describe, expect, it, beforeAll } from 'vitest';
import { FileNotFoundError } from './secondary/FileNotFoundError';
import { WrongFileExtensionError } from './WrongFileExtensionError';
import ReadFileStep from './ReadFileStep';
import FileContent from '../domain/FileContent';
import InMemoryFileContentAdapter from './secondary/InMemoryFileContentAdapter';

describe('ReadFileStep - unit test', () => {
  describe('when providing a valid MD file', () => {
    describe('that is not empty', () => {
      let content: FileContent;

      beforeAll(async () => {
        const fileContentGetter = new InMemoryFileContentAdapter({ content: '# My Title' });
        const step = new ReadFileStep(fileContentGetter);
        content = await step.execute('whatever.md');
      });

      it('should return the string content', () => {
        expect(content.getValue()).to.equal('# My Title');
      });
    });

    describe('that is empty', () => {
      let content: FileContent;

      beforeAll(async () => {
        const fileContentGetter = new InMemoryFileContentAdapter({ content: '' });
        const step = new ReadFileStep(fileContentGetter);
        content = await step.execute('whatever.md');
      });

      it('should return an empty string', () => {
        expect(content.getValue()).to.equal('');
      });
    });
  });

  describe('when providing an invalid MD file', () => {
    describe('because the file does not exist', () => {
      let step: ReadFileStep;

      beforeAll(() => {
        const fileContentGetter = new InMemoryFileContentAdapter({ error: new FileNotFoundError('invalid_file.md') });
        step = new ReadFileStep(fileContentGetter);
      });

      it('should fail', async () => {
        await expect(() => step.execute('invalid_file.md')).rejects.toThrow(FileNotFoundError);
      });
    });

    describe('because the file does not have the right extension', async () => {
      let step: ReadFileStep;

      beforeAll(() => {
        const fileContentGetter = new InMemoryFileContentAdapter({ content: 'this is a text' });
        step = new ReadFileStep(fileContentGetter);
      });

      it('should fail', async () => {
        await expect(() => step.execute('invalid_file.txt')).rejects.toThrow(WrongFileExtensionError);
      });
    });
  });
});
