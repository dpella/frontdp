/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {Box, Button, Stack, Theme, Typography, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, Table, Tooltip} from "@mui/material"
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded'
import { Header } from "./Header"
import { useNavigate } from "react-router-dom"
import { useTheme } from "@mui/material/styles"
import React, { ChangeEvent, useEffect, useState } from "react"
import { useUser } from './UserContext'
import { deleteDataset, getAvailableDatasets } from "../api/request"
import {DatasetInfo} from "../types/interfaces"


/**
 * Properties for the PreviousDatasetsBox constant.
 * @interface
 * @property {DatasetInfo[]} datasets - An array which contains information about all of the datasets' information
 * @property {(dataset: DatasetInfo[]) => void} setDatasets - Function for adding a datasets information to an array of all the datasets available for the Data curator
 * @property {(dataset: DatasetInfo) => void} updateDatasetInfo - Function for updating a specific dataset's information
 * @property {string} theme - The theme of the application
 */
interface IPreviousDatasetsBox {
   datasets: DatasetInfo[]
   setDatasets: (dataset : DatasetInfo[]) => void
   updateDatasetInfo: (updateDatesetInfo: DatasetInfo) => void
}

/**
 * Properties for the AssignAnalyst constant.
 * @interface
 * @property {DatasetInfo[]} datasets - An array which contains information about all of the datasets' information
 * @property {(dataset: DatasetInfo[]) => void} setDatasets - Function for adding a datasets information to an array of all the datasets available for the Data curator
 * @property {string} theme - The theme of the application
 */
interface IAssignAnalyst{
    datasets: DatasetInfo[]
    setDatasets: (dataset : DatasetInfo[]) => void
}

/**
 * Properties for the EditDataset constant.
 * @interface
 * @property {DatasetInfo[]} datasets - An array which contains information about all of the datasets' information
 * @property {(dataset: DatasetInfo[]) => void} setDatasets - Function for adding a datasets information to an array of all the datasets available for the Data curator
 * @property {string} theme - The theme of the application
 */
interface IEditDataset {
    datasets: DatasetInfo[]
    updateDatasetInfo: (updateDatesetInfo: DatasetInfo) => void
}

/**
 * The DCscreenOne component provides the data curator a possibility of uploading a new dataset and also viewing its previous uploaded datasets.
 */
export function DCscreenOne ( { } : { } ) {
    // Access the current user's context to personalize content.
    const { user } = useUser()

    // Using MUI theme for consistent styling across the app
    const theme = useTheme()

    // Navigation hook to navigate between routes
    const navigate = useNavigate()

    // States for handling the file which the curator wants to upload
    const [datasetName, setDataSetName] = useState<string>("")
    const [file, setFile] = useState<File>()
    const handleFile = (e : ChangeEvent<HTMLInputElement> ) => {
        if (e.target.files !== null && e.target.files.length > 0) {
            const file = e.target.files[0];
            const allowedExtensions = /(\.csv)$/i;
            if (!allowedExtensions.exec(file.name)) {
                alert('Invalid file type. Only .csv files are allowed.');
                e.target.value = ''; 
            } else {
                setFile(file);
                setDataSetName(file.name);
            }
        }
    }

    // State for storing all the datasets available for the curator
    const [datasets, setDatasets] = useState<DatasetInfo[]>([])

    /**
     * Effect hook to fetch datasets.
     * It only runs when the user context changes, indicating a login or logout action.
     */
    useEffect(() => {
        const fetchDatasets = async () => {
            if (user) {
                try {
                    const datasets = await getAvailableDatasets(user)
                    setDatasets(datasets)
                } catch (error) {
                    console.error("Error fetching datasets and budgets", error)
                }
            } else {
                console.log("User not logged in")
            }
        }
    
        fetchDatasets()
    }, [user])

    /**
     * Handles updating the list of all of the datasets which is available for the curator
     * @param updatedDataset - The information of the uploaded dataset
     */
    const updateDatasetInfo = (updatedDataset: DatasetInfo) => {
        const updatedDatasets = datasets.map(d => (d.id === updatedDataset.id ? updatedDataset : d))
        setDatasets(updatedDatasets)
    }
    
    return (
    <Stack sx={{background: theme.palette.primary.main, minHeight: '100vh', position: 'relative', alignItems: 'center', spacing: 2,
    }}>
        <Header/>
        <Typography variant="h5" color='white' sx = {{mb: 3, mt: 10, mx: 10}}>Welcome, {user ? user.name : 'User'}</Typography>
            <Typography variant="h5" color='white'>Upload new dataset</Typography>
            <div style={{width: '79%', marginBottom: 20}}></div>
            <Stack direction="row" spacing={2} alignItems="center" sx = {{mb: 5}}>
                <Button variant="contained" component="label" color="secondary">Upload new dataset
                <input hidden
                    id="upload-dataset" name="file" type="file" title="file"
                    onChange={handleFile}
                />
                </Button>
                <Box>
                {!datasetName && <Typography>Click the button to choose a local file (.csv, .tab, .tsv)</Typography>}
                {datasetName && <Typography> <strong> Chosen File: </strong> {datasetName}</Typography>}
                <div style={{width: '100%', border: '1px white solid'}}></div>
                </Box>
                {datasetName && <Button variant="contained" color="secondary" onClick={() => {navigate('/multistep-DC', {state: {from: '/data-curator', name: datasetName, file: file}})}}> Continue </ Button>}
            </Stack>
            <Typography variant="h5" color='white' marginTop={2}>Your datasets</Typography>
            <div style={{width: '100%', marginBottom: 20}}></div>
            <PreviousDataSetsBox datasets={datasets} setDatasets={setDatasets} updateDatasetInfo={updateDatasetInfo}></PreviousDataSetsBox>
    </Stack>
    )
}

