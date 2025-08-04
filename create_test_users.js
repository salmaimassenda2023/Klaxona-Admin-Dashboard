import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Create admin client with service role key (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

const adminAuthClient = supabaseAdmin.auth.admin

// Données des utilisateurs à créer (extraites de votre script)
const testUsers = [
    {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        email: 'fatima.z@example.com',
        password: 'password123', // Mot de passe pour les tests
        profile: {
            full_name: 'Fatima Zahra',
            phone_number: '+212600000001',
            user_type: 'CLIENT',
            latitude: 34.020882,
            longitude: -6.841650,
            created_at: '2025-07-10T10:00:00Z',
            updated_at: '2025-07-10T10:00:00Z'
        }
    },
    {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
        email: 'youssef.a@example.com',
        password: 'password123',
        profile: {
            full_name: 'Youssef Amrani',
            phone_number: '+212600000002',
            user_type: 'DRIVER',
            latitude: null,
            longitude: null,
            created_at: '2025-07-10T10:05:00Z',
            updated_at: '2025-07-10T10:05:00Z'
        }
    },
    {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
        email: 'amine.ef@example.com',
        password: 'password123',
        profile: {
            full_name: 'Amine El Fassi',
            phone_number: '+212600000003',
            user_type: 'DRIVER_MANAGER',
            latitude: null,
            longitude: null,
            created_at: '2025-07-10T10:10:00Z',
            updated_at: '2025-07-10T10:10:00Z'
        }
    },
    {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
        email: 'nadia.b@example.com',
        password: 'password123',
        profile: {
            full_name: 'Nadia Bennani',
            phone_number: '+212600000004',
            user_type: 'ADMIN',
            latitude: null,
            longitude: null,
            created_at: '2025-07-01T09:00:00Z',
            updated_at: '2025-07-01T09:00:00Z'
        }
    },
    {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
        email: 'karim.a@example.com',
        password: 'password123',
        profile: {
            full_name: 'Karim Alami',
            phone_number: '+212600000005',
            user_type: 'SUPPORT',
            latitude: null,
            longitude: null,
            created_at: '2025-07-01T09:05:00Z',
            updated_at: '2025-07-01T09:05:00Z'
        }
    },
    // Utilisateurs supplémentaires
    {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11',
        email: 'another.client@example.com',
        password: 'password123',
        profile: {
            full_name: 'Client Two',
            phone_number: '+212600000011',
            user_type: 'CLIENT',
            latitude: 33.573110,
            longitude: -7.589843,
            created_at: '2025-07-15T10:00:00Z',
            updated_at: '2025-07-15T10:00:00Z'
        }
    },
    {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12',
        email: 'cancelled.client@example.com',
        password: 'password123',
        profile: {
            full_name: 'Client Cancelled',
            phone_number: '+212600000012',
            user_type: 'CLIENT',
            latitude: 31.629472,
            longitude: -7.981084,
            created_at: '2024-07-01T11:00:00Z',
            updated_at: '2024-07-01T11:00:00Z'
        }
    },
    {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b13',
        email: 'new.trial.client@example.com',
        password: 'password123',
        profile: {
            full_name: 'Client New Trial',
            phone_number: '+212600000013',
            user_type: 'CLIENT',
            latitude: 34.020882,
            longitude: -6.841650,
            created_at: '2025-07-18T13:00:00Z',
            updated_at: '2025-07-18T13:00:00Z'
        }
    },
    {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b14',
        email: 'expired.client@example.com',
        password: 'password123',
        profile: {
            full_name: 'Client Expired',
            phone_number: '+212600000014',
            user_type: 'CLIENT',
            latitude: 33.971590,
            longitude: -6.849813,
            created_at: '2024-07-10T10:00:00Z',
            updated_at: '2024-07-10T10:00:00Z'
        }
    },
    {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11',
        email: 'another.driver@example.com',
        password: 'password123',
        profile: {
            full_name: 'Driver Two',
            phone_number: '+212600000021',
            user_type: 'DRIVER',
            latitude: null,
            longitude: null,
            created_at: '2025-07-10T11:00:00Z',
            updated_at: '2025-07-10T11:00:00Z'
        }
    },
    {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380c12',
        email: 'independent.driver@example.com',
        password: 'password123',
        profile: {
            full_name: 'Driver Independent',
            phone_number: '+212600000022',
            user_type: 'DRIVER',
            latitude: null,
            longitude: null,
            created_at: '2025-07-10T11:05:00Z',
            updated_at: '2025-07-10T11:05:00Z'
        }
    },
    {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380c13',
        email: 'offline.driver@example.com',
        password: 'password123',
        profile: {
            full_name: 'Driver Offline',
            phone_number: '+212600000023',
            user_type: 'DRIVER',
            latitude: null,
            longitude: null,
            created_at: '2025-07-10T11:10:00Z',
            updated_at: '2025-07-10T11:10:00Z'
        }
    },
    {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380c14',
        email: 'hw.driver2@example.com',
        password: 'password123',
        profile: {
            full_name: 'Driver HW',
            phone_number: '+212600000024',
            user_type: 'DRIVER',
            latitude: null,
            longitude: null,
            created_at: '2025-07-10T11:15:00Z',
            updated_at: '2025-07-10T11:15:00Z'
        }
    }
]

async function createTestUsers() {
    console.log('🚀 Création des utilisateurs de test...')

    let successCount = 0
    let errorCount = 0

    for (const user of testUsers) {
        try {
            console.log(`👤 Création de l'utilisateur: ${user.email}`)

            // 1. Créer l'utilisateur dans auth.users
            const { data: authData, error: authError } = await adminAuthClient.createUser({
                email: user.email,
                password: user.password,
                email_confirm: true,
                user_metadata: {
                    full_name: user.profile.full_name,
                    user_type: user.profile.user_type
                }
            })

            if (authError) {
                console.error(`❌ Erreur auth pour ${user.email}:`, authError.message)
                errorCount++
                continue
            }

            // 2. Créer le profil correspondant using admin client
            const { error: profileError } = await supabaseAdmin
                .from('profiles')
                .insert({
                    id: authData.user.id, // Utiliser l'ID généré par Supabase
                    email: user.email,
                    full_name: user.profile.full_name,
                    phone_number: user.profile.phone_number,
                    user_type: user.profile.user_type,
                    latitude: user.profile.latitude,
                    longitude: user.profile.longitude,
                })

            if (profileError) {
                console.error(`❌ Erreur profil pour ${user.email}:`, profileError.message)
                errorCount++
            } else {
                console.log(`✅ Utilisateur créé avec succès: ${user.email}`)
                successCount++
            }

        } catch (error) {
            console.error(`❌ Erreur générale pour ${user.email}:`, error.message)
            errorCount++
        }
    }

    console.log(`\n📊 Résumé:`)
    console.log(`✅ Succès: ${successCount}`)
    console.log(`❌ Erreurs: ${errorCount}`)
    console.log(`🎯 Total: ${testUsers.length}`)
}

// Call the function
createTestUsers().catch(console.error)