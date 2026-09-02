import { SiteFooter } from "@/components/ntech/SiteFooter";
import { SiteNav } from "@/components/ntech/SiteNav";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteNav />
      <div className="min-h-[calc(100vh-16rem)]">{children}</div>
      <SiteFooter />
    </>
  );
}
