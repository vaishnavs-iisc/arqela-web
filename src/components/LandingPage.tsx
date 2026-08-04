'use client';

import Image from 'next/image';
import { 
  ArrowRight, 
  Sparkles, 
  Compass, 
  BookOpen, 
  Cpu, 
  GraduationCap, 
  FlaskConical, 
  ShieldCheck,
  Search,
  Activity
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { Footer } from '@/components/Footer';

export function LandingPage() {
  const { signInWithGoogle } = useAuth();
  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch {
      alert('Google sign in could not be started. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,var(--color-primary-hover)/5,transparent_50%),radial-gradient(ellipse_at_bottom_left,var(--color-secondary)/3,transparent_40%),var(--color-background)] text-foreground flex flex-col justify-between font-sans selection:bg-primary/25">
      <main className="flex-1">
        {/* Navigation Header */}
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <Image
              src="/arqela-logo.png"
              alt="Arqela Logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain drop-shadow-[0_2px_8px_rgba(15,118,110,0.15)]"
            />
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              Arqela
            </span>
          </div>
          <button
            onClick={handleSignIn}
            className="rounded-xl border border-border bg-card/65 backdrop-blur-md px-5 py-2.5 text-sm font-semibold shadow-xs transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-sm cursor-pointer"
          >
            Sign in with Google
          </button>
        </header>

        {/* Hero Section */}
        <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-12 md:grid-cols-[1.1fr_0.9fr] md:items-center md:pt-20">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary shadow-xs animate-fade-in">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              A Warm, Thoughtful Research Partner
            </div>
            <h1 className="max-w-3xl text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.12] text-foreground">
              Let's explore your <span className="bg-gradient-to-r from-primary via-primary-hover to-secondary bg-clip-text text-transparent">biggest ideas</span>, together.
            </h1>
            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-foreground/80 font-medium">
              Rigorous science starts with a warm conversation. Arqela is an AI-powered co-pilot that helps you unpack hypotheses, surface unaddressed biases, discover literature precedents, and design experimental protocols to test your ideas.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              <button
                onClick={handleSignIn}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Begin Your Journey <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Core Capabilities Cards */}
          <div className="rounded-2xl border border-border/70 bg-card/50 backdrop-blur-lg p-7 shadow-lg space-y-3 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl transition-all duration-500 group-hover:bg-primary/10" />
            <Feature
              icon={<Compass className="h-5 w-5" />}
              title="Conceptual Clarity"
              text="Unpack your intuition. We help translate raw hypotheses into explicit, testable scientific claims, assumptions, and causal links."
            />
            <Feature
              icon={<Search className="h-5 w-5" />}
              title="Uncover Blind Spots"
              text="Explore alternate explanations. We query scientific databases to highlight counter-evidence and potential confounders you might have missed."
            />
            <Feature
              icon={<Activity className="h-5 w-5" />}
              title="Validation Playbooks"
              text="Map out real-world testing. Receive concrete experimental steps, cohort size recommendations, and expected statistical power parameters."
            />
          </div>
        </section>

        {/* Recent Advancements Section */}
        <section className="border-t border-border bg-border-muted/30 py-20 px-6">
          <div className="mx-auto max-w-6xl space-y-12">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                The Frontier of Agentic Science
              </h2>
              <p className="text-base text-foreground/75 leading-relaxed">
                Arqela is built on a rapidly accelerating global framework of AI-driven research. Leading laboratories and technology companies are redefining scientific discovery through autonomous agents.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Sakana AI Card */}
              <AdvancementCard
                institution="Sakana AI"
                tagline="The AI Scientist"
                icon={<Cpu className="h-6 w-6 text-primary" />}
                description="Developing the first fully autonomous system for scientific discovery, capable of generating ideas, writing code, running experiments, and writing academic papers."
                link="https://sakana.ai"
              />

              {/* Google DeepMind Card */}
              <AdvancementCard
                institution="Google DeepMind"
                tagline="AlphaFold & GNoME"
                icon={<FlaskConical className="h-6 w-6 text-primary" />}
                description="Unlocking protein structure predictions for all known biology and discovering millions of stable inorganic crystals, accelerating materials science by decades."
                link="https://deepmind.google"
              />

              {/* Stanford & MIT Card */}
              <AdvancementCard
                institution="Stanford & MIT"
                tagline="Agentic Biotech Labs"
                icon={<GraduationCap className="h-6 w-6 text-primary" />}
                description="Pioneering automated closed-loop systems that design physical assays, direct liquid-handling lab robots, and synthesize compound libraries autonomously."
                link="https://stanford.edu"
              />

              {/* OpenAI & Anthropic Card */}
              <AdvancementCard
                institution="OpenAI & Anthropic"
                tagline="Scientific Reasoning"
                icon={<BookOpen className="h-6 w-6 text-primary" />}
                description="Training large models with advanced multi-step logical chains to read entire research corpora, verify claims, and advise human researchers on complex studies."
                link="https://openai.com"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-4 border-b border-border/40 py-4 last:border-0 last:pb-0 first:pt-0">
      <div className="text-primary mt-1 shrink-0 p-2 rounded-lg bg-primary/5 transition-colors hover:bg-primary/10">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-bold text-foreground tracking-tight">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-foreground/75 font-medium">{text}</p>
      </div>
    </div>
  );
}

interface AdvancementCardProps {
  institution: string;
  tagline: string;
  icon: React.ReactNode;
  description: string;
  link: string;
}

function AdvancementCard({ institution, tagline, icon, description, link }: AdvancementCardProps) {
  return (
    <div className="group rounded-2xl border border-border/80 bg-card/65 backdrop-blur-md p-6 shadow-xs hover:shadow-md hover:border-primary/30 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-xl bg-primary/5 transition-colors group-hover:bg-primary/10">
            {icon}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 px-2.5 py-1 rounded-full">
            Research Node
          </span>
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-extrabold text-foreground group-hover:text-primary transition-colors">
            {institution}
          </h3>
          <p className="text-xs font-bold text-secondary">{tagline}</p>
        </div>
        <p className="text-xs leading-relaxed text-foreground/75 font-medium">
          {description}
        </p>
      </div>
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="mt-6 inline-flex items-center gap-1 text-[11px] font-bold text-primary group-hover:text-primary-hover group-hover:gap-1.5 transition-all"
      >
        Explore Work <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}
