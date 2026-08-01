import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii } from '../theme';

export function DeskCard({
  tag,
  title,
  children,
}: {
  tag?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      {tag ? <Text style={styles.tag}>{tag}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.card,
    padding: 18,
    marginBottom: 12,
  },
  tag: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.muted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  title: {
    fontFamily: fonts.semi,
    fontSize: 15,
    color: colors.accent,
    marginBottom: 8,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 22,
    color: colors.text,
  },
});
