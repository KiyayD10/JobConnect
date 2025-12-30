import DashboardLayout from '../layout'

export default function EmployerPage() {
  return (
     <DashboardLayout title="Dashboard Employer">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Lowongan Aktif</h3>
          <p className="text-3xl font-bold mt-2">5</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Pelamar Masuk</h3>
          <p className="text-3xl font-bold mt-2">32</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Diterima</h3>
          <p className="text-3xl font-bold mt-2">4</p>
        </div>

      </div>
    </DashboardLayout>
  )
}
