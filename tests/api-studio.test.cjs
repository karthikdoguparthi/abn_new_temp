const { test } = require('node:test');
const assert = require('node:assert/strict');
const studioHandler = require('../api/studio.js');

function createMockReqRes({ method = 'POST', body = {}, headers = {} }) {
  const req = {
    method,
    headers: { 'content-type': 'application/json', ...headers },
    body
  };
  let statusCode = 200;
  let responseData = null;
  const headersSet = {};

  const res = {
    status(code) {
      statusCode = code;
      return res;
    },
    setHeader(name, val) {
      headersSet[name.toLowerCase()] = val;
    },
    json(data) {
      responseData = data;
      return res;
    },
    getStatus: () => statusCode,
    getData: () => responseData,
    getHeader: (name) => headersSet[name.toLowerCase()]
  };

  return { req, res };
}

test('api/studio rejects non-POST requests with 405', async () => {
  const { req, res } = createMockReqRes({ method: 'GET' });
  await studioHandler(req, res);
  assert.equal(res.getStatus(), 405);
  assert.equal(res.getData().ok, false);
});

test('api/studio rejects empty prompt with 400', async () => {
  const { req, res } = createMockReqRes({ body: { prompt: '' } });
  await studioHandler(req, res);
  assert.equal(res.getStatus(), 400);
  assert.equal(res.getData().ok, false);
});

test('api/studio synthesizes grounded Active Brains enterprise solution', async () => {
  const { req, res } = createMockReqRes({
    body: {
      prompt: 'Design an automated underwriting workflow for commercial real estate mortgages',
      currency: 'USD',
      model: 'ab-slm-agent'
    }
  });

  await studioHandler(req, res);
  assert.equal(res.getStatus(), 200);
  const data = res.getData();
  assert.equal(data.ok, true);
  assert.ok(data.solution || data.rawOutput);

  if (data.solution) {
    assert.ok(data.solution.solutionPlan.executiveSummary.length > 20);
    assert.ok(Array.isArray(data.solution.solutionPlan.scope));
    assert.ok(Array.isArray(data.solution.solutionPlan.costItems));
    assert.ok(data.solution.solutionPlan.totalCost > 0);
  }
});
