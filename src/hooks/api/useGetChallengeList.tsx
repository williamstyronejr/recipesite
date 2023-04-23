import { useInfiniteQuery } from '@tanstack/react-query';

const useGetChallengeList = ({
  sortBy,
  search,
}: {
  sortBy: string;
  search: string;
}) => {
  return useInfiniteQuery(
    ['challenge', sortBy, search],
    async ({ pageParam = 0 }) => {
      const res = await fetch(
        `/api/challenges/search?page=${pageParam}&orderBy=${sortBy}&search=${search}`
      );

      if (res.ok) return await res.json();
      throw new Error('Error getting challenge list');
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.nextPage ? lastPage.nextPage : undefined;
      },
    }
  );
};
export default useGetChallengeList;
