import { MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { getFamilyRoleTypes } from "../../Api/api";

interface FamilyRoleSelectBoxProps {
    defaultRole: string,
    roles: string[],
    onRoleChange: (newRole: string) => void
}

const FamilyRoleSelectBox: React.FC<FamilyRoleSelectBoxProps> = ({defaultRole, roles, onRoleChange}) => {
    const [familyRole, setFamilyRole] = useState(defaultRole);
    const [familyRoles, setFamilyRoles] = useState<string[]>(roles);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRole = event.target.value as string;
        setFamilyRole(newRole); 
        onRoleChange(newRole);  
    };

    return(
    <Select
        labelId="family-role-label"
        id="family-role-select"
        value={familyRole}
        label="Family-Role"
        onChange={() => handleChange}
    >
        {familyRoles.map((familyRole, index) => 
        <MenuItem key={index} value={familyRole}>{familyRole}</MenuItem>)
        }
    </Select>
    )
}

export default FamilyRoleSelectBox;