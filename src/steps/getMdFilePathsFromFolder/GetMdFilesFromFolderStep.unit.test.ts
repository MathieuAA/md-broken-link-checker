import path from 'path';
import { beforeAll, describe, expect, it } from 'vitest';
import GetMdFilePathsFromFolderStep from './GetMdFilesFromFolderStep';
import FileAdapter from './secondary/FileAdapter';
import Folder from '../../domain/files/Folder';
import FakeFileSystemService from '../../shared/fileSystem/FakeFileSystemService';

describe('GetMdFilesFromFolderStep - unit tests', () => {
  describe('when there are MD files in the folder', () => {
    let folder: Folder;

    beforeAll(async () => {
      const fileSystemService = new FakeFileSystemService([
        path.join('test', 'test_file1.md'),
        path.join('test', 'test_file2.md'),
      ]);
      const fileAdapter = new FileAdapter(fileSystemService);
      const step = new GetMdFilePathsFromFolderStep(fileAdapter);
      folder = await step.execute('test');
    });

    it('should only return the MD files', () => {
      let count = 0;
      folder.forEachFile((file) => {
        expect(file.getPath().endsWith('md'));
        if (file.getPath().endsWith('md')) {
          count++;
        }
      });
      expect(count).to.equal(2);
    });
  });

  describe('when there are no MD files in the folder', () => {
    let folder: Folder;

    beforeAll(async () => {
      const fileSystemService = new FakeFileSystemService([]);
      const fileAdapter = new FileAdapter(fileSystemService);
      const step = new GetMdFilePathsFromFolderStep(fileAdapter);
      folder = await step.execute('test');
    });

    it('should return an empty folder', () => {
      let count = 0;
      folder.forEachFile((file) => {
        expect(file.getPath().endsWith('md'));
        if (file.getPath().endsWith('md')) {
          count++;
        }
      });
      expect(count).to.equal(0);
    });
  });
});
