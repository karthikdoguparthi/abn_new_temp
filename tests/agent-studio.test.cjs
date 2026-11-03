const { test } = require('node:test');
const assert = require('node:assert/strict');
const { ABAgentStudioEngine, formatCurrency, deriveTopic } = require('../scripts/ab-agent-studio.js');

test('deriveTopic cleans and extracts core business topic from natural language', () => {
  assert.equal(
    deriveTopic('Design a customer service solution for Capital Pooling & Asset Management'),
    'Capital Pooling & Asset Management'
  );
  assert.equal(
    deriveTopic('Build an enterprise AI platform for real estate property management'),
    'Real Estate Property Management'
  );
  assert.equal(
    deriveTopic('Tablet manufacturing factory administrative quote automation agent mesh'),
    'Tablet Manufacturing Factory Administrative Quote Automation'
  );
});

test('formatCurrency calculates accurate multi-currency figures without concatenation bugs', () => {
  assert.equal(formatCurrency(10000, 'USD'), '$10,000');
  assert.equal(formatCurrency(10000, 'GBP'), '£7,800');
  assert.equal(formatCurrency(10000, 'INR'), '₹840,000');
  assert.equal(formatCurrency(10000, 'EUR'), '€9,200');
  assert.equal(formatCurrency(10000, 'AUD'), 'A$15,200');
  assert.equal(formatCurrency(10000, 'AED'), 'AED 36,700');
});

test('ABAgentStudioEngine autonomous mode produces complete solution structure', async () => {
  const engine = new ABAgentStudioEngine({ currency: 'GBP' });
  const result = await engine.solve('Design a customer service solution for Capital Pooling & Asset Management');

  assert.equal(result.metadata.currency, 'GBP');
  assert.equal(result.metadata.solutionName, 'Capital Pooling & Asset Management AI Solution');
  assert.equal(result.metadata.targetOrg, 'Asset Management & Treasury Enterprise');
  assert.ok(result.agents.length >= 3, 'Must have at least 3 autonomous agents');
  assert.ok(result.phases.length === 5, 'Must have 5 phased delivery steps');
  assert.ok(result.costs.items.length >= 6, 'Must have detailed cost items');
  assert.ok(result.costs.totalUsd > 30000 && result.costs.totalUsd < 200000, 'Cost must be realistic enterprise estimate');
  assert.ok(result.costs.formattedTotal.startsWith('£'), 'Total must format in GBP');
  assert.ok(result.humanIntelligence.length >= 6, 'Must specify human intelligence requirements');
});

test('ABAgentStudioEngine handles empty prompt by rejecting with error', async () => {
  const engine = new ABAgentStudioEngine();
  await assert.rejects(
    async () => { await engine.solve('   '); },
    { message: 'Please provide a business scenario or problem statement.' }
  );
});
