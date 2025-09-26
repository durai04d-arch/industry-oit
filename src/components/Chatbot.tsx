import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { generateChatResponse } from '@/lib/gemini'; // Assuming this handles your AI logic

interface Message {
  text: string;
  isUser: boolean;
  isInitialGreeting?: boolean; // New flag for the initial 'Say Hi' state
  isPromptListHeader?: boolean; // New flag for the header before the prompt list
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Ref for auto-focusing input
  const [showPromptButtons, setShowPromptButtons] = useState(false); // New state to control prompt visibility

  // Define your comprehensive list of manual prompts for the project
  const manualPrompts = [
    // General Sensor Data
    "What's the latest temperature reading?",
    "Tell me the current humidity.",
    "Is the machine vibrating right now?",
    "What is the current gas concentration (MQ-6)?",
    "Show me the last recorded distance to an object.",
    "What's the current voltage being monitored?",
    "Can I get a summary of all sensor data?",
    "When was the last data update?",

    // Thermal Camera Specific
    "What's the average thermal temperature?",
    "Report the maximum temperature from the thermal camera.",
    "What's the minimum temperature detected by the thermal camera?",
    "Is there a significant temperature difference in the thermal image?",
    "Can you analyze the thermal frame for hot spots?", // Assuming AI can process this contextually

    // RFID & Access Control
    "Who is the last authorized user?",
    "What is the current RFID access status?",
    "How long is access typically granted?",
    "Show me the history of RFID scans.", // Assuming AI can query this
    "Is my RFID card authorized?",

    // System Status & Alerts
    "Is the machine relay currently active or shut down?",
    "What is the temperature threshold for relay shutdown?",
    "Am I within the danger proximity zone?",
    "What does a 'PROXIMITY ALERT' signify?",
    "Why would the buzzer sound?",
    "What's the status of the LED indicator?",
    "Are there any critical alerts active?",
    "Has the system experienced any errors recently?",

    // Explanations & Help
    "Explain how the vibration sensor works.",
    "How does the thermal camera help in monitoring?",
    "What type of gas does the MQ-6 sensor detect?",
    "How is the voltage sensor calibrated?",
    "What are the benefits of using Supabase for data logging?",
    "Can you explain NTP time synchronization?",
    "What's the purpose of the access duration?",
    "How can I add a new authorized RFID card?",
    "What are the recommended safety procedures?",

    // General Chatbot interaction
    "How are you doing today?",
    "Tell me a fun fact about IoT.",
    "What's your purpose?",
    "Can you provide a quick system health check?",
  ];

  useEffect(() => {
    if (isOpen) {
      setMessages([
        { text: "Hello! I'm your AI assistant for the Industrial IoT Monitoring System.", isUser: false },
        { text: "Tap 'Hi' to start!", isUser: false, isInitialGreeting: true }
      ]);
      setShowPromptButtons(false); // Hide prompts initially
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      setMessages([]); // Clear messages when closing
      setShowPromptButtons(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (messageText: string) => {
    if (messageText.trim() === '') return;

    const userMessage: Message = { text: messageText, isUser: true };
    if (messageText === input) {
      setInput(''); // Clear input only if it's from the input field
    }
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const history = messages.map(msg => `${msg.isUser ? 'User' : 'AI'}: ${msg.text}`).join('\n');
      const botResponse = await generateChatResponse(messageText, history);
      const aiMessage: Message = { text: botResponse, isUser: false };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = { text: 'Sorry, I encountered an error. Please try again.', isUser: false };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleInitialGreetingClick = () => {
    setMessages((prev) => [...prev, { text: "Hi there!", isUser: true }]); // Add user's "Hi" message
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "Great to connect! Here are some common questions you can ask:", isUser: false, isPromptListHeader: true }
      ]);
      setShowPromptButtons(true); // Show the full list of prompts
    }, 500); // Simulate a slight delay for the AI response
  };

  const handlePromptClick = (prompt: string) => {
    handleSend(prompt);
    setShowPromptButtons(false); // Hide prompts after one is selected (optional, can be kept visible)
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90 shadow-lg"
        >
          {isOpen ? <X /> : <MessageSquare />}
        </Button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-[28rem] bg-card border border-border rounded-lg shadow-xl flex flex-col z-50">
          <div className="p-4 border-b flex items-center gap-2">
            <Bot className="text-primary" />
            <h3 className="font-semibold">AI Assistant</h3>
          </div>
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-2 rounded-lg ${
                      message.isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {/* Initial Greeting Button */}
              {!isLoading && messages.some(msg => msg.isInitialGreeting) && !showPromptButtons && (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="outline"
                    onClick={handleInitialGreetingClick}
                    className="h-auto px-6 py-2"
                  >
                    Say Hi! 👋
                  </Button>
                </div>
              )}

              {/* Display manual prompts if showPromptButtons is true */}
              {!isLoading && showPromptButtons && (
                <div className="flex flex-col gap-2 mt-4">
                  {messages.some(msg => msg.isPromptListHeader) && ( // Ensure header is shown only once before prompts
                    <div className="text-sm text-muted-foreground mb-2">
                      Click a prompt below or type your question:
                    </div>
                  )}
                  {manualPrompts.map((prompt, index) => (
                    <Button
                      key={`prompt-${index}`}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePromptClick(prompt)}
                      className="justify-start h-auto whitespace-normal text-left text-sm"
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-300"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="Ask about sensors..."
                disabled={isLoading}
              />
              <Button onClick={() => handleSend(input)} disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
