# SPL Design System

## Visão Geral

O SPL (Sistema de Previsão Legal) utiliza um design system consistente baseado em Tailwind CSS, focado em acessibilidade, usabilidade e estética profissional.

## Cores

### Paleta Principal

| Nome | Hex | Uso |
|------|-----|-----|
| Primary (Teal) | `#0f766e` | Ações principais, links, botões primários |
| Secondary | `#0d9488` | Elementos secundários, hover states |
| Success (Emerald) | `#10b981` | Sucesso, conformidade, aprovado |
| Warning (Amber) | `#f59e0b` | Alertas, pendências, atenção |
| Danger (Red) | `#ef4444` | Erros, não conformidade, urgente |
| Info (Blue) | `#3b82f6` | Informações, dicas |

### Tons de Cinza (Slate)

- **50**: `#f8fafc` - Backgrounds claros
- **100**: `#f1f5f9` - Borders sutis
- **200**: `#e2e8f0` - Dividers
- **400**: `#94a3b8` - Placeholders
- **500**: `#64748b` - Texto secundário
- **700**: `#334155` - Texto principal
- **900**: `#0f172a` - Títulos

## Tipografia

### Font Family
- **Principal**: Inter, system-ui, sans-serif

### Tamanhos

| Nome | Classe | Uso |
|------|--------|-----|
| xs | `text-xs` | Labels, badges |
| sm | `text-sm` | Texto auxiliar, tabelas |
| base | `text-base` | Corpo de texto |
| lg | `text-lg` | Subtítulos |
| xl | `text-xl` | Títulos de seção |
| 2xl | `text-2xl` | Títulos principais |

### Pesos
- **Normal** (400): Corpo de texto
- **Medium** (500): Labels, botões
- **Semibold** (600): Subtítulos
- **Bold** (700): Títulos

## Componentes

### Botões

```jsx
// Primário
<button className="bg-teal-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-800">
  Ação Principal
</button>

// Secundário
<button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200">
  Ação Secundária
</button>

// Outline
<button className="border border-teal-600 text-teal-600 px-4 py-2 rounded-lg font-medium hover:bg-teal-50">
  Outline
</button>

// Danger
<button className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700">
  Ação Perigosa
</button>
```

### Inputs

```jsx
<input 
  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
  placeholder="Digite aqui..."
/>
```

### Cards

```jsx
<div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
  <h3 className="text-lg font-semibold text-slate-800">Título</h3>
  <p className="text-slate-600 mt-2">Conteúdo do card</p>
</div>
```

### Badges

```jsx
// Success
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
  Conforme
</span>

// Warning
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
  Pendente
</span>

// Danger
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
  Crítico
</span>
```

## Espaçamento

### Padding/Margin Scale

| Classe | Valor |
|--------|-------|
| 1 | 0.25rem (4px) |
| 2 | 0.5rem (8px) |
| 3 | 0.75rem (12px) |
| 4 | 1rem (16px) |
| 5 | 1.25rem (20px) |
| 6 | 1.5rem (24px) |
| 8 | 2rem (32px) |

### Layout Spacing
- **Entre seções**: 6-8 (24-32px)
- **Entre elementos**: 4-5 (16-20px)
- **Dentro de cards**: 6 (24px)
- **Entre itens de lista**: 3-4 (12-16px)

## Bordas

### Border Radius

| Nome | Classe | Uso |
|------|--------|-----|
| sm | `rounded-sm` | Elementos pequenos |
| md | `rounded-md` | Padrão |
| lg | `rounded-lg` | Cards, inputs |
| xl | `rounded-xl` | Cards grandes |
| full | `rounded-full` | Badges, avatares |

## Sombras

```css
/* Sutil - para cards */
shadow-sm: 0 1px 2px 0 rgba(0,0,0,0.05)

/* Média - para dropdowns */
shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1)

/* Grande - para modais */
shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1)
```

## Estados

### Hover
- Botões: Escurecer 1 tom
- Links: Underline + mudança de cor
- Cards: `hover:shadow-md` ou `hover:border-teal-300`

### Focus
- Outline: `ring-2 ring-teal-500/20`
- Border: `border-teal-500`

### Disabled
- Opacidade: `opacity-50`
- Cursor: `cursor-not-allowed`

## Animações

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

Classes: `animate-fade-in`, `animate-slide-up`

## Responsividade

### Breakpoints

| Nome | Min-width | Uso |
|------|-----------|-----|
| sm | 640px | Mobile landscape |
| md | 768px | Tablet |
| lg | 1024px | Desktop pequeno |
| xl | 1280px | Desktop |
| 2xl | 1536px | Desktop grande |

### Padrão Mobile-First

```jsx
// Exemplo de grid responsivo
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

## Ícones

Utilizamos **Lucide React** para ícones consistentes.

```jsx
import { Home, Settings, Bell, Search } from 'lucide-react';

// Tamanhos padrão
<Home size={20} />  // Navegação
<Home size={16} />  // Inline
<Home size={24} />  // Destaque
```

## Acessibilidade

### Contraste
- Texto normal: ratio mínimo 4.5:1
- Texto grande: ratio mínimo 3:1
- Elementos interativos: indicador visual claro

### Foco
- Todos os elementos interativos devem ter `:focus` visível
- Tab order lógico

### ARIA
- Usar `aria-label` para ícones sem texto
- `role` apropriado para elementos customizados
- `aria-expanded` para menus dropdown
