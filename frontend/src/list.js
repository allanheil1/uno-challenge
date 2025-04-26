import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_TODO_LIST, ADD_ITEM_MUTATION, UPDATE_ITEM_MUTATION, DELETE_ITEM_MUTATION } from "./queries";
import {
  Box,
  Button,
  TextField,
  Typography,
  List as ListMui,
  ListItem,
  ListItemButton,
  ListItemText,
  Card,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material";
import AddTaskDialog from "./components/addTaskDialog";

export default function List() {
  //Estados React
  const [itemName, setItemName] = useState(""); // Para adicionar novas tarefas
  const [filterName, setFilterName] = useState(""); // Para filtrar as tarefas pelo nome
  const [editingItem, setEditingItem] = useState(null); // Para controlar a edição do item
  const [openDialog, setOpenDialog] = useState(false); // Para controlar a exibição do Dialog de adicionar item

  //Queries
  // Utilizando useLazyQuery para que a query seja disparada ao clicar no botão
  const [getTodoList, { data: listResponse, loading: loadingList, error, refetch }] = useLazyQuery(GET_TODO_LIST);

  //Mutations
  const [addItem] = useMutation(ADD_ITEM_MUTATION);
  const [updateItem] = useMutation(UPDATE_ITEM_MUTATION);
  const [deleteItem] = useMutation(DELETE_ITEM_MUTATION);

  // Chamada p/ adicionar um item à lista
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

  // Editar um item
  const handleEditItem = async (id, name) => {
    setEditingItem({ id, name });
  };

  // Chamada p/ editar um item
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

  // Chamada p/ excluir um item
  const handleDeleteItem = async (id) => {
    await deleteItem({
      variables: { id },
      onCompleted: () => {
        refetch();
      },
    });
  };

  // Alterar o campo de filtro
  const handleFilterChange = (event) => {
    setFilterName(event.target.value); // Atualiza o valor do filtro enquanto digita
  };

  const handleFilterClick = () => {
    // Ao clicar no botão "Buscar", chama a query passando o valor do filtro
    getTodoList({ variables: { filter: { name: filterName } } });
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // useEffect que garante que ao renderizar o componente, chamaremos a query de listagem
  useEffect(() => {
    getTodoList({ variables: { filter: { name: filterName } } });
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", rowGap: 2 }}>
      <Typography
        variant="h3"
        sx={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 2,
        }}
      >
        LISTA DE TAREFAS
      </Typography>

      <Button variant="contained" onClick={handleOpenDialog} sx={{ width: "100%", height: 40 }}>
        <Typography color="textColor.main" fontSize={14}>
          + ADICIONAR TAREFA
        </Typography>
      </Button>

      <Box sx={{ display: "flex", columnGap: 4, alignItems: "center" }}>
        <TextField
          placeholder={"Buscar Tarefas..."}
          value={filterName}
          onChange={handleFilterChange}
          variant="outlined"
          fullWidth
          sx={{
            height: 40,
            "& .MuiInputBase-root": { height: "100%" },
            "& .MuiOutlinedInput-root": { paddingTop: "8px", paddingBottom: "8px" },
          }}
        />
        <Button variant="contained" onClick={handleFilterClick} sx={{ width: "100%", height: 40 }}>
          <Typography color="textColor.main" fontSize={14}>
            BUSCAR
          </Typography>
        </Button>
      </Box>

      <Card variant="elevation" elevation={4} sx={{ maxHeight: "60vh", borderRadius: 2, overflow: "auto" }}>
        <ListMui>
          {loadingList ? (
            <Box>Buscando...</Box>
          ) : error ? (
            <Box>Erro: {error.message}</Box>
          ) : listResponse?.todoList?.length === 0 ? (
            <Typography sx={{ textAlign: "center", padding: 4 }}>Nenhuma tarefa encontrada</Typography>
          ) : (
            listResponse?.todoList?.map((item) => (
              <ListItem sx={{ p: 1, mb: 1, maxWidth: "500px" }} key={item.id}>
                <ListItemButton>
                  {editingItem && editingItem.id === item.id ? (
                    <>
                      <TextField
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        variant="outlined"
                        size="small"
                        sx={{ width: "100%" }}
                      />
                      <Tooltip title="Salvar tarefa" arrow>
                        <IconButton color="primary" onClick={handleSaveEdit} sx={{ minWidth: 0, marginLeft: 1 }}>
                          <SaveIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cancelar" arrow>
                        <IconButton color="tertiary" onClick={() => setEditingItem(null)} sx={{ minWidth: 0, marginLeft: 1 }}>
                          <CancelIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : (
                    <ListItemText color="textColor" primary={item.name} sx={{ maxHeight: "100px", overflow: "auto" }} />
                  )}
                  {!editingItem || editingItem.id !== item.id ? (
                    <Tooltip title="Editar tarefa" arrow>
                      <IconButton color="secondary" onClick={() => handleEditItem(item.id, item.name)} sx={{ p: 0 }}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                  <Tooltip title="Excluir tarefa" arrow>
                    <IconButton onClick={() => handleDeleteItem(item.id)} sx={{ ml: 2, p: 0 }}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemButton>
              </ListItem>
            ))
          )}
        </ListMui>
      </Card>

      <AddTaskDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onAdd={handleAddItem}
        itemName={itemName}
        setItemName={setItemName}
      />
    </Box>
  );
}
