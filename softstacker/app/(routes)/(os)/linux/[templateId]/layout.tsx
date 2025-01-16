export function generateStaticParams() {
  // For now, we'll just generate one template
  return [
    { templateId: '1' }
  ];
}

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 