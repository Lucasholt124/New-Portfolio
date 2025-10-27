// components/chat/Chat.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { sendMessage, type ChatMessage } from "@/app/actions/groq-chat";
import type { CHAT_PROFILE_QUERYResult } from "@/sanity.types";
import { useSidebar } from "../ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Loader2,
  Send,
  X,
  Briefcase,
  Code2,
  User,
  Bot,
  UserRound,
  Box,
  Sparkles,
  MessageCircle
} from "lucide-react";

interface StartPrompt {
  icon: React.ReactNode;
  label: string;
  prompt: string;
  gradient: string;
}

interface MessageWithId extends ChatMessage {
  id: string;
}

export function Chat({
  profile,
}: {
  profile: CHAT_PROFILE_QUERYResult | null;
}) {
  const { toggleSidebar } = useSidebar();
  const [messages, setMessages] = useState<MessageWithId[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate greeting based on available profile data
  const getGreeting = () => {
    if (!profile?.firstName) {
      return "Olá! Como posso ajudar você hoje?";
    }

    const fullName = [profile.firstName, profile.lastName]
      .filter(Boolean)
      .join(" ");

    return `Olá! Eu sou ${fullName}. Como posso ajudar você hoje?`;
  };

  // System prompt para dar contexto ao AI sobre o perfil
  const getSystemPrompt = () => {
    if (!profile) return "";

    const fullName = [profile.firstName, profile.lastName]
      .filter(Boolean)
      .join(" ");

    return `Você é um assistente AI representando ${fullName}.
    ${profile.headline ? `Headline: ${profile.headline}` : ""}
    ${profile.shortBio ? `Bio: ${profile.shortBio}` : ""}
    ${profile.location ? `Localização: ${profile.location}` : ""}
    ${profile.yearsOfExperience ? `Anos de experiência: ${profile.yearsOfExperience}` : ""}
    ${profile.availability ? `Disponibilidade: ${profile.availability}` : ""}

    Responda perguntas como se você fosse esta pessoa, baseando-se nas informações disponíveis.
    Seja profissional mas amigável. Se não souber algo específico, seja honesto sobre isso.`;
  };

  const startPrompts: StartPrompt[] = [
    {
      icon: <Briefcase className="h-4 w-4 sm:h-5 sm:w-5" />,
      label: "Experiência",
      prompt: "Conte-me sobre sua experiência profissional e funções anteriores",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Code2 className="h-4 w-4 sm:h-5 sm:w-5" />,
      label: "Habilidades",
      prompt: "Em quais tecnologias e linguagens de programação você é especialista?",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Box className="h-4 w-4 sm:h-5 sm:w-5" />,
      label: "Projetos",
      prompt: "Mostre-me alguns dos seus projetos mais interessantes",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <User className="h-4 w-4 sm:h-5 sm:w-5" />,
      label: "Sobre mim",
      prompt: "Conte-me mais sobre você e sua história",
      gradient: "from-green-500 to-emerald-500"
    },
  ];

  // Generate unique ID for messages
  const generateMessageId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSubmit = async (promptText?: string) => {
    const messageText = promptText || input;

    if (!messageText.trim() || isLoading) return;

    if (!promptText) {
      setInput("");
    }

    const userMessage: MessageWithId = {
      role: "user",
      content: messageText,
      id: generateMessageId()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const apiMessages: ChatMessage[] = newMessages.map(({ role, content }) => ({ role, content }));
      const response = await sendMessage(apiMessages, getSystemPrompt());

      const assistantMessage: MessageWithId = {
        role: "assistant",
        content: response,
        id: generateMessageId()
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage: MessageWithId = {
        role: "assistant",
        content: "Desculpe, ocorreu um erro. Por favor, tente novamente.",
        id: generateMessageId()
      };

      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        setTimeout(() => {
          viewport.scrollTo({
            top: viewport.scrollHeight,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  return (
    <Card className="flex flex-col h-full w-full border-0 rounded-none shadow-none bg-gradient-to-b from-background to-muted/20">
      {/* Header - Mobile optimized */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b bg-background/95 backdrop-blur-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-50 animate-pulse" />
            <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2">
              <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-sm sm:text-base">
              {profile?.firstName ? `${profile.firstName} AI` : "Assistente AI"}
            </h2>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Sempre online • Responde instantaneamente
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="md:hidden h-8 w-8 sm:h-9 sm:w-9"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>

      {/* Messages Area - Mobile optimized */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-3 sm:px-4 py-4 sm:py-6">
        {messages.length === 0 ? (
          <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
            {/* Welcome Message */}
            <div className="text-center py-4 sm:py-8">
              <div className="relative inline-block mb-4 sm:mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-2xl opacity-25 animate-pulse" />
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-3 sm:p-4">
                  <Sparkles className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {getGreeting()}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto px-4">
                Pergunte sobre experiência, habilidades, projetos ou qualquer coisa que você queira saber.
              </p>
            </div>

            {/* Start Prompts - Mobile optimized grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-lg mx-auto px-2 sm:px-0">
              {startPrompts.map((prompt, index) => (
                <Button
                  key={prompt.label}
                  variant="outline"
                  className={cn(
                    "group relative h-auto flex flex-col items-center justify-center gap-2 p-4 sm:p-5",
                    "border-2 hover:border-primary/50 transition-all duration-300",
                    "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
                    "bg-gradient-to-br from-background to-muted/30"
                  )}
                  onClick={() => handleSubmit(prompt.prompt)}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className={cn(
                    "p-2 sm:p-2.5 rounded-xl bg-gradient-to-r text-white",
                    "group-hover:scale-110 transition-transform duration-300",
                    prompt.gradient
                  )}>
                    {prompt.icon}
                  </div>
                  <span className="text-xs sm:text-sm font-medium">{prompt.label}</span>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2 sm:gap-3 animate-in slide-in-from-bottom duration-300",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                <div
                  className={cn(
                    "flex gap-2 sm:gap-3 max-w-[85%] sm:max-w-[80%]",
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className="shrink-0">
                    {message.role === "user" ? (
                      <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                        <UserRound className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                      </div>
                    ) : (
                      <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center shadow-lg">
                        <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </div>
                    )}
                  </div>
                  <div
                    className={cn(
                      "rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm",
                      "transition-all duration-300 hover:shadow-md",
                      message.role === "user"
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    )}
                  >
                    <p className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 sm:gap-3 justify-start animate-in slide-in-from-bottom duration-300">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center shadow-lg">
                  <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input Form - Mobile optimized */}
      <div className="border-t bg-background/95 backdrop-blur-sm">
        <div className="p-3 sm:p-4">
          <form onSubmit={handleFormSubmit} className="flex gap-2 max-w-3xl mx-auto">
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                disabled={isLoading}
                className={cn(
                  "pr-10 h-10 sm:h-11",
                  "text-sm sm:text-base",
                  "rounded-full",
                  "border-2 focus:border-primary/50",
                  "bg-background/50 backdrop-blur-sm",
                  "placeholder:text-xs sm:placeholder:text-sm"
                )}
              />
              <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="icon"
              className={cn(
                "h-10 w-10 sm:h-11 sm:w-11 rounded-full",
                "bg-gradient-to-r from-blue-500 to-purple-500",
                "hover:from-blue-600 hover:to-purple-600",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all duration-300 hover:scale-105 active:scale-95",
                "shadow-lg"
              )}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              ) : (
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
          </form>

          {/* Disclaimer - Mobile optimized */}
          <p className="text-[10px] sm:text-xs text-muted-foreground text-center mt-2 sm:mt-3 px-4">
            <span className="inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Powered by AI • As respostas podem não ser 100% precisas
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
}

export default Chat;