
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bhccyhgcbjbkbgmwtrde.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoY2N5aGdjYmpia2JnbXd0cmRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MTY2NDUsImV4cCI6MjA4NjI5MjY0NX0.wS-JAayOie4W2rvJb_sXV1zDkQ6HcQqYks2w4O9K1vE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  console.log('Testing Supabase connection...');
  
  // 1. Try to select from contacts
  const { data: selectData, error: selectError } = await supabase
    .from('contacts')
    .select('*')
    .limit(1);

  if (selectError) {
    console.log('Select failed:', selectError.message);
  } else {
    console.log('Select success:', selectData);
  }

  // 2. Try to insert into contacts
  const { data: insertData, error: insertError } = await supabase
    .from('contacts')
    .insert([{
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'Test Message',
      is_read: false
    }])
    .select();

  if (insertError) {
    console.log('Insert failed:', insertError.message);
  } else {
    console.log('Insert success:', insertData);
  }
}

testSupabase();
