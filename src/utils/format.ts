const numberFmt = new Intl.NumberFormat('fr-FR');
const decimalFmt = new Intl.NumberFormat('fr-FR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatNumber(n: number): string {
  return numberFmt.format(n);
}

export function formatRate(n: number): string {
  return decimalFmt.format(n);
}

export function formatPercent(n: number): string {
  const sign = n >= 0 ? '+' : '';
  return `${sign}${decimalFmt.format(n)} %`;
}
