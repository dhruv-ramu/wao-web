import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { userAtom } from '../state/user';
import axios from 'axios';
import { API_URL } from '../constants';

export default function useHydrateUserState() {
  const [userState, setUserState] = useAtom(userAtom);

  useEffect(() => {
    if (userState.id) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    const controller = new AbortController();
    axios
      .get(`${API_URL}/auth/me`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      })
      .then(d => d.data)
      .then(setUserState)
      .catch(err => null);

    return () => controller.abort();
  }, []);
}
