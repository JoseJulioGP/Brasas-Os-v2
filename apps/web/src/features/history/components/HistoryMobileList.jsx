import { HistoryCard } from "./HistoryCard";

export const HistoryMobileList = ({ items, columns }) => (
  <div className="md:hidden space-y-3 animate-fade-in-up opacity-0 stagger-2">
    {items.map((item) => (
      <HistoryCard key={item.id} item={item} columns={columns} />
    ))}
  </div>
);
