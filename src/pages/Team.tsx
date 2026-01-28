import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Linkedin, Twitter } from 'lucide-react';
import SEOHead from '../components/SEOHead';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  photo_url: string;
  linkedin_url?: string;
  twitter_url?: string;
}

const Team = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        // MODIFICATION: Changed 'created_at' to 'display_order'
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead pageIdentifier="team" />
      <Header />
      
      <div className="pt-24">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center mb-4">Meet Our Team</h1>
            <p className="text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
              We are a group of passionate professionals dedicated to making your travel dreams a reality.
            </p>

            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map(member => (
                  <Card key={member.id} className="text-center hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
                    <div className="aspect-square w-full overflow-hidden">
                      <img 
                        src={`${member.photo_url}?t=${new Date().getTime()}`} 
                        alt={member.name} 
                        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105" 
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow text-left">
                      <CardTitle className="text-lg mb-1">{member.name}</CardTitle>
                      <p className="text-primary text-sm font-semibold mb-2">{member.position}</p>
                      <p className="text-muted-foreground text-sm mb-3 flex-grow whitespace-pre-wrap">{member.bio}</p>
                      <div className="flex justify-start space-x-3 mt-auto">
                        {member.linkedin_url && (
                          <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                            <Linkedin className="h-5 w-5" />
                          </a>
                        )}
                        {member.twitter_url && (
                          <a href={member.twitter_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                            <Twitter className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Team;