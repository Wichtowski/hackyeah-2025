export interface SeverityOption {
  value: string;
  label: string;
  description: string;
}

export const SEVERITY_OPTIONS: SeverityOption[] = [
  {
    value: 'low',
    label: 'Drobny',
    description: 'Niewielkie utrudnienia, opóźnienia do 10 minut'
  },
  {
    value: 'medium',
    label: 'Średni',
    description: 'Odczuwalne utrudnienia, opóźnienia powyżej 10 minut'
  },
  {
    value: 'severe',
    label: 'Poważny',
    description: 'Opóźnienia powyżej 30 minut, sytuacje kryzysowe'
  }
];