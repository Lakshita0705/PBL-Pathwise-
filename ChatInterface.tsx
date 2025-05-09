
import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Skill } from '@/types';
import { useRoadmap } from '@/contexts/RoadmapContext';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, Send, Bot, EyeOff, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  typing?: boolean;
}

interface ChatInterfaceProps {
  onRoadmapGenerated?: () => void;
}

// Predefined learning categories for the user to choose from
const LEARNING_CATEGORIES = [
  { name: 'Web Development', icon: '🌐' },
  { name: 'Mobile Development', icon: '📱' },
  { name: 'Data Science', icon: '📊' },
  { name: 'Machine Learning', icon: '🤖' },
  { name: 'DevOps', icon: '🔄' },
  { name: 'Game Development', icon: '🎮' },
  { name: 'Blockchain', icon: '⛓️' },
  { name: 'Cybersecurity', icon: '🔒' },
  { name: 'UX/UI Design', icon: '🎨' },
  { name: 'Cloud Computing', icon: '☁️' },
];

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onRoadmapGenerated }) => {
  const { user } = useAuth();
  const { generateRoadmap, loading } = useRoadmap();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm your learning assistant. I can help create a personalized learning roadmap based on your skills and goals.",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [stage, setStage] = useState<'intro' | 'category' | 'skills' | 'goals' | 'generating' | 'complete'>('intro');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [goals, setGoals] = useState('');
  const [category, setCategory] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add typing indicator and then show the full message
  const addBotMessage = (content: string) => {
    const messageId = Date.now().toString();
    
    // Add typing indicator
    setIsTyping(true);
    setMessages(prev => [...prev, {
      id: messageId,
      content: '',
      sender: 'bot',
      timestamp: new Date(),
      typing: true
    }]);
    
    // Simulate typing effect
    let displayText = '';
    const textLength = content.length;
    const typingSpeed = Math.max(20, Math.min(50, 1000 / textLength)); // Adjust speed based on message length
    
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < textLength) {
        displayText += content.charAt(i);
        i++;
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, content: displayText, typing: true } 
              : msg
          )
        );
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        
        // Set final message with typing complete
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, typing: false } 
              : msg
          )
        );
      }
    }, typingSpeed);
  };

  const handleSendMessage = () => {
    if (!input.trim() && stage !== 'category') return;

    // If we're in category selection stage, we'll handle it in the handler
    if (stage !== 'category') {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content: input,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
    }
    
    // Process based on current stage
    if (stage === 'intro') {
      setStage('category');
      addBotMessage("Great! Please select a learning category that interests you the most:");
    } else if (stage === 'category') {
      processCategory(category);
    } else {
      processUserInput(input);
    }
    
    setInput('');
  };

  const processCategory = (selectedCategory: string) => {
    // Add user message showing the selected category
    const userMessage: Message = {
      id: Date.now().toString(),
      content: `I'm interested in ${selectedCategory}`,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    
    setCategory(selectedCategory);
    
    // Move to skills stage
    setStage('skills');
    
    addBotMessage(`${selectedCategory} is an excellent choice! Could you tell me about your current skill level in this area? For example, "beginner in Python, intermediate in data visualization" or "advanced in JavaScript, beginner in React".`);
  };

  const processUserInput = (userInput: string) => {
    switch (stage) {
      case 'skills':
        // Extract skills from user input
        const extractedSkills = userInput
          .split(',')
          .map(skill => skill.trim().split(' '))
          .filter(parts => parts.length >= 2)
          .map(parts => {
            const level = parts[parts.length - 1].toLowerCase();
            const skillName = parts.slice(0, parts.length - 1).join(' ');
            return {
              id: Date.now().toString() + Math.random().toString(36).substring(2),
              name: skillName,
              level: (level === 'beginner' || level === 'intermediate' || level === 'advanced' || level === 'expert') 
                ? level as 'beginner' | 'intermediate' | 'advanced' | 'expert'
                : 'beginner'
            };
          });
        
        // If no skills could be extracted, create a default one based on the category
        const finalSkills = extractedSkills.length > 0 ? extractedSkills : [
          { id: '1', name: category, level: 'beginner' as const }
        ];
        
        setSkills(finalSkills);
        
        // Move to goals stage
        setStage('goals');
        
        addBotMessage(`Thanks for sharing your skills in ${category}. What specific goals do you have? What do you want to achieve or build in this field?`);
        break;
        
      case 'goals':
        setGoals(userInput);
        
        // Move to generating stage
        setStage('generating');
        
        addBotMessage(`Thank you! I'm now generating a personalized ${category} learning roadmap based on your skills and goals. This will take just a moment...`);
        
        // Generate roadmap after a delay
        setTimeout(async () => {
          try {
            // Add the category to the first skill to help with roadmap generation
            const enrichedSkills = [
              ...skills,
              { id: 'category', name: category, level: 'intermediate' as const }
            ];
            
            await generateRoadmap(enrichedSkills, userInput);
            
            const completionMessage: Message = {
              id: Date.now().toString(),
              content: `Your personalized ${category} learning roadmap is ready! I've created a step-by-step plan to help you achieve your goals. You can view and track your progress through the dashboard.`,
              sender: 'bot',
              timestamp: new Date(),
            };
            
            setMessages(prev => [...prev, completionMessage]);
            setStage('complete');
            
            if (onRoadmapGenerated) {
              onRoadmapGenerated();
            }
          } catch (error) {
            const errorMessage: Message = {
              id: Date.now().toString(),
              content: "I'm sorry, there was an error generating your roadmap. Please try again later.",
              sender: 'bot',
              timestamp: new Date(),
            };
            
            setMessages(prev => [...prev, errorMessage]);
            setStage('intro');
          }
        }, 3000);
        break;
        
      default:
        addBotMessage("Is there anything else you'd like to know about your learning journey?");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Create message bubble with animation
  const renderMessage = (message: Message) => {
    return (
      <div
        key={message.id}
        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
      >
        <div
          className={`flex max-w-[80%] ${
            message.sender === 'user'
              ? 'flex-row-reverse items-end'
              : 'items-start'
          }`}
        >
          {message.sender === 'bot' && (
            <Avatar className="h-9 w-9 mr-2 border border-primary/20 bg-primary/5">
              <AvatarImage src="/placeholder.svg" alt="AI" />
              <AvatarFallback className="bg-primary/10 text-primary">
                <Bot size={18} />
              </AvatarFallback>
            </Avatar>
          )}
          <div
            className={`rounded-lg px-4 py-2 shadow-sm ${
              message.sender === 'user'
                ? 'bg-primary text-primary-foreground ml-2'
                : 'bg-muted'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">
              {message.content}
              {message.typing && (
                <span className="inline-block w-2 h-2 bg-current rounded-full ml-1 animate-ping"></span>
              )}
            </p>
            <p className="text-xs opacity-70 mt-1">
              {new Intl.DateTimeFormat('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              }).format(message.timestamp)}
            </p>
          </div>
          {message.sender === 'user' && (
            <Avatar className="h-9 w-9 ml-2 border border-primary/10">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-secondary">
                {user?.name?.slice(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="h-full flex flex-col shadow-md border-primary/10">
      <CardHeader className="pb-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 bg-primary/10">
              <AvatarFallback className="text-primary">
                <Sparkles size={16} />
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-lg">Learning Roadmap Assistant</CardTitle>
          </div>
          {category && (
            <Badge variant="outline" className="ml-auto font-normal gap-1">
              {LEARNING_CATEGORIES.find(c => c.name === category)?.icon} {category}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto py-4 px-4">
        <div className="space-y-4">
          {messages.map(renderMessage)}
          
          {/* Category selection UI */}
          {stage === 'category' && (
            <div className="my-4 animate-fade-in">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {LEARNING_CATEGORIES.map((cat) => (
                  <Button
                    key={cat.name}
                    variant="outline"
                    className={`justify-start gap-2 h-auto py-2 px-3 text-sm font-normal ${
                      category === cat.name ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => {
                      setCategory(cat.name);
                      processCategory(cat.name);
                    }}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        {stage === 'complete' ? (
          <Button 
            className="w-full" 
            onClick={() => {
              setStage('intro');
              setCategory('');
              setSkills([]);
              setGoals('');
              setMessages([{
                id: Date.now().toString(),
                content: "Hi there! I'm ready to help you create another learning roadmap. What area of technology are you interested in?",
                sender: 'bot',
                timestamp: new Date(),
              }]);
            }}
          >
            Start New Roadmap
          </Button>
        ) : (
          <div className="flex w-full items-center space-x-2">
            <Textarea
              placeholder={
                stage === 'skills' 
                  ? "E.g., beginner in Python, intermediate in data analysis..." 
                  : stage === 'goals'
                  ? "E.g., build a machine learning model, create a mobile app..."
                  : "Type your message..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 min-h-[60px] focus-visible:ring-primary"
              disabled={isTyping || stage === 'generating' || stage === 'category'}
            />
            <Button 
              type="submit" 
              size="icon"
              onClick={handleSendMessage}
              disabled={((!input.trim() && stage !== 'category') || isTyping || stage === 'generating')}
              className="h-[60px] w-[60px] rounded-full"
            >
              {loading || isTyping ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
