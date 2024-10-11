import { MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { getFamilyRoleTypes } from "../../Api/api";

const FamilyRoleSelectBox: React.FC = () => {
    const [familyRole, setFamilyRole] = useState("");
    const [familyRoles, setFamilyRoles] = useState<string[]>([]);

    useEffect(
        () => {
           getFamilyRoleTypes()
           .then(response=>setFamilyRoles(response.data));

        }
    )

    const handleChange = () => {

    }

    return(
    <Select
        labelId="family-role-label"
        id="family-role-select"
        value={familyRole}
        label="Family-Role"
        onChange={handleChange}
    >
        {familyRoles.map(familyRole => <MenuItem value={familyRole}>{familyRole}</MenuItem>)}
    </Select>
    )
}

export default FamilyRoleSelectBox;