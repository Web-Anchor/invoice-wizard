import Breadcrumbs from '@components/Breadcrumbs';
import Header from '@app/components/Header';
import Footer from '@components/Footer';
import Navigation from '@components/Navigation';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen max-w-7xl flex-row">
      <Navigation />
      <section className="flex flex-1 flex-col ml-52">
        <Breadcrumbs />
        <section className="flex-auto pt-6 bg-slate-100">{children}</section>
        <Footer />
      </section>
    </main>
  );
}
