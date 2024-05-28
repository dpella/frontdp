/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  UserInfo,
  Budget,
  DatasetInfo,
  BudgetInfo,
  DatasetSchema,
  Variable,
  Result, allocation, LabelEdit,
  User, totalBudgetsTest
} from '../types/interfaces';


const serverApiRoot = '/v1';
/**
 * Generic function to make HTTP requests to the specified endpoint using axios.
 * @param endpoint - The endpoint URL to which the request will be made.
 * @param method - The HTTP method (GET, POST, PATCH, DELETE).
 * @param token - Optional authorization token for the request.
 * @param body - Optional body of the request, used for POST and PUT requests.
 * @param contentType - The MIME type of the request, defaulting to 'application/json'.
 * @returns A promise resolving to the Axios response object.
 * @throws Will throw an error if the request fails.
 */
async function makeRequest(endpoint: string, method: 'GET' | 'POST' | 'PATCH' | 'DELETE', token?: string, body?: any, contentType: string = 'application/json'): Promise<AxiosResponse<any>> {
  const headers: { [key: string]: string } = { 'Content-Type': contentType };

  if (token !== undefined) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const requestConfig: AxiosRequestConfig = {
    url: `${serverApiRoot}${endpoint}`,
    method: method,
    headers: headers,
  };

  if (contentType === 'application/json' && body !== undefined) {
    requestConfig.data = body
  } else if (contentType === 'text/csv' && body !== undefined) {
    console.log("sending with contenttype: ", contentType)
    requestConfig.data = body;
  }

  try {
    const response = await axios(requestConfig);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error making request:', error.response?.data || error.message);
      throw error;
    } else {
      console.error('Unexpected error:', error);
      throw new Error('Unexpected error during request');
    }
  }
}

/**
 * Logs in a user and stores the JWT token received in localStorage.
 * @param username - The user's username.
 * @param password - The user's password.
 * @throws Will log and rethrow any errors encountered during the API request.
 */
export const loginUser= async (username:string, password:string) => {
  try {
    const response = await makeRequest("/login", "POST", undefined, { username, password });
    localStorage.setItem('token', response.data.jwt);
    console.log("User logged in:", response);

  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Registers a new user with the specified details. If a user with the same username already exists, an alert is shown.
 * For other types of errors during registration, the error details are alerted to the user.
 * Non-Axios errors are logged and rethrown for further handling upstream.
 * 
 * @param username - The handle of the user to be registered.
 * @param name - The full name of the user.
 * @param password - The password for the new account.
 * @param role - The role to be assigned to the new user.
 * @throws Will rethrow non-Axios errors for further handling.
 */
export const regUser= async (username:string, name: string, password:string, role: string) => {
  const body = {
    "handle": username,
    "name": name,
    "password": password,
    "roles": [role]
  };
  try {
    const response = await makeRequest("/users", "POST", localStorage.getItem('token') || '', body);
    console.log("User registered successfully:", response);

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 400) {
        const detail = error.response.data.detail;
        if (detail.includes('User handle already exists')) {
          alert('A user with this username already exists. Please choose a different username.');
        } else {
          alert(detail || 'An error occurred while attempting to create the user. Please try again.');
        }
      }
    } else {
      console.error('An unexpected error occurred:', error);
      throw error;
    }
  }
};

/**
 * Fetches a list of users from the server.
 * If an error occurs, it is logged and the error is rethrown.
 * 
 * @returns A promise that resolves to an array of User objects.
 * @throws Will log and rethrow any errors encountered during the API request.
 */
