"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/app/login/actions";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Lock } from "lucide-react";

export function LoginForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const resultado = await loginAction(formData);
    setLoading(false);

    if (!resultado.sucesso) {
      toast({
        variant: "destructive",
        title: "Erro ao entrar",
        description: resultado.erro,
      });
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="password" className="text-white text-lg">
          Palavra-passe
        </Label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Insira a sua palavra-passe"
            required
            className="pl-12 pr-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 h-14 text-lg backdrop-blur-sm focus:bg-white/20 focus:border-white/40 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        <p className="text-white/60 text-sm">
          Palavra-passe padrão: <code className="bg-white/10 px-2 py-1 rounded">admin123</code>
          <br />
          (mude no ficheiro .env)
        </p>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full h-14 text-lg bg-white hover:bg-white/90 text-blue-600 font-semibold shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02]"
        disabled={loading}
      >
        {loading ? "A entrar..." : "Entrar"}
      </Button>
    </form>
  );
}
