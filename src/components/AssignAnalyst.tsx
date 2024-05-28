/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {allocation, datasetBudgetInfo, totalBudgetsTest, User} from "../types/interfaces"
import Header from "./Header"
import {useLocation, useNavigate} from "react-router-dom"
import {useTheme} from "@mui/material/styles"
import React, {useEffect, useState} from "react"
import {
    allocateBudget,
    allocateBudgetPureDP,
    deallocateBudget,
    getSpecificDataSetBudget,
    getTotalDatasetBudget, getUsers, updateBudget
} from "../api/request"
import {
    Box,
    Button,
    Container,
    Fab, FormControl,
    Grid, MenuItem,
    Paper, Select,
    Stack,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Typography
} from "@mui/material"
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit";
import {red} from "@mui/material/colors";
interface IAssignmentOfAnalyst {
    index: number
    name:string[]
    epsilon:number[]
    delta:number[]
    setName: ( nameList : string[]) => void
    setEpsilon: ( epsilonList : number[]) => void
    setDelta: ( deltaList : number[]) => void
    privacyNotion: string
    users: User[]
    budget: totalBudgetsTest
    assignedAnalysts: allocation[]

}

interface IAssignedAnalyst{
    assignedAnalysts: allocation[]
    setAssignedAnalyst: (assignedAnalyst : allocation[]) => void
    datasetID:number
    refresh:number
    setRefresh: (prev:number) => void

}









