import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vukgskvspewsvkntkujd.supabase.co'
const supabaseKey = 'sb_publishable_D2-sgkDrpU9cQllBUI9jNg_ufbrcBWR'

export const supabase = createClient(supabaseUrl, supabaseKey)