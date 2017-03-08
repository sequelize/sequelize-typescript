import 'reflect-metadata';
import {addOptions} from "../services/models";

export function DeletedAt(target: any, propertyName: string): void {

  addOptions(target, {
    deletedAt: propertyName,
    timestamps: true,
    paranoid: true
  });
}