export const getUsers= async (): Promise<User[]>  => {
  try {
    const response = await makeRequest("/users", "GET", localStorage.getItem('token') || '');
    console.log("Users:", response);
    return response.data;

  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Updates the specified user's details with new name and role.
 * If an error occurs during the update, the error is logged and rethrown.
 * 
 * @param username - The username of the user to update.
 * @param newName - The new name to be set for the user.
 * @param newRole - The new role to be assigned to the user.
 * @throws Will log and rethrow any errors encountered during the API request.
 */
export const updateUser= async (username: string, newName:string, newRole: string) => {
  const body = {
    "name": newName,
    "roles": [newRole]
  };
  try {
    const response = await makeRequest(`/user/${username}`, "PATCH", localStorage.getItem('token') || '', body);
    console.log("Update user:", response);

  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Deletes the user with the given username.
 * If an error occurs during the deletion process, the error is logged and rethrown.
 * 
 * @param username - The username of the user to delete.
 * @throws Will log and rethrow any errors encountered during the API request.
 */
export const deleteUser= async (username: string) => {
  try {
    const response = await makeRequest(`/user/${username}`, "DELETE", localStorage.getItem('token') || '');
    console.log("Delete user:", response);

  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Fetches and returns user information for a given username.
 * @param username - The username for which to fetch information.
 * @returns An object containing user information.
 * @throws Will throw an error if the request fails.
 */
export const getUserInfo= async (username:string): Promise<UserInfo>  => {
  try {
    const response = await makeRequest("/user/"+ username, "GET", localStorage.getItem('token') || '');
    console.log("User info", response);
    return {
      name: response.data.name,
      roles: response.data.roles, 
    };

  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Evaluates a query on a dataset and returns the result.
 * @param datasetID - The ID of the dataset to query.
 * @param statisticsMethod - The statistical method to apply.
 * @param variable - The variable to query.
 * @param budget - The budget constraints.
 * @param groupBy - Optional grouping variable.
 * @param enumOptions - Optional enumeration options for the groupBy variable.
 * @param binOptions - Optional binning options.
 * @param equalBinsNumber - Optional number of equal bins.
 * @param labelEdits - Optional label edits to apply to variables.
 * @returns An array of results from the query.
 * @throws Will throw an error if the request or query evaluation fails.
 */
export const evaluateQuery= async (datasetID: number, statisticsMethod: string, variable: string, budget: Budget, groupBy?:Variable, enumOptions?: string[], binOptions?: string, equalBinsNumber?: number, labelEdits?: LabelEdit) : Promise<Result[]>  => {
  let queryComponents = [];

  if (labelEdits && Object.keys(labelEdits).length > 0) {

    variable = labelEdits[variable] || variable;
    if (groupBy) {
      groupBy.name = labelEdits[groupBy.name] || groupBy.name;
    }
    
    queryComponents.push( 
      { "rename": labelEdits });
  }
  
  if (groupBy?.type.name==="Enum") {
    queryComponents.push(
      {"groupby": {[groupBy.name]: enumOptions}}
    );
  }
  else if (groupBy?.type.name === "Int" || groupBy?.type.name === "Double") {
    const low = groupBy.type.low ?? 0;
    const high = groupBy.type.high ?? 100;
  
    if (binOptions === "One bin per value") {
      const binsLength = high - low + 1;
      if (binsLength > 0) {
        const bins = Array.from({ length: binsLength }, (_, index) => index + low);
        queryComponents.push(
          { "bin": { [groupBy.name]: bins } },
          { "groupby": { [`${groupBy.name}_binned`]: bins } }
        );
      } else {
        console.error('Invalid range for binning. Ensure that high is greater than low.');
      }
    } 
    else if (binOptions === "Equal range bins within variable bounds" && equalBinsNumber) {
      const totalRange = high - low;
      const binSize = Math.floor(totalRange / equalBinsNumber); 
    
      const bins = [];
      for (let i = 0; i <= equalBinsNumber; i++) {
        let nextValue = low + binSize * i;
        if (nextValue > high) {
          bins.push(high);
          break; 
        }
        bins.push(nextValue);
      }
      
      if (bins[bins.length - 1] !== high) {
        bins[bins.length - 1] = high;
      }
    
      queryComponents.push(
        { "bin": { [groupBy.name]: bins } },
        { "groupby": { [`${groupBy.name}_binned`]: bins.slice(1) } }
      );
    }
  }
  if(statisticsMethod==="count"){
    queryComponents.push({ [statisticsMethod]: {}});
  }
  else{
    queryComponents.push({ [statisticsMethod]: { "column": variable }});
  }

  const body = {
    "dataset": datasetID,
    "budget": budget,
    "query": queryComponents
  };
  console.log(queryComponents);

  try {
    const response = await makeRequest("/query/evaluate", "POST", localStorage.getItem('token') || '', body);
    console.log("Query evaluation", response.data.rows);
    const result = response.data.rows;
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Fetches the budget details for a specific user and dataset.
 * @param userHandle - The unique identifier for the user.
 * @param datasetId - The unique identifier of the dataset.
 * @returns A Promise that resolves to the budget details including delta and epsilon values.
 * @throws Throws an error if the request fails or if there is an error during the API call.
 */
export const getBudgetUser = async (userHandle: string, datasetId: number): Promise<Budget> => {

  try {
    const response = await makeRequest("/budget/allocation/" + userHandle + "/" + datasetId, "GET", localStorage.getItem('token') || '');
    console.log("User budget", response);
    return {
      delta: response.data.delta,
      epsilon: response.data.epsilon, 
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Retrieves all available datasets from the server.
 * @returns A Promise that resolves to an array of dataset information, each including name, privacy notion, ID, and update time.
 * @throws Throws an error if the request fails or if there is an error during the API call.
 */
export const getAvailableDatasets= async (user : User): Promise<DatasetInfo[]> => {
  try {
    const response = await makeRequest("/datasets", "GET", localStorage.getItem('token') || '');
    console.log("Available datasets", response);
    let availableDatasets = response.data
    {/*
      if (user.roles.includes('Curator')) {
      availableDatasets = response.data.filter((dataset : any) => dataset.owner === user.handle)
    }
    */}


    return availableDatasets.map((dataset: any): DatasetInfo => ({
      name: dataset.name,
      privacy_notion: dataset.privacy_notion,
      owner: dataset.owner,
      id: dataset.id,
      updated_time: dataset.updated_time
    }));

  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Fetches budget information for a specific user.
 * @param userHandle - The user's unique identifier.
 * @returns A Promise that resolves to an array of budget information related to various datasets.
 * @throws Throws an error if the request fails or if there is an error during the API call.
 */
export const getBudgets = async (userHandle: string): Promise<BudgetInfo[]> => {
  try {
    const response = await makeRequest("/budget/user/"+userHandle, "GET", localStorage.getItem('token') || ''); 
    console.log("Budgets fetched", response);

    return response.data.map((budget: any): BudgetInfo => ({
      dataset: budget.dataset,
      allocated: {
        epsilon: budget.allocated.epsilon,
        delta: budget.allocated.delta,
      },
      consumed: {
        epsilon: budget.consumed?.epsilon ?? 0,
        delta: budget.consumed?.delta ?? 0,
      },

    }));
  } catch (error) {
    console.error("Error fetching budgets", error);
    throw error;
  }
};

/**
 * Retrieves the schema for a specific dataset.
 * @param datasetID - The ID of the dataset for which the schema is requested.
 * @returns A Promise that resolves to an array of dataset schema details.
 * @throws Throws an error if the request fails or if there is an error during the API call.
 */
export const getDatasetSchema = async (datasetID: number): Promise<DatasetSchema[]> => {
  try {
    const response = await makeRequest(`/dataset/${datasetID}`, "GET", localStorage.getItem('token') || '');
    console.log("Dataset schema", response.data.schema);
    return response.data.schema;

  } catch (error) {
    console.error("Error fetching dataset schema", error);
    throw error;
  }
};

/**
 * Uploads a new dataset schema to the server.
 * @param name - The name of the dataset.
 * @param owner - The owner of the dataset.
 * @param privacy_notion - The privacy notion to be applied to the dataset.
 * @param schema - The schema details of the dataset.
 * @param total_budget - The total budget for the dataset, adjusted based on privacy notion.
 * @returns A Promise that resolves to the new dataset ID.
 * @throws Throws an error if the request fails or if there is an error during the API call.
 */
export const uploadDataSchema = async (name : string, owner : string, privacy_notion : string, schema: DatasetSchema[], total_budget : Budget) : Promise<number> => {
  const body={
    "name": name,
    "owner": owner,
    "privacy_notion": privacy_notion,
    "schema": schema,
    "total_budget": privacy_notion === "PureDP" ? {"epsilon" : total_budget.epsilon} : total_budget
}
  try {
    const response = await makeRequest("/datasets", "POST", localStorage.getItem('token') || '', body);
    console.log("Dataset upload", response.data);
    return response.data.id;
  } catch (error) {
    console.error(error);
    throw error;
  }

}

/**
 * Deletes a specific dataset.
 * @param datasetID - The ID of the dataset to delete.
 * @throws Throws an error if the request fails or if there is an error during the API call.
 */
export const deleteDataset = async (datasetID : number) => {

  const body = {
    "datasetId": datasetID
  }
  try {
    const response = await makeRequest(`/dataset/${datasetID}`, "DELETE", localStorage.getItem('token') || '', body)
    console.log("Deleting dataset, expected 204, got: " + response.status);
  } catch (error) {
    console.error(error)
    throw error;
  }
}

/**
 * Allocates budget for a specific dataset for a user.
 * @param userHandle - The user's handle.
 * @param datasetId - The ID of the dataset.
 * @param epsilon - The epsilon value of the budget.
 * @param delta - The delta value of the budget.
 * @returns A Promise that resolves to the budget allocation details.
 * @throws Throws an error if the request fails or if there is an error during the API call.
 */
export const allocateBudget = async (userHandle: string, datasetId:number, epsilon: number, delta:number ) : Promise<number> => {

  const body={
    "epsilon": epsilon,
    "delta": delta
  }

  try {
    const response = await makeRequest(`/budget/allocation/${userHandle}/${datasetId}`, "POST", localStorage.getItem('token') || '', body);
    console.log("Allocating budget", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }

}

/**
 * Retrieves accuracy for a specific query
 * @param userHandle - The user's handle.
 * @param datasetId - The ID of the dataset.
 * @param epsilon - The epsilon value of the budget.
 * @param delta - The delta value of the budget.
 * @returns Throws an error if the request fails or if there is an error during the API call.
 */
export const getAccuracy = async (userHandle: string, datasetId: number, epsilon: number, delta: number, confidence: number) : Promise<number> => {
  
  const body={
    "epsilon": epsilon,
    "delta": delta,
    "confidence": confidence
  }

  try {
    const response = await makeRequest(`/query/accuracy/${userHandle}/${datasetId}`, "POST", localStorage.getItem('token') || '', body);
    console.log("Calculating accuracy", response.data.accuracy[0]);
    return response.data.accuracy[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Allocates a pure differential privacy budget to a dataset for a specific user.
 * @param userHandle - The user's handle.
 * @param datasetId - The ID of the dataset.
 * @param epsilon - The epsilon value of the budget.
 * @returns A Promise that resolves to the budget allocation details.
 * @throws Throws an error if the request fails or if there is an error during the API call.
 */
export const allocateBudgetPureDP = async (userHandle: string, datasetId:number,epsilon: number ) : Promise<number> => {

  const body={
    "epsilon": epsilon
  }

  try {
    const response = await makeRequest(`/budget/allocation/${userHandle}/${datasetId}`, "POST", localStorage.getItem('token') || '', body);
    console.log("Allocating budget", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }

}

/**
 * Uploads data to a specific dataset.
 * @param datasetID - The ID of the dataset to which the data will be uploaded.
 * @param data - The data to be uploaded in string format.
 * @throws Throws an error if the request fails or if there is an error during the API call.
 */
export const uploadDatasetData = async (datasetID : number, data : string) : Promise<AxiosResponse<any>> => {
  console.log("here")
  console.log("id is: ", datasetID)
  console.log("data is:", data)
  try {
    const response = await makeRequest(`/dataset/${datasetID}/upload`, "POST", localStorage.getItem('token') || '', data, 'text/csv')
    console.log("Uploading dataset-data, expected 204, got: " + response.status);
    return response;
  } catch (error) {
    console.error(error)
    throw error;
  }
}

/**
 * Deallocates the budget for a specific dataset for a user.
 * @param userHandle - The user's handle.
 * @param datasetId - The ID of the dataset.
 * @throws Throws an error if the request fails or if there is an error during the API call.
 */
export const deallocateBudget = async (userHandle: string, datasetId:number) => {
  try {
    const response = await makeRequest(`/budget/allocation/${userHandle}/${datasetId}`, "DELETE", localStorage.getItem('token') || '');
    console.log("Deallocating budget for user", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }

}

/**
 * Updates the allocated budget for a specific analyst for a dataset.
 * @param userHandle - The user's handle.
 * @param datasetID - The ID of the dataset.
 * @param epsilon - The epsilon value of the budget.
 * @param delta - The delta value of the budget, only needed when the privacy notion is ApproxDP.
 * @returns A Promise which contains the number of the newly updated budget
 * @throws Throws an error if the request fails or if there is an error during the API call.
 */
export const updateBudget = async (userHandle: string, datasetId:number, epsilon:number, delta?:number) => {
  const body = {
    "epsilon": epsilon,
    "delta": delta
  }
  try {
    const response = await makeRequest(`/budget/allocation/${userHandle}/${datasetId}`, "PATCH", localStorage.getItem('token') || '',body);
    console.log("Updating user budget", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Fetches budget allocation details for a specific dataset.
 * @param datasetID - The ID of the dataset.
 * @returns A Promise that resolves to an array of budget allocations for the dataset.
 * @throws Throws an error if the request fails or if there is an error during the API call.
 */
export const getSpecificDataSetBudget = async (datasetID: number): Promise<allocation[]> => {
  try {
    const response = await makeRequest(`/budget/dataset/${datasetID}`, "GET", localStorage.getItem('token') || '');
    console.log("Datasets users fetched", response.data.allocation);
    return response.data.allocation.map((allocation: any): allocation => ({
      user: allocation.user,
      allocated: {
        epsilon: allocation.allocated.epsilon,
        delta: allocation.allocated.delta,
      },
      consumed: {
        epsilon: allocation.consumed?.epsilon ?? 0,
        delta: allocation.consumed?.delta ?? 0,
      },

    }));

  } catch (error) {
    console.error("Error fetching users connected to dataset", error);
    throw error;
  }
};

/**
 * Logs out a user from theirs acoount.
 * @throws Will log and rethrow any errors encountered during the API request.
 */
export const logout = async () => {
  try {
    const response = await makeRequest(`/logout`, "POST", localStorage.getItem('token') || '');
    console.log('Logout successful')
  } catch (error) {
    console.error(error);
    throw error;
  }

};

/**
 * Edits an existing uploaded dataset.
 * @param datasetInfo - The updated dataset information.
 * @throws Throws an error if the request fails or if there is an error during the API call.
 */
export const editDataset = async (datasetInfo: any) => {
  console.log('Dataset info before sending request:', datasetInfo); 
  const body = {
    "name": datasetInfo.name,
    "owner": datasetInfo.owner,
    "total_budget": datasetInfo.privacy_notion === "PureDP" ? {"epsilon" : datasetInfo.budget.epsilon} : datasetInfo.budget
}
  try {
    const response = await makeRequest(`/dataset/${datasetInfo.id}`, "PATCH", localStorage.getItem('token') || '', body);
    console.log("Editing dataset, expected 204, got:", response.status);
  } catch (error) {
    console.error(error);
    throw error;
  }
};


/**
 * Recieves the total budget of a dataset.
 * @param datasetID - The ID of the dataset.
 * @returns A Promise that information about the dataset's total budget
 * @throws Throws an error if the request fails or if there is an error during the API call.
 */
export const getTotalDatasetBudget = async (datasetID: number): Promise<totalBudgetsTest> => {
  try {
    const response = await makeRequest(`/budget/dataset/${datasetID}`, "GET", localStorage.getItem('token') || '');
    console.log("Total budget fecthed - In Requests", response.data);
    return response.data}

  catch (error) {
    console.error("Error fetching totalbudget", error);
    throw error;
  }
};
