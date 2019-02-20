import { expect, use } from 'chai';
import { createSequelize } from "../../utils/sequelize";
import { Table } from '../../../src/model/table/table';
import { Model } from '../../../src/model/model/model';
import { Column } from "../../../src/model/column/column";
import { Comment } from "../../../src/model/column/column-options/comment";

describe("comment", () => {
    const sequelize = createSequelize(false);
    const BookTitleCommentString = "title for book";

    @Table
    class Book extends Model<Book> {
        @Comment(BookTitleCommentString)
        @Column
        title: string;
    }

    sequelize.addModels([Book]);

    it("should set comment property on model options", () => {
        expect(Book['tableAttributes'].title.comment).to.be.eq(BookTitleCommentString);
    });
});
