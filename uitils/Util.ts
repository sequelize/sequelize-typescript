
export class Util {

    static toArrayIfExists<T>(value?): Array<T> {

        if(value) {
            return [].concat(value);
        }

        return undefined;
    }
}
