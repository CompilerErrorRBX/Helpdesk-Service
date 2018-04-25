const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
} = require('graphql');

const lists = {};

const List = (itemType) => {
  if (lists[itemType]) {
    return lists[itemType];
  }
  const listObject = new GraphQLObjectType({
    name: `${itemType}List`,
    description: 'List of users',
    fields: () => ({
      totalResults: {
        type: GraphQLInt,
        resolve: list => list.count,
      },
      items: {
        type: new GraphQLList(itemType),
        resolve: list => list.rows,
      },
      moreResults: {
        type: GraphQLBoolean,
        resolve: list => list.moreResults,
      },
    }),
  });

  lists[itemType] = listObject;

  return listObject;
};

const paginationArgs = {
  limit: {
    type: GraphQLInt,
    defaultValue: 10,
  },
  offset: {
    type: GraphQLInt,
    defaultValue: 0,
  },
  orderBy: {
    type: GraphQLString,
    defaultValue: 'createdAt',
  },
}

const resolveHelper = (args) => {
  const queryArgs = { ...args };
  delete queryArgs.limit;
  delete queryArgs.offset;
  delete queryArgs.orderBy;

  return queryArgs;
}

const findAllHelper = (model, args, custom) => {
  const queryArgs = resolveHelper(args);

  const orders = args.orderBy.split(',').map((order) => {
    const dir = order[0] === '-' ? 'DESC' : 'ASC';
    order = order.replace('-', '');
    return [order, dir];
  });

  return new Promise((resolve, reject) => {
    model.findAndCountAll({
      where: queryArgs,
      limit: args.limit,
      offset: args.offset,
      order: [orders],
      ...custom,
    })
      .then((results) => {
        results.moreResults = args.offset + args.limit < results.count;
        resolve(results);
      }).catch(err => reject(err));
  });
}

module.exports = {
  PaginatedFindAll: findAllHelper,
  PaginationArgs: paginationArgs,
  PaginatedList: List,
}
