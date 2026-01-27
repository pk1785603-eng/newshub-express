import { Users, Target, Award, Clock } from "lucide-react";
import logo from "@/assets/logo.png";

const team = [
  {
    name: "Rajesh Kumar",
    role: "Editor-in-Chief",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    bio: "15+ years of experience in journalism covering national and international news.",
  },
  {
    name: "Priya Sharma",
    role: "Senior Political Correspondent",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
    bio: "Award-winning journalist specializing in political coverage and analysis.",
  },
  {
    name: "Amit Verma",
    role: "Sports Editor",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
    bio: "Former sports commentator with deep expertise in cricket and football.",
  },
  {
    name: "Neha Singh",
    role: "Technology Reporter",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
    bio: "Tech enthusiast covering startups, AI, and digital transformation.",
  },
];

const milestones = [
  { year: "2020", title: "Founded", description: "24x7 News Time was established in Ghaziabad" },
  { year: "2021", title: "Digital Launch", description: "Launched our digital news platform" },
  { year: "2022", title: "1M Readers", description: "Reached 1 million monthly readers" },
  { year: "2023", title: "YouTube Channel", description: "Started live streaming and video content" },
  { year: "2024", title: "Award", description: "Received Best Regional News Portal Award" },
  { year: "2025", title: "Expansion", description: "Expanded coverage to all of North India" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary py-20 text-white">
        <div className="container text-center">
          <img src={logo} alt="24x7 News Time" className="h-24 mx-auto mb-6 brightness-0 invert" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About 24x7 News Time</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Your trusted source for breaking news from Ghaziabad, Uttar Pradesh, and around the world.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-card rounded-2xl p-8 shadow-lg">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground">
                To deliver accurate, unbiased, and timely news to our readers. We believe in journalism that empowers people with knowledge and keeps democracy alive through transparent reporting.
              </p>
            </div>
            <div className="bg-card rounded-2xl p-8 shadow-lg">
              <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
                <Award className="h-7 w-7 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-muted-foreground">
                To become India's most trusted digital news platform, bridging the gap between local and global news coverage while maintaining the highest standards of journalistic integrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">5M+</p>
              <p className="text-muted-foreground">Monthly Readers</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-secondary mb-2">500+</p>
              <p className="text-muted-foreground">Articles Daily</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-accent mb-2">50+</p>
              <p className="text-muted-foreground">Journalists</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">24/7</p>
              <p className="text-muted-foreground">News Coverage</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              Our Team
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the dedicated journalists and editors who bring you the news every day.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="bg-card rounded-2xl p-6 text-center shadow-lg">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-primary text-sm mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              <Clock className="h-8 w-8 text-primary" />
              Our Journey
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    {milestone.year.slice(-2)}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-full bg-border mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="font-bold text-lg">{milestone.title}</h3>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
