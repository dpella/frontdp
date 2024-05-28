/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { ReactNode } from "react";

/**
 * Represents a single variable within a dataset, including its type and optional label.
 * @interface Variable
 * @property {string} name - The name of the variable.
 * @property {VariableType} type - The type of the variable, including data type details.
 * @property {string} [label] - An optional label for the variable that is displayed in the UI.
 */
export interface Variable {
    name: string;
    type: VariableType;
    label?:string;
}



/**
 * Stores information about a user, including their name and roles.
 * @interface UserInfo
 * @property {string} name - The user's full name.
 * @property {Array<string>} roles - A list of roles assigned to the user.
 */
export interface UserInfo {
    name: string;
    roles: UserRole[];
}

/**
 * Describes budget constraints for queries.
 * @interface Budget
 * @property {number} [delta] - The optional delta value for differential privacy.
 * @property {number} epsilon - The epsilon value for differential privacy.
 */
export interface Budget {
    delta?: number;
    epsilon: number;
}

export interface Confidence {
    confidence: number;
}

/**
 * Contains detailed information about a dataset.
 * @interface DatasetInfo
 * @property {string} name - The name of the dataset.
 * @property {number} id - The unique identifier of the dataset.
 * @property {string} privacy_notion - The privacy notion applied to the dataset.
 * @property {BudgetInfo} [budget] - Optional budget information specific to this dataset.
 * @property {string} [updated_time] - Optional last updated timestamp of the dataset.
 * @property {string} [owner] - Optional owner of the dataset.
 * @property {DatasetSchema[]} [schema] - Optional schema details of the dataset.
 */
export interface DatasetInfo {
  name: string;
  id: number
  privacy_notion: string;
  budget?: BudgetInfo;
  updated_time?: string;
  owner?: string;
  schema?: DatasetSchema[];
}

/**
 * Detailed information about the budget allocated and consumed for a specific dataset.
 * @interface BudgetInfo
 * @property {number} [dataset] - Optional dataset identifier this budget info relates to.
 * @property {object} allocated - The amount of budget that has been allocated.
 * @property {object} [consumed] - The amount of budget that has been consumed, if available.
 */
export interface BudgetInfo {
    dataset?: number;
    allocated: {
        epsilon: number;
        delta: number;
    };
    consumed?: {
        epsilon: number,
        delta: number,
    }

}

/**
 * Describes the schema of a dataset variable, including its name and type.
 * @interface DatasetSchema
 * @property {string} name - The name of the variable in the dataset schema.
 * @property {VariableType} type - The type information of the variable.
 */
export interface DatasetSchema {
    name: string;
    type: VariableType
}

/**
 * Defines the type of a dataset variable, including its range and optional labels for categorical types.
 * @interface VariableType
 * @property {string} name - The name of the type (e.g., 'Enum', 'Int', 'Double').
 * @property {number} [low] - Optional lower bound for the type if it is numeric.
 * @property {number} [high] - Optional upper bound for the type if it is numeric.
 * @property {string[]} [labels] - Optional labels for categorical types.
 */
interface VariableType{
    name: string;
    low?: number;
    high?: number;
    labels?: string[];
}

/**
 * Defines the data structure for configuring a query.
 * @interface QueryData
 * @property {string} statistics - The statistical method to apply.
 * @property {string} variable - The main variable to query.
 * @property {Variable} [groupBy] - Optional variable to group the data by.
 * @property {string} [binOptions] - Optional binning options.
 * @property {string[]} [enumOptions] - Optional enumeration options for groupBy variable.
 * @property {boolean} [showHistogram] - Whether to show a histogram for the results.
 * @property {number} [equalBinsNumber] - Optional number of equal bins for binning the variable.
 */
export interface QueryData {
    statistics: string;
    variable: string;
    groupBy?: Variable;
    binOptions?: string;
    enumOptions?: string[];
    showHistogram?: boolean;
    equalBinsNumber?: number;
}

/**
 * Props for configuring a component that allows users to select and configure data for a query.
 * @interface QuerySelectorProps
 * @property {Variable[]} variables - List of available variables for selection.
 * @property {(data: QueryData) => void} onDataSelected - Callback function when data is selected or modified.
 * @property {QueryData} selectedData - The currently selected and configured data.
 */
export interface QuerySelectorProps {
    variables: Variable[];
    onDataSelected: (data: QueryData) => void;
    selectedData: QueryData;
}

/**
 * Represents a result object where keys are string identifiers and values are either numbers or strings.
 * @interface Result
 */
export interface Result{
  [key: string]: string | number;
}

/**
 * Represents a mapping of original variable names to their edited labels.
 * @interface LabelEdit
 */
export interface LabelEdit {
  [originalName: string]: string;
}

/**
 * Properties for the VariableSelector component which allows users to select and edit labels of dataset variables.
 * @interface VariableSelectorProps
 * @property {number} [datasetID] - Optional dataset ID
 * @property {(selectedVariables: Variable[]) => void} onVariablesSelected - Callback when variables are selected.
 * @property {Variable[]} selectedVariables - Array of currently selected variables.
 * @property {LabelEdit} labelEdits - Current label edits applied to the selected variables.
 * @property {(edits: LabelEdit) => void} onLabelEdit - Callback when label edits are made.
 */
