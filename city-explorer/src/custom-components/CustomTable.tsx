import React, { useState, useEffect, useRef } from "react";
import {
  Filter,
  Users,
  ListPlus,
  Trash,
  X,
  Check,
  ChevronDown,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// TypeScript interface for table data
interface TableRow {
  id: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// Interface for column configuration
interface ColumnConfig {
  key: string;
  header: string;
  width?: string;
  filterable?: boolean;
}

// Props for the CustomTable component
interface CustomTableProps {
  columns: ColumnConfig[];
  data: TableRow[];
  actions?: React.ReactNode;
  onCreateNew?: () => void;
  onCustomizeTable?: () => void;
  isFetching?: boolean;
}

const CustomTable: React.FC<CustomTableProps> = ({
  columns,
  data,
  actions,
  isFetching,
}) => {
  // States
  const [tableData, setTableData] = useState<TableRow[]>(data);
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
    new Set()
  );
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Update table data when props change
  useEffect(() => {
    setTableData(data);
  }, [data]);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter data based on active filters
  useEffect(() => {
    let filteredData = data;

    Object.entries(filters).forEach(([column, filterValue]) => {
      if (filterValue) {
        filteredData = filteredData.filter((row) =>
          String(row[column]).toLowerCase().includes(filterValue.toLowerCase())
        );
      }
    });

    setTableData(filteredData);
  }, [filters, data]);

  // Handle row selection
  const handleRowSelect = (rowId: string | number, checked: boolean) => {
    const newSelectedRows = new Set(selectedRows);
    if (checked) {
      newSelectedRows.add(rowId);
    } else {
      newSelectedRows.delete(rowId);
    }
    setSelectedRows(newSelectedRows);
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(tableData.map((row) => row.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  // Handle filter change
  const handleFilterChange = (column: string, value: string) => {
    setFilters((prev) => ({ ...prev, [column]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
  };

  // Get filterable columns
  const filterableColumns = columns.filter((col) => col.filterable);

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-700">
              {tableData.length} records
            </span>
            {selectedRows.size > 0 && (
              <Badge variant="secondary">
                {selectedRows.size} selected
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Dropdown */}
            {filterableColumns.length > 0 && (
              <div className="relative" ref={filterRef}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filter
                  <ChevronDown className="h-4 w-4" />
                </Button>

                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-10 p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Filters</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsFilterOpen(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {filterableColumns.map((column) => (
                        <div key={column.key} className="space-y-1">
                          <label className="text-sm font-medium text-gray-700">
                            {column.header}
                          </label>
                          <Input
                            placeholder={`Filter by ${column.header.toLowerCase()}`}
                            value={filters[column.key] || ""}
                            onChange={(e) =>
                              handleFilterChange(column.key, e.target.value)
                            }
                            size="sm"
                          />
                        </div>
                      ))}

                      <div className="flex justify-between pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearFilters}
                        >
                          Clear All
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setIsFilterOpen(false)}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            {actions}

            {/* Delete Selected */}
            {selectedRows.size > 0 && (
              <Button variant="destructive" size="sm" className="gap-2">
                <Trash className="h-4 w-4" />
                Delete ({selectedRows.size})
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isFetching ? (
          <div className="p-8 text-center">
            <Progress value={45} className="w-full mb-4" />
            <p className="text-gray-500">Loading data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedRows.size === tableData.length && tableData.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  {columns.map((column) => (
                    <TableHead
                      key={column.key}
                      style={{ width: column.width }}
                      className="font-medium text-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        {column.header}
                        {column.filterable && filters[column.key] && (
                          <Badge variant="secondary" className="text-xs">
                            Filtered
                          </Badge>
                        )}
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="w-16">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + 2}
                      className="text-center py-8 text-gray-500"
                    >
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  tableData.map((row) => (
                    <TableRow
                      key={row.id}
                      className={
                        selectedRows.has(row.id) ? "bg-blue-50" : ""
                      }
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.has(row.id)}
                          onCheckedChange={(checked) =>
                            handleRowSelect(row.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      {columns.map((column) => (
                        <TableCell key={column.key} className="text-gray-700">
                          {row[column.key]}
                        </TableCell>
                      ))}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Check className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomTable;