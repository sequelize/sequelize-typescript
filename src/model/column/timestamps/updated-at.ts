import {addOptions} from '../../shared/model-service';

export function UpdatedAt(target: any, propertyName: string): void {

  addOptions(target, {
    updatedAt: propertyName,
    timestamps: true
  });
}
