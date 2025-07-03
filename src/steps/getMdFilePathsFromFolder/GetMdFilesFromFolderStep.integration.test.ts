import { mkdir, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import GetMdFilePathsFromFolderStep from './GetMdFilesFromFolderStep';
import FileAdapter from './secondary/FileAdapter';
import Folder from '../../domain/files/Folder';
import FastGlobFileSystemService from '../../shared/fileSystem/FastGlobFileSystemService';

describe('GetMdFilesFromFolderStep - integration tests', () => {
  describe('when there are MD files in the folder', () => {
    const folderPath = path.join(tmpdir(), 'test_folder');
    let folder: Folder;

    beforeAll(async () => {
      await createDirectory(folderPath);
      await createEmptyFile(path.join(folderPath, 'test_file0.txt'));
      await createEmptyFile(path.join(folderPath, 'test_file1.md'));
      await createEmptyFile(path.join(folderPath, 'test_file2.md'));
      const fileSystemService = new FastGlobFileSystemService();
      const fileAdapter = new FileAdapter(fileSystemService);
      const step = new GetMdFilePathsFromFolderStep(fileAdapter);
      folder = await step.execute(folderPath);
    });

    afterAll(async () => {
      await deleteDirectory(folderPath);
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

  describe('when there are MD files in the folder, along with other MD files in subfolders', () => {
    const folderPath = path.join(tmpdir(), 'test_folder');
    let folder: Folder;

    beforeAll(async () => {
      await createDirectory(folderPath);
      await createEmptyFile(path.join(folderPath, 'test_file0.txt'));
      await createEmptyFile(path.join(folderPath, 'test_file1.md'));
      await createEmptyFile(path.join(folderPath, 'test_file2.md'));
      await createDirectory(path.join(folderPath, 'test_folder'));
      await createEmptyFile(path.join(path.join(folderPath, 'test_folder'), 'test_file3.md'));
      const fileSystemService = new FastGlobFileSystemService();
      const fileAdapter = new FileAdapter(fileSystemService);
      const step = new GetMdFilePathsFromFolderStep(fileAdapter);
      folder = await step.execute(folderPath);
    });

    afterAll(async () => {
      await deleteDirectory(folderPath);
    });

    it('should only return the MD files', () => {
      let count = 0;
      folder.forEachFile((file) => {
        expect(file.getPath().endsWith('md'));
        if (file.getPath().endsWith('md')) {
          count++;
        }
      });
      expect(count).to.equal(3);
    });
  });

  describe('when there are no MD files in the folder', () => {
    const folderPath = path.join(tmpdir(), 'test_folder');
    let folder: Folder;

    beforeAll(async () => {
      await createDirectory(folderPath);
      await createEmptyFile(path.join(folderPath, 'test_file0.txt'));
      await createDirectory(path.join(folderPath, 'test_folder'));
      await createEmptyFile(path.join(path.join(folderPath, 'test_folder'), 'test_file3.sql'));
      const fileSystemService = new FastGlobFileSystemService();
      const fileAdapter = new FileAdapter(fileSystemService);
      const step = new GetMdFilePathsFromFolderStep(fileAdapter);
      folder = await step.execute(folderPath);
    });

    afterAll(async () => {
      await deleteDirectory(folderPath);
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

async function createDirectory(path: string): Promise<void> {
  await mkdir(path, { recursive: true });
}

async function createEmptyFile(path: string): Promise<void> {
  await writeFile(path, '');
}

async function deleteDirectory(path: string): Promise<void> {
  await rm(path, { recursive: true, force: true });
}
