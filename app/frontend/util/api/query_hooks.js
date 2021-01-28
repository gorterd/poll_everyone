import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { currentUserIdSelector } from '../hooks_selectors';
import ajax from './ajax';


export const useCheckIfUserExists = (usernameOrEmail, options = {}) => {
  return useQuery(['checkUser', usernameOrEmail], () =>
    ajax({
      method: 'GET',
      url: '/api/session/exists',
      data: { query: usernameOrEmail },
    }), options
  );
}

export const usePresentation = (type, id, username, options = {}) => {
  return useQuery(['presentation', { type, id, username }], () => 
    ajax({
      method: 'GET',
      url: '/api/users/presentation',
      data: { type, id, username }
    }), options
  );
}

export const useRecentPresentations = (type, id, options = {}) => {
  return useQuery(['recentPresentations', { type, id }], () =>
    ajax({
      method: 'GET',
      url: '/api/participants/recents',
      data: { type, id }
    }), options
  );
}

export const usePoll = (pollId, options = {}) => {
  return useQuery(['polls', pollId], () =>
    ajax({
      method: 'GET',
      url: `/api/polls/${pollId}`,
      data: { fullData: true }
    }), options
  );
}


export function usePollData(options = {}) {
  const currentId = useSelector(currentUserIdSelector);
  return useQuery('polls', 
    () => ajax({ url: `/api/users/${currentId}/groups` }),
    options
  );
}

export function useCachedPollData(options = {}) {
  const client = useQueryClient();
  return client.getQueryData('polls', { exact: true, ...options });
}