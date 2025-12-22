'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/src/components/ui/navbar'
import { Button } from '@/src/components/ui/button'
import { MapPin, Briefcase, DollarSign } from 'lucide-react'
// Tipe data Job (sesuai Prisma)
interface Job {
  id: string
  title: string
  company: string
  location: string
  type: string
  salary: string | null
  createdAt: string
}
export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    // Fetch data dari API backend kita
    fetch('/api/jobs')
      .then((res) => res.json())
      .then((data) => {
        setJobs(data.jobs || [])
        setIsLoading(false)
      })
      .catch((err) => console.error(err))
  }, [])
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Temukan Pekerjaan <span className="text-indigo-600">Impianmu</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Ribuan lowongan terbaru dari perusahaan teknologi terbaik menantimu.
          </p>
        </div>
        {isLoading ? (
          <div className="text-center py-20">Loading jobs...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl border border-gray-100
shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{job.title}</h3>
                      <p className="text-indigo-600 font-medium">{job.company}</p>
                    </div>
                    <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full
font-medium">
                      {job.type}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> {job.location}
                    </div>
                    {job.salary && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" /> {job.salary}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> {new
                        Date(job.createdAt).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-6" variant="outline">
                  Lihat Detail
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
