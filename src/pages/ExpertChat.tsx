import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Avatar, 
  IconButton, 
  CircularProgress,
  AppBar,
  Toolbar,
  Divider,
  Container,
  Link as MuiLink
} from '@mui/material';
import { 
  Send as SendIcon, 
  ArrowBack as ArrowBackIcon,
  LocalFlorist as PlantIcon,
  ContentCopy as CopyIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Initialize the Gemini API with the API key from environment variables
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || '');

// Message type definition
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ExpertChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [chatModel, setChatModel] = useState<any>(null);
  const [showMarkdownInfo, setShowMarkdownInfo] = useState(false);

  // Initialize chat with welcome message
  useEffect(() => {
    const initialMessage: Message = {
      id: '1',
      text: "# Welcome to Plant Expert Chat! 🌱\n\nI'm your plant expert assistant. I can help with:\n\n- Plant identification\n- Care tips and watering schedules\n- Troubleshooting plant problems\n- Gardening advice\n- Seasonal plant care\n\nHow can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([initialMessage]);

    // Initialize the chat model
    const initializeChat = async () => {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const chat = model.startChat({
          history: [
            {
              role: "user",
              parts: [{ text: "I want to talk about plants, gardening, and plant care. I might ask for identification help, care tips, or troubleshooting advice. Please use Markdown formatting in your responses to make them more structured and readable. Use headings, lists, tables, and other formatting as appropriate." }],
            },
            {
              role: "model",
              parts: [{ text: "# Welcome to Plant Expert Chat! 🌱\n\nI'd be happy to discuss plants, gardening, and plant care with you! I can provide information on plant identification, care requirements, troubleshooting common issues, and general gardening advice.\n\nI'll use Markdown formatting to make my responses clear and structured. Feel free to ask any questions you have about your plants or gardening projects." }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000,
          },
        });
        setChatModel(chat);
      } catch (err) {
        console.error('Error initializing chat:', err);
        setError('Failed to initialize chat. Please try again later.');
      }
    };

    initializeChat();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading || !chatModel) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setError(null);
    
    try {
      // Add instructions to use Markdown in the prompt
      const enhancedPrompt = inputText.trim() + "\n\nPlease format your response using Markdown with headings, lists, and other formatting as appropriate to make the information clear and structured.";
      
      const result = await chatModel.sendMessage([{ text: enhancedPrompt }]);
      const response = await result.response;
      const responseText = response.text();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError('Failed to get a response. Please try again.');
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error processing your request. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  // Handle pressing Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle copying message text
  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Could show a snackbar or toast here
        console.log('Text copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* App Bar */}
      <AppBar position="static" sx={{ bgcolor: '#4CAF50' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Avatar sx={{ bgcolor: 'white', mr: 1 }}>
              <PlantIcon sx={{ color: '#4CAF50' }} />
            </Avatar>
            <Typography variant="h6" component="div">
              Plant Expert
            </Typography>
          </Box>
          <IconButton 
            color="inherit" 
            onClick={() => setShowMarkdownInfo(!showMarkdownInfo)}
            sx={{ color: 'white' }}
          >
            <InfoIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Markdown Info */}
      {showMarkdownInfo && (
        <Paper 
          elevation={1} 
          sx={{ 
            m: 2, 
            p: 2, 
            bgcolor: '#E8F5E9', 
            borderRadius: 2,
            border: '1px solid #C8E6C9'
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Markdown Support
          </Typography>
          <Typography variant="body2">
            This chat supports Markdown formatting. The AI can provide structured responses with:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 1 }}>
            <li>Headings and subheadings</li>
            <li>Bulleted and numbered lists</li>
            <li>Tables for organized data</li>
            <li>Bold and italic text for emphasis</li>
            <li>Code blocks for technical instructions</li>
          </Box>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Try asking for care instructions or plant information to see formatted responses.
          </Typography>
        </Paper>
      )}

      {/* Chat Messages */}
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto', 
        p: 2, 
        bgcolor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Container maxWidth="md" sx={{ flexGrow: 1 }}>
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 2
              }}
            >
              {message.sender === 'bot' && (
                <Avatar sx={{ bgcolor: '#4CAF50', mr: 1, alignSelf: 'flex-start', mt: 1 }}>
                  <PlantIcon />
                </Avatar>
              )}
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: '80%',
                  borderRadius: 2,
                  bgcolor: message.sender === 'user' ? '#E3F2FD' : 'white',
                  borderTopLeftRadius: message.sender === 'bot' ? 0 : 2,
                  borderTopRightRadius: message.sender === 'user' ? 0 : 2,
                  position: 'relative'
                }}
              >
                {message.sender === 'bot' ? (
                  <Box sx={{ '& > *': { maxWidth: '100%' } }}>
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ node, ...props }) => <Typography variant="h5" gutterBottom fontWeight="bold" color="primary" {...props} />,
                        h2: ({ node, ...props }) => <Typography variant="h6" gutterBottom fontWeight="bold" color="primary" {...props} />,
                        h3: ({ node, ...props }) => <Typography variant="subtitle1" gutterBottom fontWeight="bold" {...props} />,
                        h4: ({ node, ...props }) => <Typography variant="subtitle2" gutterBottom fontWeight="bold" {...props} />,
                        p: ({ node, ...props }) => <Typography variant="body1" paragraph {...props} />,
                        a: ({ node, ...props }) => <MuiLink color="primary" {...props} />,
                        ul: ({ node, ...props }) => <Box component="ul" sx={{ pl: 2 }} {...props} />,
                        ol: ({ node, ...props }) => <Box component="ol" sx={{ pl: 2 }} {...props} />,
                        li: ({ node, ...props }) => <Box component="li" sx={{ mb: 0.5 }} {...props} />,
                        table: ({ node, ...props }) => (
                          <Box sx={{ overflowX: 'auto', my: 2 }}>
                            <table style={{ borderCollapse: 'collapse', width: '100%' }} {...props} />
                          </Box>
                        ),
                        tr: ({ node, ...props }) => <tr style={{ borderBottom: '1px solid #e0e0e0' }} {...props} />,
                        th: ({ node, ...props }) => <th style={{ padding: '8px', textAlign: 'left', fontWeight: 'bold', backgroundColor: '#f5f5f5' }} {...props} />,
                        td: ({ node, ...props }) => <td style={{ padding: '8px', textAlign: 'left' }} {...props} />,
                        code: (props) => {
                          const { children } = props;
                          return props.className 
                            ? <Box component="pre" sx={{ bgcolor: '#f5f5f5', p: 1.5, borderRadius: 1, overflowX: 'auto', fontFamily: 'monospace' }}>{children}</Box>
                            : <Box component="code" sx={{ bgcolor: '#f5f5f5', p: 0.3, borderRadius: 0.5, fontFamily: 'monospace' }}>{children}</Box>;
                        },
                        blockquote: ({ node, ...props }) => (
                          <Box component="blockquote" sx={{ borderLeft: '4px solid #4CAF50', pl: 2, py: 0.5, my: 1, color: 'text.secondary' }} {...props} />
                        ),
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  </Box>
                ) : (
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {message.text}
                  </Typography>
                )}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mt: 1
                }}>
                  <Typography variant="caption" color="text.secondary">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                  {message.sender === 'bot' && (
                    <IconButton 
                      size="small" 
                      onClick={() => handleCopyMessage(message.text)}
                      sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
                    >
                      <CopyIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Paper>
              {message.sender === 'user' && (
                <Avatar sx={{ bgcolor: '#2196F3', ml: 1, alignSelf: 'flex-start', mt: 1 }} />
              )}
            </Box>
          ))}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
              <Avatar sx={{ bgcolor: '#4CAF50', mr: 1 }}>
                <PlantIcon />
              </Avatar>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'white',
                  borderTopLeftRadius: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <CircularProgress size={20} sx={{ mr: 1 }} />
                <Typography variant="body2">Thinking...</Typography>
              </Paper>
            </Box>
          )}
          {error && (
            <Box sx={{ mb: 2 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: '#FFEBEE',
                  border: '1px solid #FFCDD2'
                }}
              >
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              </Paper>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Container>
      </Box>

      {/* Input Area */}
      <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #e0e0e0' }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask about plant care, identification, or gardening tips..."
              value={inputText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              multiline
              maxRows={4}
              sx={{ 
                mr: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                }
              }}
            />
            <Button
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading || !chatModel}
              sx={{ 
                borderRadius: 3,
                px: 3,
                py: 1.5,
                bgcolor: '#4CAF50',
                '&:hover': {
                  bgcolor: '#388E3C'
                }
              }}
            >
              Send
            </Button>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
            Powered by Google Gemini AI • Specialized in plant knowledge
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default ExpertChat; 