/**
 * The PreviousDataSetsBox implement communication with server in order to create new boxes with previous datasets.
 */
const PreviousDataSetsBox : React.FC<IPreviousDatasetsBox>  = ({datasets, setDatasets}) => {
    // Navigation hook to navigate between routes
    const navigate = useNavigate()

    // Access the current user's context to personalize content.
    const { user } = useUser()

    // A constant for handling the deletion of a dataset
    const handleDelete = async (datasetID : number) => {
        //Create a pop up window to ensure that the user really wants to delete the dataset.
        if(window.confirm('Are you sure you want to delete this dataset? Only datasets that have not had analysts use any budget is eligible for deletion.')){
            await deleteDataset(datasetID)
            setDatasets(datasets.filter((dataset) => dataset.id !== datasetID))
        }else{

        }
    }

    return(
        (datasets.length > 0) ? <TableContainer component={Paper} sx={{width: 1000, background: 'transparent'}}>
        <Table sx={{ '.MuiTableCell-root': { color: 'white' } }}>
            <TableHead>
            <TableRow>
                <TableCell>Name of Dataset</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Last updated</TableCell>
                <TableCell style={{paddingLeft:'32px'}}>Assign Analyst</TableCell>
                <TableCell style={{paddingLeft:'32px'}}>Edit Dataset</TableCell>
                <TableCell>Delete</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {datasets.map((dataset) => (
                <TableRow key={dataset.id} sx={{ background: 'transparent' }}>
                <TableCell component="th" scope="row">
                    {dataset.name}
                </TableCell>
                <Tooltip title={"Only the owners are allowed to edit/allocate/delete datasets"}>
                    <TableCell component="th" scope="row">
                        {dataset.owner}
                    </TableCell>
                </Tooltip>
                    <TableCell>
                        {dataset.updated_time === undefined ? undefined : (dataset.updated_time).split('T')[0]}
                    </TableCell>
                    {dataset.owner === user?.handle ? (
                        <TableCell>
                            <Tooltip title="Handle the assignment of analysts">
                                <Button onClick={() => {navigate('/assignanalyst', {state: {from: '/data-curator', privacyNotion: dataset.privacy_notion, cantbeconfused: dataset.id}})}}
                                        variant="contained" component="label" color="secondary"> 
                                    Assign Analyst
                                </Button>
                            </Tooltip>
                        </TableCell>
                    ):(
                        <TableCell style={{paddingLeft:'32px'}}>Not available</TableCell> //This can be changed to allow the user to also see the assigned analysts to the dataset but idk if they should be able to.

                    )}
                    {dataset.owner === user?.handle ? (
                        <TableCell>
                            <Box>
                                <Tooltip title="Edit name and privacy notion information">
                                    <Button onClick={() => {navigate('/editdataset', {state: {from: '/data-curator', dataset: dataset}})}} variant="contained" component="label" color="secondary"> Edit Dataset
                                    </Button>
                                </Tooltip>
                            </Box>
                        </TableCell>
                    ):(
                        <TableCell style={{paddingLeft:'32px'}}>Not available</TableCell>
                    )}
                    {dataset.owner === user?.handle ? (
                        <TableCell>
                            <Tooltip title="Delete the dataset">
                                <Button onClick={() => handleDelete(dataset.id)} startIcon={<DeleteForeverRoundedIcon />} sx={{ minWidth: 0, transition: 'none',color: '#E06666', paddingLeft: 2 }}>
                                </Button>
                            </Tooltip>
                        </TableCell>
                    ):(
                        <TableCell>Not available</TableCell>
                    )}
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer> : <Typography variant="h6"> No datasets uploaded yet on this user </Typography>
    )
}


const AssignAnalyst : React.FC<IAssignAnalyst>  = ({datasets, setDatasets}) => {
    
    const navigate = useNavigate()

    return(
        (datasets.length > 0) ? <TableContainer component={Paper} sx={{width: 568, background: '#A9A9A9'}}>
            <Table sx={{ minWidth: 450 }} size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Name of Dataset</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {datasets.map((dataset) => (
                        <TableRow
                            key={dataset.id}
                            sx={{ background: '#D3D3D3' }}
                        >
                            <TableCell component="th" scope="row">
                                {dataset.name}
                            </TableCell>
                            <TableCell>{dataset.privacy_notion}</TableCell>
                            <TableCell>{dataset.id}</TableCell>
                            <TableCell>
                                <Button variant="contained" color="secondary" onClick={() => {navigate('/assignanalyst', {state: {from: '/data-curator', privacyNotion: dataset.privacy_notion, cantbeconfused: dataset.id}})}}> Assign Analyst </ Button>
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer> : <Typography variant="h6"> No datasets uploaded yet on this user </Typography>
    )

}


const EditDataset : React.FC<IEditDataset>  = ({ datasets, updateDatasetInfo }) => {
    const navigate = useNavigate()
    

    return(
        (datasets.length > 0) ? <TableContainer component={Paper} sx={{width: 568, background: '#A9A9A9'}}>
            <Table sx={{ minWidth: 450 }} size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Name of Dataset</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {datasets.map((dataset) => (
                        <TableRow
                            key={dataset.id}
                            sx={{ background: '#D3D3D3' }}
                        >
                            <TableCell component="th" scope="row">
                                {dataset.name}
                            </TableCell>
                            <TableCell>{dataset.privacy_notion}</TableCell>
                            <TableCell>{dataset.id}</TableCell>
                            <TableCell>
                            <Button variant="contained" color="secondary" onClick={() => {navigate('/editdataset', {state: {from: '/data-curator', dataset: dataset}})}}> Edit Dataset </Button>
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer> : <Typography variant="h6"> No datasets uploaded yet on this user </Typography>
    )
}