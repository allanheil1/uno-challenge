import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_TODO_LIST, ADD_ITEM_MUTATION, UPDATE_ITEM_MUTATION, DELETE_ITEM_MUTATION, COMPLETE_ITEM_MUTATION } from "./queries";
import { useSnackbar } from "./context/SnackbarContext";
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
  Checkbox,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material";
import AddTaskDialog from "./components/addTaskDialog";
import ConfirmationDialog from "./components/confirmationDialog";

export default function List() {
  // Estados React
  const [itemName, setItemName] = useState(""); // Para adicionar novas tarefas
  const [filterName, setFilterName] = useState(""); // Para filtrar as tarefas pelo nome
  const [editingItem, setEditingItem] = useState(null); // Para controlar a edição do item
  const [openDialog, setOpenDialog] = useState(false); // Para controlar a exibição do Dialog de adicionar item
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // Para controlar o modal de confirmação
  const [selectedTask, setSelectedTask] = useState(null); // Tarefa selecionada para marcar como completa
  const [actionType, setActionType] = useState(null);

  // Queries
  const [getTodoList, { data: tarefasResponse, loading: loadingTarefas, error: errorTarefas, refetch: refetchTarefas }] =
    useLazyQuery(GET_TODO_LIST, {
      fetchPolicy: "no-cache",
    });

  // Mutations
  const [addItem] = useMutation(ADD_ITEM_MUTATION);
  const [updateItem] = useMutation(UPDATE_ITEM_MUTATION);
  const [deleteItem] = useMutation(DELETE_ITEM_MUTATION);
  const [completeItem] = useMutation(COMPLETE_ITEM_MUTATION);

  // Context
  const { openSnackbar } = useSnackbar();

  // Chamada p/ adicionar um item à lista
  const handleAddItem = async () => {
    if (!itemName) return;

    await addItem({
      variables: { values: { name: itemName } },
      onCompleted: (data) => {
        setItemName("");
        setOpenDialog(false);
        refetchTarefas();
        openSnackbar(data.addItem.message, data.addItem.status);
      },
      onError: (err) => {
        openSnackbar("Ocorreu um erro ao adicionar a tarefa", "error");
      },
    });
  };

  // Chamada p/ editar um item
  const handleSaveEdit = async () => {
    if (!editingItem.name) return;

    await updateItem({
      variables: { values: { id: editingItem.id, name: editingItem.name } },
      onCompleted: (data) => {
        setEditingItem(null);
        refetchTarefas();
        openSnackbar(data.updateItem.message, data.updateItem.status);
      },
      onError: (err) => {
        openSnackbar("Ocorreu um erro ao atualizar a tarefa", "error");
      },
    });
  };

  // Chamada p/ excluir um item
  const handleDeleteItem = async (id) => {
    await deleteItem({
      variables: { id },
      onCompleted: (data) => {
        refetchTarefas();
        openSnackbar(data.deleteItem.message, data.deleteItem.status);
        setOpenConfirmDialog(false);
      },
      onError: (err) => {
        openSnackbar("Ocorreu um erro ao excluir a tarefa", "error");
        setOpenConfirmDialog(false);
      },
    });
  };

  // Editar um item
  const handleEditItem = async (id, name) => {
    setEditingItem({ id, name });
  };

  // Chamada p/ marcar um item como completo
  const handleCompleteItem = async (id) => {
    await completeItem({
      variables: { id },
      onCompleted: (data) => {
        refetchTarefas();
        openSnackbar(data.completeItem.message, data.completeItem.status);
        setOpenConfirmDialog(false); // Fecha o modal após a confirmação
      },
      onError: (err) => {
        openSnackbar("Ocorreu um erro ao concluir a tarefa", "error");
        setOpenConfirmDialog(false);
      },
    });
  };

  // Alterar o campo de filtro
  const handleFilterChange = (event) => {
    setFilterName(event.target.value);
  };

  // Chamada do botão Buscar
  const handleFilterClick = () => {
    getTodoList({ variables: { filter: { name: filterName } } });
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Função para abrir o modal de confirmação
  const handleOpenConfirmDialog = (task, type) => {
    setSelectedTask(task); // Salva a tarefa selecionada
    setActionType(type); // Define o tipo da ação (completar ou excluir)
    setOpenConfirmDialog(true); // Abre o modal
  };

  // Função para fechar o modal de confirmação
  const handleCloseConfirmDialog = (_event, reason) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }
    setOpenConfirmDialog(false);
  };

  //Após o modal sumir, limpa os campos de task selecionada e actiontype
  const handleExitedConfirmDialog = () => {
    setSelectedTask(null);
    setActionType(null);
  };

  // useEffect que garante a primeira busca de tarefas
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
          + ADICIONAR
        </Typography>
      </Button>

      <Box sx={{ display: "flex", columnGap: 4, alignItems: "center" }}>
        <TextField
          placeholder={"Filtrar por nome..."}
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
          {loadingTarefas ? (
            <Box>Buscando...</Box>
          ) : errorTarefas ? (
            <Box>Erro: {errorTarefas.message}</Box>
          ) : tarefasResponse?.todoList?.length === 0 ? (
            <Typography sx={{ textAlign: "center", padding: 4 }}>Nenhuma tarefa encontrada</Typography>
          ) : (
            tarefasResponse?.todoList?.map((item) => (
              <ListItem sx={{ p: 1, mb: 1, maxWidth: "500px" }} key={item.id}>
                <ListItemButton>
                  <Tooltip title={!item.completed ? "Concluir tarefa" : "Tarefa concluída"}>
                    <Checkbox
                      checked={item.completed}
                      onChange={() => {
                        if (!item.completed) {
                          handleOpenConfirmDialog(item, "complete");
                        }
                      }}
                    />
                  </Tooltip>

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
                        <IconButton
                          color="primary"
                          onClick={handleSaveEdit}
                          sx={{ minWidth: 0, marginLeft: 1 }}
                          disabled={editingItem && editingItem.name.trim() === ""}
                        >
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
                    <IconButton onClick={() => handleOpenConfirmDialog(item, "delete")} sx={{ ml: 2, p: 0 }}>
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

      <ConfirmationDialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        onConfirm={() => {
          if (actionType === "complete") {
            handleCompleteItem(selectedTask.id);
          } else if (actionType === "delete") {
            handleDeleteItem(selectedTask.id);
          }
        }}
        onExited={handleExitedConfirmDialog}
        actionType={actionType}
      />
    </Box>
  );
}
