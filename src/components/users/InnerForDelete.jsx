import { Button } from "@mui/material";

const InnerForDelete = ({ handleDelete, setOpenModal, id }) => {
  return (
    <div className="modalButton">
      <Button
        size="small"
        variant="contained"
        className="deleteYes"
        onClick={(e) => {
          setOpenModal(false);
          handleDelete(id);
        }}
      >
        YES
      </Button>
      <Button
        size="small"
        variant="contained"
        color="error"
        className="deleteNo"
        onClick={(e) => setOpenModal(false)}
      >
        NO
      </Button>
    </div>
  );
};
export default InnerForDelete;
