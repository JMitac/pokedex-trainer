/**
 * @file index.ts
 * @layer UI / Components / Card
 *
 * Punto de entrada único del componente Card.
 *
 * Uso:
 *   import { Card } from '@/ui/components/Card';
 *
 *   <Card variant="elevated" onPress={handlePress}>
 *     <Card.Header>...</Card.Header>
 *     <Card.Body>...</Card.Body>
 *     <Card.Footer>...</Card.Footer>
 *   </Card>
 */

export { Card } from './Card';
export type { CardProps, CardVariant, CardSectionProps } from './Card';
