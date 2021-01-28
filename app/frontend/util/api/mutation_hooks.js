import { useMutation, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { clearSelections } from '../../store/actions/selection_actions/poll_selection_actions';
import ajax from './ajax';

const useMutatePoll = (mutateFn, options = {}) => {
  const queryClient = useQueryClient();

  return useMutation(mutateFn, {
    ...options,
    onMutate: (...args) => {
      options.onMutate?.(queryClient, ...args);
    },
    onSuccess: (...args) => {
      options.onSuccess?.(queryClient, ...args);
      queryClient.invalidateQueries('polls')
    }
  });
}

export const useCreatePoll = () => {
  return useMutatePoll( ({ poll, groupId }) => 
    ajax({
      method: 'POST',
      url: `/api/groups/${groupId}/polls`,
      data: { poll }
    })
  );
}

export const useUpdatePoll = () => {
  return useMutatePoll( ({ poll, pollId }) => 
    ajax({
      method: 'PATCH',
      url: `/api/polls/${pollId}`,
      data: { poll }
    })
  );
}

export const useDuplicatePoll = () => {
  return useMutatePoll( pollId => 
    ajax({
      method: 'POST',
      url: `/api/polls/${pollId}/duplicate`,
      data: { pollId }
    })
  );
}

export const useToggleActive = () => {

  return useMutatePoll( pollId => 
    ajax({
      method: 'PATCH',
      url: `/api/polls/${pollId}/toggle_activation`,
    }), {
      onMutate: (queryClient, pollId) => {
        queryClient.setQueryData(['polls', pollId], oldData => {
          if (!oldData) return;
          const { poll } = oldData;
          const newPoll = { ...poll, active: !poll.active }
          return { ...oldData, poll: newPoll }
        })
        queryClient.setQueryData('polls', oldData => {
          if (!oldData) return;
          const { polls } = oldData;
          const poll = polls[pollId];
          const newPoll = { ...poll, active: !poll.active }
          return { ...oldData, polls: { ...polls, [pollId]: newPoll } }
        })
      }
    }
  );
}

const useMutateGroup = (mutateFn, options = {}) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation(mutateFn, {
    ...options,
    onMutate: () => {
      options.onMutate?.();
      dispatch(clearSelections())
    },
    onSuccess: () => { 
      options.onSuccess?.();
      queryClient.invalidateQueries('polls')
    }
  });
}

export const useCreateGroup = () => {
  return useMutateGroup(({ data, userId }) =>
    ajax({
      method: 'POST',
      url: `/api/users/${userId}/groups`,
      data
    })
  );
}

export const useUpdateGroup = () => {
  return useMutateGroup( group => 
    ajax({
      method: 'PATCH',
      url: `/api/groups/${group.id}`,
      data: { group }
    })
  );
}

export const useBatchDestroy = () => {
  return useMutateGroup( selections => 
    ajax({
      method: 'DELETE',
      url: `/api/groups/batch_destroy`,
      data: selections
    })
  );
}

export const useMovePolls = () => {
  return useMutateGroup(({pollIds, groupId}) => 
    ajax({
      method: 'PATCH',
      url: `/api/groups/${groupId}/move_polls`,
      data: { pollIds }
    })
  );
}