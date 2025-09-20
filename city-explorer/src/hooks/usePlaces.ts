import { useState, useEffect, useCallback } from 'react'
import { placesService, type GooglePlace, type PlaceSearchOptions } from '@/services/maps/placesService'

interface UsePlacesReturn {
  places: GooglePlace[]
  loading: boolean
  error: string | null
  searchNearby: (options: PlaceSearchOptions) => Promise<void>
  searchByQuery: (query: string, location?: { lat: number; lng: number }) => Promise<void>
  getPlaceDetails: (placeId: string) => Promise<GooglePlace | null>
  getPlacesByCategory: (category: string, location?: { lat: number; lng: number }) => Promise<void>
  getCurrentLocation: () => Promise<{ lat: number; lng: number }>
  clearPlaces: () => void
}

export const usePlaces = (): UsePlacesReturn => {
  const [places, setPlaces] = useState<GooglePlace[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initialize the places service when the hook is first used
    placesService.initialize().catch((err) => {
      setError('Failed to initialize Google Maps API')
      console.error(err)
    })
  }, [])

  const searchNearby = useCallback(async (options: PlaceSearchOptions) => {
    setLoading(true)
    setError(null)
    try {
      const results = await placesService.searchNearbyPlaces(options)
      setPlaces(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search nearby places')
      setPlaces([])
    } finally {
      setLoading(false)
    }
  }, [])

  const searchByQuery = useCallback(async (query: string, location?: { lat: number; lng: number }) => {
    setLoading(true)
    setError(null)
    try {
      const results = await placesService.searchPlacesByQuery(query, location)
      setPlaces(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search places')
      setPlaces([])
    } finally {
      setLoading(false)
    }
  }, [])

  const getPlaceDetails = useCallback(async (placeId: string): Promise<GooglePlace | null> => {
    try {
      return await placesService.getPlaceDetails(placeId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get place details')
      return null
    }
  }, [])

  const getPlacesByCategory = useCallback(async (category: string, location?: { lat: number; lng: number }) => {
    setLoading(true)
    setError(null)
    try {
      const results = await placesService.getPlacesByCategory(category, location)
      setPlaces(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get places by category')
      setPlaces([])
    } finally {
      setLoading(false)
    }
  }, [])

  const getCurrentLocation = useCallback(async (): Promise<{ lat: number; lng: number }> => {
    try {
      return await placesService.getCurrentLocation()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get current location')
      throw err
    }
  }, [])

  const clearPlaces = useCallback(() => {
    setPlaces([])
    setError(null)
  }, [])

  return {
    places,
    loading,
    error,
    searchNearby,
    searchByQuery,
    getPlaceDetails,
    getPlacesByCategory,
    getCurrentLocation,
    clearPlaces
  }
}

export default usePlaces