
// *This middleware is used to build the query string for the network request

exports.queryBuilder = (req, res, next) => {
    //build query
  const queryObject = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObject[el]);
  //build the query string
  let queryStr = JSON.stringify(queryObject);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  let sortBy = req.query.sort
    ? req.query.sort.split(",").join(" ")
    : "-createdAt";
  let limitFields = req.query.fields
    ? req.query.fields.split(",").join(" ")
    : "-__v";
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 100;
  let skip = (page - 1) * limit;
 
  req.queryBuilder= {
    queryStr,
    sortBy,
    limitFields,
    page,
    limit,
    skip
  } 
    next(); 
}




