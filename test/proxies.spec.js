import { randomUUID } from 'node:crypto';

import { faker } from '@faker-js/faker';
import nock from 'nock';
import request from 'supertest';

import { loadServer } from './helpers/load-server';

describe('Proxies', () => {
  /**
   * @type {import('http').Server}
   */
  let server;

  beforeEach(async () => {
    process.env = {
      ...process.env,
      TOKEN: faker.lorem.word(),
    };

    server = await loadServer();
  });

  it('should proxy to the api', async () => {
    const url = faker.internet.url();
    const uri = `/${faker.internet.domainWord()}`;

    nock(url)
      .get(uri)
      .reply(200, {
        id: randomUUID(),
      });

    await request(server)
      .post(`/proxies?token=${process.env.TOKEN}`)
      .send({
        namespace: 'something',
        target: url,
      });

    const { status, body } = await request(server)
      .get(`/something${uri}`);

    expect(status).toBe(200);
    expect(body).toEqual({
      id: expect.any(String),
    });
  });
});
