export const READ_STORY_ROUTE = '/public/read/:id';

export const makePath = (path, args) => {
  let result = path;
  Object.keys(args).forEach(key => {
    result.replace(key, args[key]);
  });
  return result;
};
