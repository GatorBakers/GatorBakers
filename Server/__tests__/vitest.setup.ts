import { vi } from 'vitest';

process.env.NODE_ENV = 'test';
process.env.VITEST = 'true';
process.env.MEILI_HOST ??= 'http://127.0.0.1:7700';
process.env.MEILI_API_KEY ??= 'test-meili-api-key';
process.env.STREAM_API_KEY ??= 'test-stream-api-key';
process.env.STREAM_API_SECRET ??= 'test-stream-api-secret';
process.env.STREAM_API_KEY_SECRET ??= process.env.STREAM_API_SECRET;

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

vi.mock('stream-chat', () => {
  const mockChannel = {
    create: vi.fn(async () => undefined),
  };

  const mockClient = {
    upsertUsers: vi.fn(async () => undefined),
    channel: vi.fn(() => mockChannel),
    createToken: vi.fn(() => 'test-stream-token'),
  };

  return {
    StreamChat: {
      getInstance: vi.fn(() => mockClient),
    },
  };
});