// todo add functionality for different column name then class name
export function Table(target: any) {

  let tableName = target.name;

  setBookshelfTableName(target, tableName);
}

function setBookshelfTableName(target, tableName) {

  target.prototype.tableName = tableName;
}
