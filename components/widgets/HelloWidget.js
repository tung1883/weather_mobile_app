import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

export function HelloWidget() {
  return (
    <FlexWidget>
      <FlexWidget
        style={{
          height: 5,
          width: 5
        }}
      >

      </FlexWidget>
    </FlexWidget>
  );
}