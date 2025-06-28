export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
        <p>© {currentYear} AI Flow Hub. All Rights Reserved.</p>
        <p className="mt-1">
          由 Daseanle 充满热情地构建 ❤️
        </p>
      </div>
    </footer>
  );
}