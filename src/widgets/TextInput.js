import React, { useState, useEffect } from 'react'
import _ from "lodash";
import { useTranslation } from 'react-i18next';
import {
  Modal,
  Card,
  Row,
  Col,
  Image
} from 'react-bootstrap';

import Navigator from './Navigator';
import Markdown from '../components/Markdown';

const TextInput = ({
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
  const { t } = useTranslation();

  const [show, setShow] = useState(false);
  const [value, setValue] = useState((answer || ''));

  useEffect(() => {
    setValue(values[item.variableName]);
  }, [values[item.variableName]])

  return (
    <Card className="mb-3 px-3" style={{ maxWidth: "auto" }}>
      <Row className="no-gutters">
        <Col md={12}>
          <Card.Title className="question">
            {
              watermark &&
              <Image className="watermark" src={watermark} alt="watermark" rounded />
            }
            <Markdown
              markdown={item.question.en.replace(/(!\[.*\]\s*\(.*?) =\d*x\d*(\))/g, '$1$2')}
            />
          </Card.Title>
          <Card.Body>
            <Row className="no-gutters px-4 py-4">
              <input
                type="text"
                style={{ width: '80%', margin: 'auto' }}
                value={value}
                onChange={e => {
                  setValue(e.target.value);
                  handleChange({ value: e.target.value });
                }}
                disabled={!isNextShown}
              />
            </Row>
          </Card.Body>
        </Col>
      </Row>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t("failed")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t("incorrect_answer")}
        </Modal.Body>
      </Modal>

      <Navigator
        isBackShown={isBackShown}
        isNextShown={isNextShown}
        isNextDisable={!answer}
        handleBack={handleBack}
        isSubmitShown={isSubmitShown}
        canSubmit={(e) => {
          if (!item.correctAnswer || !item.correctAnswer.en || item.correctAnswer.en === value) {
            return true;
          }
          setShow(true);
          return false;
        }}
      />
    </Card>
  )
}

export default TextInput;
