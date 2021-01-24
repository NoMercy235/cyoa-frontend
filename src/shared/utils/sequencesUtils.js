import { debounced } from '../utilities';
import { sequenceService } from '../../infrastructure/services/SequenceService';

const debouncedSequenceList = debounced(sequenceService.list);

export const getDebouncedSequences = async (storyId, searchQuery, extraFilters) => {
  sequenceService.setNextRouteParams(
    { ':story': storyId }
  );
  const { sequences } = (await debouncedSequenceList({
    filters: {
      name: {
        op: 'ilike',
        value: searchQuery,
        options: {
          allowEmpty: true,
        },
      },
      ...extraFilters,
    },
    pagination: {
      page: 0,
      limit: 20,
    },
  }));
  return sequences;
};
