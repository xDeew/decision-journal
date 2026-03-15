import type { Dispatch, SetStateAction } from 'react'

type DecisionToolbarProps = {
  statusFilter: 'all' | 'open' | 'reviewed'
  setStatusFilter: Dispatch<SetStateAction<'all' | 'open' | 'reviewed'>>
  searchTerm: string
  setSearchTerm: Dispatch<SetStateAction<string>>
  selectedCategory: string
  setSelectedCategory: Dispatch<SetStateAction<string>>
  availableCategories: string[]
  sortOrder: 'newest' | 'oldest'
  setSortOrder: Dispatch<SetStateAction<'newest' | 'oldest'>>
}

function DecisionToolbar({
  statusFilter,
  setStatusFilter,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  availableCategories,
  sortOrder,
  setSortOrder,
}: DecisionToolbarProps) {
  return (
    <>
      <div className="filter-tabs">
        <button
          type="button"
          className={statusFilter === 'all' ? 'filter-tab active' : 'filter-tab'}
          onClick={() => setStatusFilter('all')}
        >
          All
        </button>

        <button
          type="button"
          className={statusFilter === 'open' ? 'filter-tab active' : 'filter-tab'}
          onClick={() => setStatusFilter('open')}
        >
          Open
        </button>

        <button
          type="button"
          className={statusFilter === 'reviewed' ? 'filter-tab active' : 'filter-tab'}
          onClick={() => setStatusFilter('reviewed')}
        >
          Reviewed
        </button>
      </div>

      <div className="toolbar">
        <div className="toolbar-search">
          <label htmlFor="search-decisions">Search</label>
          <input
            id="search-decisions"
            type="text"
            placeholder="Search by title, category or context..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="toolbar-category">
          <label htmlFor="category-filter">Category</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="all">All categories</option>
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="toolbar-sort">
          <label htmlFor="sort-order">Sort</label>
          <select
            id="sort-order"
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(event.target.value as 'newest' | 'oldest')
            }
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </div>
    </>
  )
}

export default DecisionToolbar