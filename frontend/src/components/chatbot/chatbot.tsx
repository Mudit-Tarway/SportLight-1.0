'use client';

import { useState, useRef, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleChat } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Bot, Send, User, MessageSquarePlus } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

const initialState = {
  response: null,
  error: null,
};

function ChatSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" disabled={pending}>
      <Send className="h-4 w-4" />
      <span className="sr-only">Send</span>
    </Button>
  );
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [state, formAction] = useActionState(handleChat, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.response) {
      setMessages((prev) => [...prev, { sender: 'bot', text: state.response as string }]);
    }
    // We don't handle state.error here, but you could show a toast.
  }, [state]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleFormSubmit = (formData: FormData) => {
    const query = formData.get('query') as string;
    if (query.trim()) {
      setMessages((prev) => [...prev, { sender: 'user', text: query }]);
      formAction(formData);
      formRef.current?.reset();
    }
  };

  return (
    <>
      <Button 
        size="icon" 
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl z-40"
        onClick={() => setOpen(true)}
        aria-label="Open Chatbot"
      >
        <MessageSquarePlus className="h-7 w-7" />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex flex-col p-0">
          <SheetHeader className="p-6 pb-2">
            <SheetTitle className="font-headline flex items-center gap-2">
              <Bot /> AI Assistant
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1 px-6" ref={scrollAreaRef}>
            <div className="space-y-6 py-4">
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8 border-2 border-primary">
                    <AvatarFallback><Bot size={16}/></AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm">Hello! I'm the Sportlight AI assistant. How can I help you today?</p>
                </div>
              </div>

              {messages.map((message, index) => (
                <div key={index} className={cn("flex items-start gap-3", message.sender === 'user' && 'justify-end')}>
                  {message.sender === 'bot' && (
                    <Avatar className="w-8 h-8 border-2 border-primary">
                        <AvatarFallback><Bot size={16}/></AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn(
                    "rounded-lg p-3 max-w-[80%]",
                    message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}>
                    <p className="text-sm">{message.text}</p>
                  </div>
                   {message.sender === 'user' && (
                    <Avatar className="w-8 h-8">
                        <AvatarFallback><User size={16}/></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="p-4 bg-background border-t">
            <form
              ref={formRef}
              action={handleFormSubmit}
              className="flex items-center gap-2"
            >
              <Input name="query" placeholder="Ask a question..." autoComplete="off" />
              <ChatSubmitButton />
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

    