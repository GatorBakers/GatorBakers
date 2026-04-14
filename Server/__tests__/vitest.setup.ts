import { vi } from 'vitest';

process.env.NODE_ENV = 'test';
process.env.VITEST = 'true';
process.env.MEILI_HOST ??= 'http://127.0.0.1:7700';
process.env.MEILI_API_KEY ??= 'test-meili-api-key';

vi.mock('meilisearch', () => {
  class MeiliSearchMock {
    index() {
      return {
        addDocuments: vi.fn(async () => undefined),
        search: vi.fn(async () => ({ hits: [] })),
        updateDocuments: vi.fn(async () => undefined),
        deleteDocument: vi.fn(async () => undefined),
      };
    }
  }

  return { MeiliSearch: MeiliSearchMock };
});