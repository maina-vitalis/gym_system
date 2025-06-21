import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";

function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

export default PagesLayout;
