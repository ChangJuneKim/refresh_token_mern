const asyncHandler = controllerFunction => (req, res, next) => {
  return (
    Promise
      //
      .resolve(controllerFunction(req, res, next))
      .catch(next)
  );
  // return async (req, res, next) => {
  //   try {
  //     await controllerFunction(req, res);
  //   } catch (err) {
  //     next(err);
  //   }
  // };
};

export default asyncHandler;
