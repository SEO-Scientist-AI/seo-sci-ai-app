interface LayoutProps {
  children: React.ReactNode;
  params: { [key: string]: string | string[] | undefined };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Layout({
  children,
  searchParams,
}: LayoutProps) {
  // ... rest of your layout component
} 