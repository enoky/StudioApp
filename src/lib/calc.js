// Pure calculator maths, shared by the tool pages and the tests in tests/.
// All money is in Canadian dollars, before HST.

export const WEEKS_PER_MONTH = 52 / 12; // about 4.33

const n = (v) => (Number.isFinite(+v) ? +v : 0);

/**
 * Break-even and Profit First lease test.
 * @param {object} i
 * @param {number} i.rent monthly rent
 * @param {number} i.otherFixed other monthly fixed costs (utilities, insurance, software, marketing)
 * @param {number} i.rate effective hourly rate actually earned
 * @param {number} i.ownerPay monthly pay you want for yourself
 * @param {number} i.availableHours hours a week the room could be booked
 * @param {number} i.opexShare share of real revenue the studio may spend on overhead (0.30 = 30%)
 * @param {number} i.realisticHours hours a week you honestly expect to book
 */
export function breakEven(i) {
  const overhead = n(i.rent) + n(i.otherFixed);
  const rate = n(i.rate);
  const opex = n(i.opexShare);
  const available = n(i.availableHours);
  const perWeek = (monthlyHours) => monthlyHours / WEEKS_PER_MONTH;
  const util = (weekly) => (available > 0 ? weekly / available : null);

  const coverHoursMonth = rate > 0 ? overhead / rate : null;
  const payHoursMonth = rate > 0 ? (overhead + n(i.ownerPay)) / rate : null;
  const pfRevenue = opex > 0 ? overhead / opex : null;
  const pfHoursMonth = pfRevenue !== null && rate > 0 ? pfRevenue / rate : null;

  const realisticRevenue = n(i.realisticHours) * rate * WEEKS_PER_MONTH;
  const overheadCeiling = realisticRevenue * opex;

  return {
    overhead,
    cover: coverHoursMonth === null ? null : { month: coverHoursMonth, week: perWeek(coverHoursMonth), utilization: util(perWeek(coverHoursMonth)) },
    withPay: payHoursMonth === null ? null : { month: payHoursMonth, week: perWeek(payHoursMonth), utilization: util(perWeek(payHoursMonth)) },
    profitFirst:
      pfHoursMonth === null
        ? null
        : { revenue: pfRevenue, month: pfHoursMonth, week: perWeek(pfHoursMonth), utilization: util(perWeek(pfHoursMonth)) },
    realisticRevenue,
    overheadCeiling,
    leasePasses: overhead <= overheadCeiling,
  };
}

/**
 * Podcast ad revenue at CPM, compared with selling production work.
 */
export function podcastAds(i) {
  const perEpisodeGross = (n(i.downloads) / 1000) * n(i.cpm) * n(i.slots);
  const perEpisode = perEpisodeGross * (1 - n(i.networkCut));
  return { perEpisodeGross, perEpisode, perMonth: perEpisode * n(i.episodesPerMonth) };
}

export function productionRetainer(i) {
  const perEpisode = n(i.hoursPerEpisode) * n(i.rate);
  const episodesPerMonth = n(i.episodesPerWeek) * WEEKS_PER_MONTH;
  const capacityEpisodes = n(i.hoursPerEpisode) > 0 ? (n(i.focusHoursPerWeek) * WEEKS_PER_MONTH) / n(i.hoursPerEpisode) : 0;
  const capacityClients = episodesPerMonth > 0 ? capacityEpisodes / episodesPerMonth : 0;
  return { perEpisode, perClientMonth: perEpisode * episodesPerMonth, capacityEpisodes, capacityClients };
}

/**
 * Months for a purchase or build-out to pay for itself.
 */
export function gearPayback(i) {
  const extraRevenue = n(i.extraHours) * n(i.rate);
  const extraProfit = extraRevenue - n(i.extraCosts);
  const months = extraProfit > 0 ? n(i.cost) / extraProfit : null;
  const lease = n(i.leaseMonthsLeft);
  return {
    extraRevenue,
    extraProfit,
    months,
    paysBackInLease: months !== null && lease > 0 ? months <= lease : null,
    // Profit First "major equipment" saving: target ÷ months ÷ 2, moved on the 10th and 25th.
    perTransfer: n(i.saveMonths) > 0 ? n(i.cost) / n(i.saveMonths) / 2 : null,
  };
}

/**
 * Startup budget and runway.
 * @param {{oneTime: number[], monthly: number[], cash: number, monthlyRevenue: number}} i
 */
export function runway(i) {
  const oneTime = (i.oneTime || []).reduce((a, b) => a + n(b), 0);
  const monthly = (i.monthly || []).reduce((a, b) => a + n(b), 0);
  const left = n(i.cash) - oneTime;
  const burn = monthly - n(i.monthlyRevenue);
  let months = null;
  if (left < 0) months = 0;
  else if (burn <= 0) months = Infinity;
  else months = left / burn;
  return { oneTime, monthly, left, burn, months };
}
