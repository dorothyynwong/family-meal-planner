import { useState } from "react";
import { Col, Row } from "react-bootstrap";

const RecipeIngredient: React.FC = () => {
    const [rowCount, setRowCount] = useState(5);

    return (
        <>
            {Array.from({ length: rowCount }, (_, i) => (
                <Row key={i}>
                    <Col key={i-1}>
                    {i}-1
                    </Col>
                    <Col key={i-2}>
                    {i}-2
                    </Col>
                    <Col key={i-3}>
                    {i}-3
                    </Col>
                </Row>
            ))}
        </>
    )
}

export default RecipeIngredient;