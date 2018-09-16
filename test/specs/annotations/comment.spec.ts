import { expect, use } from 'chai';
import { createSequelize } from "../../utils/sequelize";
import { Table } from '../../../lib/model/table/table';
import { Model } from '../../../lib/model/model/model';
import { Column } from "../../../lib/model/column/column";
import { Comment } from "../../../lib/model/column/column-options/comment";

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
        expect(Book.attributes.title.comment).to.be.eq(BookTitleCommentString);
    });
});