export function AssignAnalyst () {


    const theme = useTheme()
    const location = useLocation()
    const [datasetID,setDataSetID] = useState<number>(0)
    const [nRows, setNRows] = useState<number>(1)
    const [name, setName] = useState<string[]>([''])
    const [epsilon, setEpsilon] = useState<number[]>([0])
    const [delta, setDelta] = useState<number[]>([0])
    const [assignedAnalysts, setAssignedAnalysts] = useState<allocation[]>([])
    const navigate = useNavigate()
    const [privacynotion, setPrivacyNotion] = useState<string>('')
    const [refresh, setRefresh] = useState<number>(0)
    const [users, setUsers] =  useState<User[]>([])
    const [filteredUsers, setfilteredUsers] =  useState<[]>([])
    const [totalBudget, setTotalBudget] = useState<totalBudgetsTest>({
        total: {
            epsilon: 0,
            delta: 0
        },
        allocated: {
            "epsilon": 0,
            "delta": 0,
        },
        consumed: {
            "epsilon": 0,
            "delta": 0,
        }

    })


    /**
     * Obtains relevant information from previous state to localize which type of screen should be displayed.
     */
    useEffect(() => {
        if (location.state) {
            setPrivacyNotion(location.state.privacyNotion)
            setDataSetID(location.state.cantbeconfused)
        }
    }, [])


    /**
     * Fetches users.
     */
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await getUsers()
                setUsers(fetchedUsers)
            } catch (error) {
                console.error('Failed to fetch users:', error)
            }
        }
        fetchUsers()
    },[])


    /**
     * Fetches budget across users.
     */
    useEffect(() => {
            const fetchbudgetacrossusers = async () => {
                try {
                    const usersallocatedbudgets = await getSpecificDataSetBudget(location.state.cantbeconfused)
                    setAssignedAnalysts(usersallocatedbudgets)
                } catch (error) {
                    console.error("Error fetching datasets and budgets", error)
                }
            }
            fetchbudgetacrossusers()


    }, [refresh])


    /**
     * Fetches the total budget of the dataset.
     */
    useEffect(() => {
        const fetchtotalBudget = async () => {
            try {
                const totalBudgets = await getTotalDatasetBudget(location.state.cantbeconfused)
                setTotalBudget(totalBudgets)
            } catch (error) {
                console.error("Error fetching datasets and budgets", error)
            }
        }
        fetchtotalBudget()
    }, [refresh])


    /**
     * Updates the amount of rows where the user is asked to enter the budget of the corresponding anaylst.
     * @param event When the user clicks the + button a new row is added, clicking - button removes a row.
     */

    

    const handleNewRow = (event: React.MouseEvent<HTMLButtonElement>) => {
        setNRows(nRows+1)
        setName(prevName => [...prevName, ''])
        setEpsilon(prevEpsilon => [...prevEpsilon, 0])
        setDelta(prevDelta => [...prevDelta, 0])
    }

    const handleRowDeletion = (event: React.MouseEvent<HTMLButtonElement>) => {
        if(nRows>1){
            const updateName = name.slice(0,-1)
            const updateEpsilon = epsilon.slice(0,-1)
            const updateDelta = delta.slice(0,-1)

            setNRows(nRows-1)
            setName(updateName)
            setEpsilon(updateEpsilon)
            setDelta(updateDelta)


        }}


    /**
     * Makes an API call to allocate budget to the analysts the user has inputed. assignAnalystPureDP works similarly.
     * @param user Name of the user which you want to allow to have access to it and run queries.
     * @param datasetID
     * @param epsilon
     * @param delta
     */
    const assignAnalyst = async (user:string,datasetID:number,epsilon:number,delta:number) => {
        try {
            await allocateBudget(user,datasetID,epsilon,delta)
        }catch (error){
            console.error('Failed to assign analyst',error)
        }

    }

    const assignAnalystPureDP = async (user:string,datasetID:number,epsilon:number) => {
        try {
            await allocateBudgetPureDP(user,datasetID,epsilon)
        }catch (error){
            console.error('Failed to assign analyst',error)
        }

    }

    //Current implementation can create a potential bug without being able to carry out correct testing right now
    const handleAssignAnalyst = (event: React.MouseEvent<HTMLButtonElement>) => {


        if(privacynotion === "PureDP"){
            for (let i = 0; i<name.length; i++){
                assignAnalystPureDP(name[i],datasetID,epsilon[i])
            }


        }else{
            for (let i = 0; i<name.length; i++){
                assignAnalyst(name[i],datasetID,epsilon[i],delta[i])}

    

    }
       setRefresh(prev => prev + 1)
        setName([])
        setNRows(0)
        setEpsilon([])
        setDelta([])
    }















    return (
        <Stack sx={{ background: theme.palette.primary.main, minHeight: '100vh' }}>
            <Header />

            <Stack flexDirection="row" justifyContent={"center"}>
                <Box marginRight={2}>
                    <Typography borderBottom={1} marginY={2} marginX={3} sx={{fontSize: '30px'}}>Total Budget</Typography>
                    <Typography marginX={3} sx={{fontSize: '20px'}} >Epsilon: {totalBudget.total.epsilon} {totalBudget.total.delta ? ( <> Delta: {totalBudget.total.delta} </>) : null } </Typography>

                </Box>
                <Box marginRight={2}>
                    <Typography borderBottom={1} marginY={2} marginX={3} sx={{fontSize: '30px'}} >Budget left to allocate</Typography>
                    <Typography marginX={3} sx={{fontSize: '20px'}} >Epsilon: {totalBudget.total.epsilon - totalBudget.allocated.epsilon} {totalBudget.total.delta - totalBudget.allocated.delta ? ( <> Delta: {totalBudget.total.delta - totalBudget.allocated.delta} </>) : null } </Typography>

                </Box>
            </Stack>



            <Grid container>
                <Grid item xs={12} md={6}>
                    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'left' }}>
                        <h1 className="center maintext"> Assign new analysts </h1>
                        {[...Array(nRows)].map((_, index) => (
                            <AssignmentOfAnalyst
                                key={index}
                                index={index}
                                name={name}
                                epsilon={epsilon}
                                delta={delta}
                                privacyNotion={privacynotion}
                                setName={setName}
                                setEpsilon={setEpsilon}
                                setDelta={setDelta}
                                users={users}
                                budget={totalBudget}
                                assignedAnalysts={assignedAnalysts}
                            />
                        ))}
                        <div style={{ marginTop: '15px' }}>
                            <Fab color="error" size="small" sx={{ marginRight: 2 }} onClick={handleRowDeletion}>
                                <RemoveCircleIcon style={{ fill: '#E06666', stroke: '#FFFFFF', strokeWidth: 2 }} />
                            </Fab>
                            <Fab color="secondary" size="small" sx={{ color: '#FFFFFF' }} onClick={handleNewRow}>
                                <AddIcon />
                            </Fab>
                        </div>
                        <div style={{ marginTop: '30px' }}>
                            <Button variant="contained" color="secondary" className="navigation-button" onClick={handleAssignAnalyst}> Assign Analysts </Button>
                        </div>
                    </Container>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'right' }}>
                        <h1 className="center maintext"> Assigned analysts </h1>
                        <div style={{ width: '79%', marginBottom: 20 }}></div>
                        <AssignedAnalystBoxes assignedAnalysts={assignedAnalysts} setAssignedAnalyst={setAssignedAnalysts} datasetID={datasetID} refresh={refresh} setRefresh={setRefresh} />
                    </Container>
                </Grid>
            </Grid>

            <div style={{ marginTop: '400px', marginLeft: '100px' }}>
                <Button variant="contained" color="secondary" className="navigation-button" onClick={() => { navigate('/data-curator') }}> Back </Button>
            </div>
        </Stack>
    );
}


