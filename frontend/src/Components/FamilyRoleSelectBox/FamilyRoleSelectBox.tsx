import { MenuItem, Select, SelectChangeEvent } from "@mui/material";

interface FamilyRoleSelectBoxProps {
    defaultRole: string,
    roles: string[],
    onRoleChange: (newRole: string) => void
}

const FamilyRoleSelectBox: React.FC<FamilyRoleSelectBoxProps> = ({defaultRole, roles, onRoleChange}) => {
<<<<<<< HEAD
    const [familyRoles] = useState<string[]>(roles);
=======
    // const [familyRoles, setFamilyRoles] = useState<string[]>(roles);
>>>>>>> main

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
        {roles.map((familyRole, index) => 
        <MenuItem key={index} value={familyRole}>{familyRole}</MenuItem>)
        }
    </Select>
    )
}

export default FamilyRoleSelectBox;