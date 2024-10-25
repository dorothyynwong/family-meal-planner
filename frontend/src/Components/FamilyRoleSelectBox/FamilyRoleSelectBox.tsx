import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";

interface FamilyRoleSelectBoxProps {
    defaultRole: string,
    roles: string[],
    onRoleChange: (newRole: string) => void
}

const FamilyRoleSelectBox: React.FC<FamilyRoleSelectBoxProps> = ({defaultRole, roles, onRoleChange}) => {
    const [familyRoles] = useState<string[]>(roles);

    const handleChange = (event: SelectChangeEvent<string>) => {
            const { value } = event.target;
            onRoleChange(value as string);
    };

    return(
    <Select
        labelId="family-role-label"
        id="family-role-select"
        value={defaultRole}
        label="Family-Role"
        onChange={handleChange}
    >
        {familyRoles.map((familyRole, index) => 
        <MenuItem key={index} value={familyRole}>{familyRole}</MenuItem>)
        }
    </Select>
    )
}

export default FamilyRoleSelectBox;