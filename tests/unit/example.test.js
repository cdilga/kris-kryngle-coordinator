import { describe, it, expect } from 'vitest';
import worker from '../../src/index.js';
import { env, createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';

describe('Worker unit tests', () => {
  it('responds with a message', async () => {
    const request = new Request('http://example.com');
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toBeTruthy();
  });

  it('handles errors gracefully', async () => {
    // Add your error handling tests here
    expect(true).toBe(true);
  });
});
