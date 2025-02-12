<form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
  <input
    type="text"
    placeholder="Search for products..."
    className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
  <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
    <SearchIcon />
  </button>
</form>