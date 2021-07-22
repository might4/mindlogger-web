import React from 'react';
import _ from "lodash";
import { Form, Row, Card, Col, Image } from 'react-bootstrap';

import Navigator from './Navigator';
import Markdown from '../components/Screens/Markdown';

const Radio = (props) => {
  const {
    item,
    answer,
    isBackShown,
    isNextShown,
    handleChange,
    handleBack,
    isSubmitShown
  } = props;

  const isNextDisable = !answer && answer !== 0;
  const valueType = item.valueConstraints.valueType;
  const token = valueType && valueType.includes('token');

  return (
    <Card className="mb-3" style={{ maxWidth: "auto" }}>
      <Row className="no-gutters">
        <Col md={12}>
          <Card.Body>
            <Card.Title className="question">
              <Markdown>{item.question.en}</Markdown>
            </Card.Title>
            <Row className="no-gutters pl-5">
              <Form.Group as={Row}>
                {_.map(item.valueConstraints.itemList, (obj, i) => (
                  <Col md={6} className="pr-5 response-option" key={i}>
                    {
                      obj.image && <Image className="option-image" src={obj.image} roundedCircle /> ||
                      <div className="option-image"></div>
                    }
                    <Form.Check
                      label={obj.name.en}
                      name={item.variableName}
                      type="radio"
                      onChange={
                        () => {
                          handleChange({
                            value: token ? obj.name.en : obj.value
                          })
                        }
                      }
                      value={obj.value}
                      id={`${item.variableName}${i}`}
                      disabled={!isNextShown}
                    />
                  </Col>
                ))}
              </Form.Group>
            </Row>
          </Card.Body>
        </Col>
      </Row>
      <Navigator
        isBackShown={isBackShown}
        isNextShown={isNextShown}
        isNextDisable={isNextDisable}
        handleBack={handleBack}
        answer={answer}
        isSubmitShown={isSubmitShown}
      />
    </Card>
  );
}

export default Radio;
