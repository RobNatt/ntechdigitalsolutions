import { ChatWidget } from "@/components/chat/chat-widget";
import { Footer } from "@/components/startup-landing/footer";
import { Navbar } from "@/components/startup-landing/navbar";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-12rem)] pt-20 lg:pt-24">{children}</div>
      <Footer />
      <ChatWidget />
    </>
  );
}
