export class DataParser {
  static getValueFromKey(data: AnyObject | AnyObject[], keyPath: string): any {
    const keys = keyPath.split('.');
    let result: any = data;
    for (const key of keys) {
      if (Array.isArray(result)) {
        // If result is an array, apply the key to each element and merge the results
        result = result.map(item => item[key]).flat();
      } else {
        // If result is an object, apply the key directly
        result = result[key];
      }
      if (result === undefined) {
        return undefined; // Return undefined if the key does not exist
      }
    }
    return result;
  }
}

type AnyObject = { [key: string]: any };
