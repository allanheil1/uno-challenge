import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";

export default function AddTaskDialog({ open, onClose, onAdd, itemName, setItemName }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Nome da tarefa"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          variant="outlined"
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="tertiary">
          CANCELAR
        </Button>
        <Button onClick={onAdd} color="primary" disabled={itemName.trim() === ""}>
          ADICIONAR
        </Button>
      </DialogActions>
    </Dialog>
  );
}
