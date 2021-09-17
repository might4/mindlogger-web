import React, { useState, useEffect, useRef } from 'react';
import _ from "lodash";
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Parser } from 'expr-eval';
import { PDFExport } from '@progress/kendo-react-pdf';
import styled from 'styled-components';
import cn from 'classnames';

// Component
import MyButton from '../components/Button';
import Markdown from '../components/Markdown';

// State
import { setCumulativeActivities } from '../state/applet/applet.reducer';
import { inProgressSelector } from '../state/responses/responses.selectors';
import { appletCumulativeActivities } from '../state/applet/applet.selectors';

// services
import { getScoreFromResponse, evaluateScore, getMaxScore } from '../services/scoring';

const MARKDOWN_REGEX = /(!\[.*\]\s*\(.*?) =\d*x\d*(\))/g;
const termsText = "I understand that the information provided by this questionnaire is not intended to replace the advice, diagnosis, or treatment offered by a medical or mental health professional, and that my anonymous responses may be used and shared for general research on children’s mental health.";
const footerText = "CHILD MIND INSTITUTE, INC. AND CHILD MIND MEDICAL PRACTICE, PLLC (TOGETHER, “CMI”) DOES NOT DIRECTLY OR INDIRECTLY PRACTICE MEDICINE OR DISPENSE MEDICAL ADVICE AS PART OF THIS QUESTIONNAIRE. CMI ASSUMES NO LIABILITY FOR ANY DIAGNOSIS, TREATMENT, DECISION MADE, OR ACTION TAKEN IN RELIANCE UPON INFORMATION PROVIDED BY THIS QUESTIONNAIRE, AND ASSUMES NO RESPONSIBILITY FOR YOUR USE OF THIS QUESTIONNAIRE.";


const Summary = styled(({ className, ...props }) => {
  const { appletId, activityId } = useParams();
  const history = useHistory();
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [activity, setActivity] = useState({});

  const dispatch = useDispatch();

  const response = useSelector(inProgressSelector);
  const cumulativeActivities = useSelector(appletCumulativeActivities);

  const pdfRef = useRef(null);

  useEffect(() => {
    if (response[`activity/${activityId}`]) {
      const { responses, activity } = response[`activity/${activityId}`];
      setActivity(activity);

      if (responses && responses.length > 0) {
        const parser = new Parser({
          logical: true,
          comparison: true,
        });

        let scores = [], maxScores = [];
        for (let i = 0; i < activity.items.length; i++) {
          const { variableName } = activity.items[i];
          let score = getScoreFromResponse(activity.items[i], responses[i][variableName] ? responses[i][variableName] : responses[i]);
          scores.push(score);
          maxScores.push(getMaxScore(activity.items[i]))
        }

        const cumulativeScores = activity.compute.reduce((accumulator, itemCompute) => {
          return {
            ...accumulator,
            [itemCompute.variableName.trim().replace(/\s/g, '__')]: evaluateScore(itemCompute.jsExpression, activity.items, scores),
          };
        }, {});

        const cumulativeMaxScores = activity.compute.reduce((accumulator, itemCompute) => {
          return {
            ...accumulator,
            [itemCompute.variableName.trim().replace(/\s/g, '__')]: evaluateScore(itemCompute.jsExpression, activity.items, maxScores),
          };
        }, {});

        const reportMessages = [];
        let cumActivities = [];
        activity.messages.forEach((msg) => {
          const { jsExpression, message, outputType, nextActivity } = msg;

          const variableName = jsExpression.split(/[><]/g)[0];
          const category = variableName.trim().replace(/\s/g, '__');
          const expr = parser.parse(category + jsExpression.substr(variableName.length));

          const variableScores = {
            [category]: outputType == 'percentage' ? Math.round(cumulativeMaxScores[category] ? cumulativeScores[category] * 100 / cumulativeMaxScores[category] : 0) : cumulativeScores[category]
          }

          if (expr.evaluate(variableScores)) {
            if (nextActivity) cumActivities.push(nextActivity);

            const compute = activity.compute.find(itemCompute => itemCompute.variableName.trim() == variableName.trim())

            reportMessages.push({
              category,
              message,
              score: variableScores[category] + (outputType == 'percentage' ? '%' : ''),
              compute,
            });
          }
        });

        if (cumulativeActivities && cumulativeActivities[`${activity.id}/nextActivity`]) {
          cumActivities = _.difference(cumActivities, cumulativeActivities[`${activity.id}/nextActivity`]);
          if (cumActivities.length > 0) {
            cumActivities = [...cumulativeActivities[`${activity.id}/nextActivity`], ...cumActivities];
            dispatch(setCumulativeActivities({ [`${activity.id}/nextActivity`]: cumActivities }));
          }
        } else {
          dispatch(setCumulativeActivities({ [`${activity.id}/nextActivity`]: cumActivities }));
        }

        setMessages(reportMessages);
      }
    }
  }, [response && Object.keys(response).length > 1]);

  return (
    <Card className={cn("mb-3", className)}>
      <Row className="no-gutters">
        <Col md={12}>
          <Card.Body>
            {messages && messages.map((item, i) => (
              <>
                <div key={i}>
                  <h1>{item.category.replace(/_/g, ' ')}</h1>
                  <h3><strong>{item.score}</strong></h3>
                  <Markdown markdown={item.message.replace(MARKDOWN_REGEX, '$1$2')} />
                </div>
                {messages.length > 1 && <div key={`${i}-hr`} className="hr" />}
              </>
            ))}
          </Card.Body>
        </Col>
      </Row>
      <div>
        <div className="pdf-container">
          <PDFExport paperSize="A4" margin="2cm" ref={pdfRef}>
            <p className="font-weight-bold mb-4">
              <u>{_.get(activity, 'name.en')} Report</u>
            </p>
            <div className="mb-4">
              <Markdown markdown={_.get(activity, 'scoreOverview', '').replace(MARKDOWN_REGEX, '$1$2')} />
            </div>
            {messages &&
              messages.map((item, i) => (
                <div key={i}>
                  <p class="font-weight-bold mb-1">{item.category.replace(/_/g, ' ')}</p>
                  <div class="mb-4">
                    <Markdown markdown={_.get(item, 'compute.description', '').replace(MARKDOWN_REGEX, '$1$2')} />
                  </div>
                  <img
                    className={cn('score-bar mb-4', { reverse: !item.compute.direction })}
                    src="https://raw.githubusercontent.com/ChildMindInstitute/mindlogger-app/master/img/score_bar.png"
                  />
                  <h3><strong>{item.score}</strong></h3>
                  <div className="mb-4">
                    <Markdown markdown={item.message.replace(MARKDOWN_REGEX, '$1$2')} />
                  </div>
                </div>
              ))}
            <p class="mb-5">{termsText}</p>
            <p>{footerText}</p>
          </PDFExport>
        </div>
        <MyButton
          type="submit"
          label={t("Consent.next")}
          classes="mr-5 mb-2 float-right"
          handleClick={(e) => history.push(`/applet/${appletId}/activity_thanks`)}
        />
        <MyButton
          type="button"
          label={t('additional.share_report')}
          classes="mr-5 mb-2 float-right"
          handleClick={(e) => {
            if (pdfRef.current) {
              pdfRef.current.save();
            }
          }}
        />
      </div>
    </Card>
  );
})`
  max-width: auto;

  .pdf-container {
    max-width: 1000px;
    position: absolute;
    left: -2000px;
    top: 0;
  }
  .score-bar {
    width: 100%;
  }
  .score-bar.reverse{
    -webkit-transform: scaleX(-1);
    transform: scaleX(-1);
  }
`;

export default Summary;