export interface VariableSelectorProps {
  datasetID?: number;
  onVariablesSelected: (selectedVariables: Variable[]) => void;
  selectedVariables: Variable[];
  labelEdits: LabelEdit;
  onLabelEdit: (edits: LabelEdit) => void;
}

type UserRole = 'Admin' | 'Analyst' | 'Curator';

/**
 * Properties required for the ProtectedRoute component.
 * 
 * @property {JSX.Element} children - The child components or elements that are rendered if the user has the necessary role.
 * @property {UserRole[]} allowedRoles - A list of user roles that are authorized to access the route.
 */
export interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: UserRole[];
};

/**
 * Defines the structure for user data within the application.
 * @interface User
 * @property {string} name - The full name of the user.
 * @property {Array<string>} roles - The roles assigned to the user within the application.
 * @property {string} handle - Username which is a unique identifier for the user
 */
export interface User {
  name: string;
  roles: UserRole[];
  handle: string;
  created_time?: string;
  updated_time?: string;
}

/**
 * Defines the context type for managing user state within the application.
 * @interface UserContextType
 * @property {User | null} user - The currently authenticated user or null if no user is authenticated.
 * @property {(user: User | null) => void} setUser - Function to update the current user state.
 */
export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

/**
 * Props for the UserProvider component that passes down user-related context.
 * @interface UserProviderProps
 * @property {ReactNode} children - The child components that require access to the user context.
 */
export interface UserProviderProps {
  children: ReactNode;
}


/**
 * Information about the dataset's budget.
 * @interface datasetBudgetInfo
 * @property {allocation} [allocation] - Detailed information of how much budget that was allocated and how much that have been consumed.
 */
export interface datasetBudgetInfo {
    allocation?: allocation;
}

/**
 * Information about a specific analyst's budget.
 * @interface allocation
 * @property {object} allocated - The amount of budget that has been allocated.
 * @property {object} consumed  - The amount of budget that has been consumed, if available.
 * @property {string} user      - The user variable for the analyst in question.
 */
export interface allocation{
    allocated: {
        epsilon: number;
        delta: number;
    },
    consumed: {
        epsilon: number,
        delta: number,
    }
    user:string;
}

/**
 * Props for a slider component used to adjust budget parameters within the application.
 * @interface ContinuousSliderProps
 * @property {BudgetInfo} budget - The current budget information.
 * @property {Budget} selectedBudget - The currently selected budget values that can be adjusted.
 * @property {(newBudget: Budget) => void} onBudgetChange - Callback function invoked when the budget values are changed via the slider.
 */
export interface ContinuousSliderProps {
  budget: BudgetInfo;
  selectedBudget: Budget;
  onBudgetChange: (newBudget: Budget) => void;
  //selectedConfidence: Confidence;
  //onConfidenceChange: (newConfidence: Confidence) => void; 
}

/**
 * Properties for the SearchBar component that handles search functionality.
 * @interface SearchBarProps
 * @property {(searchTerm: string) => void} onSearch - Callback function triggered when a search is executed.
 */
export interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

/**
 * Properties for a toggle button component that can be interactively clicked to toggle its state.
 * @interface ToggleButtonProps
 * @property {string} text - The text to display on the toggle button.
 * @property {() => void} [onClick] - Optional callback function that is called when the button is clicked.
 * @property {boolean} [selected] - Indicates whether the button is currently selected or not.
 */
export interface ToggleButtonProps {
  text: string;
  onClick?: () => void;
  selected?: boolean;
}

/**
 * Properties for the TextFieldAdmin component, a customized text input field.
 * @interface
 * @property {string} value - The current value of the text field.
 * @property {(event: React.ChangeEvent<HTMLInputElement>) => void} onChange - The event handler function to call when the value of the text field changes.
 * @property {string} placeholder - A string that provides a brief hint to the user about what kind of information is expected in the text field.
 */
export interface TextFieldAdminProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

/**
 * Information about testing the total budgets, not commonly used. Only created for testing purposes
 * @interface totalBudgetsTest
 * @property {object} total - The amount of budget that has been allocated.
 * @property {object} allocated - The amount of budget that has been allocated.
 * @property {string} consumed - The amount of budget that has been consumed, if available.
 */
export interface totalBudgetsTest{
    total: {
        "epsilon": number,
        "delta": number,
    },
    allocated: {
        "epsilon": number,
        "delta": number,
    },
    consumed: {
        "epsilon": number,
        "delta": number,
    }
}
/**
 * Represents the properties required for editing dataset settings.
 *
 * @interface IEditDataset2
 * @property {string} privacyNotion - Describes the privacy notion associated with the dataset.
 * @property {Budget} totalBudget - Represents the total budget allocated for this dataset.
 * @property {(budget: Budget) => void} updateTotalBudget - A function to update the total budget of the dataset.
 */
export interface IEditDataset2{
  privacyNotion : string
  totalBudget : Budget;
  updateTotalBudget : (budget : Budget) => void;
}

/**
 * Properties for the NameSelector component, a selector for name input of the dataset
 * @interface NameSelectorProps
 * @property {string} dataSetName - The current value of the datasetname.
 * @property {(datasetname: string) => void} updateDataSetName - The event handler function to call when the user inserts a new name changes.
 */
export interface NameSelectorProps  {
  dataSetName : string,
  updateDataSetName: (datasetname : string) => void
}

