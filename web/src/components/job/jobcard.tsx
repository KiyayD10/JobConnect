import { MapPin, Briefcase, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function JobCard({ job }: { job: any }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between group">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-xl">
            {job.company.charAt(0)}
          </div>
          <span className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
            {job.type}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {job.title}
        </h3>
        <p className="text-gray-500 font-medium mb-4">{job.company}</p>

        <div className="space-y-3 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-400" />
            {job.location}
          </div>
          <div className="flex items-center gap-2 text-indigo-600 font-medium">
            <DollarSign size={16} />
            {job.salary || "Negosiasi"}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Calendar size={14} />
          {new Date(job.createdAt).toLocaleDateString("id-ID")}
        </div>
        <Button variant="outline" size="sm">Detail</Button>
      </div>
    </div>
  );
}