export function CategoryFilter({ categories, selected = [], onChange }) {
  const isAllSelected = selected.length === 0

  const handleToggle = (id) => {
    const isSelected = selected.includes(id)
    if (isSelected) {
      onChange([]) // toggle off to show all collections
    } else {
      onChange([id]) // single-select filter
    }
  }

  return (
    <>
      <button
        onClick={() => onChange([])}
        className={`shrink-0 px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium border transition-colors ${
          isAllSelected
            ? 'bg-cf-primary text-white border-cf-primary'
            : 'bg-white dark:bg-[#2c1e1b] text-cf-primary dark:text-cf-gold border-[#e8dcd8] dark:border-cf-gold/20 hover:bg-cf-surface hover:dark:bg-cf-saffron/10'
        }`}
      >
        <span className="inline sm:hidden">All</span>
        <span className="hidden sm:inline">All Collections</span>
      </button>
      {categories.map((cat) => {
        // Map common category names to match mockup casing/names
        let displayName = cat.name
        if (cat.name === 'Designer Rakhi') displayName = 'Designer'
        if (cat.name === 'Kids Rakhi') displayName = 'Kids Special'
        if (cat.name === 'Combo Pack') displayName = 'Combo Packs'

        const isSelected = selected.includes(cat.id)

        return (
          <button
            key={cat.id}
            onClick={() => handleToggle(cat.id)}
            className={`shrink-0 px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium border transition-colors ${
              isSelected
                ? 'bg-cf-primary text-white border-cf-primary'
                : 'bg-white dark:bg-[#2c1e1b] text-cf-primary dark:text-cf-gold border-[#e8dcd8] dark:border-cf-gold/20 hover:bg-cf-surface hover:dark:bg-cf-saffron/10'
            }`}
          >
            {displayName}
          </button>
        )
      })}
    </>
  )
}

