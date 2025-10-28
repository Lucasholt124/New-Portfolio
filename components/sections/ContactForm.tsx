"use client";

import { useState, useTransition } from "react";
import { submitContactForm } from "@/app/actions/submit-contact-form";
import {
  Send,
  User,
  Mail,
  MessageSquare,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    startTransition(async () => {
      const result = await submitContactForm(formData);

      if (result.success) {
        setStatus({
          type: "success",
          message: "Mensagem enviada com sucesso! Responderei em breve.",
        });
        // Reset do formulário
        (e.target as HTMLFormElement).reset();
        // Limpar mensagem de sucesso após 5 segundos
        setTimeout(() => {
          setStatus({ type: null, message: "" });
        }, 5000);
      } else {
        setStatus({
          type: "error",
          message: result.error || "Ocorreu um erro. Por favor, tente novamente.",
        });
        // Limpar mensagem de erro após 7 segundos
        setTimeout(() => {
          setStatus({ type: null, message: "" });
        }, 7000);
      }
    });
  };

  return (
    <div className="@container/form">
      <div className="bg-card border-2 rounded-2xl p-4 sm:p-6 @md/form:p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl @md/form:text-2xl font-bold text-foreground">
                Envie uma Mensagem
              </h3>
              <p className="text-xs @md/form:text-sm text-muted-foreground">
                Responderei em até 24 horas
              </p>
            </div>
          </div>

          {/* Status Alert */}
          {status.type && (
            <div
              className={cn(
                "mb-6 p-4 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2 duration-300",
                status.type === "success"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800"
              )}
            >
              {status.type === "success" ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm @md/form:text-base font-medium">
                {status.message}
              </p>
            </div>
          )}

          <form className="space-y-4 @md/form:space-y-5" onSubmit={handleSubmit}>
            {/* Nome */}
            <div className="group">
              <label
                htmlFor="name"
                className="flex items-center gap-2 text-xs @md/form:text-sm font-semibold text-foreground mb-2 transition-colors group-focus-within:text-primary"
              >
                <User className="h-3.5 w-3.5 @md/form:h-4 @md/form:w-4" />
                Nome completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={cn(
                  "w-full px-4 py-2.5 @md/form:px-5 @md/form:py-3",
                  "rounded-xl border-2 bg-background",
                  "text-sm @md/form:text-base",
                  "transition-all duration-200",
                  "focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary",
                  "hover:border-primary/50",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  focusedField === "name" && "border-primary"
                )}
                placeholder="Lucas Aragão"
                required
                disabled={isPending}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Email */}
            <div className="group">
              <label
                htmlFor="email"
                className="flex items-center gap-2 text-xs @md/form:text-sm font-semibold text-foreground mb-2 transition-colors group-focus-within:text-primary"
              >
                <Mail className="h-3.5 w-3.5 @md/form:h-4 @md/form:w-4" />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={cn(
                  "w-full px-4 py-2.5 @md/form:px-5 @md/form:py-3",
                  "rounded-xl border-2 bg-background",
                  "text-sm @md/form:text-base",
                  "transition-all duration-200",
                  "focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary",
                  "hover:border-primary/50",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  focusedField === "email" && "border-primary"
                )}
                placeholder="Lucas@exemplo.com"
                required
                disabled={isPending}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Assunto */}
            <div className="group">
              <label
                htmlFor="subject"
                className="flex items-center gap-2 text-xs @md/form:text-sm font-semibold text-foreground mb-2 transition-colors group-focus-within:text-primary"
              >
                <FileText className="h-3.5 w-3.5 @md/form:h-4 @md/form:w-4" />
                Assunto
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className={cn(
                  "w-full px-4 py-2.5 @md/form:px-5 @md/form:py-3",
                  "rounded-xl border-2 bg-background",
                  "text-sm @md/form:text-base",
                  "transition-all duration-200",
                  "focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary",
                  "hover:border-primary/50",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  focusedField === "subject" && "border-primary"
                )}
                placeholder="Projeto de desenvolvimento web"
                required
                disabled={isPending}
                onFocus={() => setFocusedField("subject")}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Mensagem */}
            <div className="group">
              <label
                htmlFor="message"
                className="flex items-center gap-2 text-xs @md/form:text-sm font-semibold text-foreground mb-2 transition-colors group-focus-within:text-primary"
              >
                <MessageSquare className="h-3.5 w-3.5 @md/form:h-4 @md/form:w-4" />
                Mensagem
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className={cn(
                  "w-full px-4 py-2.5 @md/form:px-5 @md/form:py-3",
                  "rounded-xl border-2 bg-background",
                  "text-sm @md/form:text-base",
                  "transition-all duration-200",
                  "focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary",
                  "hover:border-primary/50",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "resize-none",
                  focusedField === "message" && "border-primary"
                )}
                placeholder="Olá! Gostaria de conversar sobre um projeto..."
                required
                disabled={isPending}
                onFocus={() => setFocusedField("message")}
                onBlur={() => setFocusedField(null)}
              />
              <p className="text-[10px] @md/form:text-xs text-muted-foreground mt-1">
                Mínimo de 10 caracteres
              </p>
            </div>

            {/* Botão de Envio */}
            <button
              type="submit"
              disabled={isPending}
              className={cn(
                "w-full px-6 py-3 @md/form:py-4",
                "rounded-xl font-semibold text-sm @md/form:text-base",
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90 hover:scale-[1.02]",
                "active:scale-[0.98]",
                "transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                "shadow-lg hover:shadow-xl",
                "flex items-center justify-center gap-2",
                "group"
              )}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 @md/form:h-5 @md/form:w-5 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 @md/form:h-5 @md/form:w-5 group-hover:translate-x-1 transition-transform" />
                  <span>Enviar Mensagem</span>
                </>
              )}
            </button>
          </form>

          {/* Informação adicional */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-[11px] @md/form:text-xs text-muted-foreground text-center">
              🔒 Suas informações estão seguras e não serão compartilhadas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}