export const apiColumns = [
  {
    field: "name",
    headerName: "Name",
    width: 330,
  },
  {
    field: "ip",
    headerName: "Destination",
    width: 230,
    renderCell: (params) => {
      return <div>{params.row.showDestination && params.row.ip}</div>;
    },
  },
];
export const groupColumns = [
  {
    field: "name",
    headerName: "Name",
    width: 330,
  },
];

export const userColumns = [
  {
    field: "number",
    headerName: "№",
  },

  {
    field: "email",
    headerName: "Email",
    width: 270,
  },
];