const AssignedAnalystBoxes : React.FC<IAssignedAnalyst>  = ({assignedAnalysts, setAssignedAnalyst,datasetID,refresh,setRefresh}) => {

    const [handleEpsilonChange, setHandleEpsilonChange] = useState<number>(0)
    const [handleDeltaChange, setDeltaChange] = useState<number>()
    const [editRow,setEditRow] = useState<number>()





    const handleDelete = async (userHandle: string, datasetId:number) => {
        await deallocateBudget(userHandle,datasetId)
        setAssignedAnalyst(assignedAnalysts.filter((deallocate) => deallocate.user !== userHandle))
        setRefresh(refresh + 1)

    }

    const handleEditMode = (row:number) => {
        setEditRow(row)
    }

    const reset = () => {
        setEditRow(undefined)
        setRefresh(refresh + 1)
    }

    const handlenewEpsilonChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setHandleEpsilonChange(Number(event.target.value))
    }

    const handlenewDeltaChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setDeltaChange(Number(event.target.value))

    }


    const handleUpdateBudget = async (userHandle: string, datasetId:number,epsilon:number,delta?:number) => {
        await updateBudget(userHandle,datasetId,epsilon,delta)
        setRefresh(refresh + 1)
        reset()

    }

    return(
        (assignedAnalysts.length > 0) ? <TableContainer component={Paper} sx={{width: 568, background: '#A9A9A9', color:'white'}}>
        <Table sx={{ minWidth: 450, color:'white' }} size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Name of Analyst</TableCell>
                        <TableCell>Allocated budget</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {assignedAnalysts.map((a,row) => {
                        return (
                            <TableRow
                                sx={{ color:'white' }}
                            >
                                <TableCell component="th" scope="row">{a.user}</TableCell>
                                {editRow === row ? (
                                    <TableCell>Epsilon: <input type={"number"}
                                                               onChange={handlenewEpsilonChange}
                                                               style={{width:'40px'}}
                                    />
                                        {a.allocated.delta ? ( <> Delta: <input type={"number"}
                                                                                onChange={handlenewDeltaChange}
                                                                                style={{width:'40px'}} /> </>) : null } </TableCell>


                                ):(

                                    <TableCell>Epsilon: {a.allocated.epsilon } {a.allocated.delta ? ( <> Delta: {a.allocated.delta} </>) : null } </TableCell>
                                )}




                                {editRow === row ? (
                                        <Button onClick={() => reset()} sx={{ minWidth: 0, transition: 'none',color:'white', backgroundColor:'#E06666', '&:hover':{backgroundColor: 'darkred' }}} variant="contained" component="label">Cancel</Button>

                                ):(
                                    <Button onClick={() => handleEditMode(row)} startIcon={<EditIcon style={{fill: 'black', stroke: 'white', strokeWidth: 2 }} />} sx={{ minWidth: 0, transition: 'none' }}></Button>


                                )}

                                {editRow === row ?(
                                    <Button onClick={() => handleUpdateBudget(a.user,datasetID,handleEpsilonChange,handleDeltaChange)} sx={{ minWidth: 0, transition: 'none' }}variant="contained" component="label" color="secondary">Confirm</Button>
                                ):(
                                    <Button onClick={() => handleDelete(a.user,datasetID)} startIcon={<RemoveCircleIcon style={{fill: 'red', stroke: 'white', strokeWidth: 2 }} />} sx={{ minWidth: 0, transition: 'none' }}>
                                    </Button>
                                )}


                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer> : <Typography variant="h6"> No analysts assigned to this specific dataset yet </Typography>
    )

}



//Getting quite heavy, might need more abstraction
const AssignmentOfAnalyst: React.FC<IAssignmentOfAnalyst> = ({
                                                                       index,
                                                                       name,
                                                                       epsilon,
                                                                       delta,
                                                                       setName,
                                                                       setEpsilon,
                                                                       setDelta,
                                                                       privacyNotion,users,budget,assignedAnalysts}) => {

        const [chosenUser, setChosenUser] = useState<string>('')
        const alreadyAssigned = assignedAnalysts.map(assigned => assigned.user)
        const analysts = users.filter((user) => user.roles.at(0) === 'Analyst').map(user => user.handle).filter(analysts => !alreadyAssigned.includes(analysts))



        const newhandleNameChange = (index:number, newnamefrom:string) => {
            const newNameChange = [...name]
            newNameChange[index] = newnamefrom
            setName(newNameChange)
        }

        const handleEpsilonChange = (index:number) => async (event: React.ChangeEvent<HTMLInputElement>) => {
            const epsilonVal = epsilon.reduce((total,num) => total + num)
            if(epsilonVal <= budget.total.epsilon && Number(event.target.value) <= budget.total.epsilon ){
                const newEpsilonChange = [...epsilon]
                newEpsilonChange[index] = Number(event.target.value)
                setEpsilon(newEpsilonChange)
            }else{
                window.alert('You are not allowed to exceed your total epsilon limit.')
                const newEpsilonChange = [...epsilon]
                newEpsilonChange[index] = 0
                setEpsilon(newEpsilonChange)
                event.target.value = '0'

            }

        }

        const handleDeltaChange = (index:number) => async (event: React.ChangeEvent<HTMLInputElement>) => {
            const deltaVal = delta.reduce((total,num) => total + num)
            if(deltaVal <= budget.total.delta && Number(event.target.value) <= budget.total.delta){
                const newDeltaChange = [...delta]
                newDeltaChange[index] = Number(event.target.value)
                setDelta(newDeltaChange)
            }else{
                window.alert('You are not allowed to exceed your total delta budget.')
                const newDeltaChange = [...delta]
                newDeltaChange[index] = 0
                setDelta(newDeltaChange)
                event.target.value = '0'

            }

        }


            return(
                <Stack flexDirection="row" justifyContent={"center"}>
                    <Box marginRight={2}>
                        <Typography borderBottom={1} marginY={2}>Name of analyst</Typography>
                        <FormControl variant="standard" sx={{minWidth: 210, maxHeight:100, background: '#A9A9A9', padding: 0}}>
                            <Select
                                value={chosenUser}
                                onChange={(e) =>{ setChosenUser(e.target.value as string)
                                    newhandleNameChange(index,e.target.value as string)
                            }}
                                displayEmpty
                                renderValue={(value) => value || 'Choose Analyst'}
                                sx={{color: 'white'}}

                            >
                                {analysts.map((user) => <MenuItem key={user} value={user} sx={{color: 'black'}} >{user}</MenuItem>)}

                            </Select>
                        </FormControl>

                    </Box>
                    <Box marginRight={2}>
                        <Typography borderBottom={1} marginY={2}>Epsilon</Typography>
                        <input
                            type={"number"}
                            className={'inputFieldAnalyst '}
                            onChange={handleEpsilonChange(index)}
                        />
                    </Box>

                    {privacyNotion === 'ApproxDP' ? (
                        <Box>
                            <Typography borderBottom={1} marginY={2}>Delta</Typography>
                            <input type={"number"} className={'inputFieldAnalyst'} onChange={handleDeltaChange(index)}/></Box>

                    ): undefined
                    }
                </Stack>
            )}





