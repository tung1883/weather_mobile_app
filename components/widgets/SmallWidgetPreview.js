import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { WidgetPreview } from 'react-native-android-widget';

import { SmallWidget } from './SmallWidget';

export function SmallWidgetPreviewScreen() {
  return (
    <View style={styles.container}>
      <WidgetPreview
        renderWidget={() => <SmallWidget />}
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