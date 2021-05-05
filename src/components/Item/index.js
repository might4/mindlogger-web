import React from 'react';

import "./style.css";

// Widgets
import Radio from '../../widgets/Radio';
import TextInput from '../../widgets/TextInput';
import Checkbox from '../../widgets/Checkbox';
import Slider from '../../widgets/Slider/index';

export const Item = ({ type }) => {

  let widget;

  switch (type) {
    case "radio":
      widget = <Radio />;
      break;
    case "checkbox":
      widget = <Checkbox />;
      break;
    case "textinput":
      widget = <TextInput />;
      break;
    case "slider":
      widget = <Slider />;
      break;
    default:
      widget = <div />;
      break;
  }

  return widget;
}

export default Item;
