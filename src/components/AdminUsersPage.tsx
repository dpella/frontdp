/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React, { useState, useEffect } from 'react';
import { Container, Table, TableHead, TableRow, TableCell, TableBody, Paper, Stack, useTheme, Typography, Box, Fab, Button, FormControl, Select, MenuItem, SelectChangeEvent, IconButton, Tooltip } from '@mui/material';
import { Header } from './Header';
import { useUser } from './UserContext';
import { deleteUser, getUsers, regUser, updateUser } from '../api/request';
import { User } from '../types/interfaces';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import TextFieldAdmin from './TextFieldAdmin';
import SearchBar from './SearchBar';

/**
 * AdminUsersPage is a component that manages the user administration interface.
 * It allows for adding, editing, and deleting users, interacting with the API to perform these operations.
 */
const AdminUsersPage: React.FC = () => {
  // Stores an array of User objects fetched from the server.
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Using MUI theme for consistent styling across the app
  const theme = useTheme();

  // Access the current user's context to personalize content.
  const { user } = useUser();

  // Static list of user roles available for assignment.
  const availableRoles = ['Admin', 'Curator', 'Analyst'];

  // Boolean flag to control the visibility of the add new user form.
  const [isAddingUser, setIsAddingUser] = useState(false);

  // Holds the state for the new user form.
  const [newUser, setNewUser] = useState({ handle: '', name: '', password: '', roles: '' });

  // Holds the state for editing an existing user.
  const [editingUser, setEditingUser] = useState({ handle: '', name: '', roles: '' });

  /**
   * Asynchronously registers a new user. It validates the input fields and sends a registration request.
   * Resets the newUser state and hides the add user form upon successful registration.
   * Alerts the user in case of missing fields or API errors.
   */
  const sendRegRequest = async () => {
    if (!newUser.handle || !newUser.name || !newUser.password || !newUser.roles) {
        alert('All fields must be filled in before adding a new user.');
        return;
    }
    try {
      await regUser(newUser.handle, newUser.name, newUser.password, newUser.roles);
      setNewUser({ handle: '', name: '', password: '', roles: '' }); 
      setIsAddingUser(false); 
    } catch (error) {
        console.error(error);
        alert(error);
    }
  };

  /**
   * Sets the isAddingUser state to true, which triggers the UI to display the form for adding a new user.
   */
  const handleAddUserClick = () => {
    setIsAddingUser(true);
  };

  /**
   * Resets the newUser form and sets isAddingUser to false, hiding the add user form.
   */
  const handleCancel = () => {
    setNewUser({ handle: '', name: '', password: '', roles: '' });
    setIsAddingUser(false);
  };

  /**
   * Updates the newUser state with values from form inputs.
   * @param prop The property of the user object to update (e.g., 'name', 'handle').
   */
  const handleNewUserInfoChange = (prop: keyof typeof newUser) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({ ...newUser, [prop]: event.target.value });
  };

  /**
   * Handles role changes for both new and currently editing users.
   * Updates the corresponding state.
   * @param event - The select change event containing the new role value.
   */
  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    if (editingUser.handle) {
      setEditingUser(prev => ({
        ...prev,
        roles: event.target.value as string
      }));
    } else {
      setNewUser(prevNewUser => ({
        ...prevNewUser,
        roles: event.target.value as string
      }));
    }
  };
  
  /**
   * Fetches and sets the list of users upon component initialization or when triggering conditions change.
   */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        const filteredUsers = fetchedUsers.filter(user => user.handle !== 'root'); 
        setUsers(filteredUsers);
        setAllUsers(filteredUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, [isAddingUser, editingUser]); 

  /**
   * Prepares the user data for editing by setting the editingUser state.
   * @param userToEdit - The user object that is to be edited.
   */
  const handleEditClick = (userToEdit:User) => {
    setEditingUser({
      handle: userToEdit.handle,
      name: userToEdit.name,
      roles: userToEdit.roles.join(', ')
    });
  };
  
  /**
   * Confirms and submits the edits made to a user.
   * Validates the form fields before sending the update request.
   * Resets the editing states upon successful update or logs an error on failure.
   */
  const handleConfirmEdit = async () => {
    if (!editingUser.handle || !editingUser.name || !editingUser.roles) {
      alert('All fields must be filled in before editing a user.');
      return;
    }
    try {
      await updateUser(editingUser.handle, editingUser.name, editingUser.roles);
      setEditingUser({ handle: '', name: '', roles: '' });
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  /**
   * Asynchronously deletes a user after confirmation.
   * Updates the list of users by filtering out the deleted user.
   * @param userHandle - The handle of the user to delete.
   */
  const handleDeleteUser = async (userHandle:string) => {
    if (window.confirm(`Are you sure you want to delete the user ${userHandle}?`)) {
      try {
        await deleteUser(userHandle);
        setUsers(users.filter((user) => user.handle !== userHandle));
        setAllUsers(users.filter((user) => user.handle !== userHandle));
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert('Failed to delete the user.');
      }
    }
  };
  
  /**
   * Cancels the editing of a user, resetting the editingUser state.
   */
  const handleCancelEdit = () => {
    setEditingUser({ handle: '', name: '', roles: '' });
  };

  /**
     * Handles the search operation in the user list.
     * @param searchTerm The text to search for within user names.
     */
  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
        setUsers(allUsers);
    } else {
        const filteredUsers = allUsers.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setUsers(filteredUsers);
    }
};

  return (
    <Stack
    sx={{
      background: theme.palette.primary.main,
      minHeight: '100vh',
      position: 'relative',
      alignItems: 'center',
      color: 'white',
    }}
  >
    <Header />
    <Container maxWidth="lg">
      <Box textAlign="center" sx={{ my: 2 }}>
        <Typography variant="h5" color="white">
          Welcome, {user ? user.name : 'User'}
        </Typography>
        <Typography variant="h4" color="white" sx={{ mb: 2, marginTop: 2 }}>
          Handle Users
        </Typography>
        <Box display="flex" justifyContent="flex-end">
            <SearchBar onSearch={handleSearch} />
        </Box>
      </Box>
        <Paper sx={{width: '100%', overflow: 'hidden', background: 'transparent', boxShadow: 'none' }}>
        <Table sx={{ '.MuiTableCell-root': { color: 'white' } }}>
          <TableHead>
            <TableRow>
              <TableCell width="18%">Username</TableCell>
              <TableCell width="18%">Name</TableCell>
              <TableCell width="18%">Roles</TableCell>
              <TableCell width="18%">Created time</TableCell>
              <TableCell width="18%">Updated time</TableCell>
              <TableCell width="10%">Options</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.handle}
                sx={{
                  '&:hover': {
                    bgcolor: editingUser.handle === user.handle ? 'transparent' : 'rgba(0, 0, 0, 0.08)'
                  }
                }}>
                <TableCell> 
                {user.handle}
                </TableCell>

                <TableCell> {editingUser.handle === user.handle ? (
                <TextFieldAdmin
                value={editingUser.name}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                placeholder='Name'
                 />
                ) : (
                  user.name
                )}</TableCell>
                
                <TableCell>
                  {editingUser.handle === user.handle ? (
                    <FormControl fullWidth>
                    <Select
                    labelId="role-select-label"
                    onChange={handleRoleChange}
                    id="role-select"
                    value={editingUser.roles}
                    displayEmpty
                    size="small"
                    renderValue={(selected) => {
                        if (selected === "") {
                          return <span style={{ color: theme.palette.grey[500] }}>Role</span>;
                        }
                        return selected;
                      }}
                    sx={{ color: 'black', backgroundColor: 'white'}}
                    >
                     <MenuItem disabled value="" style={{ color: theme.palette.grey[500] }}>
                        <em>Role</em>
                    </MenuItem>
                    {availableRoles.map((role) => (
                        <MenuItem key={role} value={role} sx={{ color: theme.palette.text.primary }}>
                        {role}
                      </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                  ) : (
                    user.roles.join(', ')
                  )}
                </TableCell>
                <TableCell>{user.created_time === undefined ? undefined : (user.created_time).split('T')[0]}</TableCell>
                <TableCell>{user.updated_time === undefined ? undefined : (user.updated_time).split('T')[0]}</TableCell>
                <TableCell>
                  {editingUser.handle === user.handle ? (
                    <>
                      <IconButton 
                        sx={{ color: theme.palette.success.main }}
                        onClick={handleConfirmEdit}
                      >
                        <CheckIcon />
                      </IconButton>
                      <IconButton 
                        onClick={handleCancelEdit}
                        sx={{ color: theme.palette.error.main }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </>
                  ) : (
                    <>
                    <Tooltip title="Edit user" >
                    <IconButton 
                      onClick={() => handleEditClick(user)}
                      sx={{ color: 'white' }}
                    >
                    <EditIcon />
                    </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete user" >
                    <IconButton 
                    onClick={() => handleDeleteUser(user.handle)}
                    sx={{ color: 'white' }}
                    >
                    <DeleteIcon />
                    </IconButton>
                    </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
             {isAddingUser && (
                <TableRow sx={{ '&:hover': { bgcolor: 'transparent' } }}>
                <TableCell>
                <TextFieldAdmin
                   value={newUser.handle}
                   onChange={handleNewUserInfoChange('handle')}
                   placeholder='UserName'
                    />
                </TableCell>
                <TableCell>
                <TextFieldAdmin
                    value={newUser.name}
                    onChange={handleNewUserInfoChange('name')}
                    placeholder='Name'
                    />
                </TableCell>
                <TableCell>
                <FormControl fullWidth>
                    <Select
                    labelId="role-select-label"
                    onChange={handleRoleChange}
                    id="role-select"
                    value={newUser.roles}
                    displayEmpty
                    size="small"
                    renderValue={(selected) => {
                        if (selected === "") {
                          return <span style={{ color: theme.palette.grey[500] }}>Role</span>;
                        }
                        return selected;
                      }}
                    sx={{ color: 'black', backgroundColor: 'white'}}
                    >
                     <MenuItem disabled value="" style={{ color: theme.palette.grey[500] }}>
                        <em>Role</em>
                    </MenuItem>
                    {availableRoles.map((role) => (
                        <MenuItem key={role} value={role} sx={{ color: theme.palette.text.primary }}>
                        {role}
                      </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </TableCell>
                <TableCell>
                <TextFieldAdmin
                    value={newUser.password}
                    onChange={handleNewUserInfoChange('password')}
                    placeholder='Password'
                    />
                </TableCell>
                <TableCell></TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
      <Box textAlign="center" sx={{ mt: 2 }}>
        {isAddingUser ? (
          <>
            <Button 
              variant="contained" 
              color='secondary' 
              onClick={sendRegRequest}
              sx={{ marginRight: '8px' }} 
            >
              Confirm
            </Button>
            <Button 
              variant="contained" 
              color="error"
              onClick={handleCancel}
              sx={{'&:hover': {
                backgroundColor: theme.palette.error.dark
              },}} 
            >
              Cancel
            </Button>
          </>
        ) : (
          <Fab color="secondary" aria-label="add" size='small' onClick={handleAddUserClick}>
            <AddIcon />
          </Fab>
        )}
      </Box>
    </Container>
    </Stack>
  );
};
export default AdminUsersPage;