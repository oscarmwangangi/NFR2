export default function SummaryCard({ title, value, icon, color }) {
  return (
    <div className={`bg-[#330000] p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[#ff9999]">{title}</p>
          <h3 className="text-xl font-bold">{value}</h3>
        </div>
        <div className="p-3 rounded-full bg-[#2a0000]">
          {icon}
        </div>
      </div>
    </div>
  );
}