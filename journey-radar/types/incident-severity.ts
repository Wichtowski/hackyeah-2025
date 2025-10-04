export interface SeverityOption {
  value: string;
  label: string;
  description: string;
}

export const SEVERITY_OPTIONS: SeverityOption[] = [
  {
    value: 'low',
    label: 'Utrudnienie',
    description: 'Drobne utrudnienia, opóźnienia do 5 minut'
  },
  {
    value: 'medium',
    label: 'Opóźnienie',
    description: 'Znaczące utrudnienia, opóźnienia 5-15 minut'
  },
  {
    value: 'severe',
    label: 'Blokada',
    description: 'Poważne zakłócenia, opóźnienia powyżej 15 minut'
  }
];