import { rm } from 'fs/promises';
import { join } from 'path';
import { getConnection } from 'typeorm';

// Path must match app.module TypeORM database for NODE_ENV=test (test.sqlite at project root)
const testDbPath = join(__dirname, '..', 'test.sqlite');

global.beforeEach(async () => {
  try {
    await rm(testDbPath);
  } catch (err) {}
});

global.afterEach(async () => {
  const conn = getConnection();
  await conn.close();
});
