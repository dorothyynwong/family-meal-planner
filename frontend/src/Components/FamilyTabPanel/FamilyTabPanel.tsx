import { Box } from "@mui/material";
import { FamilyWithUsersInterface } from "../../Api/apiInterface";

interface FamilyTabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

const FamilyTabPanel: React.FC<FamilyTabPanelProps> = (props: FamilyTabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );

}

export default FamilyTabPanel;