import { Member } from '../members-db';

interface AdminIndexProps {
  mode: string;
  state: string;
  members: (Member & { signedIn: boolean })[];
}

export {
  AdminIndexProps,
};
