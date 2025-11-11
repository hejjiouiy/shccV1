'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Award, Users, Building, Microscope, Heart, Globe2, ChevronDown, Play, X, Sparkles, Info, ArrowUpRight } from 'lucide-react';
// import FuturisticAvatar from '../comps/FuturisticAvatar';
// import SectionAvatar from './SectionAvatar';

interface MousePosition {
  x: number;
  y: number;
}

interface GuideState {
  visible: boolean;
  section: string;
  position: 'left' | 'right';
  message: string;
  title: string;
  tips: string[];
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function SHCCInteractiveGuide() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState<number>(0);
  const [language, setLanguage] = useState<'EN' | 'FR' | 'AR'>('EN');
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [videoPlaying, setVideoPlaying] = useState<boolean>(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<number>(0);
  
  // Guide state
  const [guide, setGuide] = useState<GuideState>({
    visible: true,
    section: 'welcome',
    position: 'right',
    message: '',
    title: '',
    tips: [],
  });
  const [guideAnimation, setGuideAnimation] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded(true);
    const handleScroll = (): void => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent): void => {
      setMousePos({ 
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Guide appears based on scroll position
  useEffect(() => {
    if (dismissed) return;

    const sections = [
      {
        start: 0,
        end: 600,
        section: 'hero',
        position: 'right' as const,
        title: 'Welcome to SHCC! 👋',
        message: 'I\'m Dr. Sarah, your virtual guide. Let me show you how we\'re revolutionizing healthcare in Africa.',
        tips: [
          'Explore our two world-class institutions',
          'Scroll down to see our impressive stats',
          'Click on any institution to learn more'
        ]
      },
      {
        start: 600,
        end: 1200,
        section: 'stats',
        position: 'left' as const,
        title: 'Our Impact by Numbers 📊',
        message: 'These statistics represent years of dedication to medical excellence and patient care.',
        tips: [
          '40+ academic programs across specialties',
          '15K+ students and patients served annually',
          '100+ active research projects',
          '50+ international partnerships'
        ]
      },
      {
        start: 1200,
        end: 2400,
        section: 'institutions',
        position: 'right' as const,
        title: 'Two Pillars of Excellence 🏥',
        message: 'Our Faculty of Medicine and Hospital work in perfect harmony to advance healthcare.',
        tips: [
          'Faculty: 15+ programs, 120+ expert faculty',
          'Hospital: 25+ specialties, 350 beds',
          'Combined: 50K+ patients treated yearly',
          'Click any card to explore in detail'
        ],
        action: {
          label: 'Explore Institutions',
          onClick: () => {
            document.getElementById('institutions')?.scrollIntoView({ behavior: 'smooth' });
          }
        }
      },
      {
        start: 2400,
        end: 3200,
        section: 'testimonials',
        position: 'left' as const,
        title: 'Hear from Our Community 💬',
        message: 'Real stories from doctors, faculty, and students who are part of the SHCC family.',
        tips: [
          'World-class research opportunities',
          'State-of-the-art medical facilities',
          'Supportive learning environment',
          'International recognition'
        ]
      },
      {
        start: 3200,
        end: 4000,
        section: 'mission',
        position: 'right' as const,
        title: 'Our Vision for the Future 🌟',
        message: 'We\'re committed to transforming healthcare across Africa and setting global standards.',
        tips: [
          'Excellence: World-class standards',
          'Innovation: Cutting-edge research',
          'Compassion: Patient-centered care',
          'Collaboration: Global partnerships'
        ]
      },
      {
        start: 4000,
        end: 10000,
        section: 'cta',
        position: 'left' as const,
        title: 'Ready to Join Us? 🚀',
        message: 'Your journey in healthcare innovation starts here. Let\'s shape the future together!',
        tips: [
          'Apply for our medical programs',
          'Schedule a hospital tour',
          'Join our research initiatives',
          'Connect with our admissions team'
        ],
        action: {
          label: 'Get Started',
          onClick: () => {
            window.location.href = '#contact';
          }
        }
      }
    ];

    const currentSection = sections.find(s => scrollY >= s.start && scrollY < s.end);
    
    if (currentSection && currentSection.section !== guide.section) {
      setGuideAnimation(true);
      setTimeout(() => {
        setGuide({
          visible: true,
          section: currentSection.section,
          position: currentSection.position,
          title: currentSection.title,
          message: currentSection.message,
          tips: currentSection.tips,
          action: currentSection.action
        });
        setGuideAnimation(false);
      }, 300);
    }
  }, [scrollY, guide.section, dismissed]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  class Node {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    pulsePhase: number;
    color: number[];
    
    constructor() {
      this.x = Math.random() * canvas!.width;
      this.y = Math.random() * canvas!.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2.5 + 0.5;
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.color = Math.random() > 0.5 ? [0, 84, 64] : [0, 150, 120];
    }
    
    update(): void {
      this.x += this.vx;
      this.y += this.vy;
      this.pulsePhase += 0.03;
      if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
    }
    
    draw(): void {
      if (!ctx) return; // Type guard
      const pulse = Math.sin(this.pulsePhase) * 0.4 + 0.6;
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * pulse * 3);
      gradient.addColorStop(0, `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${0.6 * pulse})`);
      gradient.addColorStop(1, 'rgba(0, 84, 64, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * pulse * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  const nodes: Node[] = Array.from({ length: 120 }, () => new Node());
  
  function drawConnections(): void {
    if (!ctx) return; // Type guard
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 180) {
          const opacity = (1 - distance / 180) * 0.2;
          const gradient = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
          gradient.addColorStop(0, `rgba(0, 84, 64, ${opacity})`);
          gradient.addColorStop(0.5, `rgba(0, 150, 120, ${opacity * 1.2})`);
          gradient.addColorStop(1, `rgba(0, 84, 64, ${opacity})`);
          
          ctx.beginPath();
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
  }
  
  let animationId: number;
  
  function animate(): void {
    if (!ctx) return; // Type guard
    ctx.fillStyle = 'rgba(250, 251, 252, 0.1)';
    ctx.fillRect(0, 0, canvas!.width, canvas!.height);
    nodes.forEach(node => {
      node.update();
      node.draw();
    });
    drawConnections();
    animationId = requestAnimationFrame(animate);
  }
  
  animate();
  
  const handleResize = (): void => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  
  window.addEventListener('resize', handleResize);
  
  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', handleResize);
  };
}, []);

  const institutions = [
    {
      id: 'fms',
      title: 'Faculty of Medicine',
      description: 'Cultivating the next generation of healthcare leaders through world-class medical education, cutting-edge research, and clinical excellence',
      url: 'https://fms.shcc-um6p.ma',
      number: '01',
      icon: Microscope,
      highlights: ['15+', '120+', '8'],
      highlightLabels: ['Programs', 'Faculty', 'Labs']
    },
    {
      id: 'hospital',
      title: 'UM6P Hospital',
      description: 'Delivering compassionate, technology-driven healthcare with specialized expertise across 25+ medical disciplines',
      url: 'https://hospital.shcc-um6p.ma',
      number: '02',
      icon: Heart,
      highlights: ['25+', '350', '50K+'],
      highlightLabels: ['Specialties', 'Beds', 'Patients']
    }
  ];

  const stats = [
    { value: '40+', label: 'Programs', icon: Award },
    { value: '15K+', label: 'Community', icon: Users },
    { value: '100+', label: 'Research', icon: Microscope },
    { value: '50+', label: 'Partners', icon: Globe2 }
  ];

  const testimonials = [
    {
      quote: "SHCC represents the future of integrated healthcare education. The facilities and research opportunities are world-class.",
      author: "Dr. Sarah Ahmed",
      role: "Dean of Medical Research"
    },
    {
      quote: "The patient care experience at UM6P Hospital sets a new standard. Technology meets compassion at every touchpoint.",
      author: "Prof. Jean Martin",
      role: "Chief Medical Officer"
    },
    {
      quote: "As a medical student, I've found an environment that challenges and supports in equal measure. This is where innovation happens.",
      author: "Amira Benali",
      role: "4th Year Medical Student"
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none opacity-60"
      />

      {/* Dynamic gradient overlay */}
      <div 
        className="fixed inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at ${50 + mousePos.x * 12}% ${50 + mousePos.y * 12}%, rgba(0, 84, 64, 0.08) 0%, transparent 65%)`,
        }}
      />

      {/* Interactive 3D Guide - NOUVELLE Version "Hologramme" */}
      {guide.visible && !dismissed && (
        <div 
          className={`fixed ${guide.position === 'right' ? 'right-8' : 'left-8'} top-1/2 -translate-y-1/2 z-50 transition-all duration-500 ${
            guideAnimation ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          } ${
            guide.position === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'
          }`}
        >
          {/* Conteneur flexible principal. 
            'flex-row-reverse' place l'avatar à droite si position='right'
            'flex-row' place l'avatar à gauche si position='left'
          */}
          <div className={`relative flex items-center gap-4 ${guide.position === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
            
            {/* PARTIE 1: Avatar 3D interactif */}
            {/* <SectionAvatar /> */}

            {/* PARTIE 2: Panneau de texte "nuageux" / Holographique */}
            <div className="relative w-96 p-8 rounded-3xl shadow-2xl border border-white/20 bg-gradient-to-br from-[#005440]/30 via-[#006d52]/20 to-[#005440]/30 backdrop-blur-xl overflow-hidden">
              
              {/* Motif de fond animé (repris de votre en-tête) */}
              <div className="absolute inset-0 opacity-10 z-0">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 20px 20px, white 2px, transparent 0)`,
                  backgroundSize: '40px 40px'
                }} />
              </div>

              {/* Ligne lumineuse en haut */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-300 via-white to-emerald-300 animate-pulse" />

              {/* Bouton Fermer */}
              <button
                onClick={() => setDismissed(true)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors flex-shrink-0 z-20"
              >
                <X className="text-white" size={16} />
              </button>
              
              {/* Contenu (Styles modifiés pour le texte clair) */}
              <div className="relative z-10 space-y-4">
                {/* Titre */}
                <h3 className="text-white font-bold text-xl mb-1">{guide.title}</h3>
                <p className="text-white/90 text-sm leading-relaxed mb-4">
                  {guide.message}
                </p>

                {/* Section des points clés */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Info className="text-emerald-300" size={16} />
                    <span className="text-sm font-bold text-white uppercase tracking-wider">Key Points</span>
                  </div>
                  <ul className="space-y-2">
                    {guide.tips.map((tip, i) => (
                      <li 
                        key={i}
                        className="flex items-start space-x-3 text-white/90 text-sm animate-fade-in"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-300 to-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[#005440] text-xs font-bold">{i + 1}</span>
                        </div>
                        <span className="leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bouton d'action */}
                {guide.action && (
                  <button
                    onClick={guide.action.onClick}
                    className="w-full mt-4 px-6 py-3 bg-white/90 text-[#005440] rounded-lg hover:bg-white hover:shadow-xl transition-all font-semibold flex items-center justify-center space-x-2 group"
                  >
                    <span>{guide.action.label}</span>
                    <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                )}

                {/* Indicateur de progression (Styles modifiés) */}
                <div className="flex items-center justify-center space-x-2 pt-4">
                  {['welcome', 'hero', 'stats', 'institutions', 'testimonials', 'mission', 'cta'].map((section, i) => (
                    <div
                      key={section}
                      className={`h-1 rounded-full transition-all ${
                        guide.section === section ? 'w-8 bg-white' : 'w-1 bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Coin décoratif */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-white/10 to-transparent rounded-tl-full opacity-50" />
            </div>
          </div>
        </div>
      )}

      {/* Le bouton de réouverture reste le même */}
      {dismissed && (
        <button
          onClick={() => setDismissed(false)}
          className="fixed bottom-8 right-8 z-50 group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-[#005440] rounded-full blur-xl opacity-40 group-hover:opacity-60 animate-pulse transition-opacity" />
            <div className="relative w-16 h-16 bg-gradient-to-br from-[#005440] to-[#007a5e] rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform border-4 border-white">
              <Sparkles className="text-white" size={28} />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">
              ?
            </div>
          </div>
        </button>
      )}
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-8 lg:px-16 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-[#005440] blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="relative w-14 h-14 bg-gradient-to-br from-[#005440] via-[#006d52] to-[#007a5e] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <Building className="text-white" size={26} strokeWidth={1.5} />
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-[#005440] tracking-tight">SHCC</div>
                <div className="text-xs text-gray-500 tracking-widest">UM6P</div>
              </div>
            </div>

            <div className="flex items-center space-x-8">
              <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium">
                <a href="#about" className="text-gray-700 hover:text-[#005440] transition-colors">About</a>
                <a href="#institutions" className="text-gray-700 hover:text-[#005440] transition-colors">Institutions</a>
                <a href="#research" className="text-gray-700 hover:text-[#005440] transition-colors">Research</a>
                <a href="#contact" className="text-gray-700 hover:text-[#005440] transition-colors">Contact</a>
              </nav>

              <div className="flex items-center space-x-1 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                {(['EN', 'FR', 'AR'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-4 py-2 text-xs font-bold tracking-wider transition-all ${
                      language === lang
                        ? 'bg-[#005440] text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-40 px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div 
            className={`text-center transition-all duration-1200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{
              transform: `translateY(${scrollY * 0.15}px)`,
              opacity: Math.max(0, 1 - scrollY * 0.0015)
            }}
          >
            <div className="mb-8">
              <span className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#005440]/10 to-emerald-100/50 text-[#005440] rounded-full text-xs font-bold tracking-[0.25em] uppercase border border-[#005440]/20 shadow-sm">
                <span className="w-2 h-2 bg-[#005440] rounded-full animate-pulse" />
                <span>Smart Health Care City</span>
              </span>
            </div>

            <h1 
              className="text-7xl md:text-9xl lg:text-[11rem] font-bold text-gray-900 mb-4 leading-[0.9] tracking-tighter"
              style={{
                transform: `perspective(1200px) rotateX(${mousePos.y * 1}deg) rotateY(${mousePos.x * 1}deg)`,
                transition: 'transform 0.2s ease-out'
              }}
            >
              <span className="block font-light">Redefining Healthcare</span>
              <span className="block bg-gradient-to-r from-[#005440] via-[#007a5e] to-[#005440] bg-clip-text text-transparent">
                Innovation
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 font-light leading-relaxed">
              A premier integrated ecosystem advancing medical education, research excellence, and transformative patient care
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-20">
              <a 
                href="#institutions"
                className="group px-10 py-5 bg-[#005440] text-white rounded-lg hover:bg-[#007a5e] transition-all shadow-xl hover:shadow-2xl font-semibold text-lg flex items-center space-x-3"
              >
                <span>Discover More</span>
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" strokeWidth={2} />
              </a>
              
              <button 
                onClick={() => setVideoPlaying(true)}
                className="group px-10 py-5 bg-white text-[#005440] rounded-lg border-2 border-[#005440] hover:bg-[#005440] hover:text-white transition-all shadow-lg font-semibold text-lg flex items-center space-x-3"
              >
                <Play size={22} strokeWidth={2} />
                <span>Watch Video</span>
              </button>
            </div>

            <div className="flex flex-col items-center animate-bounce">
              <span className="text-xs text-gray-500 mb-2 tracking-wider uppercase">Scroll to explore</span>
              <ChevronDown className="text-[#005440]" size={24} />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div 
                key={i}
                className={`group text-center p-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl hover:shadow-2xl hover:border-[#005440]/30 hover:-translate-y-2 transition-all duration-500 cursor-pointer ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-16 h-16 mx-auto mb-5 bg-[#005440]/5 rounded-full flex items-center justify-center group-hover:bg-[#005440]/10 group-hover:scale-110 transition-all">
                  <stat.icon className="text-[#005440]" size={32} strokeWidth={1.5} />
                </div>
                <div className="text-5xl font-bold bg-gradient-to-r from-[#005440] to-[#007a5e] bg-clip-text text-transparent mb-3">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-semibold tracking-wide uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Institutions Section */}
      <section id="institutions" className="relative py-32 px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              Our <span className="text-[#005440]">Institutions</span>
            </h2>
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#005440] to-transparent" />
              <div className="w-3 h-3 rounded-full bg-[#005440]" />
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#005440] to-transparent" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Two pillars of excellence united in advancing human health and medical innovation
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {institutions.map((inst, index) => (
              <a
                key={inst.id}
                href={inst.url}
                onMouseEnter={() => setActiveCard(inst.id)}
                onMouseLeave={() => setActiveCard(null)}
                className={`group relative block transition-all duration-700 ${
                  isLoaded ? 'opacity-100 translate-x-0' : index === 0 ? 'opacity-0 -translate-x-10' : 'opacity-0 translate-x-10'
                }`}
                style={{ transitionDelay: `${600 + index * 200}ms` }}
              >
                <div 
                  className="relative h-[650px] bg-white border-2 border-gray-200 rounded-3xl transition-all duration-700 overflow-hidden group-hover:border-[#005440]/40"
                  style={{
                    transform: activeCard === inst.id ? 'translateY(-16px) scale(1.02)' : 'translateY(0) scale(1)',
                    boxShadow: activeCard === inst.id 
                      ? '0 40px 80px -20px rgba(0, 84, 64, 0.25)' 
                      : '0 4px 12px 0 rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#005440]/0 via-[#005440]/0 to-[#005440]/0 group-hover:from-[#005440]/[0.07] group-hover:via-[#005440]/[0.04] group-hover:to-[#005440]/[0.12] transition-all duration-700" />

                  <div 
                    className="absolute inset-0 opacity-[0.015] group-hover:opacity-[0.03] transition-opacity duration-700"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0, 84, 64, .8) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(0, 84, 64, .8) 1.5px, transparent 1.5px)`,
                      backgroundSize: '50px 50px',
                      transform: activeCard === inst.id ? 'scale(1.1)' : 'scale(1)',
                      transition: 'transform 0.7s ease-out'
                    }}
                  />

                  <div className="relative h-full flex flex-col p-14">
                    <div className="flex items-start justify-between mb-auto">
                      <div className="flex-1">
                        <div className="text-sm font-bold text-[#005440] tracking-[0.3em] uppercase mb-6">
                          {inst.number}
                        </div>
                        <div className="w-20 h-20 bg-gradient-to-br from-[#005440]/10 to-emerald-100/50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:shadow-lg transition-all">
                          <inst.icon className="text-[#005440]" size={36} strokeWidth={1.5} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
                        {inst.title}
                      </h3>
                      
                      <p className="text-gray-600 text-lg font-light leading-relaxed">
                        {inst.description}
                      </p>

                      <div className="grid grid-cols-3 gap-6 py-8 border-y border-gray-200">
                        {inst.highlights.map((highlight, i) => (
                          <div key={i} className="text-center">
                            <div className="text-3xl font-bold text-[#005440] mb-2">{highlight}</div>
                            <div className="text-xs text-gray-600 font-medium uppercase tracking-wider">{inst.highlightLabels[i]}</div>
                          </div>
                        ))}
                      </div>

                      <div className="inline-flex items-center space-x-4 text-[#005440] font-bold group-hover:space-x-6 transition-all pt-4">
                        <span className="text-base tracking-wide">Explore Institution</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-0.5 bg-[#005440] group-hover:w-24 transition-all" />
                          <ArrowRight size={24} strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-[#005440]/10 group-hover:border-[#005440]/40 rounded-tr-3xl transition-colors" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-[#005440]/10 group-hover:border-[#005440]/40 rounded-bl-3xl transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-32 px-8 lg:px-16 bg-gradient-to-br from-[#005440]/5 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">What They Say</h2>
            <div className="w-20 h-1 bg-[#005440] mx-auto rounded-full" />
          </div>

          <div className="relative h-80 flex items-center justify-center">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-all duration-700 ${
                  i === currentTestimonial ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 h-full flex flex-col justify-center">
                  <p className="text-2xl text-gray-700 font-light italic leading-relaxed mb-8">
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <div className="font-bold text-[#005440] text-lg">{testimonial.author}</div>
                    <div className="text-gray-500 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-3 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentTestimonial(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === currentTestimonial ? 'bg-[#005440] w-8' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative py-32 px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="relative p-16 md:p-20 bg-gradient-to-br from-white via-emerald-50/30 to-white rounded-3xl border-2 border-[#005440]/10 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#005440]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl" />
            
            <div className="relative text-center">
              <div className="inline-block mb-8">
                <div className="w-16 h-16 bg-[#005440] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Globe2 className="text-white" size={32} strokeWidth={1.5} />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Vision</h2>
              </div>
              
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-12 font-light max-w-4xl mx-auto">
                To become a globally recognized healthcare ecosystem that transforms lives through integrated medical education, pioneering research, and exceptional clinical care—setting new standards for health innovation in Africa and beyond
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                {['Excellence', 'Innovation', 'Compassion', 'Integrity', 'Collaboration'].map((value, i) => (
                  <span 
                    key={i}
                    className="px-8 py-4 bg-white border-2 border-[#005440]/20 rounded-full text-base font-semibold text-[#005440] hover:bg-[#005440] hover:text-white hover:border-[#005440] hover:shadow-lg hover:scale-105 transition-all cursor-default"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-8 lg:px-16 bg-gradient-to-br from-[#005440] via-[#006d52] to-[#007a5e] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, white 2px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Join Us in Shaping<br />the Future of Healthcare
          </h2>
          <p className="text-xl md:text-2xl mb-12 opacity-90 font-light max-w-3xl mx-auto">
            Whether you're seeking world-class medical education or exceptional healthcare services, SHCC is where your journey begins
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a href="#contact" className="px-12 py-5 bg-white text-[#005440] rounded-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl font-bold text-lg">
              Get In Touch
            </a>
            <a href="#" className="px-12 py-5 border-2 border-white text-white rounded-lg hover:bg-white hover:text-[#005440] transition-all font-bold text-lg">
              Download Brochure
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-900 text-white py-16">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-[#005440] flex items-center justify-center shadow-lg">
                  <Building className="text-white" size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-2xl font-bold">SHCC</div>
                  <div className="text-sm text-gray-400">Smart Health Care City</div>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-4 max-w-md">
                Leading the way in integrated medical education, groundbreaking research, and exceptional patient care in Africa and beyond.
              </p>
              <div className="text-sm text-gray-500">
                <p className="mb-1">Université Mohammed VI Polytechnique</p>
                <p>Ben Guerir, Morocco</p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4 text-[#005440]">Quick Links</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About SHCC</a></li>
                <li><a href="#institutions" className="hover:text-white transition-colors">Our Institutions</a></li>
                <li><a href="#research" className="hover:text-white transition-colors">Research</a></li>
                <li><a href="#admissions" className="hover:text-white transition-colors">Admissions</a></li>
                <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4 text-[#005440]">Contact</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="mailto:contact@shcc-um6p.ma" className="hover:text-white transition-colors">
                    contact@shcc-um6p.ma
                  </a>
                </li>
                <li>
                  <a href="tel:+212XXXXXXXXX" className="hover:text-white transition-colors">
                    +212 XXX XXX XXX
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-gray-500">
              <div>© 2025 Smart Health Care City - UM6P. All rights reserved.</div>
              <div className="flex items-center space-x-6">
                <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                <span>|</span>
                <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
                <span>|</span>
                <a href="#accessibility" className="hover:text-white transition-colors">Accessibility</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {videoPlaying && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-8" onClick={() => setVideoPlaying(false)}>
          <div className="relative max-w-6xl w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden">
            <button 
              onClick={() => setVideoPlaying(false)}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X size={24} />
            </button>
            <div className="w-full h-full flex items-center justify-center text-white">
              {/* <iframe className='w-full h-full' src="https://www.youtube.com/embed/FbBuLI_5CBE?si=IOXocWDY0kXboR7T" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> */}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slide-in-left {
          from {
            transform: translateX(-100px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes blink {
          0%, 90%, 100% {
            transform: scaleY(1);
          }
          95% {
            transform: scaleY(0.1);
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.5s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-blink {
          animation: blink 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}