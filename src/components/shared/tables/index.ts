// Table Components

// Original DataTable (from data-table.tsx)
export {
  DataTable,
  renderAvatarCell,
  renderBadgeCell,
  renderRatingCell,
  renderCurrencyCell,
  renderDateCell,
  renderActionsCell,
} from "../data-table";
export type { DataTableColumn } from "../data-table";

// Generic DataTable (from DataTable/ - supports Column config)
export { DataTable as GenericDataTable } from "../DataTable";
export type { Column, DataTableProps } from "../DataTable";
