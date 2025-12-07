import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="w-full py-4 px-6 border-b bg-white flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">JobConnect</h1>

        <nav className="space-x-4 text-sm font-medium">
          <Link href="/auth/login" className="hover:text-blue-600">
            Login
          </Link>
          <Link href="/auth/register" className="hover:text-blue-600">
            Register
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl font-bold mb-4">
          Temukan Karir Impianmu di <span className="text-blue-600">JobConnect</span>
        </h2>

        <p className="text-lg text-gray-600 max-w-2xl mb-6">
          Platform pencarian pekerjaan modern yang menghubungkan perusahaan dan kandidat secara cepat, mudah, dan efektif.
        </p>

        <div className="space-x-4">
          <Link
            href="/jobs"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Lihat Lowongan
          </Link>

          <Link
            href="/auth/register"
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50"
          >
            Daftar Sekarang
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <h3 className="text-2xl font-bold text-center mb-12">
          Kenapa memilih <span className="text-blue-600">JobConnect?</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 border rounded-lg shadow-sm text-center bg-white">
            <h4 className="font-semibold text-lg mb-2">Cepat & Mudah</h4>
            <p className="text-gray-600 text-sm">
              Temukan pekerjaan sesuai minatmu hanya dalam beberapa klik.
            </p>
          </div>

          <div className="p-6 border rounded-lg shadow-sm text-center bg-white">
            <h4 className="font-semibold text-lg mb-2">Lowongan Terbaru</h4>
            <p className="text-gray-600 text-sm">
              Dapatkan akses ke ribuan lowongan pekerjaan terbaru setiap hari.
            </p>
          </div>

          <div className="p-6 border rounded-lg shadow-sm text-center bg-white">
            <h4 className="font-semibold text-lg mb-2">Untuk Perusahaan</h4>
            <p className="text-gray-600 text-sm">
              Posting lowongan dan temukan kandidat terbaik dengan cepat.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} JobConnect. All rights reserved.
      </footer>
    </main>
  );
}
