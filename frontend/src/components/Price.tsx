import { useCurrency } from '../contexts/CurrencyContext'

const SYMBOL: Record<string, string> = {
    USD: '$',
    INR: '₹',
    EUR: '€'
}

const Price = ({ amount }: { amount: number }) => {
    const { currency, rates } = useCurrency()

    const rate = rates[currency] ?? 1

    return (
        <>
            {SYMBOL[currency] || currency} {(amount * rate).toFixed(2)}
        </>
    )
}

export default Price
