import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { WidgetPreview } from 'react-native-android-widget';

import { BigWidget } from './BigWidget';

export function bigWidgetPreviewScreen() {
  return (
    <View style={styles.container}>
      <WidgetPreview
        renderWidget={() => <BigWidget />}
        width={200}
        height={200}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});