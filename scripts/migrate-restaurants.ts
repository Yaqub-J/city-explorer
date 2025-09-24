import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables
import * as dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY // You'll need this for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface RestaurantData {
  Restaurants: string
  Address?: string
  'Dining Experience'?: string
  'Price range'?: string
  Cuisine?: string
  Contact?: string
}

// Helper function to extract city from address
function extractCity(address: string | undefined): string {
  if (!address) return 'Abuja'
  // Most addresses end with "Abuja [postal code], Federal Capital Territory"
  const parts = address.split(',')
  const cityPart = parts.find(part => part.includes('Abuja'))
  return cityPart ? cityPart.trim().split(' ')[0] : 'Abuja'
}

// Helper function to clean phone number
function cleanPhoneNumber(contact: string | undefined): string | null {
  if (!contact) return null
  return contact.replace(/[^\d\+\s]/g, '').trim() || null
}

// Helper function to map price range
function mapPriceRange(priceRange: string | undefined): string {
  if (!priceRange) return 'Mid-range'
  const lower = priceRange.toLowerCase()
  if (lower.includes('upscale') || lower.includes('fine')) return 'Premium'
  if (lower.includes('mid')) return 'Mid-range'
  if (lower.includes('budget') || lower.includes('affordable')) return 'Budget'
  return 'Mid-range'
}

// Helper function to map dining experience to category
function mapCategory(diningExperience: string | undefined, cuisine: string | undefined): string {
  const experience = diningExperience?.toLowerCase() || ''
  const cuisineType = cuisine?.toLowerCase() || ''

  if (experience.includes('fine') || experience.includes('upscale')) return 'Fine Dining'
  if (experience.includes('cafe') || experience.includes('bistro')) return 'Cafe'
  if (experience.includes('casual')) return 'Casual Dining'
  if (cuisineType.includes('fast') || cuisineType.includes('quick')) return 'Fast Food'
  if (cuisineType.includes('chinese')) return 'Chinese'
  if (cuisineType.includes('italian')) return 'Italian'
  if (cuisineType.includes('mexican')) return 'Mexican'
  if (cuisineType.includes('indian')) return 'Indian'
  if (cuisineType.includes('nigerian') || cuisineType.includes('african')) return 'Nigerian'

  return 'Restaurant'
}

async function createDefaultBusinessOwner() {
  try {
    // Check if default owner already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'business-owner@cityexplorer.com')
      .single()

    if (existingProfile) {
      console.log('Default business owner already exists:', existingProfile.id)
      return existingProfile.id
    }

    // Create auth user first
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: 'business-owner@cityexplorer.com',
      password: 'CityExplorer2024!',
      email_confirm: true
    })

    if (authError) {
      throw authError
    }

    if (!authUser.user) {
      throw new Error('Failed to create auth user')
    }

    console.log('Created auth user:', authUser.user.id)

    // Try to create profile using the auth user ID
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authUser.user.id,
        email: 'business-owner@cityexplorer.com',
        full_name: 'Default Business Owner',
        role: 'business',
        city: 'Abuja'
      })
      .select()
      .single()

    if (profileError) {
      // If profile already exists, fetch it instead
      if (profileError.code === '23505') {
        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', authUser.user.id)
          .single()

        if (fetchError) {
          throw fetchError
        }

        console.log('Using existing profile:', existingProfile.id)
        return existingProfile.id
      }
      throw profileError
    }

    console.log('Created default business owner profile:', profile.id)
    return profile.id
  } catch (error) {
    console.error('Error creating default business owner:', error)
    throw error
  }
}

async function migrateRestaurants() {
  try {
    console.log('Starting restaurant migration...')

    // Create default business owner
    const ownerId = await createDefaultBusinessOwner()

    // Read restaurant data
    const dataPath = path.join(process.cwd(), '../City_Explorer_Merged/abuja-restaurants.json')
    const restaurantData: RestaurantData[] = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

    console.log(`Found ${restaurantData.length} restaurants to migrate`)

    const businesses = restaurantData.map((restaurant) => ({
      owner_id: ownerId,
      name: restaurant.Restaurants,
      description: `${restaurant['Dining Experience'] || 'Restaurant'} serving ${restaurant.Cuisine || 'Various'} cuisine. Price range: ${restaurant['Price range'] || 'Mid-range'}.`,
      category: mapCategory(restaurant['Dining Experience'], restaurant.Cuisine),
      address: restaurant.Address || 'Abuja, Federal Capital Territory',
      city: extractCity(restaurant.Address),
      phone: cleanPhoneNumber(restaurant.Contact),
      verified: false,
      rating: 0,
      total_reviews: 0
    }))

    // Insert businesses in batches
    const batchSize = 50
    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < businesses.length; i += batchSize) {
      const batch = businesses.slice(i, i + batchSize)

      try {
        const { data, error } = await supabase
          .from('businesses')
          .insert(batch)
          .select()

        if (error) {
          console.error(`Error inserting batch ${Math.floor(i/batchSize) + 1}:`, error)
          errorCount += batch.length
        } else {
          successCount += data.length
          console.log(`Inserted batch ${Math.floor(i/batchSize) + 1}: ${data.length} businesses`)
        }
      } catch (error) {
        console.error(`Exception in batch ${Math.floor(i/batchSize) + 1}:`, error)
        errorCount += batch.length
      }
    }

    console.log(`Migration completed! Success: ${successCount}, Errors: ${errorCount}`)

  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrateRestaurants().then(() => {
  console.log('Migration script completed')
  process.exit(0)
})