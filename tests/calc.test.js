// Checks the calculators against hand-worked examples from the project notes.
// Run with: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { breakEven, podcastAds, productionRetainer, gearPayback, runway, WEEKS_PER_MONTH } from '../src/lib/calc.js';

const close = (a, b, tol = 0.5) => assert.ok(Math.abs(a - b) <= tol, `${a} not within ${tol} of ${b}`);

test('lease test: $4,000 overhead at $60/h', () => {
  const r = breakEven({ rent: 2500, otherFixed: 1500, rate: 60, ownerPay: 0, availableHours: 60, opexShare: 0.3, realisticHours: 25 });
  assert.equal(r.overhead, 4000);
  close(r.cover.month, 66.7, 0.1); // about 67 booked hours a month just to cover costs
  close(r.profitFirst.revenue, 13333.3, 0.1); // $4,000 ÷ 30%
  close(r.profitFirst.month, 222.2, 0.1); // about 222 hours a month
  close(r.profitFirst.week, 51.3, 0.1); // about 51 a week
  close(r.overheadCeiling, 1950, 1); // 25 h/week × $60 × 4.33 × 30%
  assert.equal(r.leasePasses, false);
});

test('break-even with owner pay: $3,200 fixed + $4,000 pay at $60/h', () => {
  const r = breakEven({ rent: 2500, otherFixed: 700, rate: 60, ownerPay: 4000, availableHours: 50, opexShare: 0.3, realisticHours: 0 });
  close(r.cover.month, 53.3, 0.1);
  close(r.withPay.month, 120, 0.01);
  close(r.withPay.week, 120 / WEEKS_PER_MONTH, 0.01); // about 28 a week
});

test('podcast ads: 800 downloads, $25 CPM, 2 slots', () => {
  const r = podcastAds({ downloads: 800, cpm: 25, slots: 2, networkCut: 0, episodesPerMonth: 4 });
  assert.equal(r.perEpisode, 40);
  assert.equal(r.perMonth, 160);
  const cut = podcastAds({ downloads: 800, cpm: 25, slots: 2, networkCut: 0.3, episodesPerMonth: 4 });
  close(cut.perEpisode, 28, 0.001);
});

test('production retainer: 6 h per episode at $75, weekly show', () => {
  const r = productionRetainer({ hoursPerEpisode: 6, rate: 75, episodesPerWeek: 1, focusHoursPerWeek: 20 });
  assert.equal(r.perEpisode, 450);
  close(r.perClientMonth, 1950, 1);
  close(r.capacityEpisodes, 14.4, 0.1);
  close(r.capacityClients, 3.33, 0.01);
});

test('gear payback: $60,000 build, 40 extra hours at $60', () => {
  const r = gearPayback({ cost: 60000, extraHours: 40, rate: 60, extraCosts: 0, leaseMonthsLeft: 36, saveMonths: 12 });
  assert.equal(r.months, 25);
  assert.equal(r.paysBackInLease, true);
  assert.equal(r.perTransfer, 2500);
  assert.equal(gearPayback({ cost: 1000, extraHours: 0, rate: 60, extraCosts: 0 }).months, null);
});

test('runway', () => {
  const r = runway({ oneTime: [5000, 3000], monthly: [1200, 300], cash: 20000, monthlyRevenue: 500 });
  assert.equal(r.left, 12000);
  assert.equal(r.burn, 1000);
  assert.equal(r.months, 12);
  assert.equal(runway({ oneTime: [100], monthly: [100], cash: 1000, monthlyRevenue: 200 }).months, Infinity);
  assert.equal(runway({ oneTime: [2000], monthly: [100], cash: 1000, monthlyRevenue: 0 }).months, 0);
});
