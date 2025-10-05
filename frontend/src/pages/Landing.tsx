import { useState } from "react";
import { ArrowRight, MessageCircle, Users, Shield, Zap, Star, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);

  const features = [
    {
      icon: MessageCircle,
      title: "Real-Time Messaging",
      description: "Instant messaging with live typing indicators and message delivery status"
    },
    {
      icon: Users,
      title: "Group Chats",
      description: "Create unlimited group conversations with file sharing and member management"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "End-to-end encryption ensures your conversations stay private and secure"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Built with modern web technologies for optimal performance and speed"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b8c0?w=150&h=150&fit=crop&crop=face",
      content: "ChatApp has revolutionized how our team communicates. The real-time features are incredible!"
    },
    {
      name: "Mike Chen",
      role: "Software Developer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content: "Clean interface, powerful features. This is exactly what modern teams need for collaboration."
    },
    {
      name: "Lisa Wang",
      role: "Design Lead",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content: "The user experience is phenomenal. Our productivity has increased significantly since switching."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              ChatApp
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-foreground hover:text-primary transition-colors">Features</a>
            <a href="#testimonials" className="text-foreground hover:text-primary transition-colors">Reviews</a>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/chat')}>
              Sign In
            </Button>
            <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
              onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            🚀 New: Real-time voice messages now available
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent leading-tight">
            Connect Teams.<br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">Chat Instantly.</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience the future of team communication with our lightning-fast, secure chat platform.
            Built for modern teams who demand excellence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-4"
              onClick={() => navigate('/chat')}
            >
              Start Chatting <ArrowRight className="ml-2 h-7 w-7 animate-bounce" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border hover:bg-secondary text-lg px-8 py-4"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              <Play className="mr-2 h-5 w-5" /> Watch Demo
            </Button>
          </div>

          {/* Demo Preview */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl p-2 shadow-2xl">
              <div className="bg-card rounded-2xl overflow-hidden border border-border">
                <div className="h-96 bg-gradient-to-br from-chat-sidebar to-background flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 text-primary" />
                    <p className="text-lg font-semibold">Interactive Demo</p>
                    <p className="text-muted-foreground">Click "Start Chatting" to explore</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need for seamless team communication, all in one beautiful interface.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border hover:shadow-glow transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Loved by Teams Worldwide</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of teams already using ChatApp for better communication.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card border-border hover:shadow-glow transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Team Communication?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join millions of users who trust ChatApp for their daily communication needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-4"
              onClick={() => navigate('/chat')}
            >
              Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border hover:bg-secondary text-lg px-8 py-4"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                ChatApp
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 ChatApp. All rights reserved. Built with ❤️ for better communication.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;