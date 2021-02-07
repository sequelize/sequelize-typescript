// Types only test. This should compile successfully.

import { Optional } from "sequelize";
import {
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  ForeignKey,
  PrimaryKey,
  Sequelize,
} from "../../src/index";
import { Column } from "../../src/model/column/column";
import { Model } from "../../src/model/model/model";
import { Table } from "../../src/model/table/table";
import { DataType } from "../../src/sequelize/data-type/data-type";

interface PetPersonAttributes {
  petId: number;
  personId: number;
}

@Table
class PetPerson extends Model<PetPersonAttributes, PetPersonAttributes> {
  @ForeignKey(() => Pet)
  @Column
  petId: number;

  @ForeignKey(() => Person)
  @Column
  personId: number;
}

interface PersonAttributes {
  id: number;
  name: string;
}
type PersonCreationAttributes = Optional<PersonAttributes, "id">;

@Table
export class Person extends Model<PersonAttributes, PersonCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.STRING)
  name: string;
}

@Table
export class Pet extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  petId: number;

  @Column(DataType.STRING)
  name: string;

  // model with attributes
  @BelongsToMany(() => Person, () => PetPerson)
  owners: Person[];
}

@Table
export class Toy extends Model {
  @ForeignKey(() => Pet)
  @Column(DataType.INTEGER)
  petId: number;

  @Column(DataType.STRING)
  name: string;

  // model without attributes
  @BelongsTo(() => Pet)
  pet: Pet;
}

function testTypes() {
  // all models should be accepted
  new Sequelize().addModels([Person, Pet, PetPerson]);
}
