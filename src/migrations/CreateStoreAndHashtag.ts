import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateStoreAndHashtag1624645281898 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Store 테이블 생성
        await queryRunner.createTable(new Table({
            name: "store",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "name", type: "varchar", length: "255" },
                { name: "latitude", type: "decimal", precision: 10, scale: 8 },
                { name: "longitude", type: "decimal", precision: 11, scale: 8 },
                { name: "description", type: "text", isNullable: true },
                { name: "address", type: "varchar", length: "255", isNullable: true },
                { name: "category", type: "varchar", length: "50" },
                { name: "image_url", type: "varchar", length: "255", isNullable: true } // 추가됨
            ]
        }), true);

        // Hashtag 테이블 생성
        await queryRunner.createTable(new Table({
            name: "hashtag",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "tag_name", type: "varchar", length: "50", isUnique: true }
            ]
        }), true);

        // StoreHashtag (중간 테이블) 생성
        await queryRunner.createTable(new Table({
            name: "storehashtag",
            columns: [
                { name: "storeId", type: "int", isPrimary: true },
                { name: "hashtagId", type: "int", isPrimary: true }
            ],
            foreignKeys: [
                {
                    columnNames: ["storeId"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "store",
                    onDelete: "CASCADE"
                },
                {
                    columnNames: ["hashtagId"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "hashtag",
                    onDelete: "CASCADE"
                }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("storehashtag");
        await queryRunner.dropTable("hashtag");
        await queryRunner.dropTable("store");
    }
}
