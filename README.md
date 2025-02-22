# GymFlow - Gym Management System

## Database Setup Instructions

1. Create a Supabase Account:
   - Go to https://supabase.com
   - Create a new account or sign in
   - Create a new project

2. Create Database Tables:

Run the following SQL in the Supabase SQL editor:

```sql
-- Create members table
CREATE TABLE members (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    membershipType TEXT NOT NULL,
    phone TEXT NOT NULL,
    joinDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    status TEXT NOT NULL,
    image TEXT NOT NULL,
    isPresent BOOLEAN DEFAULT false,
    attendanceCount INTEGER DEFAULT 0,
    visitHours INTEGER[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create settings table
CREATE TABLE settings (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    logo TEXT DEFAULT '',
    openingTime TEXT NOT NULL,
    closingTime TEXT NOT NULL,
    gradientFrom TEXT NOT NULL,
    gradientTo TEXT NOT NULL,
    backgroundImage TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create initial settings record
INSERT INTO settings (
    name, 
    openingTime, 
    closingTime, 
    gradientFrom, 
    gradientTo
) VALUES (
    'نادي جليدة الرياضي',
    '06:00',
    '23:00',
    '#1e3a8a',
    '#581c87'
);
```

3. Configure Environment Variables:
   - In your Supabase project settings, find your project URL and anon key
   - Update these values in `src/lib/supabase.ts`
   - Replace `YOUR_SUPABASE_URL` with your project URL
   - Replace `YOUR_SUPABASE_KEY` with your anon key

4. Enable Row Level Security (RLS):
   - Go to your Supabase project's Authentication settings
   - Enable "Row Level Security" for both tables
   - Add the following policies:

For members table:
```sql
CREATE POLICY "Enable read access for all users" ON public.members
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.members
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.members
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON public.members
    FOR DELETE USING (auth.role() = 'authenticated');
```

For settings table:
```sql
CREATE POLICY "Enable read access for all users" ON public.settings
    FOR SELECT USING (true);

CREATE POLICY "Enable update for authenticated users only" ON public.settings
    FOR UPDATE USING (auth.role() = 'authenticated');
```

5. Run the application:
```bash
npm install
npm run dev
```
#   g y m a k  
 #   g y m a k  
 