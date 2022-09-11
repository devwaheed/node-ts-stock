import fsExtra from 'fs-extra';

export async function readJsonFile<T>(filePath: string): Promise<T>{
  return await fsExtra.readJson(filePath, {encoding: 'utf-8'});
}
