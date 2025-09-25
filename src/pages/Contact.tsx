import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.company || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    // Success message (in a real app, this would send to a backend)
    toast({
      title: "Message Sent Successfully!",
      description: "Our team will contact you within 24 hours to discuss your IIoT needs.",
    });

    // Reset form
    setFormData({
      name: "",
      company: "",
      email: "",
      message: ""
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Headquarters",
      content: "1500 Innovation Drive, Suite 200\nTech Valley, CA 95001"
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+1 (555) 123-4567"
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@apexindustrial.ai\nsales@apexindustrial.ai"
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Monday - Friday: 8:00 AM - 6:00 PM PST\n24/7 Emergency Support Available"
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background to-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Get Your Free Consultation
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Ready to revolutionize your manufacturing operations? Our IIoT experts are here to help 
              you design a custom solution that delivers immediate ROI and long-term competitive advantage.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Request Your Assessment</CardTitle>
                <CardDescription>
                  Fill out the form below and our team will contact you within 24 hours to discuss 
                  your specific requirements and schedule a facility assessment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company *</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your company name"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@company.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your current challenges, facility size, and what you hope to achieve with IIoT solutions..."
                      rows={5}
                      required
                    />
                  </div>
                  <Button type="submit" variant="hero" size="lg" className="w-full">
                    Get Your Free Consultation
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    By submitting this form, you agree to our privacy policy and consent to being contacted 
                    by our team about IIoT solutions.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our team of IIoT specialists is ready to help you transform your manufacturing operations. 
                  Whether you're looking to improve efficiency, reduce costs, or enhance safety, we have the 
                  expertise and technology to deliver results.
                </p>
              </div>

              <div className="grid gap-6">
                {contactInfo.map((info) => (
                  <Card key={info.title} className="border-border/50 bg-card/30 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center flex-shrink-0">
                          <info.icon className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">{info.title}</h3>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {info.content}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Response Promise */}
              <div className="bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-xl p-6">
                <h3 className="font-semibold mb-2">Our Commitment to You</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Response within 24 hours
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Free initial consultation and assessment
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Custom solution design based on your needs
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Ongoing support and optimization
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alternative Contact Methods */}
      <section className="py-20 bg-gradient-to-br from-secondary/20 to-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Prefer to Talk Directly?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Schedule a call with one of our IIoT specialists to discuss your specific requirements 
            and learn how we can help optimize your operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="tech" size="lg">
              Schedule a Call
            </Button>
            <Button variant="outline" size="lg">
              Download Our Brochure
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;