import fs from 'fs';
import path from 'path'

async function setOrCreateFile(filePath, data) {
  const dir = path.dirname(filePath)
  await ensureDirExists(dir)
  return await fs.promises.writeFile(filePath, data)
}

async function getOrCreateFile(filePath) {
  const dir = path.dirname(filePath)
  await ensureDirExists(dir)
  try {
    return await fs.promises.readFile(filePath, 'utf8')
  } catch (error) {
    if (error.code == 'ENOENT') {
      const initData = ''
      await fs.promises.writeFile(filePath, initData)
      return initData;
    }
    throw error;
  }
}

async function ensureDirExists(dir) {
  if (!fs.existsSync(dir)) {
    await fs.promises.mkdir(dir, { recursive: true })
  }
}

export { setOrCreateFile, getOrCreateFile };
