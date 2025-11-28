# 🎨 Design System - AutoRemind PT

Design moderno e profissional para a aplicação AutoRemind PT.

---

## 🌈 Paleta de Cores

### Cores Primárias

```css
/* Azul (Principal) */
--blue-50: #eff6ff
--blue-500: #3b82f6
--blue-600: #2563eb  /* Primária */
--blue-700: #1d4ed8

/* Índigo (Secundária) */
--indigo-500: #6366f1
--indigo-600: #4f46e5  /* Secundária */
--indigo-700: #4338ca

/* Roxo (Acento) */
--purple-500: #a855f7
--purple-600: #9333ea
```

### Cores de Estado

```css
/* Sucesso */
--green-50: #f0fdf4
--green-100: #dcfce7
--green-600: #16a34a
--green-700: #15803d

/* Aviso */
--amber-50: #fffbeb
--amber-100: #fef3c7
--amber-600: #d97706
--amber-700: #b45309

/* Erro */
--red-50: #fef2f2
--red-100: #fee2e2
--red-600: #dc2626
--red-700: #b91c1c

/* Neutro */
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-600: #4b5563
--gray-900: #111827
```

---

## 🎭 Gradientes

### Gradientes de Texto

```css
/* Principal */
background: linear-gradient(to right, #2563eb, #4f46e5, #9333ea);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;

/* Azul → Índigo */
background: linear-gradient(to right, #2563eb, #4f46e5);
```

### Gradientes de Fundo

```css
/* Hero Background */
background: linear-gradient(to bottom right, #eff6ff, #eef2ff, #faf5ff);

/* Card Glassmorphism */
background: linear-gradient(to bottom right,
  rgba(255, 255, 255, 0.8),
  rgba(255, 255, 255, 0.6)
);
backdrop-filter: blur(12px);

/* Botão Principal */
background: linear-gradient(to right, #2563eb, #4f46e5);

/* Estados (Cards) */
background: linear-gradient(to bottom right,
  rgba(59, 130, 246, 0.1),  /* blue-500/10 */
  rgba(59, 130, 246, 0.05)  /* blue-500/5 */
);
```

---

## ✨ Efeitos Visuais

### Glassmorphism

```css
.glass-card {
  background: linear-gradient(to bottom right,
    rgba(255, 255, 255, 0.8),
    rgba(255, 255, 255, 0.6)
  );
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
```

### Sombras

```css
/* Pequena */
box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
            0 1px 2px 0 rgba(0, 0, 0, 0.06);

/* Média */
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);

/* Grande */
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);

/* Extra Grande */
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);

/* 2XL */
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

---

## 📝 Tipografia

### Font Family

```css
font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

### Escalas de Tamanho

```css
/* Títulos */
.text-5xl { font-size: 3rem; }      /* Hero */
.text-4xl { font-size: 2.25rem; }   /* Page Title */
.text-3xl { font-size: 1.875rem; }  /* Section Title */
.text-2xl { font-size: 1.5rem; }    /* Card Title */
.text-xl  { font-size: 1.25rem; }   /* Subtitle */

/* Corpo */
.text-lg   { font-size: 1.125rem; } /* Large Body */
.text-base { font-size: 1rem; }     /* Body */
.text-sm   { font-size: 0.875rem; } /* Small */
.text-xs   { font-size: 0.75rem; }  /* Extra Small */
```

### Pesos

```css
font-weight: 400;  /* Normal */
font-weight: 500;  /* Medium */
font-weight: 600;  /* Semibold */
font-weight: 700;  /* Bold */
```

---

## 🎬 Animações

### Fade In

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}
```

### Slide Up

```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slideUp 0.5s ease-out;
}
```

### Scale In

```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scaleIn 0.3s ease-out;
}
```

### Blob (Login)

```css
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 7s infinite;
}
```

### Hover Effects

```css
/* Botões */
.hover-scale {
  transition: transform 0.2s ease;
}
.hover-scale:hover {
  transform: scale(1.05);
}

/* Cards */
.hover-lift {
  transition: all 0.3s ease;
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
```

---

## 🔘 Componentes

### Botão Principal

```tsx
<Button className="bg-gradient-to-r from-blue-600 to-indigo-600
                   hover:from-blue-700 hover:to-indigo-700
                   shadow-xl hover:shadow-2xl
                   transition-all duration-200 hover:scale-105">
  Texto do Botão
</Button>
```

### Card com Glassmorphism

```tsx
<Card className="border-0 shadow-2xl
                 bg-gradient-to-br from-white/80 to-white/60
                 backdrop-blur-xl">
  <CardContent>...</CardContent>
</Card>
```

### Badge de Estado

```tsx
<span className="px-4 py-2 rounded-full text-sm font-semibold
                 bg-green-100 text-green-700 border border-green-200
                 shadow-sm">
  ✓ Lembrete Enviado
</span>
```

### Ícone com Gradiente

```tsx
<div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600
                rounded-2xl shadow-lg">
  <Icon className="h-7 w-7 text-white" />
</div>
```

---

## 📐 Espaçamento

```css
/* Padding */
.p-4  { padding: 1rem; }      /* 16px */
.p-6  { padding: 1.5rem; }    /* 24px */
.p-8  { padding: 2rem; }      /* 32px */
.p-12 { padding: 3rem; }      /* 48px */
.p-16 { padding: 4rem; }      /* 64px */

/* Gap */
.gap-2 { gap: 0.5rem; }       /* 8px */
.gap-3 { gap: 0.75rem; }      /* 12px */
.gap-4 { gap: 1rem; }         /* 16px */
.gap-6 { gap: 1.5rem; }       /* 24px */
.gap-8 { gap: 2rem; }         /* 32px */

/* Margin */
.mb-2 { margin-bottom: 0.5rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-8 { margin-bottom: 2rem; }
```

---

## 🎯 Border Radius

```css
.rounded-lg   { border-radius: 0.5rem; }   /* 8px */
.rounded-xl   { border-radius: 0.75rem; }  /* 12px */
.rounded-2xl  { border-radius: 1rem; }     /* 16px */
.rounded-3xl  { border-radius: 1.5rem; }   /* 24px */
.rounded-full { border-radius: 9999px; }
```

---

## 🌟 Princípios de Design

### 1. Hierarquia Visual Clara
- Títulos grandes com gradientes
- Subtítulos médios em cinza
- Corpo de texto legível

### 2. Uso Generoso de Espaço
- Padding amplo nos cards (p-8, p-12)
- Gaps entre elementos (gap-4, gap-6)
- Margem entre secções (mb-8)

### 3. Animações Suaves
- Transições de 200-300ms
- Easing natural (ease, ease-out)
- Animações de entrada ao carregar

### 4. Glassmorphism e Profundidade
- Fundos semi-transparentes
- Blur para efeito de vidro
- Sombras para elevation

### 5. Gradientes Subtis
- Gradientes de fundo suaves
- Gradientes de texto vibrantes
- Gradientes em botões e ícones

---

**Design System v2.0 - AutoRemind PT**
