import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Photography | Altonsworld',
  description: 'Explore photography across 13 categories — coastal, landscape, portrait, street, wildlife, and more by Alton James Williams.',
};

export default function PhotographyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
