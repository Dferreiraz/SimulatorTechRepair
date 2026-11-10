const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

/** R$ 1.234,56 */
export const formatCurrency = (value: number): string => brl.format(value);
