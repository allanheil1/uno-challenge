import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@mui/material";

export default function ConfirmationDialog({ open, onClose, onConfirm, actionType, onExited }) {
  const getMessage = () => {
    switch (actionType) {
      case "complete":
        return "Deseja marcar esta tarefa como concluída?";
      case "delete":
        return "Deseja excluir esta tarefa?";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onClose={onClose} disableEscapeKeyDown TransitionProps={{ onExited }}>
      <DialogTitle>Confirmar ação</DialogTitle>
      <DialogContent>
        <Typography>{getMessage()}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="primary">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
