import { createContext, useContext, useEffect, useState } from 'react'

type Currency = {
    code: string
    description: string
}

type CurrencyContextType = {
    currency: string
    setCurrency: (c: string) => void
    currencies: Currency[]
    rates: Record<string, number>
}

const CurrencyContext = createContext<CurrencyContextType | null>(null)

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
    const [currency, setCurrency] = useState('USD')
    const [currencies, setCurrencies] = useState<Currency[]>([])
    const [rates, setRates] = useState<Record<string, number>>({})

    useEffect(() => {
        const loadCurrencyData = async () => {
            try {
                /* Fetch currencies list */
                const currenciesRes = await fetch(
                    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json'
                )
                const currenciesData = await currenciesRes.json()

                const list: Currency[] = Object.entries(currenciesData).map(
                    ([code, description]) => ({
                        code: code.toUpperCase(),
                        description: String(description),
                    })
                )

                setCurrencies(list)

                /* Fetch USD exchange rates */
                const ratesRes = await fetch(
                    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json'
                )
                const ratesData = await ratesRes.json()

                // NORMALIZE rates to UPPERCASE
                const normalizedRates: Record<string, number> = { USD: 1 }

                Object.entries(ratesData.usd).forEach(([code, value]) => {
                    normalizedRates[code.toUpperCase()] = value as number
                })

                setRates(normalizedRates)
            } catch (err) {
                console.error('Currency loading failed:', err)
            }
        }

        loadCurrencyData()
    }, [])

    return (
        <CurrencyContext.Provider
            value={{ currency, setCurrency, currencies, rates }}
        >
            {children}
        </CurrencyContext.Provider>
    )
}

export const useCurrency = () => {
    const ctx = useContext(CurrencyContext)
    if (!ctx) {
        throw new Error('useCurrency must be used inside CurrencyProvider')
    }
    return ctx
}
