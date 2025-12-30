

export default function AdminPage() {
  return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold">Total User</h3>
          <p className="text-3xl font-bold mt-2">520</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold">Perusahaan</h3>
          <p className="text-3xl font-bold mt-2">86</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold">Lowongan</h3>
          <p className="text-3xl font-bold mt-2">210</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold">Aktivitas Hari Ini</h3>
          <p className="text-3xl font-bold mt-2">47</p>
        </div>

      </div>
  )
}
