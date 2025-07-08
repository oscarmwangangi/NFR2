import { Search, Filter } from 'lucide-react';

export default function SearchAndFilter({ 
  searchQuery, 
  onSearchChange, 
  dateFilter, 
  onDateFilterChange 
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <input
          type="search"
          placeholder="Search orders..."
          value={searchQuery}
          onChange={onSearchChange}
          className="pl-10 pr-4 py-2 rounded-lg bg-[#2a0000] border border-[#330000] placeholder-[#ff9999] text-[#ffcccc] focus:outline-none focus:ring-2 focus:ring-[#ff3d3d]"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-[#ff9999]" />
      </div>
      
      <div className="relative">
        <select
          value={dateFilter}
          onChange={onDateFilterChange}
          className="pl-10 pr-4 py-2 rounded-lg bg-[#2a0000] border border-[#330000] text-[#ffcccc] focus:outline-none focus:ring-2 focus:ring-[#ff3d3d] appearance-none"
        >
          <option value="all">All Time</option>
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
        <Filter className="absolute left-3 top-2.5 h-5 w-5 text-[#ff9999]" />
      </div>
    </div>
  );
}