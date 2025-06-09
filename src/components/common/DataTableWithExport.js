import React, { useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { handleDeleteRequest } from '../../api/apiHelper'; // adjust path as needed

const DataTableWithExport = ({
  columns,
  data,
  csvFileName = "data.csv",
  excelFileName = "data.xlsx",
  pdfFileName = "data.pdf",
  searchPlaceholder = "Search...",
  paginationRowsPerPageOptions = [50, 300, 500, 1000],
  defaultRowsPerPage = 50,
  title = "",
  apiUrl,
  modal = "User",
  token,
  onBulkDeleteSuccess = () => {},
  onBulkDeleteError = () => {},
}) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clearSelectedRows, setClearSelectedRows] = useState(false);

  // Custom heading for export
  const customHeading = ["Home"];

  // Filtered data
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    return data.filter(row =>
      Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, data]);

  // Only export columns that are visible and have a selector
  const exportableColumns = columns.filter(
    col => typeof col.selector === "function"
  );
  const exportHeaders = exportableColumns.map(col => ({
    label: col.name,
    key: col.name,
  }));
  const exportData = filteredData.map(row => {
    const obj = {};
    exportableColumns.forEach(col => {
      obj[col.name] = col.selector(row);
    });
    return obj;
  });

  // Centered heading row for CSV/Excel
  const headingRow = [
    ...Array(Math.floor(exportHeaders.length / 2)).fill(""),
    customHeading[0],
    ...Array(Math.ceil(exportHeaders.length / 2) - 1).fill("")
  ];

  // CSV Export with centered heading
  const csvDataWithHeading = [
    headingRow, // centered heading row
    exportHeaders.map(h => h.label), // column headers
    ...exportData.map(row => exportHeaders.map(h => row[h.key])) // data rows
  ];

  // Excel Export with centered heading
  const handleExportExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      headingRow,
      exportHeaders.map(h => h.label),
      ...exportData.map(row => exportHeaders.map(h => row[h.key]))
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, excelFileName);
  };

  // PDF Export with centered heading
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(14);
    doc.text(customHeading[0], pageWidth / 2, 15, { align: 'center' }); // Centered
    const tableColumn = exportHeaders.map(h => h.label);
    const tableRows = exportData.map(row => exportHeaders.map(h => row[h.key]));
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });
    doc.save(pdfFileName);
  };

  // Multiple Delete Handler
  const handleMultiDelete = async () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one row to delete.");
      return;
    }
    const ids = selectedRows.map(r => r.id);
    setIsLoading(true);
    try {
      await handleDeleteRequest({
        apiUrl,
        ids,
        modal,
        token,
        confirmMessage: `Are you sure you want to delete ${ids.length} selected item(s)?`,
        onSuccess: () => {
          onBulkDeleteSuccess();
          setClearSelectedRows(true); // <-- Reset selection after success
        },
        onError: onBulkDeleteError,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Multiple Send Message Handler
  const handleMultiSendMessage = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one row to send a message.");
      return;
    }
    alert(`Send message to: ${selectedRows.map(r => r.name || r.email || r.mobile).join(", ")}`);
    // Replace with your actual send message logic
  };

  // Multiple Edit Handler
  const handleMultiEdit = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one row to edit.");
      return;
    }
    if (selectedRows.length > 5) {
      alert("You can edit a maximum of 5 users at a time.");
      return;
    }
    selectedRows.forEach(row => {
      // Adjust the URL as per your edit page route
      window.open(`/userAdd?id=${row.id}`, '_blank', 'width=1100,height=700');
    });
  };

  return (
    <div>
      {/* {title && (
        <h4 className="mb-3" style={{ fontWeight: 600, color: "#2c3e50" }}>
          {title}
        </h4>
      )} */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control w-auto"
          placeholder={searchPlaceholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ minWidth: 250 }}
        />
        <div>
          {/* Show these buttons only if at least one row is selected */}
          <span
            style={{
              opacity: selectedRows.length > 0 ? 1 : 0,
              transition: "opacity 0.3s",
              pointerEvents: selectedRows.length > 0 ? "auto" : "none"
            }}
          >
            <button className="btn btn-outline-warning btn-sm mr-2" onClick={handleMultiEdit}>
              Edit Selected
            </button>
            <button className="btn btn-outline-danger btn-sm mr-2" onClick={handleMultiDelete} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete Selected"}
            </button>
            <button className="btn btn-outline-primary btn-sm mr-2" onClick={handleMultiSendMessage}>
              Send Message
            </button>
          </span>
          <CSVLink
            data={csvDataWithHeading}
            filename={csvFileName}
            className="btn btn-success btn-sm mr-2"
          >
            Export CSV
          </CSVLink>
          <button className="btn btn-info btn-sm mr-2" onClick={handleExportExcel}>
            Export Excel
          </button>
          <button className="btn btn-danger btn-sm mr-2" onClick={handleExportPDF}>
            Export PDF
          </button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        paginationPerPage={rowsPerPage}
        paginationRowsPerPageOptions={paginationRowsPerPageOptions}
        highlightOnHover
        striped
        responsive
        persistTableHead
        noDataComponent="No data found."
        selectableRows
        onSelectedRowsChange={({ selectedRows }) => setSelectedRows(selectedRows)}
        clearSelectedRows={clearSelectedRows}
        onChangePage={page => setCurrentPage(page)}
        onChangeRowsPerPage={(newPerPage, page) => {
          setRowsPerPage(newPerPage);
          setCurrentPage(page);
        }}
      />
    </div>
  );
};

export default DataTableWithExport;