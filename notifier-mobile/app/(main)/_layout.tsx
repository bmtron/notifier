import { RootState } from '@/state/rootState';
import { Stack, useFocusEffect } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserNotes } from '@/services/notesService';
import { NoteActions } from '@/state/reducers/notesReducer';

export default function MainApp() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      console.log('USER', user);
    }, [])
  );
  useEffect(() => {
    const getUserData = async () => {
      const result = await getUserNotes(user.authToken, user.userId);
      console.log(result);
      dispatch({ type: NoteActions.SetAllActiveNotesAction, payload: result.data });
    };
    getUserData();
  });
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
    </Stack>
  );
}
