import { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import CountryCard from '../components/CountryCard'

function Home() {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!query) {
      const resetTimer = setTimeout(() => {
        setCountries([])
        setError(null)
        setLoading(false)
      }, 0)

      return () => clearTimeout(resetTimer)
    }

    const timer = setTimeout(() => {
      const fetchCountries = async () => {
        setLoading(true)
        setError(null)

        try {
          const res = await fetch(`https://restcountries.com/v3.1/name/${query}`)
          if (!res.ok) throw new Error('Not found')
          const data = await res.json()
          setCountries(data)
          setError(null)
        } catch {
          setCountries([])
          setError('No countries found.')
        } finally {
          setLoading(false)
        }
      }

      fetchCountries()
    }, 400)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="home">
      <SearchBar query={query} onQueryChange={setQuery} />

      {loading && <p className="home__status">Loading...</p>}
      {error && <p className="home__status home__status--error">{error}</p>}

      {!loading && !error && countries.length > 0 && (
        <div className="cards-grid">
          {countries.map((country) => (
            <CountryCard key={country.cca3} country={country} />
          ))}
        </div>
      )}

      {!loading && !error && countries.length === 0 && !query && (
        <p className="home__status">Start searching to explore countries.</p>
      )}
    </div>
  )
}

export default Home