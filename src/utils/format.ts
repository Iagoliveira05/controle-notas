export const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
export const formatDate = (value: string) => new Date(value + 'T12:00').toLocaleDateString('pt-BR')
