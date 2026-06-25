import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Clock, Award, HeadphonesIcon, MapPin, Phone, MessageCircle, Menu, X } from 'lucide-react';
import { services } from './types';
import { BookingForm } from './components/BookingForm';
import { VoiceAssistant } from './components/VoiceAssistant';
import { TTSPlayer } from './components/TTSPlayer';
import { Toaster } from './components/ui/sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/ui/card';

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/30 relative">
      <Toaster position="top-center" />
      
      {/* Background Accents */}
      <div className="fixed top-0 right-0 w-1/2 h-1/2 bg-primary/10 blur-[120px] -z-10 rounded-full pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-1/3 h-1/3 bg-muted/30 blur-[100px] -z-10 rounded-full pointer-events-none"></div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 w-full backdrop-blur-lg border-b border-border/40 bg-background/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-primary-foreground rounded-sm rotate-45"></div>
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground uppercase hidden sm:block">
                SB Elite Consultancy
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
              <a href="#services" className="hover:text-foreground transition-colors">Services</a>
              <a href="#why-us" className="hover:text-foreground transition-colors">Why Us</a>
              <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            <div className="flex items-center gap-4">
              <a href="#book" className="hidden sm:inline-flex px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full text-sm font-semibold shadow-lg shadow-primary/20 transition-all">
                Book Appointment
              </a>
              <button 
                className="md:hidden p-2 text-foreground"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-3/4 max-w-sm bg-background border-l border-border/40 shadow-2xl z-50 md:hidden flex flex-col"
            >
              <div className="flex justify-end p-6">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex flex-col gap-6 px-8 py-4">
                <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-foreground hover:text-primary transition-colors">Services</a>
                <a href="#why-us" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-foreground hover:text-primary transition-colors">Why Us</a>
                <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-foreground hover:text-primary transition-colors">Contact</a>
                <a href="#book" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-3 mt-4 bg-primary text-center hover:bg-primary/90 text-primary-foreground rounded-full text-sm font-semibold shadow-lg shadow-primary/20 transition-all">
                  Book Appointment
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold uppercase tracking-widest mb-8 w-fit">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              Fast Processing Guaranteed
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tighter text-foreground mb-6">
              Start Your Business <br className="hidden sm:block" />
              <span className="text-muted-foreground">The Elite Way.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10 leading-relaxed">
              Professional business registration and compliance services tailored to make your corporate journey seamless and efficient.
            </p>
            <div className="flex justify-center gap-4">
              <a href="#services" className="px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                View Services
              </a>
              <a href="#book" className="px-8 py-3.5 bg-card border border-border text-foreground rounded-xl font-bold hover:bg-muted transition-colors">
                Book Consultation
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tighter mb-4 text-foreground">Services & Prices</h2>
            <p className="text-muted-foreground text-lg">Comprehensive business registration and compliance solutions.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="h-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors border-border/50 hover:border-primary/50 group shadow-lg rounded-3xl overflow-hidden">
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <CardTitle className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                      {service.title}
                    </CardTitle>
                    <TTSPlayer text={`${service.title}. Price: ${service.price}. ${service.description}`} />
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-foreground mb-3">{service.price}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="py-24 bg-card/30 border-y border-border/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold tracking-tighter mb-10 text-foreground">Why Choose <span className="text-primary">SB Elite?</span></h2>
              <div className="space-y-8">
                {[
                  { icon: Clock, title: "Fast Processing", desc: "We ensure rapid turnaround times for all registrations." },
                  { icon: Award, title: "Professional Service", desc: "Expert handling of all your compliance requirements." },
                  { icon: ShieldCheck, title: "Reliable Support", desc: "Assistance from start to finish, guaranteed." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <item.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card/90 backdrop-blur-md p-10 rounded-[2rem] border border-border shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
              <h3 className="text-3xl font-bold mb-6 text-foreground tracking-tight">Affordable Pricing</h3>
              <p className="text-muted-foreground text-lg leading-relaxed mb-10">
                We believe in transparent, competitive pricing that gives you the best value for your investment in your business's future.
              </p>
              <div className="bg-background/80 p-5 rounded-2xl border border-border flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <span className="font-bold text-lg text-foreground">100% Compliance Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking & Contact Section */}
      <section id="book" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3">
              <div className="bg-card/80 backdrop-blur-sm rounded-[2rem] p-10 border border-border shadow-2xl">
                <div className="text-primary text-xs uppercase font-bold tracking-widest mb-4">Ready to start?</div>
                <h2 className="text-3xl font-bold mb-8 tracking-tight">Book a Consultation</h2>
                <BookingForm />
              </div>
            </div>
            
            <div id="contact" className="lg:col-span-2 flex flex-col justify-center space-y-10 pl-0 lg:pl-8">
              <div>
                <h3 className="text-3xl font-bold mb-6 tracking-tight">Contact Us</h3>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">Reach out to us for any inquiries or visit our office for a direct consultation.</p>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Office Location</h4>
                      <p className="text-muted-foreground leading-relaxed">Cnr Robert Mugabe & Leopold Takawira<br />Karimapondo Building, 1st Floor, Office G53<br />Harare, Zimbabwe</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Phone Number</h4>
                      <p className="text-muted-foreground">0715 772 159</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-10 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-6 bg-background/50 backdrop-blur-sm">
        <div className="flex gap-12 items-center">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Trusted By</span>
          <div className="flex gap-8 opacity-40 grayscale">
             <span className="text-sm font-bold text-foreground">SB PARTNERS</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground">SB Elite Portal</span>
            <span className="text-[10px] text-green-500 uppercase font-bold tracking-tighter">Backend Optimized</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </footer>

      <VoiceAssistant />

      {/* WhatsApp Floating Action Button */}
      <a
        href="https://wa.me/263715772159"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-[104px] right-7 z-50 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-background"
        aria-label="Chat with us on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
}
