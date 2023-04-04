import { atom } from 'jotai';

export const userAtom = atom({
  id: '',
  name: '',
  role: '',
  verifiedHelper: false,
  grades: [{}],
});
