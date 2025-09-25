import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Users, Award, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import engineersImage from "@/assets/engineers-collaboration.jpg";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Precision Excellence",
      description: "We deliver solutions with engineering precision, ensuring every component contributes to operational excellence."
    },
    {
      icon: Lightbulb,
      title: "Innovation First",
      description: "Continuous innovation drives us to develop cutting-edge technologies that anticipate industry needs."
    },
    {
      icon: Users,
      title: "Partnership Approach",
      description: "We work as an extension of your team, providing ongoing support and optimization for long-term success."
    },
    {
      icon: Award,
      title: "Proven Results",
      description: "Our track record speaks for itself: measurable improvements in efficiency, safety, and profitability."
    }
  ];

  const stats = [
    { number: "500+", label: "Manufacturing Sites" },
    { number: "98%", label: "Uptime Improvement" },
    { number: "30%", label: "Energy Savings" },
    { number: "75%", label: "Reduced Downtime" }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background to-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Pioneering Industrial Intelligence
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              At Apex Industrial Intelligence, we believe that data is the key to operational excellence. 
              Our mission is to make industrial manufacturing smarter, safer, and more efficient through 
              innovative IoT solutions that deliver measurable results.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                We transform manufacturing operations through intelligent data integration, providing 
                real-time insights that enable proactive decision-making. Our comprehensive IIoT ecosystem 
                empowers organizations to achieve operational excellence while maintaining the highest 
                standards of safety and efficiency.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                By combining advanced sensor technology with powerful analytics, we help our clients 
                predict equipment failures, optimize energy consumption, and ensure workplace safety 
                through continuous environmental monitoring.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src={engineersImage}
                alt="Engineers collaborating with technology"
                className="w-full h-96 object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent rounded-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-secondary/20 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Our Core Values</h2>
            <p className="text-muted-foreground leading-relaxed">
              These principles guide everything we do, from product development to customer relationships, 
              ensuring we deliver exceptional value and build lasting partnerships.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value) => (
              <Card key={value.title} className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-tech transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                      <value.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Industry Expertise</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-foreground">15+</span>
                </div>
                <h3 className="font-semibold mb-2">Years Experience</h3>
                <p className="text-sm text-muted-foreground">Deep expertise in industrial automation and IoT solutions</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-foreground">50+</span>
                </div>
                <h3 className="font-semibold mb-2">Expert Engineers</h3>
                <p className="text-sm text-muted-foreground">Specialized team of IoT, data science, and automation experts</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-foreground">24/7</span>
                </div>
                <h3 className="font-semibold mb-2">Support Coverage</h3>
                <p className="text-sm text-muted-foreground">Round-the-clock monitoring and support for critical operations</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Operations?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Partner with us to unlock the full potential of your manufacturing operations through 
                intelligent automation and data-driven insights.
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">Start Your Journey</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;