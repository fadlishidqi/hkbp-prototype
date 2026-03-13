import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import ConcertSchedule from '@/components/ConcertSchedule';
import Berita from '@/components/Berita';
import Tiket from '@/components/Tiket';
import Footer from '@/components/Footer';
import { error } from 'console';

export const revalidate = 0;

export default async function Home() {
  const { data: berita } = await supabase
    .from('berita')
    .select('*')
    .order('created_at', { ascending: false });
    console.log('error:', error);

  const { data: tiket } = await supabase
    .from('tiket')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <ConcertSchedule />
      <Berita berita={berita} />
      <Tiket tiket={tiket} />
      <Footer />
    </div>
  );
}