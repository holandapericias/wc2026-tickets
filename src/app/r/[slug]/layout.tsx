import PublicNav from "./PublicNav";

export default function PublicPortfolioLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  return (
    <>
      <PublicNav slug={params.slug} />
      <main className="max-w-[1600px] mx-auto px-4 py-6">{children}</main>
    </>
  );
}
