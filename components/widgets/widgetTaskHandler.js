import React from 'react';
import { HelloWidget } from './HelloWidget';

const nameToWidget = {
  // Hello will be the **name** with which we will reference our widget.
  Hello: HelloWidget,
};

export async function widgetTaskHandler (props) {
  const widgetInfo = props.widgetInfo;
  const Widget =
    nameToWidget[widgetInfo.widgetName];
  

  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
      props.renderWidget(<HelloWidget />);
      break;

    case 'WIDGET_UPDATE':
      props.renderWidget(<HelloWidget />);
      break;

    case 'WIDGET_RESIZED':
      props.renderWidget(<HelloWidget />);
      break;

    case 'WIDGET_DELETED':
      props.renderWidget(<HelloWidget />);
      break;

    case 'WIDGET_CLICK':
      props.renderWidget(<HelloWidget />);
      break;

    default:
      props.renderWidget(<HelloWidget />);
      break;
  }
}