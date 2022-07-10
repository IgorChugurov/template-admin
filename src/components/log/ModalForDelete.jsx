import { Box, Button, Modal, Typography } from "@mui/material";
const ModalForDelete = ({ openModal, setOpenModal, deleteLog, currentLog }) => {
  const handleCloseModal = () => setOpenModal(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "white",
    border: "0.5px solid #000",
    boxShadow: 24,
    p: 3,
  };
  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {currentLog
            ? `Delete log for ${currentLog.fileName}?`
            : "Delete all logs?"}
        </Typography>
        <div id="modal-modal-description">
          <div className="modalButton">
            <Button
              size="small"
              variant="contained"
              className="deleteYes"
              onClick={(e) => {
                setOpenModal(false);
                deleteLog(currentLog);
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
        </div>
      </Box>
    </Modal>
  );
};
export default ModalForDelete;
