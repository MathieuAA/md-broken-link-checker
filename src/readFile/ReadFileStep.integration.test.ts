import * as fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { FileNotFoundError } from './secondary/FileNotFoundError';
import { WrongFileExtensionError } from './WrongFileExtensionError';
import ReadFileStep from './ReadFileStep';
import FileSystemFileContentAdapter from './secondary/FileSystemFileContentAdapter';
import FileContent from '../domain/FileContent';

describe('ReadFileStep - integration test', () => {
  describe('when providing a valid MD file', () => {
    describe('that is not empty', () => {
      let content: FileContent;
      const mdFilePath = path.join(os.tmpdir(), 'test_file.md');

      beforeAll(async () => {
        await fs.promises.writeFile(mdFilePath, '# My Title');
        const fileContentGetter = new FileSystemFileContentAdapter();
        const step = new ReadFileStep(fileContentGetter);
        content = await step.execute(mdFilePath);
      });

      afterAll(async () => {
        await fs.promises.unlink(mdFilePath);
      });

      it('should return the string content', () => {
        expect(content.getValue()).to.equal('# My Title');
      });
    });

    describe('that is empty', () => {
      let content: FileContent;
      const mdFilePath = path.join(os.tmpdir(), 'test_file.md');

      beforeAll(async () => {
        await fs.promises.writeFile(mdFilePath, '');
        const fileContentGetter = new FileSystemFileContentAdapter();
        const step = new ReadFileStep(fileContentGetter);
        content = await step.execute(mdFilePath);
      });

      afterAll(async () => {
        await fs.promises.unlink(mdFilePath);
      });

      it('should return an empty string', () => {
        expect(content.getValue()).to.equal('');
      });
    });
  });

  describe('when providing an invalid MD file', () => {
    let step: ReadFileStep;

    beforeAll(() => {
      const fileContentGetter = new FileSystemFileContentAdapter();
      step = new ReadFileStep(fileContentGetter);
    });

    describe('because the file does not exist', () => {
      it('should fail', async () => {
        await expect(() => step.execute('invalid_file.md')).rejects.toThrow(FileNotFoundError);
      });
    });

    describe('because the file does not have the right extension', async () => {
      it('should fail', async () => {
        await expect(() => step.execute('invalid_file.txt')).rejects.toThrow(WrongFileExtensionError);
      });
    });
  });
});
