/**
 * @file index.ts
 * @layer UI / Components
 *
 * Barrel export principal del catálogo de componentes nativos.
 * Punto de entrada único para todos los componentes de UI.
 *
 * Uso:
 *   import { Button, Card, Typography, TypeBadge } from '@/ui/components';
 *
 * NUNCA importar directamente desde los archivos individuales
 * fuera de src/ui/. Siempre usar este barrel.
 */

// Typography
export {
  Typography,
  Heading,
  Body,
  Label,
  Caption,
  PokemonNumber,
  PokemonName,
} from './Typography';
export type {
  TypographyProps,
  TypographyVariant,
  TypographyAlign,
} from './Typography';

// Button
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

// Input
export { Input } from './Input';
export type { InputProps, InputVariant } from './Input';

// Badge
export { Badge, TypeBadge } from './Badge';
export type {
  BadgeProps,
  BadgeVariant,
  BadgeSize,
  TypeBadgeProps,
} from './Badge';

// Card
export { Card } from './Card';
export type { CardProps, CardVariant, CardSectionProps } from './Card';

// Skeleton
export {
  Skeleton,
  PokemonCardSkeleton,
  PokemonListSkeleton,
  PokemonDetailSkeleton,
} from './Skeleton';
export type {
  SkeletonProps,
  PokemonCardSkeletonProps,
  PokemonListSkeletonProps,
} from './Skeleton';