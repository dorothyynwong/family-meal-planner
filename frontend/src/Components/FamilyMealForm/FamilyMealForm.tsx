import { Button, Form, InputGroup } from "react-bootstrap";
import MealFormBase from "../MealFormBase/MealFormBase";
import { useMeal } from "../MealContext/MealContext";
import { Dayjs } from 'dayjs';
import StatusHandler from "../StatusHandler/StatusHandler";
import Popup from "../Popup/Popup";
import useMealForm from "../../Hooks/useMealForm";
// import RecipeSearch from "../RecipeSearch/RecipeSearch";
import { useNavigate } from "react-router-dom";
// import SearchBar from "../SearchBar/SearchBar";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";

interface FamilyMealFormProps {
    isForFamily?: boolean
    selectedDate?: Dayjs
}

const FamilyMealForm: React.FC<FamilyMealFormProps> = ({ isForFamily, selectedDate }) => {
    const {
        selectedFamily,
        modalShow,
        setModalShow,
        resetMealContext,
        mode,
        status,
        errorMessages,
        // setRecipeName,
        recipeName,
    } = useMeal();

    const navigate = useNavigate();

    const { handleSubmit } = useMealForm(isForFamily, selectedDate);
    const [searchValue, setSearchValue] = useState("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    }

    useEffect(() => {
        setSearchValue(recipeName);
    }, [recipeName])

    const isFromMealForm = true;

    return (
        <Popup
            customclass="meal-form"
            show={modalShow}
            onHide={() => { setModalShow(false); resetMealContext(); }}
            title={`${mode} Meal`}
            body="">
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="meal-family-name">
                    <Form.Control
                        type="text"
                        className="mt-3 meal-family-name"
                        readOnly
                        placeholder={selectedFamily?.familyName} />
                </Form.Group>
                <InputGroup className="mt-3 recipe-search-container">
                    <InputGroup.Text className="recipe-search-icon-box">
                        <FaSearch className="recipe-search-icon" />
                    </InputGroup.Text>
                    <Form.Control
                        className="recipe-search-box"
                        placeholder="Search Recipe"
                        aria-label="Search"
                        onChange={handleChange}
                        value={searchValue}
                    />
                    <Button className="custom-button" onClick={() => navigate(`/recipes-search/${searchValue}`, { state: { isFromMealForm } })}>
                        Search
                    </Button>
                </InputGroup>
                <MealFormBase isForFamily={isForFamily} selectedDate={selectedDate} />
                <StatusHandler
                    status={status}
                    errorMessages={errorMessages}
                    loadingMessage="Submitting/Loading meal ..."
                    successMessage=""
                >
                    <></>
                </StatusHandler>
            </Form>
        </Popup>
    )
}

export default FamilyMealForm;