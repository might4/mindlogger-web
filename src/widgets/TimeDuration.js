import React, { useState, useEffect } from 'react'
import _ from "lodash";
import { useTranslation } from 'react-i18next';
import {
  Modal,
  DropdownButton,
  Dropdown,
  Card,
  Row,
  Col,
  Image,
} from 'react-bootstrap';

import Navigator from './Navigator';
import Markdown from '../components/Screens/Markdown';

const TimeDuration = ({
  item,
  values,
  isBackShown,
  isNextShown,
  handleChange,
  handleBack,
  watermark,
  isSubmitShown,
  answer
}) => {
  const { timeDuration } = item.valueConstraints;
  const durations = timeDuration.split(' ');
  let finalAnswer = answer ? answer : {};

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const onChangeValue = (type, value) => {
    let answers = {
      ...finalAnswer,
      [type]: value,
    };
    finalAnswer = answers;
    handleChange(answers);
  }

  const renderDuration = (type) => {
    let items;

    if (type === 'hours') {
      items = new Array(23).fill(0).map((val, index) => {
        return { label: index + 1, value: index + 1 }
      });
    } else if (type === 'mins') {
      items = new Array(59).fill(0).map((val, index) => {
        return { label: index + 1, value: index + 1 }
      });
    } else if (type === 'secs') {
      items = new Array(59).fill(0).map((val, index) => {
        return { label: index + 1, value: index + 1 }
      });
    } else {
      items = new Array(99).fill(0).map((val, index) => {
        return { label: index + 1, value: index + 1 }
      });
    }

    return (
      <>
        <p>{capitalizeFirstLetter(type)}</p>
        <DropdownButton
          variant="none"
          title={finalAnswer[type] || 0}
          onSelect={(v) => onChangeValue(type, v)}
        >
          {items.map(item => 
            <Dropdown.Item eventKey={item.value}>{item.label}</Dropdown.Item>
          )}
        </DropdownButton>
      </>
    )
  }

  return (
    <Card className="mb-3 px-3" style={{ maxWidth: "auto" }}>
      <Row className="no-gutters">
        <Col md={12}>
          <Card.Title className="question">
            {watermark &&
              <Image className="watermark" src={watermark} alt="watermark" rounded />
            }
            <Markdown>{item.question.en}</Markdown>
          </Card.Title>
          <Card.Body>
            <Row>
              {durations.map(duration => 
                <>
                  {duration && <Col>
                      {renderDuration(duration)}
                    </Col>
                  }
                </>
              )}
            </Row>
          </Card.Body>
        </Col>
      </Row>

      <Navigator
        isBackShown={isBackShown}
        isNextShown={isNextShown}
        isNextDisable={!answer}
        handleBack={handleBack}
        isSubmitShown={isSubmitShown}
        answer={answer}
      />
    </Card>
  )
}

export default TimeDuration;
