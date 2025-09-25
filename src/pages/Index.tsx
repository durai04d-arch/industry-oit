import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Zap, Shield, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-factory.jpg";
import dashboardImage from "@/assets/dashboard-analytics.jpg";

const Index = () => {
  const services = [
    {
      icon: Activity,
      title: "Predictive Maintenance",
      description: "Prevent equipment failures before they happen with AI-powered vibration and thermal monitoring.",
      features: ["75% reduction in unplanned downtime", "Extended equipment lifespan", "Optimized maintenance schedules"]
    },
    {
      icon: Zap,
      title: "Energy Optimization",
      description: "Reduce energy costs by up to 30% through intelligent monitoring and automated control systems.",
      features: ["Real-time consumption tracking", "Peak demand management", "Automated efficiency optimization"]
    },
    {
      icon: Shield,
      title: "Automated Safety Monitoring",
      description: "Ensure workplace safety with continuous environmental monitoring and instant alert systems.",
      features: ["Multi-gas detection", "Environmental compliance", "Emergency response automation"]
    }
  ];

  const partners = [
    "Siemens", "ABB", "Schneider Electric", "Rockwell Automation", "Honeywell", "GE Digital"
  ];

  const benefits = [
    "Reduce operational costs by 25-40%",
    "Increase equipment uptime to 98%+",
    "Improve safety compliance by 90%",
    "ROI typically achieved within 6-12 months"
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage}
            alt="Modern industrial facility with advanced automation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Unlock Operational Excellence.
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent block">
                Predict the Future.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Transform your manufacturing operations with our integrated Industrial IoT ecosystem. 
              Harness the power of predictive analytics, energy optimization, and automated safety monitoring 
              to achieve unprecedented operational efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button variant="hero" size="lg" asChild>
                <Link to="/login">Access System</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/services">
                  Explore Solutions <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-gradient-to-br from-secondary/20 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Complete IIoT Solutions for Modern Manufacturing
            </h2>
            <p className="text-xl text-muted-foreground">
              Our integrated ecosystem combines advanced sensors, edge computing, and cloud analytics 
              to deliver real-time operational intelligence across your entire facility.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.title} className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-tech transition-all duration-300 group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link to="/services">
                View All Services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Platform Showcase */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Data-Driven Intelligence for Every Decision
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Our advanced analytics platform transforms raw sensor data into actionable insights, 
                providing real-time visibility into every aspect of your operations. From equipment 
                health to energy consumption, make informed decisions with confidence.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Real-time monitoring of 1000+ data points per machine</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>AI-powered predictive analytics with 95% accuracy</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Mobile-responsive dashboards for anywhere access</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Seamless integration with existing systems</span>
                </div>
              </div>
              <Button variant="tech" asChild>
                <Link to="/technology">Explore Our Technology</Link>
              </Button>
            </div>
            <div className="relative">
              <img 
                src={dashboardImage}
                alt="Advanced analytics dashboard showing industrial IoT metrics"
                className="w-full h-80 object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent rounded-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-gradient-to-br from-secondary/20 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Trusted by Industry Leaders</h2>
            <p className="text-muted-foreground">
              We partner with the world's leading technology companies to deliver best-in-class solutions
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {partners.map((partner) => (
              <div key={partner} className="text-center">
                <div className="w-full h-12 bg-muted rounded-lg flex items-center justify-center mb-2">
                  <span className="text-sm font-medium text-muted-foreground">{partner}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-primary-glow/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of manufacturers who have already revolutionized their operations with our IIoT solutions. 
            Get started with a free consultation and facility assessment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">Request a Demo</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/about">Learn More About Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
