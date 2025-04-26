import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Box, Button, TextField, Typography } from "@mui/material";
import ListMui from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { GET_TODO_LIST, ADD_ITEM_MUTATION, UPDATE_ITEM_MUTATION, DELETE_ITEM_MUTATION } from "./queries";

export default function List() {
  const [itemName, setItemName] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const { data: listResponse, loading, error, refetch } = useQuery(GET_TODO_LIST);
  const [addItem] = useMutation(ADD_ITEM_MUTATION);
  const [updateItem] = useMutation(UPDATE_ITEM_MUTATION);
  const [deleteItem] = useMutation(DELETE_ITEM_MUTATION);

  const handleAddItem = async () => {
    if (!itemName) return;

    await addItem({
      variables: { values: { name: itemName } },
      onCompleted: () => {
        setItemName("");
        refetch();
      },
    });
  };

  const handleEditItem = async (id, name) => {
    setEditingItem({ id, name });
  };

  const handleSaveEdit = async () => {
    if (!editingItem.name) return;

    await updateItem({
      variables: { values: { id: editingItem.id, name: editingItem.name } },
      onCompleted: () => {
        setEditingItem(null);
        refetch();
      },
    });
  };

  const handleDeleteItem = async (id) => {
    await deleteItem({
      variables: { id },
      onCompleted: () => {
        refetch();
      },
    });
  };

  return (
    <Box>
      <Typography color="textColor.main" fontSize={38}>
        Lista de Tarefas
      </Typography>

      <Box display={"flex"} columnGap={4}>
        <TextField
          sx={{ color: "white" }}
          label="Nova tarefa"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          variant="outlined"
        />
        <Button disabled={itemName.length === 0} variant="contained" onClick={handleAddItem}>
          <Typography color="textColor.main" fontSize={14}>
            +Tarefa
          </Typography>
        </Button>
      </Box>

      <ListMui>
        {loading ? (
          <Box>Loading...</Box>
        ) : error ? (
          <Box>Error: {error.message}</Box>
        ) : (
          listResponse?.todoList?.map((item) => (
            <ListItem sx={{ border: 1, p: 1, mb: 1 }} key={item.id}>
              <ListItemButton>
                {editingItem && editingItem.id === item.id ? (
                  <TextField
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    variant="outlined"
                    size="small"
                  />
                ) : (
                  <ListItemText color="textColor" primary={item.name} />
                )}
                <EditIcon color="secondary" onClick={() => handleEditItem(item.id, item.name)} />
                <DeleteIcon sx={{ ml: 2 }} onClick={() => handleDeleteItem(item.id)} />
              </ListItemButton>
            </ListItem>
          ))
        )}
      </ListMui>

      {editingItem && (
        <Box display="flex" justifyContent="center" columnGap={2}>
          <Button variant="contained" onClick={handleSaveEdit}>
            <Typography fontSize={14}>Atualizar Item</Typography>
          </Button>
          <Button variant="outlined" onClick={() => setEditingItem(null)}>
            <Typography fontSize={14}>Cancelar</Typography>
          </Button>
        </Box>
      )}
    </Box>
  );
}
