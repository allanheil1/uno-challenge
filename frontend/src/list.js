import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TODO_LIST, ADD_ITEM_MUTATION, UPDATE_ITEM_MUTATION, DELETE_ITEM_MUTATION } from "./queries";
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List as ListMui,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";

export default function List() {
  const [itemName, setItemName] = useState(""); // Para adicionar novas tarefas
  const [filterName, setFilterName] = useState(""); // Para filtrar as tarefas pelo nome
  const [editingItem, setEditingItem] = useState(null); // Para controlar a edição do item
  const [openDialog, setOpenDialog] = useState(false); // Para controlar a exibição do Dialog de adicionar item

  const {
    data: listResponse,
    loading: loadingList,
    error,
    refetch,
  } = useQuery(GET_TODO_LIST, {
    variables: { filter: { name: filterName } }, // Passa o filtro de nome para a query
  });

  const [addItem] = useMutation(ADD_ITEM_MUTATION);
  const [updateItem] = useMutation(UPDATE_ITEM_MUTATION);
  const [deleteItem] = useMutation(DELETE_ITEM_MUTATION);

  // Função de chamada p/ adicionar um item à lista
  const handleAddItem = async () => {
    if (!itemName) return;

    await addItem({
      variables: { values: { name: itemName } },
      onCompleted: () => {
        setItemName("");
        setOpenDialog(false);
        refetch();
      },
    });
  };

  // Função para editar um item
  const handleEditItem = async (id, name) => {
    setEditingItem({ id, name });
  };

  // Função de chamada p/ editar um item
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

  // Função de chamada p/ excluir um item
  const handleDeleteItem = async (id) => {
    await deleteItem({
      variables: { id },
      onCompleted: () => {
        refetch();
      },
    });
  };

  // Função para alterar o nome do filtro
  const handleFilterChange = (event) => {
    setFilterName(event.target.value); // Atualiza o valor do filtro enquanto digita
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box>
      <Typography
        variant="h3"
        sx={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 2,
          marginBottom: "20px",
        }}
      >
        LISTA DE TAREFAS
      </Typography>

      <Box display={"flex"} columnGap={4}>
        <TextField
          sx={{ color: "white" }}
          label="Buscar tarefas"
          value={filterName}
          onChange={handleFilterChange}
          variant="outlined"
          fullWidth
        />

        <Button variant="contained" onClick={handleOpenDialog} sx={{ width: "100%" }}>
          <Typography color="textColor.main" fontSize={14}>
            + Tarefa
          </Typography>
        </Button>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
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
          <Button onClick={handleCloseDialog} color="tertiary">
            Cancelar
          </Button>
          <Button onClick={handleAddItem} color="primary" disabled={itemName.trim() === ""}>
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      <ListMui>
        {loadingList ? (
          <Box>Carregando...</Box>
        ) : error ? (
          <Box>Erro: {error.message}</Box>
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
