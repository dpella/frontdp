/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Button } from '@mui/material';
import '../styling/ToggleButton.css';
import CheckIcon from '@mui/icons-material/Check';
import { ToggleButtonProps } from '../types/interfaces'


/**
 * Renders a toggleable button that visually indicates its selection state.
 *
 * @param {ToggleButtonProps} props - The properties passed to the ToggleButton component.
 * @param {string} props.text - The text to display on the button.
 * @param {Function} props.onClick - Callback function to execute when the button is clicked.
 * @param {boolean} props.selected - Indicates whether the button is in the "selected" state.
 *                                   Affects the button's styling and whether the CheckIcon is displayed.
 */
const ToggleButton: React.FC<ToggleButtonProps> =({ text, onClick, selected }) => {
  return (
    <div>
      <Button
        className={`customMuiButton ${selected ? 'clicked' : 'initial'}`}
        onClick={onClick}
        endIcon={selected ? <CheckIcon /> : null}
      >
        {text}
      </Button>
    </div>
  );
}

export default ToggleButton;
