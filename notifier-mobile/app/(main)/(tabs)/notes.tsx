import { useAppTheme } from '@/app/_layout';
import colorScheme from '@/assets/colorscheme';
import { Note } from '@/models/Note';
import { RootState } from '@/state/rootState';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';

export default function NotesView() {
  const theme = useAppTheme();
  const user = useSelector((state: RootState) => state.user);
  const notes = useSelector((state: RootState) => state.notes);
  const [activeNotes, setActiveNotes] = useState<Note[]>(notes.activeNotes);
  useFocusEffect(
    useCallback(() => {
      console.log('NOTES', notes);
    }, [])
  );
  return (
    <SafeAreaView
      style={{
        flex: 1,

        backgroundColor: theme.colors.background,
      }}
    >
      {activeNotes.map((note) => {
        return (
          <View key={note.noteId ? note.noteId : note.title + note.userId}>
            <Text style={{ color: colorScheme.primary }}>{note.title}</Text>
            <Text style={{ color: colorScheme.tokyoLaserBlue }}>{note.content}</Text>
          </View>
        );
      })}
    </SafeAreaView>
  );
}
