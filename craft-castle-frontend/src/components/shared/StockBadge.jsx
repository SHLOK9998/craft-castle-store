export function StockBadge({ qty }) {
  if (qty === 0)   return <span className="badge-out   text-xs font-semibold px-2 py-0.5 rounded-full">Out of Stock</span>
  if (qty <= 5)    return <span className="badge-low-stock text-xs font-semibold px-2 py-0.5 rounded-full">Only {qty} left</span>
  return               <span className="badge-in-stock text-xs font-semibold px-2 py-0.5 rounded-full">In Stock</span>
}
