# ORM wrapper for sequelize
For simplicity and to prevent an interface chaos for the interaction of _TypeScript_ and _Sequelize_, a wrapper on top 
of both is implemented. The implementation is currently found in `orm/`.

## Definition of database models
To define a database model you have to annotate the class(which represents you specific entity) with the `Table` and
`Column` annotations. `Table` for defining the entity and `Column` for defining the column/property of the entity.
 For example:

````

@Table
class Person {

  @Column
  @PrimaryKey
  id: number;

  @Column
  name: string;

}


````
#### Associations
For Relations between entities there are some annotations like `BelongsTo`, `HasOne` or `BelongsToMany` that can be used. To define
foreign keys, use the `ForeignKey` annotation. 

##### Many-To-Many
````

@Table
class Person {

  ... 
  
  @BelongsToMany(() => Group, () => PersonGroup)
  groups: Group[];
  
}

@Table
class Group {

  ...

  @BelongsToMany(() => Person, () => PersonGroup)
  persons: Person[];
  
}

@Table
class PersonGroup {

  @ForeignKey(() => Person)
  personId: number;
  
  @ForeignKey(() => Group)
  groupId: number;

}


````

