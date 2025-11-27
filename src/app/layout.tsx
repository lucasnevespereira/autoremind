import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";
import { Settings, Home } from "lucide-react";
import { Logo } from "@/components/logo";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AutoRemind PT - Lembretes de Revisão",
  description: "Envie lembretes de revisão aos seus clientes automaticamente",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-6xl mx-auto px-6 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Logo className="h-16 w-16" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      AutoRemind PT
                    </h1>
                    <p className="text-sm text-gray-600">
                      Lembretes de revisão automáticos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Navigation */}
          <nav className="bg-white border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-6">
              <div className="flex gap-2">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-6 py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-500"
                >
                  <Home className="h-5 w-5" />
                  <span className="font-medium">Início</span>
                </Link>
                <Link
                  href="/configuracoes"
                  className="flex items-center gap-2 px-6 py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-500"
                >
                  <Settings className="h-5 w-5" />
                  <span className="font-medium">Configurações</span>
                </Link>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 mt-12">
            <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-gray-600">
              <p>AutoRemind PT - A sua oficina sempre em contacto com os clientes</p>
            </div>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
