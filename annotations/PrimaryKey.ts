// todo extract db column name if it is different from prototype key
export function PrimaryKey(target: any, key: string) {

  setBookshelfIdAttribute(target, key);
}

function setBookshelfIdAttribute(target, key) {

  target.idAttribute = key;
}
