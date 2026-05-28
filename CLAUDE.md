# CleanBy

Marketplace mobile de serviços automotivos (lava-jatos e estéticas). Modelo B2C estilo iFood.

## Stack
- React Native + Expo (TypeScript)
- Expo Router (file-based navigation)
- NativeWind (Tailwind CSS para RN)
- Supabase (auth + banco + storage)
- Zustand (estado global)
- MercadoPago (pagamentos)

## Rodar o projeto
```bash
npm start          # Expo DevTools
npm run ios        # Simulador iOS
npm run android    # Emulador Android
```

## Variáveis de ambiente
Copie `.env.example` para `.env` e preencha as chaves do Supabase e Google Maps.

## Estrutura
- `app/` — Rotas (Expo Router file-based)
  - `(auth)/` — Onboarding, Login, Signup
  - `(tabs)/` — Home, Buscar, Mapa, Agendamentos, Perfil
  - `estabelecimento/[id]` — Página do estabelecimento
  - `agendamento/[id]` — Fluxo de agendamento (5 passos)
  - `loja/` — Loja de produtos automotivos
  - `pro/` — Assinatura PRO
- `src/components/` — Componentes reutilizáveis
- `src/stores/` — Zustand stores (auth, booking, cart)
- `src/lib/` — Supabase client, constantes
- `src/types/` — Tipos TypeScript

## Design
- Cores: Noite `#0A1628` | Chuva `#1A7AC8` | Verde Água `#00C9A0`
- PRO features: verde água `#00C9A0`, símbolo `✦`
