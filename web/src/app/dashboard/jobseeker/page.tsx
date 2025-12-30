import DashboardLayout from "../layout";



export default function JobseekerDashboard() {
  return (
    <DashboardLayout title="Dashboard Jobseeker">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Lowongan Tersedia</h3>
          <p className="text-3xl font-bold mt-2">124</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Lamaran Dikirim</h3>
          <p className="text-3xl font-bold mt-2">8</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Diproses</h3>
          <p className="text-3xl font-bold mt-2">3</p>
        </div>

      </div>
    </DashboardLayout>
  )
}
