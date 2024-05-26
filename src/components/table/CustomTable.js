import "./styles.css";
import {
  useMaterialReactTable,
  MaterialReactTable,
} from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material";

const CustomTable = ({
  columns,
  data,
  enableLoading,
  renderRowActions,
  renderTopToolbarCustomActions,
  enableColumnActions,
  enableHiding,
  enableDensityToggle,
  enableFullScreenToggle,
  pageSize,
}) => {
  const theme = createTheme({
    components: {
      MuiTable: {
        styleOverrides: {
          root: {
            fontFamily: "'Poppins', sans-serif",
            zIndex: "1000 !important",
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            fontFamily: "'Poppins', sans-serif",
            zIndex: "1000 !important",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontFamily: "'Poppins', sans-serif",
            zIndex: "1000 !important",
          },
          root: {
            fontFamily: "'Poppins', sans-serif",
            zIndex: "1000 !important",
          },
        },
      },
    },
  });

  const table = useMaterialReactTable({
    columns,
    data: data,
    initialState: {
      showColumnFilters: true,
      // showGlobalFilter: true,
      pagination: { pageSize: pageSize || 10 },
      enableColumnPinning: true,
      columnPinning: {
        right: ["mrt-row-actions"],
      },
    },
    state: {
      isLoading: enableLoading,
      showProgressBars: enableLoading,
    },
    muiLinearProgressProps: { color: "inherit" },
    muiSkeletonProps: { animation: "wave" },
    positionActionsColumn: "last",
    renderRowActions: renderRowActions,
    enableRowActions: true,
    enableFullScreenToggle: enableFullScreenToggle,
    enableDensityToggle: enableDensityToggle,
    enableHiding: enableHiding,
    enableColumnActions: enableColumnActions,
    renderTopToolbarCustomActions: renderTopToolbarCustomActions,
    enablePagination: true,
    enableStickyFooter: true,
    enableStickyHeader: true,
    muiTablePaperProps: ({ table }) => ({
      style: {
        zIndex: table.getState().isFullScreen ? 1001 : 1000,
      },
    }),
    muiTableContainerProps: ({ table }) => ({
      sx: {
        minHeight: table.getState().isFullScreen
          ? "calc(100dvh - 200px - 0.5rem)"
          : "350px",
        height: table.getState().isFullScreen
          ? "100%"
          : "calc(100dvh - 200px - 0.5rem)",
      },
    }),
  });

  return (
    <ThemeProvider theme={theme}>
      <MaterialReactTable table={table} />
    </ThemeProvider>
  );
};

export default CustomTable;
